import { MessageCircle, Sparkles } from "lucide-react";

import { BotaoLink } from "./Botao";
import { SALAO, whatsappLink } from "@/lib/salao";
import { usePublicSiteData } from "@/lib/site-data";

export function Produtos() {
  const { data, isLoading } = usePublicSiteData();
  const productsImage = data?.images.find((image) => image.image_key === "products");
  return (
    <section id="produtos" className="bg-blush-soft py-16 lg:py-24">
      <div className="mx-auto grid max-w-6xl items-center gap-10 px-5 lg:grid-cols-[0.9fr_1.1fr] lg:px-8">
        {isLoading ? (
          <div className="aspect-square w-full animate-pulse rounded-[2rem] bg-secondary/70 shadow-soft" />
        ) : (
          <img
            src={productsImage?.image_url ?? "/media/francielly-produtos.jpg"}
            width={640}
            height={800}
            loading="lazy"
            alt={
              productsImage?.alt_text ??
              "Francielly Soares com produtos Bem Bonita desenvolvidos para cabelos cacheados"
            }
            className="aspect-square w-full rounded-[2rem] object-cover shadow-soft"
          />
        )}
        <div>
          <p className="eyebrow flex items-center gap-2">
            <Sparkles className="h-3.5 w-3.5 text-gold" />
            Cuidado em casa
          </p>
          <h2 className="mt-4 text-3xl leading-tight sm:text-4xl">
            Produtos que acompanham a rotina dos seus cachos
          </h2>
          <p className="mt-5 max-w-xl leading-relaxed text-muted-foreground">
            O Bem Bonita trabalha com cosméticos voltados para cabelos crespos e cacheados. A
            escolha dos produtos deve considerar a necessidade real dos seus fios, sua rotina e o
            resultado que você deseja manter.
          </p>
          <BotaoLink
            href={whatsappLink(
              `Olá, ${SALAO.nome}! Gostaria de conhecer os produtos indicados para cabelos cacheados.`,
            )}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-7"
          >
            <MessageCircle className="h-4 w-4" />
            Consultar pelo WhatsApp
          </BotaoLink>
        </div>
      </div>
    </section>
  );
}
