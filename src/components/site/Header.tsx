import { useEffect, useState } from "react";
import { Menu, X, MessageCircle, Sun, Moon } from "lucide-react";

import { BotaoLink } from "./Botao";
import { Logo } from "./Logo";
import { contatoLink, MENU, SALAO } from "@/lib/salao";
import { useTheme } from "@/hooks/use-theme";

export function Header() {
  const [aberto, setAberto] = useState(false);
  const [rolou, setRolou] = useState(false);
  const { theme, toggleTheme, isLight } = useTheme();

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
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        rolou ? "border-b border-border/70 bg-background/90 backdrop-blur-md" : "bg-transparent"
      }`}
    >
      <div className="mx-auto grid max-w-7xl grid-cols-[minmax(0,1fr)_auto] items-center gap-4 px-5 py-4 lg:px-8">
        <a href="/" className="min-w-0" aria-label="Bem Bonita — início">
          <Logo />
        </a>

        <div className="flex items-center gap-3">
          <nav className="hidden items-center gap-6 xl:flex" aria-label="Menu principal">
            {MENU.map((item) => (
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
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-border text-foreground xl:hidden"
            aria-label={isLight ? "Ativar modo escuro" : "Ativar modo claro"}
          >
            {isLight ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
          </button>

          <button
            type="button"
            onClick={() => setAberto((v) => !v)}
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-border text-foreground xl:hidden"
            aria-expanded={aberto}
            aria-controls="menu-mobile"
            aria-label={aberto ? "Fechar menu" : "Abrir menu"}
          >
            {aberto ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {aberto ? (
        <div
          id="menu-mobile"
          className="fixed inset-x-0 bottom-0 top-[4.75rem] overflow-y-auto border-t border-border bg-background px-5 pb-8 pt-4 xl:hidden"
        >
          <nav className="flex flex-col" aria-label="Menu mobile">
            {MENU.map((item) => (
              <a
                key={item.href}
                href={item.href}
                onClick={() => setAberto(false)}
                className="border-b border-border/60 py-4 text-base text-foreground/85"
              >
                {item.label}
              </a>
            ))}
          </nav>
          <BotaoLink
            href={agendar}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 w-full"
            onClick={() => setAberto(false)}
          >
            <MessageCircle className="h-4 w-4" />
            Solicitar avaliação
          </BotaoLink>
        </div>
      ) : null}
    </header>
  );
}
