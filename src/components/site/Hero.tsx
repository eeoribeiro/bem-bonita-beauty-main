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
    <section id="inicio" className="bg-blush-soft relative overflow-hidden pt-24 sm:pt-28 lg:pt-32">
      <div
        aria-hidden
        className="pointer-events-none absolute -right-24 top-10 h-72 w-72 rounded-full bg-secondary/70 blur-3xl"
      />
      <div className="relative mx-auto grid max-w-7xl items-center gap-10 px-5 pb-16 sm:gap-12 lg:grid-cols-2 lg:gap-16 lg:px-8 lg:pb-28">
        <div>
          <p className="eyebrow flex items-center gap-2">
            <Sparkles className="h-3.5 w-3.5 text-gold" />
            {settings?.hero_eyebrow ?? "Especialista em cachos em Ponte Nova"}
          </p>
          <h1 className="mt-5 text-3xl leading-[1.12] sm:text-5xl lg:text-6xl">
            {headlineWords.join(" ")}{" "}
            <span className="text-gradient-pink font-display italic font-normal tracking-wide">
              {highlight}
            </span>
          </h1>
          <p className="mt-5 max-w-xl text-base leading-relaxed text-muted-foreground sm:mt-6 sm:text-lg">
            {settings?.hero_description ??
              "Cortes, tratamentos, definição, mechas e penteados para valorizar a identidade dos seus cabelos."}
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:mt-9 sm:flex-row sm:flex-wrap">
            <BotaoLink
              href="#agendamento"
              className="w-full shadow-soft sm:w-auto"
            >
              <MessageCircle className="h-4 w-4" />
              Atendimento Personalizado
            </BotaoLink>
            <BotaoLink href="#servicos" variante="outline" className="w-full sm:w-auto">
              Conhecer serviços
            </BotaoLink>
          </div>

          <p className="mt-8 flex flex-wrap items-center gap-2 text-sm text-muted-foreground sm:mt-10">
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
              className="relative aspect-[4/5] w-full animate-pulse rounded-[2rem] border border-border/70 bg-secondary/70 shadow-soft sm:rounded-[2.5rem]"
            />
          ) : (
            <div className="relative aspect-[4/5] overflow-hidden rounded-[2rem] border border-border/70 shadow-soft sm:rounded-[2.5rem]">
              <img
                src={heroImage?.image_url ?? "/media/francielly-profissional.jpg"}
                width={710}
                height={710}
                alt={
                  heroImage?.alt_text ??
                  "Francielly Soares, profissional do salão Bem Bonita, com tesouras de cabeleireira"
                }
                className="h-full w-full object-cover"
              />
            </div>
          )}
          <div className="absolute -bottom-5 left-4 rounded-2xl bg-card/95 px-4 py-3 shadow-card backdrop-blur sm:-bottom-6 sm:left-10 sm:px-5 sm:py-4">
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
