import { useEffect, useState } from "react";
import { MessageSquareQuote, X } from "lucide-react";

import { TituloSecao } from "./TituloSecao";
import { usePublicSiteData, type TestimonialData } from "@/lib/site-data";

export function Depoimentos() {
  const { data } = usePublicSiteData();
  const feedbacks = (data?.testimonials ?? []).filter((item) => Boolean(item.image_url));
  const [aberto, setAberto] = useState<TestimonialData | null>(null);

  useEffect(() => {
    if (!aberto) return;
    const fechar = (event: KeyboardEvent) => event.key === "Escape" && setAberto(null);
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", fechar);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", fechar);
    };
  }, [aberto]);

  if (!feedbacks.length) return null;

  return (
    <section id="depoimentos" className="bg-background py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <div data-reveal className="reveal text-center">
          <TituloSecao eyebrow="Feedbacks reais" titulo="O carinho de quem viveu essa experiência" texto="Mensagens compartilhadas por clientes após seus atendimentos no Bem Bonita." className="mx-auto max-w-3xl text-center [&>span]:mx-auto" />
        </div>
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {feedbacks.map((feedback) => (
            <button key={feedback.id} type="button" onClick={() => setAberto(feedback)} className="group overflow-hidden rounded-3xl border border-border/70 bg-card p-3 text-left shadow-card transition hover:-translate-y-1 hover:border-primary hover:shadow-soft" aria-label={`Ampliar feedback de ${feedback.client_name || "cliente"}`}>
              <div className="overflow-hidden rounded-2xl bg-secondary/40">
                <img src={feedback.image_url!} alt={feedback.client_name ? `Print do feedback de ${feedback.client_name}` : "Print de feedback de cliente"} loading="lazy" className="aspect-[4/5] w-full object-contain transition-transform duration-300 group-hover:scale-[1.02]" />
              </div>
              <span className="flex items-center gap-2 px-2 pb-1 pt-4 text-sm font-medium text-foreground"><MessageSquareQuote className="h-4 w-4 text-magenta" />{feedback.client_name || "Feedback de cliente"}</span>
            </button>
          ))}
        </div>
      </div>
      {aberto ? (
        <div role="dialog" aria-modal="true" aria-label="Feedback ampliado" onMouseDown={(event) => event.target === event.currentTarget && setAberto(null)} className="fixed inset-0 z-[80] flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm">
          <div className="relative max-h-[92vh] max-w-2xl overflow-auto rounded-3xl bg-card p-3 shadow-2xl">
            <button type="button" onClick={() => setAberto(null)} className="absolute right-5 top-5 z-10 flex h-11 w-11 items-center justify-center rounded-full bg-black/70 text-white" aria-label="Fechar feedback"><X className="h-5 w-5" /></button>
            <img src={aberto.image_url!} alt={aberto.client_name ? `Print do feedback de ${aberto.client_name}` : "Print de feedback de cliente"} className="max-h-[86vh] w-full rounded-2xl object-contain" />
          </div>
        </div>
      ) : null}
    </section>
  );
}
