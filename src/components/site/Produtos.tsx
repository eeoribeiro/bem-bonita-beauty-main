import { CheckCircle2, MessageCircle, Sparkles, ShoppingBag } from "lucide-react";

import { BotaoLink } from "./Botao";
import { TituloSecao } from "./TituloSecao";
import { SALAO, whatsappLink } from "@/lib/salao";
import { usePublicSiteData } from "@/lib/site-data";

import shampooImg from "@/assets/produto-shampoo.jpg";
import mascaraImg from "@/assets/produto-mascara.jpg";
import finalizadorImg from "@/assets/produto-finalizador.jpg";
import oleoImg from "@/assets/produto-oleo.jpg";
import kitImg from "@/assets/produto-kit.jpg";

interface ProdutoItem {
  id: string;
  nome: string;
  subtitulo: string;
  curvatura: string;
  descricao: string;
  beneficios: string[];
  imagem: string;
  destaque?: boolean;
}
const produtosLinha: ProdutoItem[] = [
  {
    id: "kit-completo",
    nome: "Kit Completo Bem Bonita",
    subtitulo: "Tratamento, nutrição e finalização diária",
    curvatura: "Curvaturas 2A a 4C & Transição",
    descricao:
      "A experiência completa do salão para manter seus cachos hidratados, nutridos e com definição impecável entre as visitas.",
    beneficios: [
      "Cronograma completo em casa",
      "Controle de frizz e retenção de umidade",
      "Economia e resultado profissional",
    ],
    imagem: kitImg,
    destaque: true,
  },
  {
    id: "shampoo",
    nome: "Shampoo Nutritivo Suave",
    subtitulo: "Limpeza equilibrada sem ressecar",
    curvatura: "Todos os tipos de cachos e crespos",
    descricao:
      "Fórmula com ativos botânicos que limpa o couro cabeludo suavemente preservando a oleosidade natural das pontas.",
    beneficios: ["Livre de sulfatos agressivos", "Espuma cremosa e hidratante", "Ação desembaraçante"],
    imagem: shampooImg,
  },
  {
    id: "mascara",
    nome: "Máscara de Nutrição Profunda",
    subtitulo: "Reposição lipídica e maciez imediata",
    curvatura: "Cachos 3A-3C e Crespos 4A-4C",
    descricao:
      "Tratamento intensivo com manteigas nobres para recuperar fios ressecados, devolver a elasticidade e o toque aveludado.",
    beneficios: ["Combate o ressecamento severo", "Ação antifrizz imediata", "Brilho e maleabilidade"],
    imagem: mascaraImg,
  },
  {
    id: "finalizador",
    nome: "Finalizador Ativador de Cachos",
    subtitulo: "Definição prolongada e memória de cachos",
    curvatura: "Ondulados, cacheados e crespos",
    descricao:
      "Leave-in de alta performance que modela sem pesar, garantindo day after prolongado e proteção contra umidade.",
    beneficios: ["Fixação flexível sem efeito duro", "Proteção térmica e solar", "Definição com movimento"],
    imagem: finalizadorImg,
  },
  {
    id: "oleo",
    nome: "Óleo Reparador Iluminador",
    subtitulo: "Nutrição e selagem das pontas",
    curvatura: "Todas as curvaturas",
    descricao:
      "Blend de óleos leves para quebrar o 'durinho' da finalização, selar cutículas e garantir brilho espelhado instantâneo.",
    beneficios: ["Toque seco e ultra leve", "Selagem anti-pontas duplas", "Perfume delicado e sofisticado"],
    imagem: oleoImg,
  },
];

export function Produtos() {
  const { data, isLoading } = usePublicSiteData();
  const productsImage = data?.images.find((image) => image.image_key === "products");
  const products = data?.products?.length
    ? data.products.map((product) => ({
        id: product.id,
        nome: product.name,
        subtitulo: product.subtitle,
        curvatura: product.hair_type,
        descricao: product.description,
        beneficios: product.benefits,
        imagem: product.image_url ?? kitImg,
        destaque: product.featured,
      }))
    : produtosLinha;

  return (
    <section id="produtos" className="bg-blush-soft py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <div data-reveal className="reveal text-center max-w-3xl mx-auto">
          <TituloSecao
            eyebrow="Linha Bem Bonita"
            titulo="Cuidado profissional que acompanha sua rotina"
            texto="Cosméticos especialmente selecionados e desenvolvidos para respeitar as necessidades reais de cabelos crespos, cacheados e ondulados."
            className="mx-auto text-center [&>span]:mx-auto"
          />
        </div>

        {/* Destaque Institucional */}
        <div className="mt-14 overflow-hidden rounded-3xl border border-border/70 bg-card p-6 shadow-card sm:p-10 lg:grid lg:grid-cols-[1fr_1.1fr] lg:gap-12 lg:items-center">
          <div className="relative">
            {isLoading ? (
              <div className="aspect-square w-full animate-pulse rounded-2xl bg-secondary/70 shadow-soft" />
            ) : (
              <img
                src={productsImage?.image_url ?? "/media/francielly-produtos.jpg"}
                width={640}
                height={640}
                loading="lazy"
                alt={
                  productsImage?.alt_text ??
                  "Francielly Soares com produtos Bem Bonita desenvolvidos para cabelos cacheados"
                }
                className="aspect-square w-full rounded-2xl object-cover shadow-soft"
              />
            )}
            <span className="absolute bottom-4 left-4 rounded-xl bg-card/90 px-4 py-2 text-xs font-semibold backdrop-blur text-magenta">
              ✨ Recomendado no Salão
            </span>
          </div>

          <div className="mt-8 lg:mt-0 space-y-5">
            <p className="eyebrow flex items-center gap-2">
              <Sparkles className="h-3.5 w-3.5 text-gold" />
              Prescrição Personalizada
            </p>
            <h3 className="text-2xl sm:text-3xl leading-tight">
              Não sabe qual produto é o ideal para o seu cabelo?
            </h3>
            <p className="text-sm sm:text-base leading-relaxed text-muted-foreground">
              Cada cacho possui densidade, porosidade e espessura únicas. No Bem Bonita, Francielly
              Soares orienta você sobre a combinação exata de produtos para o melhor resultado em casa.
            </p>
            <BotaoLink
              href={whatsappLink(
                `Olá, ${SALAO.nome}! Gostaria de uma orientação sobre os produtos ideais para o meu cabelo.`,
              )}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4"
            >
              <MessageCircle className="h-4 w-4" />
              Pedir recomendação no WhatsApp
            </BotaoLink>
          </div>
        </div>

        {/* Catálogo de Produtos */}
        <div className="mt-16">
          <div className="flex items-center justify-between gap-4 mb-8">
            <div>
              <p className="text-xs uppercase tracking-widest text-gold font-semibold">Catálogo</p>
              <h3 className="text-2xl sm:text-3xl font-display">Produtos Disponíveis</h3>
            </div>
            <span className="text-xs text-muted-foreground hidden sm:inline">
              Retirada no salão ou entrega sob consulta
            </span>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {products.map((produto) => (
              <article
                key={produto.id}
                className={`group flex flex-col justify-between overflow-hidden rounded-3xl border bg-card p-6 shadow-card transition-all duration-300 hover:shadow-soft hover:border-primary/50 ${
                  produto.destaque ? "border-primary/60 ring-1 ring-primary/30 sm:col-span-2 lg:col-span-1" : "border-border/70"
                }`}
              >
                <div>
                  <div className="relative aspect-square w-full overflow-hidden rounded-2xl bg-secondary/40">
                    <img
                      src={produto.imagem}
                      alt={produto.nome}
                      loading="lazy"
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    {produto.destaque ? (
                      <span className="absolute top-3 right-3 rounded-full bg-magenta px-3 py-1 text-[11px] font-semibold text-white shadow-md">
                        Mais Procurado
                      </span>
                    ) : null}
                  </div>

                  <div className="mt-5">
                    <span className="inline-block rounded-full bg-secondary px-3 py-1 text-[11px] font-medium text-magenta">
                      {produto.curvatura}
                    </span>
                    <h4 className="mt-3 text-xl font-display leading-snug">{produto.nome}</h4>
                    <p className="text-xs text-muted-foreground font-medium mt-1">
                      {produto.subtitulo}
                    </p>
                    <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
                      {produto.descricao}
                    </p>

                    <ul className="mt-4 space-y-1.5 border-t border-border/60 pt-3 text-xs text-foreground/80">
                      {produto.beneficios.map((beneficio) => (
                        <li key={beneficio} className="flex items-center gap-2">
                          <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-gold" />
                          <span>{beneficio}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-border/60">
                  <BotaoLink
                    href={whatsappLink(
                      `Olá, ${SALAO.nome}! Gostaria de saber mais informações e valor do produto: ${produto.nome}.`,
                    )}
                    target="_blank"
                    rel="noopener noreferrer"
                    variante={produto.destaque ? "default" : "outline"}
                    className="w-full text-xs py-2.5"
                  >
                    <ShoppingBag className="h-3.5 w-3.5" />
                    Consultar este produto
                  </BotaoLink>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
