import { ArrowUpRight, Instagram, PlayCircle } from "lucide-react";

import { BotaoLink } from "./Botao";
import { SALAO } from "@/lib/salao";

const reels = [
  {
    url: "https://www.instagram.com/reel/DdEOvylOesK/",
    imagem: "/media/resultado-mechas-cachos.jpg",
    titulo: "Cuidados, resultados e bastidores",
  },
  {
    url: "https://www.instagram.com/reel/Dc6-fFgqsY_/",
    imagem: "/media/resultado-definicao.jpg",
    titulo: "Transformações reais do salão",
  },
  {
    url: "https://www.instagram.com/reel/Dc68ZbtKdOY/",
    imagem: "/media/penteado-trancas-coloridas.jpg",
    titulo: "Cachos, penteados e finalizações",
  },
  {
    url: "https://www.instagram.com/reel/Dcyw31NCyLD/",
    imagem: "/media/francielly-profissional.jpg",
    titulo: "Acompanhe a rotina Bem Bonita",
  },
];

export function InstagramReels() {
  return (
    <section className="overflow-hidden bg-background py-16 text-foreground lg:py-24">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <p className="eyebrow text-primary">Instagram</p>
            <h2 className="mt-3 font-display text-4xl leading-tight sm:text-5xl">
              Nos acompanhe no Instagram também
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground sm:text-base">
              Veja vídeos, bastidores, resultados recentes e novidades do Salão Bem Bonita direto no Instagram.
            </p>
          </div>
          <BotaoLink
            href={SALAO.instagramUrl}
            target="_blank"
            rel="noopener noreferrer"
            variante="outline"
            className="border-border text-foreground hover:bg-secondary"
          >
            <Instagram className="h-4 w-4" />
            Ver perfil completo
            <ArrowUpRight className="h-4 w-4" />
          </BotaoLink>
        </div>

        <div className="-mx-5 mt-10 flex snap-x snap-mandatory gap-4 overflow-x-auto px-5 pb-4 sm:mx-0 sm:grid sm:grid-cols-2 sm:overflow-visible sm:px-0 sm:pb-0 lg:grid-cols-4">
          {reels.map((reel, index) => (
            <a
              key={reel.url}
              href={reel.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative min-w-[74vw] snap-center overflow-hidden rounded-[2rem] border border-border bg-card shadow-[0_24px_70px_-35px_rgba(236,102,171,0.85)] sm:min-w-0"
            >
              <img
                src={reel.imagem}
                alt={reel.titulo}
                className="aspect-[9/14] w-full object-cover transition duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/78 via-black/10 to-transparent" />
              <span className="absolute left-4 top-4 rounded-full bg-primary px-3 py-1 text-xs font-bold text-primary-foreground">
                Reel #{index + 1}
              </span>
              <span className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-background/90 text-magenta shadow-soft transition group-hover:scale-105">
                <PlayCircle className="h-5 w-5" />
              </span>
              <div className="absolute inset-x-0 bottom-0 p-5">
                <p className="text-xs font-bold uppercase tracking-[0.22em] text-primary">Assistir no Instagram</p>
                <h3 className="mt-2 text-lg font-bold text-white">{reel.titulo}</h3>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
