import { createFileRoute } from "@tanstack/react-router";

import { Header } from "@/components/site/Header";
import { Hero } from "@/components/site/Hero";
import { Sobre } from "@/components/site/Sobre";
import { Equipe } from "@/components/site/Equipe";
import { Servicos } from "@/components/site/Servicos";
import { Resultados } from "@/components/site/Resultados";
import { Produtos } from "@/components/site/Produtos";
import { Agendamento } from "@/components/site/Agendamento";
import { Localizacao } from "@/components/site/Localizacao";
import { Footer } from "@/components/site/Footer";
import { BotaoFlutuanteWhatsApp } from "@/components/site/BotaoFlutuanteWhatsApp";
import { PerguntasFrequentes } from "@/components/site/PerguntasFrequentes";
import { Depoimentos } from "@/components/site/Depoimentos";
import { useReveal } from "@/hooks/use-reveal";

const titulo = "Bem Bonita | Salão para cabelos cacheados em Ponte Nova – MG";
const descricao =
  "Salão especialista em cachos e crespos em Ponte Nova – MG. Tratamentos, definição de cachos, mechas em cabelos cacheados e cortes com Francielly Soares.";

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
      { property: "og:url", content: "https://bem-bonita-beauty-main.vercel.app/" },
      {
        property: "og:image",
        content: "https://bem-bonita-beauty-main.vercel.app/media/francielly-profissional.jpg",
      },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: titulo },
      { name: "twitter:description", content: descricao },
      {
        name: "twitter:image",
        content: "https://bem-bonita-beauty-main.vercel.app/media/francielly-profissional.jpg",
      },
    ],
    links: [{ rel: "canonical", href: "https://bem-bonita-beauty-main.vercel.app/" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "HairSalon",
          name: "Bem Bonita",
          url: "https://bem-bonita-beauty-main.vercel.app/",
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
      <main>
        <Hero />
        <Servicos />
        <Agendamento />
        <Resultados />
        <Sobre />
        <Equipe />
        <Depoimentos />
        <Produtos />
        <PerguntasFrequentes />
        <Localizacao />
      </main>
      <Footer />
      <BotaoFlutuanteWhatsApp />
    </div>
  );
}
