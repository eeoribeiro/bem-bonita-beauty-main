import "./lib/error-capture";

import { consumeLastCapturedError } from "./lib/error-capture";
import { renderErrorPage } from "./lib/error-page";
import { handleSiteAccess } from "./lib/site-access";

type ServerEntry = {
  fetch: (request: Request, env: unknown, ctx: unknown) => Promise<Response> | Response;
};

let serverEntryPromise: Promise<ServerEntry> | undefined;

async function getServerEntry(): Promise<ServerEntry> {
  if (!serverEntryPromise) {
    serverEntryPromise = import("@tanstack/react-start/server-entry").then(
      (m) => (m.default ?? m) as ServerEntry,
    );
  }
  return serverEntryPromise;
}

// h3 swallows in-handler throws into a normal 500 Response with body
// {"unhandled":true,"message":"HTTPError"} — try/catch alone never fires for those.
async function normalizeCatastrophicSsrResponse(response: Response): Promise<Response> {
  if (response.status < 500) return response;
  const contentType = response.headers.get("content-type") ?? "";
  if (!contentType.includes("application/json")) return response;

  const body = await response.clone().text();
  if (!isH3SwallowedErrorBody(body)) return response;

  console.error(consumeLastCapturedError() ?? new Error(`h3 swallowed SSR error: ${body}`));
  return new Response(renderErrorPage(), {
    status: 500,
    headers: { "content-type": "text/html; charset=utf-8" },
  });
}

function isH3SwallowedErrorBody(body: string): boolean {
  try {
    const payload = JSON.parse(body) as { unhandled?: unknown; message?: unknown };
    return payload.unhandled === true && payload.message === "HTTPError";
  } catch {
    return false;
  }
}

type CheckoutRequestItem = {
  id?: unknown;
  quantity?: unknown;
};

type ProductRow = {
  id: string;
  name: string;
  price_text: string | null;
  published: boolean;
};

function jsonResponse(payload: unknown, init?: ResponseInit) {
  return new Response(JSON.stringify(payload), {
    ...init,
    headers: {
      "content-type": "application/json; charset=utf-8",
      ...(init?.headers ?? {}),
    },
  });
}

function parsePriceToCents(priceText?: string | null) {
  const cleaned = (priceText ?? "")
    .replace(/[^\d,.-]/g, "")
    .replace(/\./g, "")
    .replace(",", ".");
  const value = Number.parseFloat(cleaned);
  if (!Number.isFinite(value) || value <= 0) return 0;
  return Math.round(value * 100);
}

function safeQuantity(value: unknown) {
  const number = Number(value);
  if (!Number.isFinite(number)) return 1;
  return Math.min(20, Math.max(1, Math.floor(number)));
}

function getServerEnv(name: string) {
  return process.env[name]?.trim();
}

async function handlePagBankCheckout(request: Request) {
  if (request.method !== "POST") {
    return jsonResponse({ error: "Método não permitido." }, { status: 405 });
  }

  const pagBankToken = getServerEnv("PAGBANK_TOKEN");
  if (!pagBankToken) {
    return jsonResponse(
      { error: "Checkout online ainda não configurado. Falta adicionar PAGBANK_TOKEN na Vercel." },
      { status: 503 },
    );
  }

  const supabaseUrl = getServerEnv("VITE_SUPABASE_URL");
  const supabaseKey = getServerEnv("VITE_SUPABASE_PUBLISHABLE_KEY");
  if (!supabaseUrl || !supabaseKey) {
    return jsonResponse({ error: "Supabase não configurado no servidor." }, { status: 500 });
  }

  let body: { items?: CheckoutRequestItem[] };
  try {
    body = (await request.json()) as { items?: CheckoutRequestItem[] };
  } catch {
    return jsonResponse({ error: "Pedido inválido." }, { status: 400 });
  }

  const cartItems = (body.items ?? [])
    .map((item) => ({
      id: typeof item.id === "string" ? item.id : "",
      quantity: safeQuantity(item.quantity),
    }))
    .filter((item) => item.id);

  if (!cartItems.length) {
    return jsonResponse({ error: "Carrinho vazio." }, { status: 400 });
  }

  const productIds = Array.from(new Set(cartItems.map((item) => item.id)));
  const query = new URL(`${supabaseUrl}/rest/v1/products`);
  query.searchParams.set("select", "id,name,price_text,published");
  query.searchParams.set("published", "eq.true");
  query.searchParams.set("id", `in.(${productIds.map((id) => `"${id.replace(/"/g, '\\"')}"`).join(",")})`);

  const productsResponse = await fetch(query, {
    headers: {
      apikey: supabaseKey,
      authorization: `Bearer ${supabaseKey}`,
    },
  });

  if (!productsResponse.ok) {
    return jsonResponse({ error: "Não foi possível consultar os produtos." }, { status: 502 });
  }

  const products = (await productsResponse.json()) as ProductRow[];
  const productsById = new Map(products.map((product) => [product.id, product]));
  const checkoutItems = cartItems
    .map((item) => {
      const product = productsById.get(item.id);
      const unitAmount = parsePriceToCents(product?.price_text);
      if (!product || !unitAmount) return null;
      return {
        reference_id: product.id,
        name: product.name.slice(0, 100),
        quantity: item.quantity,
        unit_amount: unitAmount,
      };
    })
    .filter((item): item is { reference_id: string; name: string; quantity: number; unit_amount: number } =>
      Boolean(item),
    );

  if (!checkoutItems.length) {
    return jsonResponse(
      { error: "Nenhum produto do carrinho tem preço válido para checkout online." },
      { status: 400 },
    );
  }

  const origin = new URL(request.url).origin;
  const referenceId = `bem-bonita-${Date.now()}`;
  const pagBankApiUrl = getServerEnv("PAGBANK_API_URL") || "https://api.pagseguro.com";
  const checkoutResponse = await fetch(`${pagBankApiUrl.replace(/\/$/, "")}/checkouts`, {
    method: "POST",
    headers: {
      authorization: `Bearer ${pagBankToken}`,
      "content-type": "application/json",
      accept: "application/json",
    },
    body: JSON.stringify({
      reference_id: referenceId,
      items: checkoutItems,
      payment_methods: [{ type: "CREDIT_CARD" }, { type: "DEBIT_CARD" }, { type: "PIX" }],
      redirect_url: `${origin}/produtos?pedido=sucesso`,
      soft_descriptor: "BEMBONITA",
    }),
  });

  const checkoutPayload = (await checkoutResponse.json().catch(() => ({}))) as {
    links?: Array<{ rel?: string; href?: string }>;
    error_messages?: unknown;
    message?: unknown;
  };

  if (!checkoutResponse.ok) {
    console.error("PagBank checkout error", checkoutPayload);
    return jsonResponse(
      { error: "Não foi possível criar o checkout PagBank agora.", details: checkoutPayload },
      { status: 502 },
    );
  }

  const paymentUrl =
    checkoutPayload.links?.find((link) => link.rel === "PAY")?.href ??
    checkoutPayload.links?.find((link) => link.href)?.href;

  if (!paymentUrl) {
    return jsonResponse({ error: "PagBank não retornou o link de pagamento." }, { status: 502 });
  }

  return jsonResponse({ paymentUrl, referenceId });
}

export default {
  async fetch(request: Request, env: unknown, ctx: unknown) {
    try {
      const url = new URL(request.url);
      if (url.pathname === "/api/pagbank/checkout") {
        return await handlePagBankCheckout(request);
      }

      const accessResponse = await handleSiteAccess(request);
      if (accessResponse) return accessResponse;

      const handler = await getServerEntry();
      const response = await handler.fetch(request, env, ctx);
      const normalized = await normalizeCatastrophicSsrResponse(response);

      // Páginas com conteúdo dinâmico: nunca deixar cache (navegador, CDN ou
      // proxy) para garantir que atualizações apareçam sempre que houver deploy.
      if (normalized.headers.get("content-type")?.includes("text/html")) {
        normalized.headers.set("cache-control", "no-store, private");
      }
      return normalized;
    } catch (error) {
      console.error(error);
      return new Response(renderErrorPage(), {
        status: 500,
        headers: { "content-type": "text/html; charset=utf-8" },
      });
    }
  },
};
