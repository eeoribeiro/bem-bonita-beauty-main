import { createFileRoute } from "@tanstack/react-router";

import { BotaoFlutuanteWhatsApp } from "@/components/site/BotaoFlutuanteWhatsApp";
import { Depoimentos } from "@/components/site/Depoimentos";
import { Footer } from "@/components/site/Footer";
import { Header } from "@/components/site/Header";
import { useReveal } from "@/hooks/use-reveal";

export const Route = createFileRoute("/feedbacks")({
  head: () => ({
    meta: [
      { title: "Feedbacks das clientes | Bem Bonita" },
      {
        name: "description",
        content: "Veja prints reais de depoimentos recebidos pelo WhatsApp das clientes Bem Bonita.",
      },
    ],
  }),
  component: FeedbacksPage,
});

function FeedbacksPage() {
  useReveal();

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <Depoimentos paginaCompleta />
      </main>
      <Footer />
      <BotaoFlutuanteWhatsApp />
    </div>
  );
}
