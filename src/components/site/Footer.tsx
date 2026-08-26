import { Instagram, MessageCircle } from "lucide-react";

import { Logo } from "./Logo";
import { MENU, SALAO, WHATSAPP_EXIBICAO, whatsappLink } from "@/lib/salao";

export function Footer() {
  return (
    <footer className="bg-ink text-ink-foreground">
      <div className="mx-auto max-w-7xl px-5 py-16 lg:px-8">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <Logo tone="light" />
            <p className="mt-5 max-w-xs text-sm leading-relaxed text-ink-foreground/70">
              Salão especializado na beleza de cabelos crespos e cacheados, sob os cuidados de{" "}
              {SALAO.profissional}.
            </p>
            <p className="mt-4 text-[11px] lowercase tracking-wide text-ink-foreground/45">
              feito por webly
            </p>
          </div>

          <nav aria-label="Links rápidos">
            <h3 className="text-sm uppercase tracking-[0.2em] text-gold">Links rápidos</h3>
            <ul className="mt-5 space-y-3">
              {MENU.map((item) => (
                <li key={item.href}>
                  <a
                    href={item.href}
                    className="text-sm text-ink-foreground/75 transition-colors hover:text-gold"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <h3 className="text-sm uppercase tracking-[0.2em] text-gold">Contato</h3>
            <ul className="mt-5 space-y-3 text-sm text-ink-foreground/75">
              <li>{SALAO.endereco}</li>
              <li>
                <a
                  href={whatsappLink(`Olá, ${SALAO.nome}! Gostaria de mais informações.`)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 transition-colors hover:text-gold"
                >
                  <MessageCircle className="h-4 w-4" />
                  {WHATSAPP_EXIBICAO}
                </a>
              </li>
              <li>
                <a
                  href={SALAO.instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 transition-colors hover:text-gold"
                >
                  <Instagram className="h-4 w-4" />
                  {SALAO.instagram}
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm uppercase tracking-[0.2em] text-gold">Atendimento</h3>
            <p className="mt-5 text-sm text-ink-foreground/75">
              Consulte os horários disponíveis diretamente pelo WhatsApp.
            </p>
            <a
              href="/privacidade"
              className="mt-5 inline-block text-sm text-ink-foreground/60 underline-offset-4 hover:text-gold hover:underline"
            >
              Política de privacidade
            </a>
          </div>
        </div>

        <span className="rule-gold my-10" />

        <p className="text-xs text-ink-foreground/55">
          © {new Date().getFullYear()} {SALAO.nome} — {SALAO.profissional}. Todos os direitos
          reservados.
        </p>
      </div>
    </footer>
  );
}
