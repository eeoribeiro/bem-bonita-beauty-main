import { MessageCircle, Sparkles } from "lucide-react";

import { BotaoLink } from "./Botao";
import { contatoLink, SALAO } from "@/lib/salao";
import { usePublicSiteData } from "@/lib/site-data";

export function Hero() {
  const { data, isLoading } = usePublicSiteData();
  const settings = data?.settings;
  const heroImage = data?.images.find((image) => image.image_key === "hero");
  const headline = settings?.headline ?? "Seus cachos são a nossa arte";
  const headlineWords = headline.split(" ");
  const highlight = headlineWords.splice(Math.max(0, headlineWords.length - 2)).join(" ");

  return (
    <section id="inicio" className="bg-blush-soft relative overflow-hidden pt-28 lg:pt-32">
      <div
        aria-hidden
        className="pointer-events-none absolute -right-24 top-10 h-72 w-72 rounded-full bg-secondary/70 blur-3xl"
      />
      <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-5 pb-20 lg:grid-cols-2 lg:gap-16 lg:px-8 lg:pb-28">
        <div>
          <p className="eyebrow flex items-center gap-2">
            <Sparkles className="h-3.5 w-3.5 text-gold" />
            {settings?.hero_eyebrow ?? "Especialista em cachos em Ponte Nova"}
          </p>
          <h1 className="mt-5 text-4xl leading-[1.1] sm:text-5xl lg:text-6xl">
            {headlineWords.join(" ")} <span className="text-gradient-pink">{highlight}</span>
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted-foreground">
            {settings?.hero_description ??
              "Cortes, tratamentos, definição, mechas e penteados para valorizar a identidade dos seus cabelos."}
          </p>

          <div className="mt-9 flex flex-wrap gap-3">
            <BotaoLink
              href={contatoLink(`Olá, ${SALAO.nome}! Gostaria de agendar um horário.`)}
              target="_blank"
              rel="noopener noreferrer"
            >
              <MessageCircle className="h-4 w-4" />
              Solicitar uma avaliação
            </BotaoLink>
            <BotaoLink href="#resultados" variante="outline">
              Ver resultados reais
            </BotaoLink>
          </div>

          <p className="mt-10 flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
            <span className="h-1.5 w-1.5 rounded-full bg-gold" />
            Especialistas em cabelos crespos e cacheados
            <span className="text-gold">•</span>
            {SALAO.cidade}
          </p>
        </div>

        <div className="relative">
          <div className="absolute -left-4 -top-4 hidden h-28 w-28 rounded-full border border-gold/60 sm:block" />
          {isLoading ? (
            <div
              aria-label="Carregando foto principal"
              className="relative aspect-square w-full animate-pulse rounded-[2.5rem] bg-secondary/70 shadow-soft"
            />
          ) : (
            <img
              src={heroImage?.image_url ?? "/media/francielly-profissional.jpg"}
              width={710}
              height={710}
              alt={
                heroImage?.alt_text ??
                "Francielly Soares, profissional do salão Bem Bonita, com tesouras de cabeleireira"
              }
              className="relative w-full rounded-[2.5rem] object-cover shadow-soft"
            />
          )}
          <div className="absolute -bottom-6 left-6 rounded-2xl bg-card/95 px-5 py-4 shadow-card backdrop-blur sm:left-10">
            <p className="font-display text-lg">{SALAO.profissional}</p>
            <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
              Especialista em cachos
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
