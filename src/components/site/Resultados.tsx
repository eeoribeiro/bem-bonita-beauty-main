import { ArrowUpRight, Instagram } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import { BotaoLink } from "./Botao";
import { TituloSecao } from "./TituloSecao";
import { useMobileAutoCarousel } from "@/hooks/use-mobile-auto-carousel";
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

const trancas = [
  {
    imagem: "/media/penteado-trancas-rosa.jpg",
    alt: "Penteado com tranças laterais e detalhes delicados",
    titulo: "Tranças laterais personalizadas",
  },
  {
    imagem: "/media/penteado-trancas-douradas.jpg",
    alt: "Tranças com detalhes dourados em cabelo cacheado",
    titulo: "Tranças com detalhes dourados",
  },
  {
    imagem: "/media/penteado-trancas-coloridas.jpg",
    alt: "Penteado com tranças coloridas e acabamento criativo",
    titulo: "Tranças criativas e coloridas",
  },
];

function normalizarFiltro(value?: string | null) {
  return (value ?? "")
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .trim()
    .toLowerCase();
}

// Categoria reservada para a "Galeria de tranças" (gerenciada na aba própria do admin).
const BRAIDS_CATEGORY = "trancas";

export function Resultados() {
  const { data, isLoading } = usePublicSiteData();
  const [categoriaAtiva, setCategoriaAtiva] = useState("todas");
  const fallbackCarouselRef = useMobileAutoCarousel<HTMLDivElement>();
  const portfolioCarouselRef = useMobileAutoCarousel<HTMLDivElement>();
  const trancasCarouselRef = useMobileAutoCarousel<HTMLDivElement>();
  const portfolioBruto = data?.portfolio ?? [];
  const trancasSalvas = portfolioBruto
    .filter((item) => item.category === BRAIDS_CATEGORY)
    .map((item) => ({
      imagem: item.image_url,
      alt: item.alt_text,
      titulo: item.title,
    }));
  const portfolio = portfolioBruto.filter((item) => item.category !== BRAIDS_CATEGORY);
  const servicos = data?.services ?? [];
  const filtrosServico = useMemo(() => {
    const filtros = servicos
      .map((service) => {
        const serviceName = normalizarFiltro(service.name);
        const quantidade = portfolio.filter(
          (item) => item.service_id === service.id || normalizarFiltro(item.service_name) === serviceName,
        ).length;

        return {
          id: service.id,
          label: service.name,
          quantidade,
        };
      })
      .filter((filter) => filter.quantidade > 0);

    const nomesSemCadastro = portfolio
      .map((item) => item.service_name?.trim())
      .filter((name): name is string => Boolean(name))
      .filter((name) => !servicos.some((service) => normalizarFiltro(service.name) === normalizarFiltro(name)));

    for (const name of Array.from(new Set(nomesSemCadastro))) {
      const id = `name:${normalizarFiltro(name)}`;
      filtros.push({
        id,
        label: name,
        quantidade: portfolio.filter((item) => normalizarFiltro(item.service_name) === normalizarFiltro(name)).length,
      });
    }

    return filtros;
  }, [portfolio, servicos]);

  useEffect(() => {
    if (categoriaAtiva === "todas") return;
    if (!filtrosServico.some((filter) => filter.id === categoriaAtiva)) {
      setCategoriaAtiva("todas");
    }
  }, [categoriaAtiva, filtrosServico]);

  const itensFiltrados = useMemo(() => {
    if (categoriaAtiva === "todas") return portfolio;

    if (categoriaAtiva.startsWith("name:")) {
      const selectedName = categoriaAtiva.replace("name:", "");
      return portfolio.filter((item) => normalizarFiltro(item.service_name) === selectedName);
    }

    const selectedService = servicos.find((service) => service.id === categoriaAtiva);
    const selectedName = normalizarFiltro(selectedService?.name);

    return portfolio.filter(
      (item) => item.service_id === categoriaAtiva || normalizarFiltro(item.service_name) === selectedName,
    );
  }, [categoriaAtiva, portfolio, servicos]);

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
            {filtrosServico.length ? (
              <div className="mt-8 space-y-4" aria-label="Filtros da galeria">
                <div className="-mx-5 flex gap-2 overflow-x-auto px-5 pb-2 sm:mx-0 sm:flex-wrap sm:overflow-visible sm:px-0 sm:pb-0">
                  <button
                    type="button"
                    onClick={() => setCategoriaAtiva("todas")}
                    className={`shrink-0 rounded-full border px-4 py-2 text-sm transition ${categoriaAtiva === "todas" ? "border-primary bg-primary text-primary-foreground" : "border-border bg-card/40 text-muted-foreground hover:border-primary hover:text-foreground"}`}
                  >
                    Todas <span className="ml-1 opacity-70">({portfolio.length})</span>
                  </button>
                </div>
                <div>
                  <p className="mb-2 text-xs font-bold uppercase tracking-[0.22em] text-magenta">Serviços reais</p>
                  <div className="-mx-5 flex gap-2 overflow-x-auto px-5 pb-2 sm:mx-0 sm:flex-wrap sm:overflow-visible sm:px-0 sm:pb-0">
                    {filtrosServico.map((filter) => (
                      <button
                        key={filter.id}
                        type="button"
                        onClick={() => setCategoriaAtiva(filter.id)}
                        className={`shrink-0 rounded-full border px-4 py-2 text-sm transition ${categoriaAtiva === filter.id ? "border-primary bg-primary text-primary-foreground" : "border-border bg-card/40 text-muted-foreground hover:border-primary hover:text-foreground"}`}
                      >
                        {filter.label} <span className="ml-1 opacity-70">({filter.quantidade})</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            ) : null}
            {itensFiltrados.length ? null : (
              <div className="mt-8 rounded-3xl border border-dashed border-primary/30 bg-card p-8 text-center text-sm text-muted-foreground">
                Nenhuma foto vinculada a esse serviço ainda. No admin, edite uma foto da galeria e escolha o serviço correspondente.
              </div>
            )}
            <div
              ref={portfolioCarouselRef}
              className="-mx-5 mt-8 flex snap-x snap-mandatory gap-4 overflow-x-auto px-5 pb-4 sm:mx-0 sm:grid sm:grid-cols-2 sm:overflow-visible sm:px-0 sm:pb-0 lg:grid-cols-4"
            >
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
          <div
            ref={fallbackCarouselRef}
            className="-mx-5 mt-10 flex snap-x snap-mandatory gap-4 overflow-x-auto px-5 pb-4 sm:mx-0 sm:grid sm:grid-cols-2 sm:overflow-visible sm:px-0 sm:pb-0 lg:grid-cols-5"
          >
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

        <div className="mt-16 rounded-[2rem] border border-border/70 bg-card/60 p-5 shadow-card sm:p-8">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <TituloSecao
              eyebrow="Penteados"
              titulo="Galeria de tranças"
              texto="Inspirações de tranças e penteados personalizados feitos para valorizar textura, detalhe e movimento."
            />
            <BotaoLink
              href={SALAO.instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              variante="outline"
              className="shrink-0"
            >
              <Instagram className="h-4 w-4" />
              Ver no Instagram
            </BotaoLink>
          </div>
          <div
            ref={trancasCarouselRef}
            className="-mx-5 mt-8 flex snap-x snap-mandatory gap-4 overflow-x-auto px-5 pb-4 sm:mx-0 sm:grid sm:grid-cols-2 sm:overflow-visible sm:px-0 sm:pb-0 lg:grid-cols-3"
          >
            {(trancasSalvas.length ? trancasSalvas : trancas).map((item) => (
              <figure
                key={item.titulo}
                className="group min-w-[78vw] snap-center overflow-hidden rounded-3xl border border-border/70 bg-card shadow-card sm:min-w-0"
              >
                <div className="relative aspect-[4/5] overflow-hidden bg-secondary/30">
                  <img
                    src={item.imagem}
                    alt={item.alt}
                    loading="lazy"
                    decoding="async"
                    className="h-full w-full object-cover object-center transition-transform duration-500 group-hover:scale-[1.03]"
                  />
                </div>
                <figcaption className="px-4 py-4 text-sm font-semibold text-card-foreground">
                  {item.titulo}
                </figcaption>
              </figure>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
