import { MessageCircle } from "lucide-react";

import { BotaoLink } from "./Botao";
import { TituloSecao } from "./TituloSecao";
import { contatoLink, SALAO } from "@/lib/salao";
import { initialServices } from "@/lib/initial-content";
import { usePublicSiteData } from "@/lib/site-data";

export function Servicos() {
  const { data, isError, isLoading } = usePublicSiteData();
  const servicosExibidos = data
    ? data.services.map((service) => ({
        id: service.id,
        nome: service.name,
        descricao: service.description,
        preco: service.price_text,
      }))
    : isError
      ? initialServices.map((service) => ({
          id: service.name,
          nome: service.name,
          descricao: service.description,
          preco: service.price_text,
        }))
    : initialServices.map((service) => ({
        id: service.name,
        nome: service.name,
        descricao: service.description,
        preco: service.price_text,
      }));

  return (
    <section id="servicos" className="bg-blush-soft py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <div data-reveal className="reveal">
          <TituloSecao
            eyebrow="Serviços"
            titulo={data?.settings?.services_title ?? "Tabela de preços Bem Bonita"}
            texto={
              data?.settings?.services_description ??
              "Atendimentos para cuidar dos cachos, tratamentos e finalizações com clareza para você escolher o melhor momento de se cuidar."
            }
          />
        </div>

        <div className="mt-12 grid gap-4 lg:grid-cols-2">
          {isLoading
            ? Array.from({ length: 8 }, (_, index) => (
                <div key={index} className="rounded-3xl border border-border/60 bg-card p-6 shadow-card">
                  <div className="h-5 w-2/3 animate-pulse rounded bg-secondary/70" />
                  <div className="mt-4 h-12 animate-pulse rounded bg-secondary/40" />
                </div>
              ))
            : servicosExibidos.length ? servicosExibidos.map((servico, index) => (
                <article
                  key={servico.id}
                  className="group flex min-h-full flex-col justify-between rounded-3xl border border-border/60 bg-card p-5 shadow-card transition duration-300 hover:-translate-y-0.5 hover:border-primary/50 hover:shadow-soft sm:p-6"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-secondary text-xs font-semibold text-magenta">
                          {String(index + 1).padStart(2, "0")}
                        </span>
                        <h3 className="text-xl leading-snug font-display">{servico.nome}</h3>
                      </div>
                      {servico.descricao ? (
                        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                          {servico.descricao}
                        </p>
                      ) : null}
                    </div>
                    <strong className="shrink-0 rounded-full bg-secondary px-4 py-2 text-sm font-semibold text-magenta">
                      {servico.preco}
                    </strong>
                  </div>

                  <div className="mt-5 border-t border-border/60 pt-4">
                    <BotaoLink
                      href={contatoLink(
                        `Olá, ${SALAO.nome}! Gostaria de agendar ou tirar dúvidas sobre o serviço: ${servico.nome}.`,
                      )}
                      target="_blank"
                      rel="noopener noreferrer"
                      variante="outline"
                      className="w-full"
                    >
                      <MessageCircle className="h-4 w-4" />
                      Conversar sobre este serviço
                    </BotaoLink>
                  </div>
                </article>
              )) : (
                <div className="rounded-3xl border border-dashed border-primary/30 bg-card p-8 text-center text-sm text-muted-foreground lg:col-span-2">
                  A tabela de serviços será publicada em breve.
                </div>
              )}
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-6 rounded-3xl border border-primary/20 bg-card p-6 shadow-card sm:flex-row sm:p-8">
          <div className="max-w-2xl">
            <h4 className="text-xl font-display">Não tem certeza de qual serviço escolher?</h4>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              A avaliação capilar é o primeiro passo para entendermos a densidade, curvatura e as
              necessidades atuais do seu cabelo.
            </p>
          </div>
          <BotaoLink
            href={contatoLink(
              `Olá, ${SALAO.nome}! Gostaria de agendar uma avaliação inicial para os meus cachos.`,
            )}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full shrink-0 shadow-soft sm:w-auto"
          >
            Agendar avaliação no WhatsApp
          </BotaoLink>
        </div>
      </div>
    </section>
  );
}
