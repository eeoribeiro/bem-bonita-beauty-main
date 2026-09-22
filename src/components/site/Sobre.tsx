import { ChevronLeft, ChevronRight, Maximize2, X } from "lucide-react";
import { useCallback, useEffect, useState } from "react";

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
  const fotoDestaque = fotosEspaco[0] ?? null;
  const fotosGaleria = fotosEspaco.length > 1 ? fotosEspaco.slice(1) : fotosEspaco;

  useEffect(() => {
    if (!selectedPhoto) return;
    const closeWithEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setSelectedPhoto(null);
    };
    window.addEventListener("keydown", closeWithEscape);
    return () => window.removeEventListener("keydown", closeWithEscape);
  }, [selectedPhoto]);

  const activeIndex = selectedPhoto ? fotosEspaco.findIndex((foto) => foto.url === selectedPhoto.url) : -1;

  const showPhotoAt = useCallback(
    (index: number) => {
      if (!fotosEspaco.length) return;
      const normalized = (index + fotosEspaco.length) % fotosEspaco.length;
      const foto = fotosEspaco[normalized];
      if (foto) setSelectedPhoto(foto);
    },
    [fotosEspaco],
  );

  const stepPhoto = useCallback(
    (direction: 1 | -1) => {
      if (activeIndex === -1) return;
      showPhotoAt(activeIndex + direction);
    },
    [activeIndex, showPhotoAt],
  );

  useEffect(() => {
    if (!selectedPhoto || fotosEspaco.length < 2) return;
    const handleArrows = (event: KeyboardEvent) => {
      if (event.key === "ArrowRight") {
        event.preventDefault();
        stepPhoto(1);
      } else if (event.key === "ArrowLeft") {
        event.preventDefault();
        stepPhoto(-1);
      }
    };
    window.addEventListener("keydown", handleArrows);
    return () => window.removeEventListener("keydown", handleArrows);
  }, [selectedPhoto, fotosEspaco.length, stepPhoto]);

  return (
    <section
      id="nosso-espaco"
      className="relative overflow-hidden bg-[#181113] py-20 text-white lg:py-28"
    >
      <div aria-hidden className="pointer-events-none absolute -left-28 top-24 h-96 w-96 rounded-full bg-primary/10 blur-3xl" />
      <div aria-hidden className="pointer-events-none absolute -right-28 top-0 h-96 w-96 rounded-full bg-gold/10 blur-3xl" />
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <div className="relative grid min-h-[34rem] gap-10 lg:grid-cols-[0.78fr_1.22fr] lg:items-center">
          <div className="max-w-xl pt-8 lg:pt-16">
            <h2 className="font-display text-4xl leading-tight text-white sm:text-5xl lg:text-[3.45rem]">
              Nosso espaço
            </h2>
            <p className="mt-5 max-w-md text-base leading-8 text-white/72">
              Poucos metros quadrados, mas cada estação foi pensada com carinho: mármore branco,
              ripas de madeira e um cantinho reservado pra cada cliente.
            </p>
            <div className="mt-8 flex items-center gap-4 text-sm text-white/76">
              <span className="h-px w-11 bg-gold" aria-hidden="true" />
              <span>{fotosEspaco.length || 0} registros do dia a dia do salão</span>
            </div>
          </div>

          {fotoDestaque ? (
            <button
              type="button"
              onClick={() => setSelectedPhoto(fotoDestaque)}
              className="group relative overflow-hidden rounded-[1.2rem] border border-white/35 bg-white/5 shadow-[0_26px_90px_-45px_rgba(255,170,210,0.55)] transition duration-300 hover:-translate-y-1 hover:border-primary/60 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/40"
              aria-label={`Ampliar foto do espaço: ${fotoDestaque.titulo}`}
            >
              <img
                src={fotoDestaque.url}
                alt={fotoDestaque.titulo}
                loading="eager"
                fetchPriority="high"
                decoding="async"
                className="aspect-[4/5] w-full object-cover transition duration-700 group-hover:scale-[1.025] lg:max-h-[44rem]"
                style={{ objectPosition: `${fotoDestaque.focusX ?? 50}% ${fotoDestaque.focusY ?? 50}%` }}
              />
              <span className="absolute right-5 top-5 flex h-11 w-11 items-center justify-center rounded-full bg-black/45 text-white opacity-0 shadow-lg backdrop-blur transition group-hover:opacity-100">
                <Maximize2 className="h-4 w-4" aria-hidden="true" />
              </span>
            </button>
          ) : null}
        </div>

        <div className="mt-14 flex items-center gap-5 text-xs text-white/68">
          <span className="shrink-0">a casa por dentro</span>
          <span className="h-px flex-1 bg-white/14" aria-hidden="true" />
        </div>

        {carregando ? (
          <div className="mt-8 grid grid-cols-2 gap-4 sm:gap-5 lg:grid-cols-4">
            {Array.from({ length: 6 }).map((_, index) => (
              <div
                key={index}
                className="aspect-[4/5] animate-pulse rounded-[1.5rem] border border-white/10 bg-white/10 shadow-card"
              />
            ))}
          </div>
        ) : fotosGaleria.length ? (
          <div className="relative mt-8">
            <div className="columns-2 gap-3 sm:columns-3 sm:gap-4 lg:columns-4">
              {fotosGaleria.map((foto, index) => (
                <button
                  key={foto.url}
                  type="button"
                  onClick={() => setSelectedPhoto(foto)}
                  className="bb-fade-up group relative mb-3 block w-full break-inside-avoid overflow-hidden rounded-[1.35rem] border border-white/12 bg-white/[0.04] p-2 text-left shadow-[0_18px_58px_-38px_rgba(0,0,0,0.9)] transition duration-300 hover:-translate-y-1 hover:border-primary/50 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/35 sm:mb-4"
                  style={{ animationDelay: `${Math.min(index, 11) * 60}ms` }}
                  aria-label={`Ampliar foto do espaço: ${foto.titulo}`}
                >
                  <img
                    src={foto.url}
                    alt={foto.titulo}
                    loading={index < 4 ? "eager" : "lazy"}
                    fetchPriority={index < 4 ? "high" : "auto"}
                    decoding="async"
                    className={`h-auto w-full rounded-[1rem] transition duration-500 group-hover:scale-[1.045] ${foto.displayMode === "cover" ? "aspect-[4/5] object-cover" : "object-contain"}`}
                    style={{ objectPosition: `${foto.focusX ?? 50}% ${foto.focusY ?? 50}%` }}
                  />
                  <span className="pointer-events-none absolute inset-x-3 bottom-3 z-[1] flex items-center gap-2 rounded-xl bg-gradient-to-t from-black/75 via-black/45 to-transparent px-3 pb-2.5 pt-7 text-left opacity-0 transition duration-300 group-hover:opacity-100">
                    <span className="truncate text-xs font-semibold text-white">{foto.titulo}</span>
                    <Maximize2 className="ml-auto h-4 w-4 shrink-0 text-white" aria-hidden="true" />
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
          <div className="relative max-h-[92vh] w-full max-w-5xl overflow-auto rounded-3xl bg-card p-3 shadow-2xl">
            <button
              type="button"
              onClick={() => setSelectedPhoto(null)}
              className="absolute right-5 top-5 z-10 flex h-11 w-11 items-center justify-center rounded-full bg-black/70 text-white transition hover:bg-black/85"
              aria-label="Fechar foto ampliada"
            >
              <X className="h-5 w-5" />
            </button>
            {fotosEspaco.length > 1 ? (
              <>
                <button
                  type="button"
                  onClick={() => stepPhoto(-1)}
                  className="absolute left-6 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-black/70 text-white transition hover:bg-black/90"
                  aria-label="Foto anterior"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <button
                  type="button"
                  onClick={() => stepPhoto(1)}
                  className="absolute right-6 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-black/70 text-white transition hover:bg-black/90"
                  aria-label="Próxima foto"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
              </>
            ) : null}
            <img
              src={selectedPhoto.url}
              alt={selectedPhoto.titulo}
              className="mx-auto max-h-[86vh] w-auto max-w-full rounded-2xl object-contain"
            />
            <div className="mt-2 flex items-center justify-center gap-3 pb-1 text-sm text-muted-foreground">
              <span className="text-foreground">{selectedPhoto.titulo}</span>
              {fotosEspaco.length > 1 ? (
                <span className="rounded-full bg-muted px-2.5 py-0.5 text-xs font-semibold text-muted-foreground">
                  {activeIndex + 1} / {fotosEspaco.length}
                </span>
              ) : null}
            </div>
          </div>
        </div>
      ) : null}
    </section>
  );
}
