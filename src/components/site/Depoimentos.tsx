import { useEffect, useState } from "react";
import { MessageCircle, Star, X } from "lucide-react";

import { BotaoLink } from "./Botao";
import { SALAO, whatsappLink } from "@/lib/salao";
import { usePublicSiteData, type TestimonialData } from "@/lib/site-data";

export function Depoimentos({ paginaCompleta = false }: { paginaCompleta?: boolean }) {
  const { data } = usePublicSiteData();
  const feedbacks = (data?.testimonials ?? []).filter((item) => Boolean(item.image_url));
  const feedbacksExibidos = paginaCompleta ? feedbacks : feedbacks.slice(0, 3);
  const [aberto, setAberto] = useState<TestimonialData | null>(null);

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
      className={`scroll-mt-28 bg-blush-soft py-16 text-foreground lg:py-28 ${
        paginaCompleta ? "pt-28 lg:pt-40" : ""
      }`}
    >
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <div data-reveal className="reveal text-center">
          {paginaCompleta ? (
            <>
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
            </>
          ) : (
            <>
              <h2 className="font-display text-3xl leading-tight sm:text-4xl md:text-[2.75rem]">
                Feedbacks
              </h2>
              <p className="mx-auto mt-3 max-w-2xl text-sm text-muted-foreground sm:text-base">
                Depoimentos reais recebidos pelo WhatsApp
              </p>
            </>
          )}
        </div>

        {paginaCompleta ? (
          <div className="mt-12 columns-1 gap-6 sm:columns-2 lg:columns-3">
            {feedbacksExibidos.map((feedback) => (
              <button
                key={feedback.id}
                type="button"
                onClick={() => setAberto(feedback)}
                className="group mb-6 block w-full break-inside-avoid overflow-hidden rounded-[18px] border border-border/55 bg-card text-left text-card-foreground shadow-[0_8px_24px_rgba(200,100,140,0.18)] transition duration-300 ease-out hover:-translate-y-1 hover:border-primary/45 hover:shadow-[0_14px_34px_rgba(200,100,140,0.24)] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/35"
                aria-label={`Ampliar feedback de ${feedback.client_name || "cliente"}`}
              >
                <div className="m-2 overflow-hidden rounded-xl bg-secondary/60">
                  <img
                    src={feedback.image_url!}
                    alt={
                      feedback.client_name
                        ? `Print do feedback de ${feedback.client_name}`
                        : "Print de feedback de cliente"
                    }
                    loading="lazy"
                    className="h-auto w-full object-cover transition duration-500 group-hover:scale-[1.02]"
                  />
                </div>
                <div className="px-5 pb-5 pt-3">
                  <div
                    className="flex items-center gap-1 text-amber-400"
                    aria-label="Avaliação de 5 estrelas"
                  >
                    {Array.from({ length: 5 }).map((_, index) => (
                      <Star key={index} className="h-4 w-4 fill-current" aria-hidden="true" />
                    ))}
                  </div>
                  <h3 className="mt-2 font-sans text-base font-bold text-card-foreground">
                    {feedback.client_name || "Cliente Bem Bonita"}
                  </h3>
                  <p className="mt-1 text-sm text-muted-foreground">Cliente Bem Bonita</p>
                </div>
              </button>
            ))}
          </div>
        ) : (
          <div className="mt-10 grid gap-6 md:grid-cols-2 lg:mt-12 lg:grid-cols-3">
            {feedbacksExibidos.map((feedback) => (
              <button
                key={feedback.id}
                type="button"
                onClick={() => setAberto(feedback)}
                className="group overflow-hidden rounded-[18px] border border-border/55 bg-card text-left text-card-foreground shadow-[0_8px_24px_rgba(200,100,140,0.18)] transition duration-300 ease-out hover:-translate-y-1 hover:border-primary/45 hover:shadow-[0_14px_34px_rgba(200,100,140,0.24)] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/35"
                aria-label={`Ampliar feedback de ${feedback.client_name || "cliente"}`}
              >
                <div className="overflow-hidden bg-secondary/60">
                  <img
                    src={feedback.image_url!}
                    alt={
                      feedback.client_name
                        ? `Print do feedback de ${feedback.client_name}`
                        : "Print de feedback de cliente"
                    }
                    loading="lazy"
                    className="aspect-[4/5] w-full object-cover object-top transition duration-500 group-hover:scale-[1.02] sm:aspect-[3/4] lg:aspect-[4/5]"
                  />
                </div>

                <div
                  className="mt-4 flex items-center gap-1 text-amber-400"
                  aria-label="Avaliação de 5 estrelas"
                >
                  {Array.from({ length: 5 }).map((_, index) => (
                    <Star key={index} className="h-4 w-4 fill-current" aria-hidden="true" />
                  ))}
                </div>

                <h3 className="mt-3 font-sans text-base font-bold text-card-foreground">
                  {feedback.client_name || "Cliente Bem Bonita"}
                </h3>
                <p className="mt-1 text-sm text-muted-foreground">Cliente Bem Bonita</p>
              </button>
            ))}
          </div>
        )}

        {paginaCompleta ? (
          <div className="mx-auto mt-14 max-w-2xl text-center lg:mt-16">
            <p className="eyebrow">Cuidado para os seus cachos</p>
            <h3 className="mt-3 font-display text-2xl leading-tight sm:text-3xl">
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
        ) : (
          <div className="mt-10 flex justify-center">
            <BotaoLink href="/feedbacks">Ver todos os feedbacks</BotaoLink>
          </div>
        )}
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