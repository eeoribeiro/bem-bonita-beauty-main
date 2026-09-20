import { useEffect, useState } from "react";
import { MessageCircle, Star, X } from "lucide-react";

import { BotaoLink } from "./Botao";
import { useMobileAutoCarousel } from "@/hooks/use-mobile-auto-carousel";
import { SALAO, whatsappLink } from "@/lib/salao";
import { usePublicSiteData, type TestimonialData } from "@/lib/site-data";

export function Depoimentos({ paginaCompleta = false }: { paginaCompleta?: boolean }) {
  const { data } = usePublicSiteData();
  const feedbacks = (data?.testimonials ?? []).filter((item) => Boolean(item.image_url));
  const feedbacksExibidos = paginaCompleta ? feedbacks : feedbacks.slice(0, 3);
  const [aberto, setAberto] = useState<TestimonialData | null>(null);
  const carouselRef = useMobileAutoCarousel<HTMLDivElement>();

  useEffect(() => {
    if (!aberto) return;

    const fechar = (event: KeyboardEvent) => {
      if (event.key === "Escape") setAberto(null);
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", fechar);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", fechar);
    };
  }, [aberto]);

  if (!paginaCompleta && !feedbacks.length) return null;

  return (
    <section
      id="depoimentos"
      className={`scroll-mt-24 bg-background py-14 text-foreground lg:py-24 ${
        paginaCompleta ? "pt-24 lg:pt-32" : ""
      }`}
    >
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <div className="text-center">
          <p className="eyebrow mx-auto flex w-fit items-center gap-2">
            <Star className="h-3.5 w-3.5 text-gold" aria-hidden="true" />
            Feedbacks reais
          </p>
          <h2 className="mt-4 font-display text-3xl leading-tight sm:text-4xl md:text-[2.75rem]">
            O que nossas clientes dizem
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-sm text-muted-foreground sm:text-base">
            Depoimentos reais recebidos pelo WhatsApp
          </p>
        </div>

        <div
          ref={carouselRef}
          className="-mx-5 mt-10 flex snap-x snap-mandatory gap-4 overflow-x-auto px-5 pb-4 sm:mx-0 sm:grid sm:grid-cols-2 sm:overflow-visible sm:px-0 sm:pb-0 lg:grid-cols-3 lg:gap-6"
        >
          {feedbacksExibidos.map((feedback) => (
            <button
              key={feedback.id}
              type="button"
              onClick={() => setAberto(feedback)}
              className="group flex min-h-full min-w-[78vw] snap-center flex-col overflow-hidden rounded-[2rem] border border-border bg-card p-2 text-left text-foreground shadow-card transition duration-300 ease-out hover:-translate-y-1 hover:border-primary/40 hover:shadow-soft focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/35 sm:min-w-0"
              aria-label={`Ampliar feedback de ${feedback.client_name || "cliente"}`}
            >
              <div className="relative aspect-[4/5] overflow-hidden rounded-[1.45rem] bg-secondary ring-1 ring-border">
                <img
                  src={feedback.image_url!}
                  alt={
                    feedback.client_name
                      ? `Print do feedback de ${feedback.client_name}`
                      : "Print de feedback de cliente"
                  }
                  loading="lazy"
                  decoding="async"
                  className="h-full w-full object-cover object-top transition duration-500 group-hover:scale-[1.02]"
                />
                <span className="pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/30 to-transparent" />
              </div>
              <div className="flex flex-1 flex-col px-5 pb-5 pt-4">
                <div
                  className="flex items-center gap-1 text-amber-400"
                  aria-label="Avaliação de 5 estrelas"
                >
                  {Array.from({ length: 5 }).map((_, index) => (
                    <Star key={index} className="h-4 w-4 fill-current" aria-hidden="true" />
                  ))}
                </div>
                <h3 className="mt-2 font-sans text-base font-bold text-foreground">
                  {feedback.client_name || "Cliente Bem Bonita"}
                </h3>
                <p className="mt-1 text-sm text-muted-foreground">Cliente Bem Bonita</p>
              </div>
            </button>
          ))}
        </div>

        <div className="mx-auto mt-14 max-w-2xl text-center lg:mt-16">
          <p className="eyebrow">Cuidado para os seus cachos</p>
          <h3 className="mt-3 font-display text-2xl leading-tight text-foreground sm:text-3xl">
            Gostou do que as clientes disseram?
          </h3>
          <p className="mx-auto mt-3 max-w-xl text-sm text-muted-foreground sm:text-base">
            Agende seu horário no salão e viva essa experiência você também. É só chamar no
            WhatsApp.
          </p>
          <div className="mt-7 flex justify-center">
            <BotaoLink
              href={whatsappLink(
                `Olá, ${SALAO.nome}! Vi os feedbacks no site e gostaria de agendar um horário no salão.`,
              )}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto"
            >
              <MessageCircle className="h-4 w-4" />
              Agendar horário no salão
            </BotaoLink>
          </div>
        </div>
      </div>

      {aberto ? (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Feedback ampliado"
          onMouseDown={(event) => event.target === event.currentTarget && setAberto(null)}
          className="fixed inset-0 z-[80] flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm"
        >
          <div className="relative max-h-[92vh] max-w-2xl overflow-auto rounded-3xl bg-card p-3 shadow-2xl">
            <button
              type="button"
              onClick={() => setAberto(null)}
              className="absolute right-5 top-5 z-10 flex h-11 w-11 items-center justify-center rounded-full bg-black/70 text-white"
              aria-label="Fechar feedback"
            >
              <X className="h-5 w-5" />
            </button>
            <img
              src={aberto.image_url!}
              alt={
                aberto.client_name
                  ? `Print do feedback de ${aberto.client_name}`
                  : "Print de feedback de cliente"
              }
              className="max-h-[86vh] w-full rounded-2xl object-contain"
            />
          </div>
        </div>
      ) : null}
    </section>
  );
}
