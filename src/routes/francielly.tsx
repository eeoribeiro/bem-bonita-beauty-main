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
import type { SiteImageData } from "@/lib/site-data";
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

type CourseCard = {
  id: string;
  imageUrl: string;
  altText: string;
  eyebrow: string;
  title: string;
  subtitle: string;
};

function parseCourseMeta(altText?: string | null) {
  if (!altText?.trim().startsWith("{")) return null;
  try {
    const parsed = JSON.parse(altText) as Partial<Pick<CourseCard, "eyebrow" | "title" | "subtitle" | "altText">>;
    return parsed;
  } catch {
    return null;
  }
}

function courseFromImage(image: SiteImageData): CourseCard {
  const meta = parseCourseMeta(image.alt_text);
  return {
    id: image.id,
    imageUrl: image.image_url,
    altText: meta?.altText || meta?.title || image.alt_text || "Curso com a Francielly",
    eyebrow: meta?.eyebrow || "Curso Bem Bonita",
    title: meta?.title || "Curso com a Francielly",
    subtitle:
      meta?.subtitle ||
      "Entre em contato para saber disponibilidade, conteúdo, valores e próximas turmas.",
  };
}

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
  const courseDefaults = [
    {
      eyebrow: "Curso presencial",
      title: "Finalização para cachos",
      subtitle: "Aprenda técnicas de cuidado, definição e rotina para valorizar cada curvatura com acabamento profissional.",
    },
    {
      eyebrow: "Aula prática",
      title: "Cuidados e cronograma",
      subtitle: "Conteúdo para entender necessidades dos fios, montar uma rotina e indicar cuidados com mais segurança.",
    },
    {
      eyebrow: "Turmas especiais",
      title: "Atendimento para cacheadas",
      subtitle: "Treinamento voltado para quem quer oferecer uma experiência mais cuidadosa, técnica e personalizada.",
    },
  ];
  const savedCourses = images
    .filter((img) => img.image_key.startsWith("francielly_course_"))
    .sort((a, b) => a.image_key.localeCompare(b.image_key))
    .map(courseFromImage);
  const legacyCourses = [
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
  ].map((block, index) => ({
    id: `legacy-${index + 1}`,
    imageUrl: block.image?.image_url || fotoPrincipal,
    altText: block.image?.alt_text || block.title || courseDefaults[index]?.title || "Curso com a Francielly",
    eyebrow: block.eyebrow || courseDefaults[index]?.eyebrow || "Curso Bem Bonita",
    title: block.title || courseDefaults[index]?.title || "Curso com a Francielly",
    subtitle:
      block.subtitle ||
      courseDefaults[index]?.subtitle ||
      "Entre em contato para saber disponibilidade, conteúdo, valores e próximas turmas.",
  }));
  const courseCards = savedCourses.length ? savedCourses : legacyCourses;

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
              <div className="order-2 lg:order-1">
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

              <div className="order-1 relative lg:order-2">
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

        {courseCards.length ? (
          <section className="relative overflow-hidden bg-background py-16 lg:py-24">
            <div className="pointer-events-none absolute left-0 top-12 h-72 w-72 rounded-full bg-primary/10 blur-3xl" />
            <div className="pointer-events-none absolute bottom-0 right-0 h-80 w-80 rounded-full bg-gold/10 blur-3xl" />
            <div className="mx-auto max-w-7xl px-5 lg:px-8">
              <div className="mx-auto max-w-3xl text-center">
                <p className="eyebrow mx-auto w-fit">Cursos e mentorias</p>
                <h2 className="mt-4 font-display text-3xl leading-tight sm:text-5xl">
                  Aprenda com a Francielly
                </h2>
                <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base">
                  Formações, aulas e experiências para quem deseja aprender técnicas de cuidado,
                  finalização e atendimento para cabelos cacheados, crespos e ondulados.
                </p>
              </div>

              <div className="mt-10 grid gap-5 md:grid-cols-3">
                {courseCards.map((block) => (
                  <article
                    key={block.id}
                    className="group flex overflow-hidden rounded-[2rem] border border-border/70 bg-card shadow-card transition duration-300 hover:-translate-y-1 hover:border-primary/45 hover:shadow-soft"
                  >
                    <div className="flex min-h-full w-full flex-col">
                      <div className="aspect-[4/5] overflow-hidden bg-card">
                        <SafeImage
                          src={block.imageUrl || fotoPrincipal}
                          fallbackSrc={fotoFranciellyFallback}
                          alt={block.altText}
                          loading="lazy"
                          decoding="async"
                          className="h-full w-full object-contain"
                        />
                      </div>
                      <div className="flex flex-1 flex-col p-5 sm:p-6">
                        <p className="text-xs font-bold uppercase tracking-[0.24em] text-magenta">
                          {block.eyebrow}
                        </p>
                        <h2 className="mt-3 font-display text-2xl leading-tight">
                          {block.title}
                        </h2>
                        <p className="mt-3 flex-1 text-sm leading-relaxed text-muted-foreground">
                          {block.subtitle}
                        </p>
                        <BotaoLink
                          href={whatsappLink(
                            `Olá, Francielly! Vi o curso “${block.title}” no site e quero saber como comprar ou reservar minha vaga.`,
                          )}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="mt-5 w-full"
                        >
                          <MessageCircle className="h-4 w-4" />
                          Comprar pelo WhatsApp
                        </BotaoLink>
                      </div>
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
