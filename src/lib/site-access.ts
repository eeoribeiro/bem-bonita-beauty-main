const ACCESS_COOKIE = "bem_bonita_preview";
const LOGIN_PATH = "/_site-access/login";
const LOGOUT_PATH = "/_site-access/logout";
const COOKIE_MAX_AGE = 60 * 60 * 24 * 7;

type AccessConfig = { password: string; secret: string };

function getAccessConfig(): AccessConfig | null {
  const password = process.env["SITE_ACCESS_PASSWORD"]?.trim();
  const secret = process.env["SITE_ACCESS_TOKEN_SECRET"]?.trim();
  return password && secret ? { password, secret } : null;
}

function toHex(bytes: ArrayBuffer): string {
  return Array.from(new Uint8Array(bytes), (byte) => byte.toString(16).padStart(2, "0")).join("");
}

async function createAccessToken(config: AccessConfig): Promise<string> {
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(config.secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  return toHex(await crypto.subtle.sign("HMAC", key, encoder.encode(config.password)));
}

function constantTimeEqual(left: string, right: string): boolean {
  if (left.length !== right.length) return false;
  let difference = 0;
  for (let index = 0; index < left.length; index += 1) {
    difference |= left.charCodeAt(index) ^ right.charCodeAt(index);
  }
  return difference === 0;
}

function readCookie(request: Request, name: string): string | null {
  const cookie = request.headers.get("cookie");
  if (!cookie) return null;
  for (const part of cookie.split(";")) {
    const [key, ...valueParts] = part.trim().split("=");
    if (key === name) return decodeURIComponent(valueParts.join("="));
  }
  return null;
}

function safeNextPath(value: FormDataEntryValue | null): string {
  if (typeof value !== "string" || !value.startsWith("/") || value.startsWith("//")) return "/";
  if (value.startsWith(LOGIN_PATH) || value.startsWith(LOGOUT_PATH)) return "/";
  return value;
}

function isPublicAsset(pathname: string): boolean {
  return pathname === "/favicon.svg" || pathname === "/favicon.ico" || pathname === "/robots.txt";
}

function cookieHeader(request: Request, value: string, maxAge: number): string {
  const secure = new URL(request.url).protocol === "https:" ? "; Secure" : "";
  return `${ACCESS_COOKIE}=${encodeURIComponent(value)}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${maxAge}${secure}`;
}

function redirect(location: string, cookie?: string): Response {
  const headers = new Headers({ location, "cache-control": "no-store" });
  if (cookie) headers.set("set-cookie", cookie);
  return new Response(null, { status: 303, headers });
}

function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function renderAccessPage(options: {
  nextPath: string;
  invalidPassword?: boolean;
  configurationMissing?: boolean;
}): Response {
  const { nextPath, invalidPassword = false, configurationMissing = false } = options;
  const status = invalidPassword ? 401 : configurationMissing ? 503 : 200;

  return new Response(
    `<!doctype html>
<html lang="pt-BR">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <meta name="robots" content="noindex, nofollow" />
  <meta name="theme-color" content="#171317" />
  <title>Bem Bonita | Aguarde o Lançamento</title>
  <link rel="icon" href="/favicon.svg?v=2" type="image/svg+xml" />
  <link rel="shortcut icon" href="/favicon.svg?v=2" type="image/svg+xml" />
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,500;1,500&family=Poppins:wght@400;500;600&display=swap" rel="stylesheet" />
  <style>
    :root { color-scheme: dark; font-family: "Poppins", sans-serif; background: #171317; color: #fff8fa; }
    * { box-sizing: border-box; }
    body { margin: 0; min-width: 320px; min-height: 100vh; background: radial-gradient(circle at 50% 30%, rgba(216,81,139,.18), transparent 36rem), #171317; display: grid; place-items: center; padding: 16px; }
    .card { width: min(100%, 460px); background: rgba(39,31,39,.92); border: 1px solid rgba(255,255,255,.12); border-radius: 24px; padding: clamp(24px, 5vw, 36px); text-align: center; box-shadow: 0 24px 70px rgba(0,0,0,.45); backdrop-filter: blur(20px); }
    .brand { font-family: "Playfair Display", serif; font-size: clamp(24px, 4.5vw, 30px); line-height: 1.1; margin-bottom: 16px; }
    .brand strong { color: #e766a2; font-style: italic; font-weight: 500; }
    .brand small { display: block; margin-top: 4px; font: 500 9px/1.4 "Poppins", sans-serif; letter-spacing: .35em; color: #d9a167; text-transform: uppercase; }
    .launch-title { font-family: "Playfair Display", serif; font-size: clamp(24px, 5.5vw, 34px); font-weight: 500; margin: 0 0 22px; color: #fff8fa; letter-spacing: -.02em; }
    .btn-group { display: flex; gap: 10px; justify-content: center; flex-wrap: wrap; margin-top: 4px; }
    .btn { display: inline-flex; align-items: center; justify-content: center; gap: 8px; height: 42px; padding: 0 16px; border-radius: 12px; font: 500 13.5px "Poppins", sans-serif; text-decoration: none; cursor: pointer; transition: all .2s ease; border: none; flex: 1 1 150px; max-width: 200px; white-space: nowrap; }
    .btn-whatsapp { background: #25D366; color: #0b2e17; }
    .btn-whatsapp:hover { background: #20bd5a; transform: translateY(-1px); box-shadow: 0 6px 16px rgba(37,211,102,.2); }
    .btn-password { background: rgba(231,102,162,.15); color: #f472b6; border: 1px solid rgba(231,102,162,.3); }
    .btn-password:hover { background: rgba(231,102,162,.25); border-color: rgba(231,102,162,.5); transform: translateY(-1px); }
    .btn svg { width: 17px; height: 17px; flex-shrink: 0; }
    .form-container { margin-top: 18px; transition: all .3s ease; }
    .form-container.hidden { display: none; }
    form { display: flex; flex-direction: column; gap: 10px; max-width: 320px; margin: 0 auto; }
    input { width: 100%; height: 42px; border-radius: 12px; border: 1px solid rgba(255,255,255,.16); background: #171317; color: #fff8fa; padding: 0 14px; font-size: 14px; outline: none; text-align: center; }
    input:focus { border-color: #e766a2; box-shadow: 0 0 0 3px rgba(231,102,162,.15); }
    .btn-submit { background: #df61a0; color: #fff; width: 100%; height: 42px; max-width: 100%; }
    .btn-submit:hover { background: #ed73ae; }
    .error-msg { margin-top: 8px; color: #ffafc9; font-size: 12px; }
    @media (max-width: 380px) {
      .btn-group { flex-direction: column; align-items: stretch; }
      .btn { max-width: 100%; width: 100%; }
    }
  </style>
</head>
<body>
  <main class="card">
    <div class="brand">Bem <strong>Bonita</strong><small>Cachos &amp; Crespos</small></div>
    <h1 class="launch-title">Aguarde o Lançamento</h1>
    
    <div class="btn-group">
      <a href="https://wa.me/5531996792131?text=Ol%C3%A1!%20Vim%20pelo%20site%20do%20Sal%C3%A3o%20Bem%20Bonita." target="_blank" rel="noopener noreferrer" class="btn btn-whatsapp">
        WhatsApp
      </a>
      
      <button type="button" class="btn btn-password" id="toggle-password-btn" onclick="var f=document.getElementById('password-form'); f.classList.toggle('hidden'); if(!f.classList.contains('hidden')){document.getElementById('password').focus();}">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
        Acesso com Senha
      </button>
    </div>

    <div id="password-form" class="form-container ${invalidPassword || configurationMissing ? "" : "hidden"}">
      <form action="${LOGIN_PATH}" method="post">
        <input type="hidden" name="next" value="${escapeHtml(nextPath)}" />
        <input id="password" name="password" type="password" placeholder="Digite a senha de acesso" autocomplete="current-password" required ${configurationMissing ? "disabled" : ""} />
        <button type="submit" class="btn btn-submit" ${configurationMissing ? "disabled" : ""}>Entrar</button>
      </form>
      ${invalidPassword ? '<p class="error-msg" role="alert">Senha incorreta. Tente novamente.</p>' : ''}
      ${configurationMissing ? '<p class="error-msg" role="alert">Configuração pendente no servidor.</p>' : ''}
    </div>
  </main>
</body>
</html>`,
    {
      status,
      headers: {
        "content-type": "text/html; charset=utf-8",
        "cache-control": "no-store, private",
        "x-robots-tag": "noindex, nofollow",
      },
    },
  );
}

export async function handleSiteAccess(request: Request): Promise<Response | null> {
  const url = new URL(request.url);
  if (isPublicAsset(url.pathname)) return null;
  const config = getAccessConfig();

  if (url.pathname === LOGIN_PATH && request.method === "POST") {
    if (!config) return renderAccessPage({ nextPath: "/", configurationMissing: true });
    const form = await request.formData();
    const password = form.get("password");
    const nextPath = safeNextPath(form.get("next"));
    if (typeof password !== "string" || !constantTimeEqual(password, config.password)) {
      return renderAccessPage({ nextPath, invalidPassword: true });
    }
    return redirect(
      nextPath,
      cookieHeader(request, await createAccessToken(config), COOKIE_MAX_AGE),
    );
  }

  if (url.pathname === LOGOUT_PATH && request.method === "POST") {
    return redirect("/", cookieHeader(request, "", 0));
  }

  if (config) {
    const currentToken = readCookie(request, ACCESS_COOKIE);
    if (currentToken && constantTimeEqual(currentToken, await createAccessToken(config)))
      return null;
  }

  if (request.method !== "GET" && request.method !== "HEAD") {
    return new Response("Acesso não autorizado", {
      status: 401,
      headers: { "cache-control": "no-store" },
    });
  }

  return renderAccessPage({
    nextPath: `${url.pathname}${url.search}`,
    configurationMissing: !config,
  });
}
