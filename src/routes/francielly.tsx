import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, MessageCircle, Sparkles } from "lucide-react";

import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { BotaoLink } from "@/components/site/Botao";
import { BotaoFlutuanteWhatsApp } from "@/components/site/BotaoFlutuanteWhatsApp";
import { SafeImage } from "@/components/site/SafeImage";
import { whatsappLink } from "@/lib/salao";
import { useReveal } from "@/hooks/use-reveal";
import { usePublicSiteData } from "@/lib/site-data";
import fotoFranciellyFallback from "@/assets/sobre-francielly.jpg";

export const Route = createFileRoute("/francielly")({
  head: () => ({
    meta: [
      { title: "Francielly Soares | Especialista em Cachos e Crespos em Ponte Nova – MG" },
      {
        name: "description",
        content:
          "Conheça a história de Francielly Soares, fundadora do salão Bem Bonita em Ponte Nova/MG.",
      },
    ],
  }),
  component: PaginaFrancielly,
});

function PaginaFrancielly() {
  useReveal();
  const { data } = usePublicSiteData();

  const settings = data?.settings;
  const images = data?.images ?? [];

  const professionalName = settings?.professional_name || "Francielly Soares";
  const headline = settings?.francielly_headline || "Paixão, técnica e identidade";
  const savedBio = settings?.francielly_bio?.trim();
  const bio = savedBio && savedBio.includes(" ")
    ? savedBio
    : "Especialista em cabelos crespos e cacheados, Francielly Soares criou o Bem Bonita com o propósito de transformar a relação das mulheres com seus fios naturais. Seu trabalho une técnica, escuta e cuidado para valorizar cada curvatura, preservar a saúde capilar e fortalecer a autoestima.";
  const pageEyebrow = settings?.francielly_eyebrow || "Sobre a especialista";

  const fotoPrincipal =
    images.find((img) => img.image_key === "francielly_bio")?.image_url ??
    images.find((img) => img.image_key === "about")?.image_url ??
    fotoFranciellyFallback;

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />

      <main className="page-transition pt-24 sm:pt-28 lg:pt-36">
        {/* Topo / Apresentação */}
        <section className="relative overflow-hidden bg-blush-soft py-12 lg:py-20">
          <div className="mx-auto max-w-7xl px-5 lg:px-8">
            <Link
              to="/"
              className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-magenta hover:underline mb-8"
            >
              <ArrowLeft className="h-4 w-4" /> Voltar ao início
            </Link>

            <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:gap-12">
              <div>
                <p className="eyebrow flex items-center gap-2">
                  <Sparkles className="h-3.5 w-3.5 text-gold" />
                  {pageEyebrow}
                </p>
                <h1 className="mt-4 text-3xl font-display leading-[1.12] sm:text-6xl">
                  {professionalName}
                  <span className="mt-2 block text-gradient-pink font-display text-2xl italic font-normal sm:text-5xl">
                    {headline}
                  </span>
                </h1>
                <p className="mt-5 text-base leading-relaxed text-muted-foreground sm:mt-6 sm:text-lg">
                  {bio}
                </p>

                <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                  <BotaoLink
                    href={whatsappLink(
                      `Olá, ${professionalName.split(" ")[0]}! Conheci sua história no site e gostaria de agendar uma avaliação.`,
                    )}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full shadow-soft sm:w-auto"
                  >
                    <MessageCircle className="h-4 w-4" />
                    {settings?.francielly_cta_label || `Agendar horário com ${professionalName.split(" ")[0]}`}
                  </BotaoLink>
                </div>
              </div>

              <div className="relative">
                <div className="relative aspect-[4/5] overflow-hidden rounded-[2rem] border border-border/70 shadow-soft sm:rounded-[2.5rem]">
                  <SafeImage
                    src={fotoPrincipal}
                    fallbackSrc={fotoFranciellyFallback}
                    alt={`Foto de ${professionalName}`}
                    className="h-full w-full object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

      </main>

      <Footer />
      <BotaoFlutuanteWhatsApp />
    </div>
  );
}
