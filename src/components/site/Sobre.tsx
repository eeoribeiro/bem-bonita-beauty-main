import { Coffee, MapPin, Maximize2, Scissors, Sparkles } from "lucide-react";
import { useState } from "react";

import { BotaoLink } from "./Botao";
import { contatoLink, SALAO } from "@/lib/salao";
import { usePublicSiteData } from "@/lib/site-data";

import salaoEspaco from "@/assets/instagram-salao.jpg";
import produtosEspaco from "@/assets/instagram-produtos.jpg";
import cachosEspaco from "@/assets/instagram-cachos.jpg";

const diferenciais = [
  {
    icone: Scissors,
    titulo: "Atendimento Especializado",
    texto: "Metodologia exclusiva de corte a seco e diagnóstico capilar individualizado.",
  },
  {
    icone: Sparkles,
    titulo: "Saúde & Definição",
    texto: "Produtos livres de petrolatos pesados com foco em nutrição e day after.",
  },
  {
    icone: Coffee,
    titulo: "Ambiente Acolhedor",
    texto: "Espaço intimista, café fresco e música relaxante para o seu momento de autocuidado.",
  },
  {
    icone: MapPin,
    titulo: "Fácil Acesso",
    texto: "Localização central no Lanna Shopping, com total segurança e comodidade.",
  },
];

export function Sobre() {
  const { data } = usePublicSiteData();
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);

  const space1 = data?.images.find((image) => image.image_key === "space_1")?.image_url ?? salaoEspaco;
  const space2 = data?.images.find((image) => image.image_key === "space_2")?.image_url ?? produtosEspaco;
  const space3 = data?.images.find((image) => image.image_key === "space_3")?.image_url ?? cachosEspaco;
  const customSpacePhotos =
    data?.images
      .filter((image) => image.image_key.startsWith("custom_space_"))
      .map((image) => ({
        url: image.image_url,
        titulo: image.alt_text || "Foto do espaço Bem Bonita",
        legenda: "Galeria do salão Bem Bonita",
      })) ?? [];

  const fotosEspaco = [
    {
      url: space1,
      titulo: "Ambiente Principal do Salão",
      legenda: "Estrutura aconchegante pensada para o seu conforto",
    },
    {
      url: space2,
      titulo: "Produtos & Tratamentos",
      legenda: "Linha profissional selecionada para cachos",
    },
    {
      url: space3,
      titulo: "Resultados & Transformações",
      legenda: "Realce da curvatura e brilho dos fios",
    },
    ...customSpacePhotos,
  ].filter((foto, index, lista) => lista.findIndex((item) => item.url === foto.url) === index);

  return (
    <section id="nosso-espaco" className="bg-background py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <div className="rounded-[2.5rem] border border-border/80 bg-blush-soft p-6 shadow-card sm:p-10 lg:p-12">
          <div className="text-center max-w-2xl mx-auto">
            <p className="eyebrow mx-auto flex w-fit items-center gap-2">
              <Sparkles className="h-3.5 w-3.5 text-gold" />
              Nosso Espaço
            </p>
            <h2 className="mt-3 text-3xl sm:text-4xl font-display">
              Um refúgio exclusivo para cuidar dos seus cachos
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
              Localizado no Lanna Shopping em Ponte Nova, o salão Bem Bonita foi desenhado para
              proporcionar uma experiência relaxante, intimista e acolhedora.
            </p>
          </div>

          {/* Grade de Fotos do Espaço */}
          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {fotosEspaco.map((foto, idx) => (
              <div
                key={idx}
                onClick={() => setSelectedPhoto(foto.url)}
                className="group relative cursor-pointer overflow-hidden rounded-3xl border border-border/70 bg-card shadow-card transition-all duration-300 hover:-translate-y-1 hover:shadow-soft"
              >
                <div className="aspect-[4/3] w-full overflow-hidden">
                  <img
                    src={foto.url}
                    alt={foto.titulo}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="p-4">
                  <p className="text-sm font-medium leading-snug">{foto.titulo}</p>
                  <p className="mt-1 text-xs text-muted-foreground line-clamp-1">{foto.legenda}</p>
                </div>
                <div className="absolute top-3 right-3 flex h-8 w-8 items-center justify-center rounded-full bg-black/60 text-white opacity-0 group-hover:opacity-100 transition backdrop-blur">
                  <Maximize2 className="h-4 w-4" />
                </div>
              </div>
            ))}
          </div>

          {/* Diferenciais do Espaço */}
          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4 border-t border-border/60 pt-8">
            {diferenciais.map(({ icone: Icone, titulo, texto }) => (
              <div key={titulo} className="flex gap-3.5 p-2">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-secondary text-magenta">
                  <Icone className="h-5 w-5" />
                </span>
                <div>
                  <h3 className="text-sm font-semibold">{titulo}</h3>
                  <p className="mt-1 text-xs text-muted-foreground leading-relaxed">{texto}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-10 text-center">
            <BotaoLink
              href={contatoLink(
                `Olá, ${SALAO.nome}! Gostaria de agendar uma visita e conhecer o salão no Lanna Shopping.`,
              )}
              target="_blank"
              rel="noopener noreferrer"
              className="shadow-soft"
            >
              Agendar visita ao salão pelo WhatsApp
            </BotaoLink>
          </div>
        </div>
      </div>

      {/* Modal de Foto Ampliada */}
      {selectedPhoto ? (
        <div
          onClick={() => setSelectedPhoto(null)}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm"
        >
          <div className="relative max-h-[90vh] max-w-4xl overflow-hidden rounded-3xl bg-background p-2">
            <img
              src={selectedPhoto}
              alt="Foto do Espaço do Salão Bem Bonita"
              className="max-h-[85vh] w-auto rounded-2xl object-contain"
            />
            <button
              type="button"
              onClick={() => setSelectedPhoto(null)}
              className="absolute top-4 right-4 flex h-9 w-9 items-center justify-center rounded-full bg-black/70 text-white hover:bg-black"
            >
              ✕
            </button>
          </div>
        </div>
      ) : null}
    </section>
  );
}
