import { Maximize2, Sparkles, X } from "lucide-react";
import { useState } from "react";

import { usePublicSiteData } from "@/lib/site-data";

type FotoEspaco = {
  url: string;
  titulo: string;
};

export function Sobre() {
  const { data, isFetching, isLoading } = usePublicSiteData();
  const [selectedPhoto, setSelectedPhoto] = useState<FotoEspaco | null>(null);

  const fotosEspaco =
    data?.spacePhotos
      .filter((image) => image.image_url)
      .map((image) => ({
        url: image.image_url,
        titulo: image.alt_text || image.title || "Foto do espaço Bem Bonita",
      }))
      .filter((foto, index, lista) => lista.findIndex((item) => item.url === foto.url) === index) ?? [];

  const carregando = isLoading || isFetching;

  return (
    <section
      id="nosso-espaco"
      className="bg-[linear-gradient(180deg,hsl(var(--background))_0%,hsl(var(--secondary)/0.55)_100%)] py-20 lg:py-28"
    >
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <p className="eyebrow mx-auto flex w-fit items-center gap-2">
            <Sparkles className="h-3.5 w-3.5 text-gold" aria-hidden="true" />
            Nosso Espaço
          </p>
          <h2 className="mt-3 font-display text-3xl leading-tight sm:text-4xl">
            Nosso Espaço
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base">
            Um portfólio visual do salão, pensado para mostrar o ambiente, os detalhes e a
            experiência de cuidado que as clientes encontram por aqui.
          </p>
        </div>

        {carregando ? (
          <div className="mt-12 grid grid-cols-2 gap-4 sm:gap-5 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, index) => (
              <div
                key={index}
                className="aspect-[4/5] animate-pulse rounded-[2rem] border border-border/60 bg-secondary/70 shadow-card"
              />
            ))}
          </div>
        ) : fotosEspaco.length ? (
          <div className="mt-12 grid grid-cols-2 gap-4 sm:gap-5 lg:grid-cols-3">
            {fotosEspaco.map((foto, index) => (
              <button
                key={foto.url}
                type="button"
                onClick={() => setSelectedPhoto(foto)}
                className="group relative block aspect-[4/5] overflow-hidden rounded-[2rem] border border-white/70 bg-card p-2 shadow-[0_18px_55px_rgba(200,100,140,0.18)] transition duration-300 hover:-translate-y-1 hover:border-primary/45 hover:shadow-soft focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/30 dark:border-white/10 dark:bg-white/5"
                aria-label={`Ampliar foto do espaço: ${foto.titulo}`}
              >
                <img
                  src={foto.url}
                  alt={foto.titulo}
                  loading={index < 3 ? "eager" : "lazy"}
                  fetchPriority={index < 3 ? "high" : "auto"}
                  decoding="async"
                  className="h-full w-full rounded-[1.5rem] object-cover transition duration-500 group-hover:scale-[1.03]"
                />
                <span className="absolute right-5 top-5 flex h-10 w-10 items-center justify-center rounded-full bg-black/55 text-white opacity-0 shadow-lg backdrop-blur transition group-hover:opacity-100">
                  <Maximize2 className="h-4 w-4" aria-hidden="true" />
                </span>
              </button>
            ))}
          </div>
        ) : (
          <div className="mx-auto mt-12 max-w-2xl rounded-[2rem] border border-dashed border-primary/35 bg-card p-8 text-center shadow-card">
            <p className="font-display text-2xl">Nenhuma foto do espaço publicada ainda</p>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              Adicione fotos na aba “Nosso Espaço” do painel administrativo para montar essa
              galeria em formato de portfólio.
            </p>
          </div>
        )}
      </div>

      {selectedPhoto ? (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Foto do espaço ampliada"
          onMouseDown={(event) => event.target === event.currentTarget && setSelectedPhoto(null)}
          className="fixed inset-0 z-[80] flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm"
        >
          <div className="relative max-h-[92vh] max-w-5xl overflow-auto rounded-3xl bg-card p-3 shadow-2xl">
            <button
              type="button"
              onClick={() => setSelectedPhoto(null)}
              className="absolute right-5 top-5 z-10 flex h-11 w-11 items-center justify-center rounded-full bg-black/70 text-white"
              aria-label="Fechar foto ampliada"
            >
              <X className="h-5 w-5" />
            </button>
            <img
              src={selectedPhoto.url}
              alt={selectedPhoto.titulo}
              className="max-h-[86vh] w-full rounded-2xl object-contain"
            />
          </div>
        </div>
      ) : null}
    </section>
  );
}
