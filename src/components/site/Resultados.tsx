import { ArrowUpRight, Instagram } from "lucide-react";
import { useState } from "react";

import { BotaoLink } from "./Botao";
import { TituloSecao } from "./TituloSecao";
import { SALAO } from "@/lib/salao";
import { usePublicSiteData } from "@/lib/site-data";

const cachos = [
  {
    imagem: "/media/resultado-cachos-longos.jpg",
    alt: "Cabelos longos com ondas e cachos finalizados no salão Bem Bonita",
    titulo: "Finalização com movimento",
  },
  {
    imagem: "/media/resultado-mechas-cachos.jpg",
    alt: "Cabelos cacheados longos com mechas iluminadas",
    titulo: "Mechas que valorizam os cachos",
  },
  {
    imagem: "/media/resultado-definicao.jpg",
    alt: "Cachos definidos vistos de perto após finalização",
    titulo: "Definição e brilho",
  },
  {
    imagem: "/media/resultado-cachos-naturais.jpg",
    alt: "Cabelos longos e naturalmente cacheados após atendimento",
    titulo: "Comprimento com leveza",
  },
  {
    imagem: "/media/resultado-corte-cacheado.jpg",
    alt: "Corte curto cacheado com finalização definida",
    titulo: "Corte e finalização",
  },
];

export function Resultados() {
  const { data, isLoading } = usePublicSiteData();
  const [categoriaAtiva, setCategoriaAtiva] = useState("todas");
  const portfolio = data?.portfolio ?? [];
  const servicos = data?.services ?? [];
  const itensFiltrados =
    categoriaAtiva === "todas"
      ? portfolio
      : portfolio.filter((item) => item.service_id === categoriaAtiva || item.service_name === servicos.find((service) => service.id === categoriaAtiva)?.name);

  return (
    <section id="resultados" className="bg-background py-16 lg:py-24">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
          <TituloSecao
            eyebrow="Galeria do Salão"
            titulo="Nossa Galeria"
            texto={
              data?.settings?.portfolio_description ??
              "Trabalhos realizados no Bem Bonita, com foco em definição, movimento, mechas, cortes e penteados personalizados."
            }
          />
          <BotaoLink
            href={SALAO.instagramUrl}
            target="_blank"
            rel="noopener noreferrer"
            variante="outline"
            className="shrink-0"
          >
            <Instagram className="h-4 w-4" />
            Ver mais no Instagram
            <ArrowUpRight className="h-4 w-4" />
          </BotaoLink>
        </div>

        {isLoading ? (
          <div className="-mx-5 mt-10 flex gap-4 overflow-hidden px-5 sm:mx-0 sm:grid sm:grid-cols-2 sm:px-0 lg:grid-cols-4">
            {Array.from({ length: 4 }, (_, index) => (
              <div
                key={index}
                className="aspect-[4/5] min-w-[78vw] animate-pulse rounded-3xl bg-secondary/60 sm:min-w-0"
              />
            ))}
          </div>
        ) : portfolio.length ? (
          <>
            {servicos.length ? (
              <div
                className="mt-8 flex flex-wrap gap-2"
                aria-label="Filtrar galeria por serviço"
              >
                <button
                  type="button"
                  onClick={() => setCategoriaAtiva("todas")}
                  className={`rounded-full border px-4 py-2 text-sm transition ${categoriaAtiva === "todas" ? "border-primary bg-primary text-primary-foreground" : "border-border text-muted-foreground hover:border-primary"}`}
                >
                  Todas
                </button>
                {servicos.map((service) => (
                  <button
                    key={service.id}
                    type="button"
                    onClick={() => setCategoriaAtiva(service.id)}
                    className={`rounded-full border px-4 py-2 text-sm transition ${categoriaAtiva === service.id ? "border-primary bg-primary text-primary-foreground" : "border-border text-muted-foreground hover:border-primary"}`}
                  >
                    {service.name}
                  </button>
                ))}
              </div>
            ) : null}
            {itensFiltrados.length ? null : (
              <div className="mt-8 rounded-3xl border border-dashed border-primary/30 bg-card p-8 text-center text-sm text-muted-foreground">
                Nenhuma foto vinculada a esse serviço ainda. No admin, edite uma foto da galeria e escolha o serviço correspondente.
              </div>
            )}
            <div className="-mx-5 mt-8 flex snap-x snap-mandatory gap-4 overflow-x-auto px-5 pb-4 sm:mx-0 sm:grid sm:grid-cols-2 sm:overflow-visible sm:px-0 sm:pb-0 lg:grid-cols-4">
              {itensFiltrados.map((item) => (
                <figure
                  key={item.id}
                  className="group min-w-[78vw] snap-center overflow-hidden rounded-3xl border border-border/70 bg-card shadow-card sm:min-w-0"
                >
                  <div className="relative aspect-[4/5] overflow-hidden bg-secondary/30">
                    <img
                      src={item.image_url}
                      alt={item.alt_text}
                      loading="lazy"
                      decoding="async"
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                      style={{
                        transform: `scale(${item.image_zoom ?? 1})`,
                        transformOrigin: `${item.image_position_x ?? 50}% ${item.image_position_y ?? 50}%`,
                      }}
                    />
                    {item.photo_label ? (
                      <span className="absolute left-3 top-3 rounded-full bg-black/60 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-white backdrop-blur">
                        {item.photo_label}
                      </span>
                    ) : null}
                  </div>
                  <figcaption className="px-4 py-4 text-card-foreground">
                    <span className="block text-sm font-semibold">{item.title}</span>
                    {item.description ? (
                      <span className="mt-1 block text-xs leading-relaxed text-muted-foreground">{item.description}</span>
                    ) : null}
                  </figcaption>
                </figure>
              ))}
            </div>
          </>
        ) : (
          <div className="-mx-5 mt-10 flex snap-x snap-mandatory gap-4 overflow-x-auto px-5 pb-4 sm:mx-0 sm:grid sm:grid-cols-2 sm:overflow-visible sm:px-0 sm:pb-0 lg:grid-cols-5">
            {cachos.map((item) => (
              <figure
                key={item.titulo}
                className="group min-w-[78vw] snap-center overflow-hidden rounded-3xl border border-border/70 bg-card shadow-card sm:min-w-0"
              >
                <img
                  src={item.imagem}
                  alt={item.alt}
                  loading="lazy"
                  className="aspect-[4/5] h-auto w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                />
                <figcaption className="px-4 py-4 text-sm font-medium text-card-foreground">
                  {item.titulo}
                </figcaption>
              </figure>
            ))}
          </div>
        )}

      </div>
    </section>
  );
}
