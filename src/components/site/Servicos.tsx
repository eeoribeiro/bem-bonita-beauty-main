import { TituloSecao } from "./TituloSecao";
import { BotaoLink } from "./Botao";
import { contatoLink, SALAO } from "@/lib/salao";
import tratamento from "@/assets/servico-tratamento.jpg";
import definicao from "@/assets/servico-definicao.jpg";
import mechas from "@/assets/servico-mechas.jpg";
import penteado from "@/assets/servico-penteado.jpg";
import corte from "@/assets/servico-corte.jpg";
import cronograma from "@/assets/servico-cronograma.jpg";
import consultoria from "@/assets/servico-consultoria.jpg";
import { usePublicSiteData } from "@/lib/site-data";

const servicos = [
  {
    nome: "Tratamentos capilares",
    descricao: "Hidratação, nutrição e reconstrução para devolver força, maciez e brilho aos fios.",
    imagem: tratamento,
    alt: "Aplicação de tratamento hidratante em cabelo crespo",
    cta: "Solicite uma avaliação",
  },
  {
    nome: "Definição e finalização de cachos",
    descricao:
      "Técnicas de finalização que respeitam o formato natural do seu cacho e prolongam a definição.",
    imagem: definicao,
    alt: "Detalhe de cachos definidos e brilhantes",
    cta: "Consulte disponibilidade",
  },
  {
    nome: "Mechas e iluminação",
    descricao:
      "Coloração pensada para cabelos texturizados, com cuidado na saúde do fio e no resultado luminoso.",
    imagem: mechas,
    alt: "Cabelo cacheado com mechas iluminadas",
    cta: "Solicite uma avaliação",
  },
  {
    nome: "Penteados",
    descricao:
      "Penteados para festas, casamentos e ocasiões especiais, valorizando o volume natural.",
    imagem: penteado,
    alt: "Penteado preso elegante em cabelo texturizado",
    cta: "Consulte disponibilidade",
  },
  {
    nome: "Corte especializado",
    descricao:
      "Corte curvo, fio a fio, desenhado de acordo com o movimento e a densidade dos seus cachos.",
    imagem: corte,
    alt: "Corte especializado em cabelo cacheado",
    cta: "Consulte disponibilidade",
  },
  {
    nome: "Cronograma capilar",
    descricao:
      "Plano de cuidados personalizado, com etapas e produtos indicados para a sua rotina.",
    imagem: cronograma,
    alt: "Produtos capilares e cronograma escrito sobre superfície rosada",
    cta: "Solicite uma avaliação",
  },
  {
    nome: "Consultoria para cuidados em casa",
    descricao:
      "Orientação prática sobre lavagem, finalização e manutenção entre uma visita e outra.",
    imagem: consultoria,
    alt: "Profissional orientando cliente sobre produtos para cachos",
    cta: "Consulte disponibilidade",
  },
];

export function Servicos() {
  const { data, isLoading } = usePublicSiteData();
  const servicosExibidos = data?.services.length
    ? data.services.map((service) => ({
        nome: service.name,
        descricao: service.description,
        imagem: service.image_url ?? tratamento,
        alt: service.name,
        benefits: service.benefits,
      }))
    : servicos.slice(0, 4).map((service) => ({ ...service, benefits: [] as string[] }));
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

        <div className="mt-12 grid gap-5 lg:grid-cols-2">
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
                  className="group overflow-hidden rounded-3xl border border-border/60 bg-card shadow-card transition-shadow duration-300 hover:shadow-soft sm:grid sm:grid-cols-[12rem_1fr]"
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
                    <h3 className="text-xl leading-snug">{servico.nome}</h3>
                    <span className="rule-gold mt-3 max-w-[3.5rem]" />
                    <p className="mt-4 flex-1 text-sm leading-relaxed text-muted-foreground">
                      {servico.descricao}
                    </p>
                    {servico.benefits.length ? (
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
                        `Olá, ${SALAO.nome}! Gostaria de solicitar um orçamento para: ${servico.nome}.`,
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
        <div className="mt-8 rounded-2xl border border-primary/20 bg-card p-5 text-sm leading-relaxed text-muted-foreground">
          Também oferecemos corte especializado, cronograma capilar e orientação para manter os
          cuidados em casa. A indicação ideal é feita após conhecer o seu cabelo e o resultado que
          você deseja.
        </div>
        <BotaoLink
          href={contatoLink(
            `Olá, ${SALAO.nome}! Gostaria de agendar uma avaliação para o meu cabelo.`,
          )}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-6 w-full sm:w-auto"
        >
          Agendar uma avaliação pelo WhatsApp
        </BotaoLink>
      </div>
    </section>
  );
}
