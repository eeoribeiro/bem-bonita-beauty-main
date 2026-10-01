import { createFileRoute } from "@tanstack/react-router";

import { Header } from "@/components/site/Header";
import { Hero } from "@/components/site/Hero";
import { Servicos } from "@/components/site/Servicos";
import { Agendamento } from "@/components/site/Agendamento";
import { Localizacao } from "@/components/site/Localizacao";
import { Footer } from "@/components/site/Footer";
import { BotaoFlutuanteWhatsApp } from "@/components/site/BotaoFlutuanteWhatsApp";
import { Depoimentos } from "@/components/site/Depoimentos";
import { FranciellyPreview } from "@/components/site/FranciellyPreview";
import { Produtos } from "@/components/site/Produtos";
import { Sobre } from "@/components/site/Sobre";
import { Resultados } from "@/components/site/Resultados";
import { InstagramReels } from "@/components/site/InstagramReels";
import { TrabalheConosco } from "@/components/site/TrabalheConosco";
import { useReveal } from "@/hooks/use-reveal";

const titulo = "Bem Bonita | Salão para cabelos cacheados em Ponte Nova – MG";
const descricao =
  "Salão especialista em cachos e crespos em Ponte Nova – MG. Tratamentos, definição de cachos, mechas em cabelos cacheados e cortes com Francielly Soares.";
const siteUrl = "https://www.bembonitafrancielly.com.br";
const socialImageUrl = `${siteUrl}/media/francielly-profissional.jpg`;

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: titulo },
      { name: "description", content: descricao },
      {
        name: "keywords",
        content:
          "salão para cabelos cacheados em Ponte Nova, especialista em cachos Ponte Nova, mechas em cabelos cacheados, salão de beleza Ponte Nova MG",
      },
      { property: "og:title", content: titulo },
      { property: "og:description", content: descricao },
      { property: "og:type", content: "website" },
      { property: "og:locale", content: "pt_BR" },
      { property: "og:url", content: `${siteUrl}/` },
      {
        property: "og:image",
        content: socialImageUrl,
      },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: titulo },
      { name: "twitter:description", content: descricao },
      {
        name: "twitter:image",
        content: socialImageUrl,
      },
    ],
    links: [{ rel: "canonical", href: `${siteUrl}/` }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "HairSalon",
          name: "Bem Bonita",
          url: `${siteUrl}/`,
          description: descricao,
          telephone: "+55 31 99679-2131",
          address: {
            "@type": "PostalAddress",
            streetAddress:
              "Av. Francisco Vieira Martins, 595, Lanna Shopping, sala 118, primeiro andar",
            addressLocality: "Ponte Nova",
            addressRegion: "MG",
            addressCountry: "BR",
          },
          areaServed: "Ponte Nova, MG",
          sameAs: ["https://instagram.com/salaobembonita_cielly"],
          founder: { "@type": "Person", name: "Francielly Soares" },
        }),
      },
    ],
  }),
  component: Index,
});

function Index() {
  useReveal();

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="page-transition">
        <Hero />
        <FranciellyPreview />
        <Sobre />
        <Servicos />
        <Resultados />
        <Depoimentos />
        <Produtos />
        <Agendamento />
        <InstagramReels />
        <Localizacao />
        <TrabalheConosco />
      </main>
      <Footer />
      <BotaoFlutuanteWhatsApp />
    </div>
  );
}
