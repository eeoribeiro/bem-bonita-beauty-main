import { createFileRoute } from "@tanstack/react-router";

import { BotaoFlutuanteWhatsApp } from "@/components/site/BotaoFlutuanteWhatsApp";
import { Footer } from "@/components/site/Footer";
import { Header } from "@/components/site/Header";
import { TrabalheConosco } from "@/components/site/TrabalheConosco";

export const Route = createFileRoute("/trabalhe-conosco")({
  head: () => ({
    meta: [
      { title: "Trabalhe conosco | Bem Bonita" },
      {
        name: "description",
        content: "Preencha seu currículo para oportunidades no salão Bem Bonita em Ponte Nova/MG.",
      },
    ],
  }),
  component: TrabalheConoscoPage,
});

function TrabalheConoscoPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <main className="page-transition pt-24 sm:pt-28 lg:pt-36">
        <TrabalheConosco paginaCompleta />
      </main>
      <Footer />
      <BotaoFlutuanteWhatsApp />
    </div>
  );
}
