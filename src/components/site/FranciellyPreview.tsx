import { ArrowRight, Heart, Sparkles } from "lucide-react";

import { BotaoLink } from "./Botao";
import { SafeImage } from "./SafeImage";
import { usePublicSiteData } from "@/lib/site-data";
import fotoFranciellyFallback from "@/assets/sobre-francielly.jpg";

export function FranciellyPreview() {
  const { data } = usePublicSiteData();
  const settings = data?.settings;
  const images = data?.images ?? [];
  const professionalName = settings?.professional_name || "Francielly Soares";
  const headline = settings?.francielly_headline || "Paixão, técnica e identidade";
  const bio =
    settings?.francielly_bio?.trim() ||
    "Especialista em cabelos crespos e cacheados, Francielly une técnica, escuta e cuidado para valorizar cada curvatura com naturalidade.";
  const foto =
    images.find((img) => img.image_key === "francielly_bio" || img.image_key === "about")?.image_url ??
    fotoFranciellyFallback;

  return (
    <section id="francielly-preview" className="bg-background py-20 lg:py-28">
      <div className="mx-auto grid max-w-7xl items-center gap-10 px-5 lg:grid-cols-[0.9fr_1.1fr] lg:px-8">
        <div data-reveal className="reveal relative">
          <div className="aspect-[4/5] overflow-hidden rounded-[2rem] border border-border/60 shadow-soft">
            <SafeImage
              src={foto}
              fallbackSrc={fotoFranciellyFallback}
              alt={`Foto de ${professionalName}`}
              className="h-full w-full object-cover"
            />
          </div>
          <div className="absolute -bottom-5 left-5 rounded-2xl border border-primary/20 bg-card/95 px-5 py-4 shadow-card backdrop-blur">
            <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-gold">
              <Heart className="h-3.5 w-3.5" />
              Cuidado autoral
            </p>
          </div>
        </div>

        <div data-reveal className="reveal">
          <p className="eyebrow flex items-center gap-2">
            <Sparkles className="h-3.5 w-3.5 text-gold" />
            Sobre a especialista
          </p>
          <h2 className="mt-4 font-display text-3xl leading-tight sm:text-5xl">
            {professionalName}
            <span className="mt-2 block text-gradient-pink font-display text-2xl italic sm:text-4xl">
              {headline}
            </span>
          </h2>
          <p className="mt-6 max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base">
            {bio}
          </p>
          <div className="mt-8">
            <BotaoLink href="/francielly">
              Conhecer a Francielly
              <ArrowRight className="h-4 w-4" />
            </BotaoLink>
          </div>
        </div>
      </div>
    </section>
  );
}
