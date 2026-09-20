import { ArrowRight, Maximize2, Sparkles, X } from "lucide-react";
import { useEffect, useState } from "react";

import { usePublicSiteData } from "@/lib/site-data";

type FotoEspaco = {
  url: string;
  titulo: string;
  displayMode?: "contain" | "cover" | null;
  focusX?: number | null;
  focusY?: number | null;
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
        displayMode: image.display_mode ?? "contain",
        focusX: image.focus_x ?? 50,
        focusY: image.focus_y ?? 50,
      }))
      .filter((foto, index, lista) => lista.findIndex((item) => item.url === foto.url) === index) ?? [];

  const carregando = isLoading || isFetching;

  useEffect(() => {
    if (!selectedPhoto) return;
    const closeWithEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setSelectedPhoto(null);
    };
    window.addEventListener("keydown", closeWithEscape);
    return () => window.removeEventListener("keydown", closeWithEscape);
  }, [selectedPhoto]);

  return (
    <section
      id="nosso-espaco"
      className="relative overflow-hidden bg-background py-20 text-foreground lg:py-28"
    >
      <div aria-hidden className="pointer-events-none absolute -left-24 top-10 h-80 w-80 rounded-full bg-primary/15 blur-3xl" />
      <div aria-hidden className="pointer-events-none absolute -right-28 bottom-10 h-96 w-96 rounded-full bg-gold/10 blur-3xl" />
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <div className="relative grid gap-8 lg:grid-cols-[0.82fr_1.18fr] lg:items-end">
          <div>
            <p className="eyebrow flex w-fit items-center gap-2">
              <Sparkles className="h-3.5 w-3.5 text-gold" aria-hidden="true" />
              Nosso Espaço
            </p>
            <h2 className="mt-3 font-display text-4xl leading-tight sm:text-5xl lg:text-[4.6rem]">
              Um cantinho pensado para você se sentir bem
            </h2>
          </div>
          <div className="rounded-[2rem] border border-border bg-card/70 p-5 shadow-card backdrop-blur sm:p-6">
            <p className="text-sm leading-relaxed text-muted-foreground sm:text-base">
              Um portfólio visual do salão, pensado para mostrar o ambiente, os detalhes e a
              experiência de cuidado que as clientes encontram por aqui.
            </p>
            <a
              href="#agendamento"
              className="mt-5 inline-flex items-center gap-2 rounded-full bg-primary px-5 py-3 text-sm font-bold text-primary-foreground shadow-soft transition hover:brightness-105"
            >
              Quero conhecer o espaço
              <ArrowRight className="h-4 w-4" />
            </a>
          </div>
        </div>

        {carregando ? (
          <div className="mt-12 grid grid-cols-2 gap-4 sm:gap-5 lg:grid-cols-4">
            {Array.from({ length: 6 }).map((_, index) => (
              <div
                key={index}
                className="aspect-[4/5] animate-pulse rounded-[2rem] border border-border/60 bg-secondary/70 shadow-card"
              />
            ))}
          </div>
        ) : fotosEspaco.length ? (
          <div className="relative mt-12 rounded-[2.5rem] border border-border bg-card/55 p-3 shadow-[0_28px_90px_-55px_rgba(216,27,114,0.55)] backdrop-blur sm:p-4 lg:p-5">
            <div className="columns-2 gap-3 sm:columns-3 sm:gap-4 lg:columns-4">
              {fotosEspaco.map((foto, index) => (
                <button
                  key={foto.url}
                  type="button"
                  onClick={() => setSelectedPhoto(foto)}
                  className="group relative mb-3 block w-full break-inside-avoid overflow-hidden rounded-[1.7rem] border border-border/75 bg-background p-2 text-left shadow-card transition duration-300 hover:-translate-y-1 hover:border-primary/50 hover:shadow-soft focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/30 sm:mb-4"
                  aria-label={`Ampliar foto do espaço: ${foto.titulo}`}
                >
                  <img
                    src={foto.url}
                    alt={foto.titulo}
                    loading={index < 4 ? "eager" : "lazy"}
                    fetchPriority={index < 4 ? "high" : "auto"}
                    decoding="async"
                    className={`h-auto w-full rounded-[1.25rem] transition duration-500 group-hover:scale-[1.01] ${foto.displayMode === "cover" ? "aspect-[4/5] object-cover" : "object-contain"}`}
                    style={{ objectPosition: `${foto.focusX ?? 50}% ${foto.focusY ?? 50}%` }}
                  />
                  <span className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-background/90 text-magenta opacity-0 shadow-lg backdrop-blur transition group-hover:opacity-100">
                    <Maximize2 className="h-4 w-4" aria-hidden="true" />
                  </span>
                </button>
              ))}
            </div>
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
            <img src={selectedPhoto.url} alt={selectedPhoto.titulo} className="max-h-[86vh] w-full rounded-2xl object-contain" />
          </div>
        </div>
      ) : null}
    </section>
  );
}
