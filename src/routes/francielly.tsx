import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Award, Heart, MessageCircle, Scissors, Sparkles, UserCheck, Users } from "lucide-react";

import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { BotaoLink } from "@/components/site/Botao";
import { BotaoFlutuanteWhatsApp } from "@/components/site/BotaoFlutuanteWhatsApp";
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
  const savedBio = settings?.francielly_bio?.trim();
  const bio = savedBio && savedBio.includes(" ")
    ? savedBio
    : "Especialista em cabelos crespos e cacheados, Francielly Soares criou o Bem Bonita com o propósito de transformar a relação das mulheres com seus fios naturais. Seu trabalho une técnica, escuta e cuidado para valorizar cada curvatura, preservar a saúde capilar e fortalecer a autoestima.";
  const mission = settings?.francielly_mission || "Mais do que estética: resgate da autoestima";
  const pageEyebrow = settings?.francielly_eyebrow || "Sobre a especialista";
  const methodologyEyebrow = settings?.francielly_methodology_eyebrow || "Método Bem Bonita";
  const methods = [
    {
      title: settings?.francielly_method_1_title || "Corte a Seco e Curvatura Real",
      description: settings?.francielly_method_1_description || "Cada corte é planejado considerando o fator encolhimento, o caimento e a densidade de cada mecha, respeitando o formato natural dos fios.",
      icon: Scissors,
      color: "text-magenta",
    },
    {
      title: settings?.francielly_method_2_title || "Saúde Capilar em Primeiro Lugar",
      description: settings?.francielly_method_2_description || "Mechas e tratamentos são realizados com avaliação prévia da fibra capilar para preservar a integridade, a força e a definição dos cachos.",
      icon: Award,
      color: "text-gold",
    },
    {
      title: settings?.francielly_method_3_title || "Educação e Cuidado em Casa",
      description: settings?.francielly_method_3_description || "Além do resultado no salão, você aprende como lavar, finalizar e manter seus cabelos definidos e saudáveis no dia a dia.",
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

      <main className="pt-24 sm:pt-28 lg:pt-36">
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
                <div className="absolute -bottom-5 left-4 right-4 rounded-2xl border border-border/60 bg-card/95 p-4 shadow-card backdrop-blur sm:left-auto sm:right-[-0.75rem] sm:max-w-xs sm:p-5">
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
        <section className="bg-background py-16 lg:py-28">
          <div className="mx-auto max-w-5xl px-5 lg:px-8">
            <div className="text-center max-w-2xl mx-auto">
              <p className="eyebrow mx-auto flex w-fit items-center gap-2">
                <Heart className="h-3.5 w-3.5 text-magenta" />
                {methodologyEyebrow}
              </p>
              <h2 className="mt-3 text-3xl font-display leading-tight sm:text-4xl">
                {mission}
              </h2>
            </div>

            <div className="mt-10 grid gap-5 md:mt-14 md:grid-cols-3 md:gap-8">
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
            <div className="mt-14 overflow-hidden rounded-[2rem] border border-border/70 bg-card p-5 shadow-card sm:p-8 md:mt-20 md:grid md:grid-cols-[1fr_1.1fr] md:items-center md:gap-10 md:rounded-[2.5rem]">
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
      </main>

      <Footer />
      <BotaoFlutuanteWhatsApp />
    </div>
  );
}
