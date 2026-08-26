import { HeartHandshake, Leaf, Sparkles, UserRound } from "lucide-react";

import { TituloSecao } from "./TituloSecao";
import { usePublicSiteData } from "@/lib/site-data";

const indicadores = [
  { icone: UserRound, texto: "Atendimento especializado" },
  { icone: Sparkles, texto: "Técnicas para cachos e crespos" },
  { icone: Leaf, texto: "Produtos selecionados" },
  { icone: HeartHandshake, texto: "Experiência personalizada" },
];

export function Sobre() {
  const { data, isLoading } = usePublicSiteData();
  const aboutImage = data?.images.find((image) => image.image_key === "about");
  return (
    <section id="sobre" className="bg-background py-20 lg:py-28">
      <div className="mx-auto grid max-w-7xl items-center gap-12 px-5 lg:grid-cols-2 lg:gap-16 lg:px-8">
        <div data-reveal className="reveal relative order-2 lg:order-1">
          {isLoading ? (
            <div className="aspect-[4/5] w-full animate-pulse rounded-[2.5rem] bg-secondary/60 shadow-soft" />
          ) : (
            <img
              src={aboutImage?.image_url ?? "/media/francielly-produtos.jpg"}
              width={640}
              height={800}
              loading="lazy"
              alt={
                aboutImage?.alt_text ??
                "Francielly Soares apresentando a linha de produtos Bem Bonita para cachos"
              }
              className="aspect-[4/5] w-full rounded-[2.5rem] object-cover shadow-soft"
            />
          )}
          <div
            aria-hidden
            className="absolute -bottom-5 -right-3 hidden h-32 w-32 rounded-full border border-primary/40 lg:block"
          />
        </div>

        <div data-reveal className="reveal order-1 lg:order-2">
          <TituloSecao
            eyebrow="Sobre o salão"
            titulo={data?.settings?.about_title ?? "Beleza que respeita a sua essência"}
            texto={
              data?.settings?.about_text ??
              "No Bem Bonita, cada cabelo é tratado de forma única. Sob os cuidados de Francielly Soares, o salão oferece técnicas, tratamentos e produtos pensados especialmente para cabelos crespos e cacheados. Mais do que transformar fios, queremos fortalecer a autoestima e revelar a beleza que já existe em cada cliente."
            }
          />

          <ul className="mt-10 grid gap-4 sm:grid-cols-2">
            {indicadores.map(({ icone: Icone, texto }) => (
              <li
                key={texto}
                className="flex items-center gap-3 rounded-2xl border border-border/70 bg-card px-4 py-4 shadow-card"
              >
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-secondary">
                  <Icone className="h-4.5 w-4.5 text-magenta" />
                </span>
                <span className="min-w-0 text-sm font-medium">{texto}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
