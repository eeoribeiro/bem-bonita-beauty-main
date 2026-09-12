import { useEffect, useState } from "react";

const key = "bem-bonita-cookie-consent";

export function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(window.localStorage.getItem(key) !== "set");
  }, []);

  function choose(value: "accepted" | "rejected") {
    window.localStorage.setItem(key, "set");
    window.localStorage.setItem(`${key}-value`, value);
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div className="fixed inset-x-3 bottom-3 z-[180] mx-auto max-w-3xl rounded-3xl border border-border/70 bg-card/95 p-4 text-foreground shadow-2xl backdrop-blur-xl sm:bottom-5 sm:p-5">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gold">Privacidade e cookies</p>
          <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
            Usamos cookies essenciais e dados informados no checkout para salvar carrinho, processar pedido, contato de entrega e melhorar sua experiência.
          </p>
        </div>
        <div className="flex shrink-0 gap-2">
          <button type="button" onClick={() => choose("rejected")} className="rounded-full border border-primary/40 px-4 py-2 text-xs font-bold text-magenta">
            Recusar
          </button>
          <button type="button" onClick={() => choose("accepted")} className="rounded-full bg-primary px-4 py-2 text-xs font-bold text-primary-foreground shadow-soft">
            Aceitar
          </button>
        </div>
      </div>
    </div>
  );
}
