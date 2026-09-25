import { Maximize2, Sparkles, X } from "lucide-react";
import { useEffect, useState } from "react";

import { usePublicSiteData } from "@/lib/site-data";

type FotoEspaco = {
  url: string;
  titulo: string;
  displayMode?: "contain" | "cover" | null;
  focusX?: number | null;
  focusY?: number | null;
  zoom?: number | null;
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
        zoom: image.image_zoom ?? 1,
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

  return (
    <section
      id="nosso-espaco"
      className="relative overflow-hidden bg-[#160f12] py-20 text-white lg:py-28"
    >
      <div aria-hidden className="pointer-events-none absolute -left-28 top-24 h-96 w-96 rounded-full bg-primary/15 blur-3xl" />
      <div aria-hidden className="pointer-events-none absolute -right-24 top-4 h-[28rem] w-[28rem] rounded-full bg-gold/10 blur-3xl" />
      <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-black/25 to-transparent" />
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <div className="relative grid gap-8 lg:grid-cols-[0.82fr_1.18fr] lg:items-center lg:gap-12">
          <div className="rounded-[2rem] border border-white/10 bg-white/[0.045] p-6 shadow-[0_28px_90px_-55px_rgba(0,0,0,0.9)] backdrop-blur sm:p-8 lg:p-10">
            <p className="inline-flex items-center gap-2 rounded-full border border-primary/25 bg-primary/10 px-3 py-1 text-xs font-bold uppercase tracking-[0.22em] text-primary">
              <Sparkles className="h-3.5 w-3.5 text-gold" />
              Ambiente Bem Bonita
            </p>
            <h2 className="mt-5 font-display text-4xl leading-tight text-white sm:text-5xl lg:text-[3.45rem]">
              Nosso espaço
            </h2>
            <p className="mt-5 text-base leading-8 text-white/76">
              Poucos metros quadrados, mas cada estação foi pensada com carinho: mármore branco,
              ripas de madeira e um cantinho reservado pra cada cliente.
            </p>
            <div className="mt-7 grid grid-cols-2 gap-3 text-sm">
              <div className="rounded-2xl border border-white/10 bg-black/18 p-4">
                <span className="block font-display text-3xl text-primary">{fotosEspaco.length || 0}</span>
                <span className="mt-1 block text-white/66">registros reais</span>
              </div>
              <div className="rounded-2xl border border-white/10 bg-black/18 p-4">
                <span className="block font-display text-3xl text-gold">1</span>
                <span className="mt-1 block text-white/66">cantinho reservado</span>
              </div>
            </div>
          </div>

          {fotoDestaque ? (
            <button
              type="button"
              onClick={() => setSelectedPhoto(fotoDestaque)}
              className="group relative overflow-hidden rounded-[2rem] bg-white/5 shadow-[0_35px_110px_-50px_rgba(255,170,210,0.65)] transition duration-300 hover:-translate-y-1 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/40"
              aria-label={`Ampliar foto do espaço: ${fotoDestaque.titulo}`}
            >
              <img
                src={fotoDestaque.url}
                alt={fotoDestaque.titulo}
                loading="eager"
                fetchPriority="high"
                decoding="async"
                className="aspect-[4/5] w-full object-cover transition duration-700 group-hover:scale-[1.02] lg:max-h-[44rem]"
                style={{
                  objectPosition: `${fotoDestaque.focusX ?? 50}% ${fotoDestaque.focusY ?? 50}%`,
                  transform: `scale(${fotoDestaque.zoom ?? 1})`,
                }}
              />
              <span className="absolute left-5 top-5 rounded-full bg-black/55 px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-white shadow-lg backdrop-blur">
                Foto destaque
              </span>
              <span className="absolute right-5 top-5 flex h-11 w-11 items-center justify-center rounded-full bg-black/55 text-white opacity-0 shadow-lg backdrop-blur transition group-hover:opacity-100">
                <Maximize2 className="h-4 w-4" aria-hidden="true" />
              </span>
            </button>
          ) : null}
        </div>

        <div className="mt-16 flex items-center gap-5 text-xs font-bold uppercase tracking-[0.2em] text-white/68">
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
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4">
              {fotosGaleria.map((foto, index) => (
                <button
                  key={foto.url}
                  type="button"
                  onClick={() => setSelectedPhoto(foto)}
                  className={`bb-fade-up group relative overflow-hidden rounded-[1.35rem] bg-white/[0.045] p-0 text-left transition duration-300 hover:-translate-y-1 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/35 ${
                    index % 7 === 0 ? "sm:row-span-2" : ""
                  }`}
                  style={{ animationDelay: `${Math.min(index, 11) * 60}ms` }}
                  aria-label={`Ampliar foto do espaço: ${foto.titulo}`}
                >
                  <img
                    src={foto.url}
                    alt={foto.titulo}
                    loading={index < 4 ? "eager" : "lazy"}
                    fetchPriority={index < 4 ? "high" : "auto"}
                    decoding="async"
                    className={`w-full transition duration-500 ${
                      index % 7 === 0
                        ? "h-full min-h-72 object-cover"
                        : foto.displayMode === "cover"
                        ? "aspect-[4/5] object-cover"
                        : "aspect-[4/5] object-contain"
                    }`}
                    style={{
                      objectPosition: `${foto.focusX ?? 50}% ${foto.focusY ?? 50}%`,
                      transform: `scale(${foto.zoom ?? 1})`,
                    }}
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
          <div className="relative max-h-[92vh] w-full max-w-5xl overflow-auto rounded-3xl bg-card shadow-2xl">
            <button
              type="button"
              onClick={() => setSelectedPhoto(null)}
              className="absolute right-5 top-5 z-10 flex h-11 w-11 items-center justify-center rounded-full bg-black/70 text-white transition hover:bg-black/85"
              aria-label="Fechar foto ampliada"
            >
              <X className="h-5 w-5" />
            </button>
            <img
              src={selectedPhoto.url}
              alt={selectedPhoto.titulo}
              className="mx-auto max-h-[86vh] w-auto max-w-full rounded-2xl object-contain"
            />
            <div className="mt-2 flex items-center justify-center gap-3 pb-1 text-sm text-muted-foreground">
              <span className="text-foreground">{selectedPhoto.titulo}</span>
            </div>
          </div>
        </div>
      ) : null}
    </section>
  );
}
