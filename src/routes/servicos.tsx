import { createFileRoute } from "@tanstack/react-router";

import { BotaoFlutuanteWhatsApp } from "@/components/site/BotaoFlutuanteWhatsApp";
import { Footer } from "@/components/site/Footer";
import { Header } from "@/components/site/Header";
import { Servicos } from "@/components/site/Servicos";
import { useReveal } from "@/hooks/use-reveal";

export const Route = createFileRoute("/servicos")({
  head: () => ({
    meta: [
      { title: "Serviços capilares | Bem Bonita" },
      {
        name: "description",
        content:
          "Conheça os serviços do Bem Bonita para cabelos cacheados, crespos, ondulados e em transição.",
      },
    ],
  }),
  component: ServicosPage,
});

function ServicosPage() {
  useReveal();

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <Servicos paginaCompleta />
      </main>
      <Footer />
      <BotaoFlutuanteWhatsApp />
    </div>
  );
}
