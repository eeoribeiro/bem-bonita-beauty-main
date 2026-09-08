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
  const categorias = data?.categories ?? [];
  const itensFiltrados =
    categoriaAtiva === "todas"
      ? portfolio
      : portfolio.filter(
          (item) =>
            item.category_id === categoriaAtiva ||
            item.category === categorias.find((category) => category.id === categoriaAtiva)?.slug,
        );

  return (
    <section id="resultados" className="bg-background py-16 lg:py-24">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
          <TituloSecao
            eyebrow="Resultados reais"
            titulo="Galeria de Resultados"
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
            {categorias.length ? (
              <div
                className="mt-8 flex flex-wrap gap-2"
                aria-label="Filtrar portfólio por categoria"
              >
                <button
                  type="button"
                  onClick={() => setCategoriaAtiva("todas")}
                  className={`rounded-full border px-4 py-2 text-sm transition ${categoriaAtiva === "todas" ? "border-primary bg-primary text-primary-foreground" : "border-border text-muted-foreground hover:border-primary"}`}
                >
                  Todas
                </button>
                {categorias.map((category) => (
                  <button
                    key={category.id}
                    type="button"
                    onClick={() => setCategoriaAtiva(category.id)}
                    className={`rounded-full border px-4 py-2 text-sm transition ${categoriaAtiva === category.id ? "border-primary bg-primary text-primary-foreground" : "border-border text-muted-foreground hover:border-primary"}`}
                  >
                    {category.name}
                  </button>
                ))}
              </div>
            ) : null}
            <div className="-mx-5 mt-8 flex snap-x snap-mandatory gap-4 overflow-x-auto px-5 pb-4 sm:mx-0 sm:grid sm:grid-cols-2 sm:overflow-visible sm:px-0 sm:pb-0 lg:grid-cols-4">
              {itensFiltrados.map((item) => (
                <figure
                  key={item.id}
                  className="group min-w-[78vw] snap-center overflow-hidden rounded-3xl border border-border/70 bg-card shadow-card sm:min-w-0"
                >
                  <img
                    src={item.image_url}
                    alt={item.alt_text}
                    loading="lazy"
                    className="aspect-[4/5] h-auto w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                  />
                  <figcaption className="px-4 py-4 text-sm font-medium text-card-foreground">
                    {item.title}
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
