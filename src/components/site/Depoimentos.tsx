import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";

import { TituloSecao } from "./TituloSecao";
import { usePublicSiteData } from "@/lib/site-data";

export function Depoimentos() {
  const { data } = usePublicSiteData();
  const depoimentos = data?.testimonials ?? [];
  const [indice, setIndice] = useState(0);
  useEffect(() => setIndice(0), [depoimentos.length]);

  if (!depoimentos.length) return null;
  const atual = depoimentos[indice] ?? depoimentos[0]!;

  const mover = (passo: number) =>
    setIndice((i) => (i + passo + depoimentos.length) % depoimentos.length);

  return (
    <section id="depoimentos" className="bg-background py-20 lg:py-28">
      <div className="mx-auto max-w-4xl px-5 text-center lg:px-8">
        <div data-reveal className="reveal">
          <TituloSecao
            eyebrow="Depoimentos"
            titulo="Quem conhece, recomenda"
            className="mx-auto text-center [&>span]:mx-auto"
          />
        </div>

        <div
          data-reveal
          className="reveal mt-12 rounded-[2rem] border border-border/60 bg-card px-6 py-10 shadow-card sm:px-12"
        >
          <div className="flex items-center justify-center gap-1" aria-hidden>
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                className={`h-4 w-4 ${i < (atual.rating ?? 0) ? "fill-gold text-gold" : "text-border"}`}
              />
            ))}
          </div>
          <p className="sr-only">
            {atual.rating ? `${atual.rating} de 5 estrelas` : "Sem nota informada"}
          </p>

          <blockquote className="mt-7 text-xl leading-relaxed sm:text-2xl">
            “{atual.testimonial}”
          </blockquote>
          <p className="mt-6 text-sm uppercase tracking-[0.2em] text-magenta">
            {atual.client_name}
          </p>
          {atual.service_name ? (
            <p className="mt-3 text-xs text-muted-foreground">{atual.service_name}</p>
          ) : null}

          <div className="mt-9 flex items-center justify-center gap-3">
            <button
              onClick={() => mover(-1)}
              aria-label="Depoimento anterior"
              className="flex h-11 w-11 items-center justify-center rounded-full border border-border text-foreground transition-colors hover:border-primary hover:text-magenta"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <span className="text-sm text-muted-foreground">
              {indice + 1} / {depoimentos.length}
            </span>
            <button
              onClick={() => mover(1)}
              aria-label="Próximo depoimento"
              className="flex h-11 w-11 items-center justify-center rounded-full border border-border text-foreground transition-colors hover:border-primary hover:text-magenta"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
