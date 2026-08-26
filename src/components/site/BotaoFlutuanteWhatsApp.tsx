import { MessageCircle } from "lucide-react";

import { SALAO, whatsappLink } from "@/lib/salao";

export function BotaoFlutuanteWhatsApp() {
  return (
    <a
      href={whatsappLink(`Olá, ${SALAO.nome}! Gostaria de mais informações.`)}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Falar com o salão pelo WhatsApp"
      className="fixed bottom-4 right-4 z-50 flex h-14 items-center gap-2 rounded-full bg-primary px-4 text-sm font-semibold text-primary-foreground shadow-soft transition-all duration-300 hover:scale-[1.03] hover:bg-magenta sm:bottom-5 sm:right-5"
    >
      <MessageCircle className="h-5 w-5" />
      <span className="sm:hidden">Agendar</span>
      <span className="hidden sm:inline">Falar no WhatsApp</span>
    </a>
  );
}
