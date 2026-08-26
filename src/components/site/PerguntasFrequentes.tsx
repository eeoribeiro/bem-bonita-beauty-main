import { ChevronDown, MessageCircle } from "lucide-react";

import { BotaoLink } from "./Botao";
import { TituloSecao } from "./TituloSecao";
import { SALAO, whatsappLink } from "@/lib/salao";

const perguntas = [
  {
    pergunta: "Preciso fazer uma avaliação antes do procedimento?",
    resposta:
      "A avaliação ajuda a entender o estado dos fios, a rotina de cuidados e o resultado desejado. A necessidade é confirmada diretamente pelo WhatsApp.",
  },
  {
    pergunta: "Como saber o valor do serviço?",
    resposta:
      "O valor depende do comprimento, volume, técnica e necessidade do cabelo. Envie uma mensagem com o serviço desejado para receber as orientações.",
  },
  {
    pergunta: "Como preparo o cabelo para o atendimento?",
    resposta:
      "As orientações podem variar conforme o procedimento. Ao confirmar o horário, pergunte como levar o cabelo para que o atendimento seja realizado da melhor forma.",
  },
  {
    pergunta: "Onde fica o salão?",
    resposta: `O salão fica no Lanna Shopping, sala 118, no primeiro andar, em Ponte Nova/MG. O endereço completo e a rota estão logo abaixo.`,
  },
];

export function PerguntasFrequentes() {
  return (
    <section id="duvidas" className="bg-blush-soft py-16 lg:py-24">
      <div className="mx-auto grid max-w-6xl gap-10 px-5 lg:grid-cols-[0.8fr_1.2fr] lg:px-8">
        <div>
          <TituloSecao
            eyebrow="Dúvidas frequentes"
            titulo="Antes de agendar"
            texto="Informações rápidas para facilitar o seu primeiro contato com o Bem Bonita."
          />
          <BotaoLink
            href={whatsappLink(`Olá, ${SALAO.nome}! Tenho uma dúvida antes de agendar.`)}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-7"
          >
            <MessageCircle className="h-4 w-4" />
            Tirar dúvida pelo WhatsApp
          </BotaoLink>
        </div>

        <div className="space-y-3">
          {perguntas.map((item) => (
            <details
              key={item.pergunta}
              className="group rounded-2xl border border-border/70 bg-card p-5 shadow-card"
            >
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-medium text-card-foreground">
                {item.pergunta}
                <ChevronDown className="h-5 w-5 shrink-0 text-magenta transition-transform group-open:rotate-180" />
              </summary>
              <p className="mt-4 border-t border-border/60 pt-4 text-sm leading-relaxed text-muted-foreground">
                {item.resposta}
              </p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
