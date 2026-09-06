import { useEffect, useState } from "react";
import { Menu, MessageCircle, Moon, Sun, X } from "lucide-react";

import { BotaoLink } from "./Botao";
import { Logo } from "./Logo";
import { contatoLink, SALAO } from "@/lib/salao";
import { useTheme } from "@/hooks/use-theme";

const NAV_ITEMS = [
  { label: "Início", href: "/#inicio" },
  { label: "Francielly", href: "/francielly" },
  { label: "Serviços", href: "/servicos" },
  { label: "Loja", href: "/produtos" },
  { label: "Feedbacks", href: "/feedbacks" },
  { label: "Contato", href: "/#localizacao" },
] as const;

export function Header() {
  const [aberto, setAberto] = useState(false);
  const [rolou, setRolou] = useState(false);
  const { toggleTheme, isLight } = useTheme();

  useEffect(() => {
    const onScroll = () => setRolou(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = aberto ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [aberto]);

  useEffect(() => {
    if (!aberto) return;
    const fecharComEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setAberto(false);
    };
    window.addEventListener("keydown", fecharComEscape);
    return () => window.removeEventListener("keydown", fecharComEscape);
  }, [aberto]);

  const agendar = contatoLink(`Olá, ${SALAO.nome}! Gostaria de agendar um horário.`);

  return (
    <header className="pointer-events-none fixed inset-x-0 top-0 z-50 px-2.5 pt-2.5 sm:px-5 sm:pt-4">
      <div
        className={`pointer-events-auto relative mx-auto grid w-full max-w-[64rem] origin-top grid-cols-[minmax(0,1fr)_auto] items-center gap-2 rounded-[1.6rem] border border-border/45 bg-background/78 px-3 shadow-[0_12px_40px_-20px_rgba(0,0,0,0.55)] backdrop-blur-xl transition-[transform,padding,background-color,box-shadow] duration-300 ease-out sm:gap-3 sm:rounded-full sm:px-6 ${
          rolou
            ? "scale-[0.96] bg-background/88 py-2 shadow-[0_16px_44px_-18px_rgba(0,0,0,0.68)] sm:scale-[0.9]"
            : "scale-100 py-2.5 sm:py-3"
        }`}
      >
        <a href="/" className="min-w-0" aria-label="Bem Bonita — início">
          <Logo />
        </a>

        <div className="flex items-center gap-2 sm:gap-3">
          <nav className="hidden items-center gap-6 xl:flex" aria-label="Menu principal">
            {NAV_ITEMS.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="text-sm font-medium text-foreground/80 transition-colors hover:text-magenta"
              >
                {item.label}
              </a>
            ))}
            <button
              type="button"
              onClick={toggleTheme}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-border/70 bg-card text-foreground/80 transition-colors hover:border-primary hover:text-magenta"
              aria-label={isLight ? "Ativar modo escuro" : "Ativar modo claro"}
              title={isLight ? "Ativar modo escuro" : "Ativar modo claro"}
            >
              {isLight ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
            </button>
            <BotaoLink
              href={agendar}
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-2.5"
            >
              Solicitar avaliação
            </BotaoLink>
          </nav>

          <button
            type="button"
            onClick={toggleTheme}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-border/60 bg-card/55 text-foreground backdrop-blur-md sm:h-11 sm:w-11 xl:hidden"
            aria-label={isLight ? "Ativar modo escuro" : "Ativar modo claro"}
          >
            {isLight ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
          </button>

          <button
            type="button"
            onClick={() => setAberto((v) => !v)}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-border/60 bg-card/55 text-foreground backdrop-blur-md sm:h-11 sm:w-11 xl:hidden"
            aria-expanded={aberto}
            aria-controls="menu-mobile"
            aria-label={aberto ? "Fechar menu" : "Abrir menu"}
          >
            {aberto ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        {aberto ? (
          <div
            id="menu-mobile"
            className="absolute left-0 right-0 top-[calc(100%+0.65rem)] max-h-[calc(100vh-6rem)] overflow-y-auto rounded-[1.75rem] border border-border/50 bg-background/95 p-3 shadow-2xl backdrop-blur-2xl xl:hidden"
          >
            <nav className="flex flex-col" aria-label="Menu mobile">
              {NAV_ITEMS.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  onClick={() => setAberto(false)}
                  className="rounded-2xl px-4 py-3.5 text-base font-medium text-foreground/85 transition-colors hover:bg-secondary/70 hover:text-magenta"
                >
                  {item.label}
                </a>
              ))}
            </nav>
            <BotaoLink
              href={agendar}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 w-full"
              onClick={() => setAberto(false)}
            >
              <MessageCircle className="h-4 w-4" />
              Solicitar avaliação
            </BotaoLink>
          </div>
        ) : null}
      </div>
    </header>
  );
}
