import { MapPin, MessageCircle, Sparkles } from "lucide-react";

import { BotaoLink } from "./Botao";
import { SALAO, whatsappLink } from "@/lib/salao";

export function Agendamento() {
  return (
    <section id="agendamento" className="relative overflow-hidden bg-ink py-16 lg:py-24">
      <div
        aria-hidden
        className="absolute -left-20 top-10 h-72 w-72 rounded-full bg-primary/20 blur-3xl"
      />
      <div className="relative mx-auto max-w-6xl px-5 text-center lg:px-8">
        <p className="mx-auto flex w-fit items-center gap-2 text-xs uppercase tracking-[0.22em] text-gold">
          <Sparkles className="h-3.5 w-3.5" />
          Atendimento personalizado
        </p>
        <h2 className="mx-auto mt-5 max-w-3xl text-3xl leading-tight text-ink-foreground sm:text-5xl">
          Vamos conversar sobre o resultado que você deseja?
        </h2>
        <p className="mx-auto mt-5 max-w-2xl leading-relaxed text-ink-foreground/70">
          Envie uma mensagem pelo WhatsApp, conte um pouco sobre o seu cabelo e consulte os horários
          disponíveis para atendimento.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <BotaoLink
            href={whatsappLink(
              `Olá, ${SALAO.nome}! Gostaria de agendar uma avaliação para o meu cabelo.`,
            )}
            target="_blank"
            rel="noopener noreferrer"
          >
            <MessageCircle className="h-4 w-4" />
            Agendar pelo WhatsApp
          </BotaoLink>
          <BotaoLink
            href="#localizacao"
            variante="outline"
            className="border-ink-foreground/35 text-ink-foreground hover:bg-ink-foreground/10"
          >
            <MapPin className="h-4 w-4" />
            Ver localização
          </BotaoLink>
        </div>
        <p className="mt-6 flex items-center justify-center gap-2 text-xs text-ink-foreground/55">
          <MessageCircle className="h-3.5 w-3.5" />O horário é confirmado diretamente durante o
          atendimento.
        </p>
      </div>
    </section>
  );
}
