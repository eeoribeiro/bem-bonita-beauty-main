import { createFileRoute } from "@tanstack/react-router";

import { BotaoFlutuanteWhatsApp } from "@/components/site/BotaoFlutuanteWhatsApp";
import { Footer } from "@/components/site/Footer";
import { Header } from "@/components/site/Header";
import { Produtos } from "@/components/site/Produtos";
import { useReveal } from "@/hooks/use-reveal";

export const Route = createFileRoute("/produtos")({
  head: () => ({
    meta: [
      { title: "Produtos para cabelos cacheados | Bem Bonita" },
      { name: "description", content: "Conheça os produtos para cabelos cacheados, crespos e ondulados disponíveis no salão Bem Bonita." },
    ],
  }),
  component: ProdutosPage,
});

function ProdutosPage() {
  useReveal();
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main><Produtos paginaCompleta /></main>
      <Footer />
      <BotaoFlutuanteWhatsApp />
    </div>
  );
}
