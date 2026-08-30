import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Award, Heart, MessageCircle, Scissors, Sparkles, UserCheck, Users } from "lucide-react";

import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { BotaoLink } from "@/components/site/Botao";
import { BotaoFlutuanteWhatsApp } from "@/components/site/BotaoFlutuanteWhatsApp";
import { Equipe } from "@/components/site/Equipe";
import { SafeImage } from "@/components/site/SafeImage";
import { whatsappLink } from "@/lib/salao";
import { useReveal } from "@/hooks/use-reveal";
import { usePublicSiteData } from "@/lib/site-data";
import fotoFranciellyFallback from "@/assets/sobre-francielly.jpg";
import fotoEspacoFallback from "@/assets/instagram-salao.jpg";

export const Route = createFileRoute("/francielly")({
  head: () => ({
    meta: [
      { title: "Francielly Soares | Especialista em Cachos e Crespos em Ponte Nova – MG" },
      {
        name: "description",
        content:
          "Conheça a história e metodologia de Francielly Soares, fundadora do salão Bem Bonita em Ponte Nova/MG.",
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
  const bio =
    settings?.francielly_bio ||
    "Especialista em cabelos crespos e cacheados, Francielly construiu o salão Bem Bonita a partir do propósito de transformar a relação que as mulheres têm com seus fios naturais, unindo técnica apurada, respeito à saúde capilar e acolhimento.";
  const mission = settings?.francielly_mission || "Mais do que estética: resgate da autoestima";
  const pageEyebrow = settings?.francielly_eyebrow || "Sobre a Especialista";
  const methodologyEyebrow = settings?.francielly_methodology_eyebrow || "Propósito";
  const methods = [
    {
      title: settings?.francielly_method_1_title || "Corte a Seco e Curvatura Real",
      description: settings?.francielly_method_1_description || "Cada corte é planejado considerando o fator encolhimento, caimento e a densidade de cada mecha, sem surpresas no comprimento final.",
      icon: Scissors,
      color: "text-magenta",
    },
    {
      title: settings?.francielly_method_2_title || "Saúde em Primeiro Lugar",
      description: settings?.francielly_method_2_description || "Procedimentos de mechas e tratamentos executados com avaliação prévia da fibra capilar para preservar a integridade dos cachos.",
      icon: Award,
      color: "text-gold",
    },
    {
      title: settings?.francielly_method_3_title || "Educação Home Care",
      description: settings?.francielly_method_3_description || "Você não sai apenas com o cabelo lindo: aprende exatamente como lavar, finalizar e manter a definição no dia a dia.",
      icon: UserCheck,
      color: "text-magenta",
    },
  ];

  const fotoPrincipal =
    images.find((img) => img.image_key === "francielly_bio" || img.image_key === "about")?.image_url ??
    fotoFranciellyFallback;

  const fotoEspaco =
    images.find((img) => img.image_key === "space_1")?.image_url ??
    fotoEspacoFallback;

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />

      <main className="pt-28 lg:pt-36">
        {/* Topo / Apresentação */}
        <section className="relative overflow-hidden bg-blush-soft py-14 lg:py-20">
          <div className="mx-auto max-w-7xl px-5 lg:px-8">
            <Link
              to="/"
              className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-magenta hover:underline mb-8"
            >
              <ArrowLeft className="h-4 w-4" /> Voltar ao início
            </Link>

            <div className="grid gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
              <div>
                <p className="eyebrow flex items-center gap-2">
                  <Sparkles className="h-3.5 w-3.5 text-gold" />
                  {pageEyebrow}
                </p>
                <h1 className="mt-4 text-4xl sm:text-6xl font-display leading-[1.15]">
                  {professionalName}
                  <span className="block mt-2 text-gradient-pink font-display italic font-normal text-3xl sm:text-5xl">
                    {headline}
                  </span>
                </h1>
                <p className="mt-6 text-base sm:text-lg leading-relaxed text-muted-foreground">
                  {bio}
                </p>

                <div className="mt-8 flex flex-wrap gap-4">
                  <BotaoLink
                    href={whatsappLink(
                      `Olá, ${professionalName.split(" ")[0]}! Conheci sua história no site e gostaria de agendar uma avaliação.`,
                    )}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="shadow-soft"
                  >
                    <MessageCircle className="h-4 w-4" />
                    {settings?.francielly_cta_label || `Agendar horário com ${professionalName.split(" ")[0]}`}
                  </BotaoLink>
                </div>
              </div>

              <div className="relative">
                <div className="relative aspect-[4/5] overflow-hidden rounded-[2.5rem] shadow-soft border border-border/70">
                  <SafeImage
                    src={fotoPrincipal}
                    fallbackSrc={fotoFranciellyFallback}
                    alt={`Foto de ${professionalName}`}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="absolute -bottom-5 -right-3 rounded-2xl border border-border/60 bg-card/95 p-5 shadow-card backdrop-blur max-w-xs">
                  <p className="text-xs uppercase tracking-widest text-gold font-semibold">
                    Localização
                  </p>
                  <p className="text-sm font-medium mt-1">
                    {settings?.landmark ?? "Lanna Shopping — Sala 118, Ponte Nova/MG"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Filosofia & Metodologia */}
        <section className="py-20 lg:py-28 bg-background">
          <div className="mx-auto max-w-5xl px-5 lg:px-8">
            <div className="text-center max-w-2xl mx-auto">
              <p className="eyebrow mx-auto flex w-fit items-center gap-2">
                <Heart className="h-3.5 w-3.5 text-magenta" />
                {methodologyEyebrow}
              </p>
              <h2 className="mt-3 text-3xl sm:text-4xl font-display">
                {mission}
              </h2>
            </div>

            <div className="mt-14 grid gap-8 md:grid-cols-3">
              {methods.map((method) => {
                const Icon = method.icon;
                return <div key={method.title} className="rounded-3xl border border-border/70 bg-card p-6 shadow-card">
                  <div className={`flex h-12 w-12 items-center justify-center rounded-2xl bg-secondary ${method.color} mb-5`}>
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="text-xl font-display">{method.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{method.description}</p>
                </div>;
              })}
            </div>

            {/* Espaço do Salão */}
            <div className="mt-20 overflow-hidden rounded-[2.5rem] border border-border/70 bg-card p-8 shadow-card md:grid md:grid-cols-[1fr_1.1fr] md:gap-10 md:items-center">
              <div className="aspect-video sm:aspect-square overflow-hidden rounded-2xl">
                <SafeImage
                  src={fotoEspaco}
                  fallbackSrc={fotoEspacoFallback}
                  alt="Espaço aconchegante do salão Bem Bonita em Ponte Nova"
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="mt-6 md:mt-0 space-y-4">
                <p className="eyebrow">{settings?.francielly_space_eyebrow || "Ambiente Exclusivo"}</p>
                <h3 className="text-2xl sm:text-3xl font-display">{settings?.space_title || "Um refúgio para você se cuidar"}</h3>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {settings?.space_description || "Localizado no coração de Ponte Nova, no Lanna Shopping, o espaço foi desenhado para proporcionar uma experiência intimista e atendimento focado exclusivamente em você."}
                </p>
                <div className="pt-2">
                  <BotaoLink
                    href={whatsappLink(`Olá! Gostaria de agendar uma visita ao salão Bem Bonita.`)}
                    target="_blank"
                    rel="noopener noreferrer"
                    variante="outline"
                  >
                    {settings?.francielly_space_cta_label || "Agendar visita pelo WhatsApp"}
                  </BotaoLink>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Seção da Equipe na Página da Francielly */}
        <Equipe />
      </main>

      <Footer />
      <BotaoFlutuanteWhatsApp />
    </div>
  );
}
