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
  const extraBlocks = [
    {
      image: images.find((img) => img.image_key === "francielly_extra_1"),
      eyebrow: settings?.francielly_extra_1_eyebrow,
      title: settings?.francielly_extra_1_title,
      subtitle: settings?.francielly_extra_1_subtitle,
    },
    {
      image: images.find((img) => img.image_key === "francielly_extra_2"),
      eyebrow: settings?.francielly_extra_2_eyebrow,
      title: settings?.francielly_extra_2_title,
      subtitle: settings?.francielly_extra_2_subtitle,
    },
    {
      image: images.find((img) => img.image_key === "francielly_extra_3"),
      eyebrow: settings?.francielly_extra_3_eyebrow,
      title: settings?.francielly_extra_3_title,
      subtitle: settings?.francielly_extra_3_subtitle,
    },
  ].filter((block) => block.image?.image_url || block.title || block.subtitle);

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
              <div className="order-1">
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

              <div className="order-2 relative">
                <div className="relative aspect-[4/5] overflow-hidden rounded-[2rem] border border-border/70 shadow-soft sm:rounded-[2.5rem]">
                  <SafeImage
                    src={fotoPrincipal}
                    fallbackSrc={fotoFranciellyFallback}
                    alt={`Foto de ${professionalName}`}
                    className="h-full w-full object-cover"
                  />
                  {settings?.francielly_photo_label ? (
                    <span className="absolute bottom-5 left-5 rounded-2xl bg-card/92 px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-gold shadow-card backdrop-blur">
                      {settings.francielly_photo_label}
                    </span>
                  ) : null}
                </div>
              </div>
            </div>
          </div>
        </section>

        {extraBlocks.length ? (
          <section className="bg-background py-14 lg:py-20">
            <div className="mx-auto max-w-7xl px-5 lg:px-8">
              <div className="grid gap-5 md:grid-cols-3">
                {extraBlocks.map((block, index) => (
                  <article
                    key={index}
                    className="group overflow-hidden rounded-[2rem] border border-border/70 bg-card shadow-card transition duration-300 hover:-translate-y-1 hover:border-primary/45 hover:shadow-soft"
                  >
                    {block.image?.image_url ? (
                      <div className="aspect-[4/5] overflow-hidden bg-secondary/40">
                        <SafeImage
                          src={block.image.image_url}
                          fallbackSrc={fotoFranciellyFallback}
                          alt={block.image.alt_text}
                          loading="lazy"
                          decoding="async"
                          className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]"
                        />
                      </div>
                    ) : null}
                    <div className="p-5 sm:p-6">
                      {block.eyebrow ? (
                        <p className="text-xs font-bold uppercase tracking-[0.24em] text-magenta">{block.eyebrow}</p>
                      ) : null}
                      {block.title ? (
                        <h2 className="mt-3 font-display text-2xl leading-tight">{block.title}</h2>
                      ) : null}
                      {block.subtitle ? (
                        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{block.subtitle}</p>
                      ) : null}
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </section>
        ) : null}

      </main>

      <Footer />
      <BotaoFlutuanteWhatsApp />
    </div>
  );
}
