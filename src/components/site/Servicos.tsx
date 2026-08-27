import { TituloSecao } from "./TituloSecao";
import { BotaoLink } from "./Botao";
import { contatoLink, SALAO } from "@/lib/salao";
import { initialServices } from "@/lib/initial-content";
import { usePublicSiteData } from "@/lib/site-data";

export function Servicos() {
  const { data, isLoading } = usePublicSiteData();
  const servicosExibidos = data?.services.length
    ? data.services.map((service) => ({
        nome: service.name,
        descricao: service.description,
        imagem: service.image_url ?? initialServices[0].image_url,
        alt: service.name,
        benefits: service.benefits ?? [],
      }))
    : initialServices.map((service) => ({
        nome: service.name,
        descricao: service.description,
        imagem: service.image_url,
        alt: service.name,
        benefits: service.benefits,
      }));

  return (
    <section id="servicos" className="bg-blush-soft py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <div data-reveal className="reveal">
          <TituloSecao
            eyebrow="Serviços"
            titulo={data?.settings?.services_title ?? "Técnica dedicada a cada tipo de cacho"}
            texto={
              data?.settings?.services_description ??
              "Atendimentos pensados para cabelos crespos e cacheados, com avaliação individual antes de cada procedimento."
            }
          />
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-2">
          {isLoading
            ? Array.from({ length: 4 }, (_, index) => (
                <div
                  key={index}
                  className="overflow-hidden rounded-3xl border border-border/60 bg-card sm:grid sm:grid-cols-[12rem_1fr]"
                >
                  <div className="h-56 animate-pulse bg-secondary/70 sm:h-full sm:min-h-64" />
                  <div className="space-y-3 p-6">
                    <div className="h-5 w-2/3 animate-pulse rounded bg-secondary/70" />
                    <div className="h-16 animate-pulse rounded bg-secondary/40" />
                  </div>
                </div>
              ))
            : servicosExibidos.map((servico) => (
                <article
                  key={servico.nome}
                  className="group flex flex-col justify-between overflow-hidden rounded-3xl border border-border/60 bg-card shadow-card transition-shadow duration-300 hover:shadow-soft sm:grid sm:grid-cols-[12rem_1fr]"
                >
                  <div className="h-60 overflow-hidden sm:h-full sm:min-h-72">
                    <img
                      src={servico.imagem}
                      width={900}
                      height={700}
                      loading="lazy"
                      alt={servico.alt}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                    />
                  </div>
                  <div className="flex min-w-0 flex-col p-6">
                    <h3 className="text-xl leading-snug font-display">{servico.nome}</h3>
                    <span className="rule-gold mt-3 max-w-[3.5rem]" />
                    <p className="mt-4 flex-1 text-sm leading-relaxed text-muted-foreground">
                      {servico.descricao}
                    </p>
                    {servico.benefits && servico.benefits.length ? (
                      <ul className="mt-4 space-y-2 text-xs text-muted-foreground">
                        {servico.benefits.map((benefit) => (
                          <li key={benefit} className="flex gap-2">
                            <span className="text-gold">•</span> {benefit}
                          </li>
                        ))}
                      </ul>
                    ) : null}
                    <BotaoLink
                      href={contatoLink(
                        `Olá, ${SALAO.nome}! Gostaria de agendar ou tirar dúvidas sobre o serviço: ${servico.nome}.`,
                      )}
                      target="_blank"
                      rel="noopener noreferrer"
                      variante="outline"
                      className="mt-6 w-full"
                    >
                      Conversar sobre este serviço
                    </BotaoLink>
                  </div>
                </article>
              ))}
        </div>

        <div className="mt-12 flex flex-col sm:flex-row items-center justify-between gap-6 rounded-3xl border border-primary/20 bg-card p-6 sm:p-8 shadow-card">
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
            className="w-full sm:w-auto shrink-0 shadow-soft"
          >
            Agendar avaliação no WhatsApp
          </BotaoLink>
        </div>
      </div>
    </section>
  );
}
