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

type CheckoutCustomer = {
  name?: unknown;
  phone?: unknown;
  email?: unknown;
};

type ProductRow = {
  id: string;
  name: string;
  image_url: string | null;
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

function formatCurrencyFromCents(value: number) {
  return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(value / 100);
}

function cleanText(value: unknown, maxLength: number) {
  return typeof value === "string" ? value.trim().slice(0, maxLength) : "";
}

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

async function supabaseRest(
  supabaseUrl: string,
  supabaseKey: string,
  path: string,
  init?: RequestInit,
) {
  return fetch(`${supabaseUrl.replace(/\/$/, "")}/rest/v1/${path.replace(/^\//, "")}`, {
    ...init,
    headers: {
      apikey: supabaseKey,
      authorization: `Bearer ${supabaseKey}`,
      ...(init?.headers ?? {}),
    },
  });
}

async function sendOrderEmailNotification(order: {
  referenceId: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  totalAmount: number;
  paymentUrl: string;
  items: Array<{ product_name: string; quantity: number; total_amount: number }>;
}) {
  const resendApiKey = getServerEnv("RESEND_API_KEY");
  const to = getServerEnv("ORDER_NOTIFICATION_EMAIL");
  if (!resendApiKey || !to) return;

  const from = getServerEnv("RESEND_FROM_EMAIL") || "Bem Bonita <onboarding@resend.dev>";
  const siteUrl = getServerEnv("PUBLIC_SITE_URL") || "https://www.bembonitafrancielly.com.br";
  const logoUrl = `${siteUrl.replace(/\/$/, "")}/favicon.svg?v=2`;
  const itemsHtml = order.items
    .map(
      (item) =>
        `<tr>
          <td style="padding:12px 0;border-bottom:1px solid #f4d7e7;color:#2b2028;font-weight:600;">${escapeHtml(item.product_name)}</td>
          <td style="padding:12px 0;border-bottom:1px solid #f4d7e7;color:#6f6270;text-align:center;">${item.quantity}x</td>
          <td style="padding:12px 0;border-bottom:1px solid #f4d7e7;color:#d8518b;text-align:right;font-weight:700;">${formatCurrencyFromCents(item.total_amount)}</td>
        </tr>`,
    )
    .join("");

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      authorization: `Bearer ${resendApiKey}`,
      "content-type": "application/json",
    },
    body: JSON.stringify({
      from,
      to: [to],
      subject: `Novo pedido Bem Bonita — ${order.customerName}`,
      html: `
        <div style="margin:0;padding:0;background:#fff6fb;font-family:Arial,Helvetica,sans-serif;color:#2b2028;">
          <div style="max-width:640px;margin:0 auto;padding:28px 16px;">
            <div style="background:#ffffff;border:1px solid #f2cfe0;border-radius:28px;overflow:hidden;box-shadow:0 18px 50px rgba(216,81,139,.16);">
              <div style="padding:28px 28px 22px;background:linear-gradient(135deg,#fff1f8,#ffffff);text-align:center;">
                <img src="${escapeHtml(logoUrl)}" alt="Bem Bonita" width="62" height="62" style="display:block;margin:0 auto 12px;border-radius:18px;" />
                <p style="margin:0 0 8px;color:#d8518b;font-size:12px;font-weight:700;letter-spacing:3px;text-transform:uppercase;">Loja online</p>
                <h1 style="margin:0;font-family:Georgia,'Times New Roman',serif;font-size:30px;font-weight:500;line-height:1.15;color:#201720;">Novo pedido Bem Bonita</h1>
                <p style="margin:10px 0 0;color:#7b6d7a;font-size:14px;">Pedido iniciado pelo carrinho online. Confira o pagamento no PagBank antes de entregar.</p>
              </div>

              <div style="padding:24px 28px;">
                <div style="border:1px solid #f2cfe0;border-radius:22px;padding:18px;background:#fffafd;">
                  <p style="margin:0 0 8px;color:#d8518b;font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:2px;">Cliente</p>
                  <p style="margin:0;font-size:20px;font-weight:700;color:#201720;">${escapeHtml(order.customerName)}</p>
                  <p style="margin:8px 0 0;color:#6f6270;font-size:14px;"><strong>WhatsApp:</strong> ${escapeHtml(order.customerPhone)}</p>
                  ${order.customerEmail ? `<p style="margin:6px 0 0;color:#6f6270;font-size:14px;"><strong>E-mail:</strong> ${escapeHtml(order.customerEmail)}</p>` : ""}
                  <p style="margin:6px 0 0;color:#6f6270;font-size:14px;"><strong>Referência:</strong> ${escapeHtml(order.referenceId)}</p>
                </div>

                <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin-top:22px;border-collapse:collapse;">
                  <thead>
                    <tr>
                      <th align="left" style="padding:0 0 10px;color:#b5832f;font-size:12px;letter-spacing:2px;text-transform:uppercase;">Produto</th>
                      <th align="center" style="padding:0 0 10px;color:#b5832f;font-size:12px;letter-spacing:2px;text-transform:uppercase;">Qtd.</th>
                      <th align="right" style="padding:0 0 10px;color:#b5832f;font-size:12px;letter-spacing:2px;text-transform:uppercase;">Total</th>
                    </tr>
                  </thead>
                  <tbody>${itemsHtml}</tbody>
                </table>

                <div style="margin-top:22px;text-align:right;">
                  <p style="margin:0;color:#6f6270;font-size:13px;">Total do pedido</p>
                  <p style="margin:4px 0 0;color:#d8518b;font-size:26px;font-weight:800;">${formatCurrencyFromCents(order.totalAmount)}</p>
                </div>

                <a href="${escapeHtml(order.paymentUrl)}" style="display:block;margin-top:24px;background:#df61a0;color:#ffffff;text-align:center;text-decoration:none;border-radius:999px;padding:15px 18px;font-weight:800;">Abrir pagamento no PagBank</a>
              </div>
            </div>
          </div>
        </div>
      `,
    }),
  });

  if (!response.ok) {
    console.error("Resend notification error", await response.text().catch(() => ""));
  }
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

  let body: { items?: CheckoutRequestItem[]; customer?: CheckoutCustomer };
  try {
    body = (await request.json()) as { items?: CheckoutRequestItem[]; customer?: CheckoutCustomer };
  } catch {
    return jsonResponse({ error: "Pedido inválido." }, { status: 400 });
  }

  const customerName = cleanText(body.customer?.name, 120);
  const customerPhone = cleanText(body.customer?.phone, 30);
  const customerEmail = cleanText(body.customer?.email, 160);

  if (customerName.length < 2 || customerPhone.length < 8) {
    return jsonResponse(
      { error: "Informe nome e WhatsApp para registrar o pedido no admin." },
      { status: 400 },
    );
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
  query.searchParams.set("select", "id,name,image_url,price_text,published");
  query.searchParams.set("published", "eq.true");
  query.searchParams.set("id", `in.(${productIds.map((id) => `"${id.replace(/"/g, '\\"')}"`).join(",")})`);

  const productsResponse = await fetch(query, {
    headers: { apikey: supabaseKey, authorization: `Bearer ${supabaseKey}` },
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
  const orderItems = checkoutItems.map((item) => {
    const product = productsById.get(item.reference_id);
    return {
      product_id: item.reference_id,
      product_name: item.name,
      unit_amount: item.unit_amount,
      quantity: item.quantity,
      total_amount: item.unit_amount * item.quantity,
      image_url: product?.image_url ?? null,
    };
  });
  const totalAmount = orderItems.reduce((total, item) => total + item.total_amount, 0);

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

  const orderResponse = await supabaseRest(supabaseUrl, supabaseKey, "product_orders?select=id", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      prefer: "return=representation",
    },
    body: JSON.stringify({
      reference_id: referenceId,
      pagbank_payment_url: paymentUrl,
      customer_name: customerName,
      customer_phone: customerPhone,
      customer_email: customerEmail || null,
      status: "pending",
      total_amount: totalAmount,
      notes: "Pedido iniciado pelo carrinho online. Confirme o pagamento no painel PagBank.",
    }),
  });

  if (!orderResponse.ok) {
    console.error("Supabase order insert error", await orderResponse.text().catch(() => ""));
    return jsonResponse(
      { error: "Falta criar a tabela de pedidos no Supabase. Execute o SQL de pedidos e tente novamente." },
      { status: 500 },
    );
  }

  const [savedOrder] = (await orderResponse.json()) as Array<{ id: string }>;
  const itemsResponse = await supabaseRest(supabaseUrl, supabaseKey, "product_order_items", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(orderItems.map((item) => ({ ...item, order_id: savedOrder.id }))),
  });

  if (!itemsResponse.ok) {
    console.error("Supabase order items insert error", await itemsResponse.text().catch(() => ""));
    return jsonResponse(
      { error: "O pedido foi iniciado, mas os itens não foram salvos no admin. Verifique o SQL de pedidos." },
      { status: 500 },
    );
  }

  await sendOrderEmailNotification({
    referenceId,
    customerName,
    customerPhone,
    customerEmail,
    totalAmount,
    paymentUrl,
    items: orderItems,
  });

  return jsonResponse({ paymentUrl, referenceId, orderId: savedOrder.id });
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
