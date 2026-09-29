import { useEffect, useState } from "react";
import { MessageCircle, MessageSquareQuote, X } from "lucide-react";

import { BotaoLink } from "./Botao";
import { useMobileAutoCarousel } from "@/hooks/use-mobile-auto-carousel";
import { SALAO, whatsappLink } from "@/lib/salao";
import { usePublicSiteData, type TestimonialData } from "@/lib/site-data";

export function Depoimentos({ paginaCompleta = false }: { paginaCompleta?: boolean }) {
  const { data } = usePublicSiteData();
  const feedbacks = (data?.testimonials ?? []).filter((item) => Boolean(item.image_url));
  const feedbacksExibidos = feedbacks;
  const [aberto, setAberto] = useState<TestimonialData | null>(null);
  // Mobile: 2 cards visíveis, avançando de forma suave a cada 2 segundos.
  const carouselRef = useMobileAutoCarousel<HTMLDivElement>(2000, { perView: 2 });

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
      className={`relative isolate scroll-mt-24 overflow-hidden bg-background py-16 text-foreground lg:py-28 ${
        paginaCompleta ? "pt-24 lg:pt-32" : ""
      }`}
    >
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_12%_18%,rgba(224,72,154,0.18),transparent_32%),radial-gradient(circle_at_90%_22%,rgba(196,142,74,0.12),transparent_28%),linear-gradient(180deg,rgba(255,255,255,0.02),transparent_45%)]" />
      <div className="pointer-events-none absolute left-1/2 top-12 -z-10 h-48 w-[70%] -translate-x-1/2 rounded-full bg-primary/10 blur-3xl" />
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <p className="eyebrow mx-auto flex w-fit items-center gap-2">
            <MessageSquareQuote className="h-3.5 w-3.5 text-gold" aria-hidden="true" />
            Feedbacks reais
          </p>
          <h2 className="mt-4 font-display text-3xl leading-tight sm:text-4xl md:text-[2.75rem]">
            O que nossas clientes dizem
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-sm text-muted-foreground sm:text-base">
            Prints reais recebidos pelo WhatsApp, organizados como uma vitrine de confiança para quem está chegando agora.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-2 text-xs font-bold uppercase tracking-[0.14em] text-muted-foreground">
            <span className="rounded-full border border-border bg-card/70 px-4 py-2">Resultados reais</span>
            <span className="rounded-full border border-border bg-card/70 px-4 py-2">Clientes Bem Bonita</span>
            <span className="rounded-full border border-border bg-card/70 px-4 py-2">Atendimento com cuidado</span>
          </div>
        </div>

        <div
          ref={carouselRef}
          className="-mx-5 mt-12 flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-pl-5 pl-5 pb-5 sm:mx-0 sm:gap-5 sm:pl-0 lg:gap-6"
        >
          {feedbacksExibidos.map((feedback) => (
            <button
              key={feedback.id}
              type="button"
              onClick={() => setAberto(feedback)}
              className="group flex min-h-full min-w-[calc((100vw_-_3.25rem)/2)] snap-start flex-col overflow-hidden rounded-[1.7rem] border border-border/80 bg-card/90 text-left text-foreground shadow-card backdrop-blur transition duration-300 ease-out hover:-translate-y-1 hover:border-primary/45 hover:shadow-soft focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/35 sm:min-w-[18rem] sm:max-w-[20rem] sm:rounded-[2rem] lg:min-w-[21rem]"
              aria-label={`Ampliar feedback de ${feedback.client_name || "cliente"}`}
            >
              <div className="relative overflow-hidden bg-transparent">
                <img
                  src={feedback.image_url!}
                  alt={
                    feedback.client_name
                      ? `Print do feedback de ${feedback.client_name}`
                      : "Print de feedback de cliente"
                  }
                  loading="lazy"
                  decoding="async"
                  className="block h-auto w-full object-contain object-top"
                />
              </div>
              <div className="flex flex-1 flex-col px-4 pb-5 pt-4 sm:px-5">
                <div className="flex items-center justify-between gap-3">
                  <span className="rounded-full bg-primary/15 px-3 py-1 text-[11px] font-bold text-magenta">Ver print</span>
                </div>
                <h3 className="mt-3 font-sans text-base font-bold leading-snug text-foreground sm:text-lg">
                  {feedback.client_name || "Cliente Bem Bonita"}
                </h3>
                <p className="mt-1 text-sm text-muted-foreground">Cliente Bem Bonita</p>
              </div>
            </button>
          ))}
        </div>

        <div className="mx-auto mt-14 max-w-3xl rounded-[2rem] border border-border/80 bg-card/70 p-6 text-center shadow-card backdrop-blur lg:mt-16 lg:p-8">
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
