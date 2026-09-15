import { CheckCircle2, MessageCircle, Sparkles, ShoppingBag } from "lucide-react";
import { useEffect, useState } from "react";

import { BotaoLink } from "./Botao";
import { TituloSecao } from "./TituloSecao";
import { useMobileAutoCarousel } from "@/hooks/use-mobile-auto-carousel";
import { parsePrecoCentavos, quantidadeCarrinho, readCart, saveCart, type CartItem } from "@/lib/cart";
import { SALAO, whatsappLink } from "@/lib/salao";
import { usePublicSiteData } from "@/lib/site-data";

import finalizadorImg from "@/assets/produto-finalizador.jpg";
import kitImg from "@/assets/produto-kit.jpg";
import mascaraImg from "@/assets/produto-mascara.jpg";
import oleoImg from "@/assets/produto-oleo.jpg";
import shampooImg from "@/assets/produto-shampoo.jpg";

interface ProdutoItem {
  id: string;
  nome: string;
  subtitulo: string;
  curvatura: string;
  descricao: string;
  beneficios: string[];
  imagem: string;
  preco?: string | null;
  precoPromocional?: string | null;
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
      "Tratamento intensivo com manteigas nobres para recuperar fios ressecados, devolver elasticidade e toque aveludado.",
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
      "Blend de óleos leves para quebrar o durinho da finalização, selar cutículas e garantir brilho instantâneo.",
    beneficios: ["Toque seco e ultra leve", "Selagem anti-pontas duplas", "Perfume delicado e sofisticado"],
    imagem: oleoImg,
  },
];

export function Produtos({ paginaCompleta = false }: { paginaCompleta?: boolean }) {
  const { data, isError, isFetching, isLoading } = usePublicSiteData();
  const carouselRef = useMobileAutoCarousel<HTMLDivElement>();
  const [cart, setCart] = useState<CartItem[]>([]);
  const [checkoutMessage, setCheckoutMessage] = useState("");
  const productsImage = data?.images.find((image) => image.image_key === "products");
  const products = data
    ? data.products.map((product) => ({
        id: product.id,
        nome: product.name,
        subtitulo: product.subtitle,
        curvatura: product.hair_type,
        descricao: product.description,
        beneficios: product.benefits,
        imagem: product.image_url ?? "",
        preco: product.price_text,
        precoPromocional: product.promotional_price_text,
        destaque: product.featured,
      }))
    : isError
      ? produtosLinha
      : [];
  const produtosExibidos = paginaCompleta
    ? products
    : [...products].sort((a, b) => Number(Boolean(b.destaque)) - Number(Boolean(a.destaque))).slice(0, 3);
  const cartQuantity = quantidadeCarrinho(cart);

  useEffect(() => {
    setCart(readCart());
  }, []);

  function addToCart(product: ProdutoItem) {
    if (!parsePrecoCentavos(product.precoPromocional || product.preco)) {
      setCheckoutMessage("Esse produto precisa ter preço cadastrado para vender online.");
      return;
    }
    const currentCart = readCart();
    const nextCart = (() => {
      const existing = currentCart.find((item) => item.id === product.id);
      if (existing) {
        return currentCart.map((item) =>
          item.id === product.id ? { ...item, quantity: Math.min(20, item.quantity + 1) } : item,
        );
      }
      return [...currentCart, { id: product.id, quantity: 1 }];
    })();
    setCart(nextCart);
    saveCart(nextCart);
    setCheckoutMessage(`${product.nome} foi adicionado ao carrinho.`);
    window.location.href = "/checkout";
  }

  return (
    <section id="produtos" className={`bg-blush-soft pb-16 lg:pb-28 ${paginaCompleta ? "pt-28 lg:pt-40" : "pt-16 lg:pt-28"}`}>
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <div data-reveal className="reveal mx-auto max-w-3xl text-center">
          <TituloSecao
            eyebrow={paginaCompleta ? "Loja Bem Bonita" : "Loja"}
            titulo={paginaCompleta ? "Produtos para cuidar dos seus cabelos" : "Linha Bem Bonita"}
            texto={
              paginaCompleta
                ? "Cosméticos selecionados para respeitar as necessidades reais de cabelos crespos, cacheados e ondulados."
                : "Uma prévia da linha para continuar o cuidado em casa depois do atendimento."
            }
            className="mx-auto text-center [&>span]:mx-auto"
          />
        </div>

        <div className={paginaCompleta ? "mt-16" : "mt-12"}>
          <div className="mb-7 flex flex-col gap-2 sm:mb-8 sm:flex-row sm:items-end sm:justify-between sm:gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-gold">Catálogo</p>
              <h3 className="font-display text-2xl sm:text-3xl">
                {paginaCompleta ? "Produtos disponíveis" : "Conheça alguns produtos"}
              </h3>
            </div>
            <span className="rounded-full bg-card px-4 py-2 text-xs font-semibold text-magenta shadow-card sm:text-right">
              {paginaCompleta
                ? cartQuantity
                  ? `${cartQuantity} item(ns) no carrinho da navbar`
                  : "Carrinho na navbar"
                : "Compra online na loja completa"}
            </span>
          </div>
          {checkoutMessage ? (
            <p className="mb-5 w-fit rounded-2xl bg-card px-4 py-3 text-xs font-medium text-muted-foreground shadow-card">
              {checkoutMessage}
            </p>
          ) : null}

          <div
            ref={carouselRef}
            className="-mx-5 flex snap-x snap-mandatory gap-4 overflow-x-auto px-5 pb-4 sm:mx-0 sm:grid sm:grid-cols-2 sm:overflow-visible sm:px-0 sm:pb-0 lg:grid-cols-3"
          >
            {isLoading || isFetching ? (
              Array.from({ length: paginaCompleta ? 6 : 3 }).map((_, index) => (
                <div
                  key={index}
                  className="min-w-[72vw] max-w-[18rem] snap-center overflow-hidden rounded-3xl border border-border/70 bg-card shadow-card sm:min-w-0 sm:max-w-none"
                  aria-label="Carregando produto"
                >
                  <div className="aspect-square w-full animate-pulse bg-secondary/70 sm:aspect-[3/4]" />
                  <div className="space-y-3 p-4 sm:p-6">
                    <div className="h-5 w-28 animate-pulse rounded-full bg-secondary/80" />
                    <div className="h-7 w-3/4 animate-pulse rounded bg-secondary/80" />
                    <div className="h-4 w-full animate-pulse rounded bg-secondary/70" />
                    <div className="h-4 w-2/3 animate-pulse rounded bg-secondary/70" />
                  </div>
                </div>
              ))
            ) : produtosExibidos.length ? (
              produtosExibidos.map((produto, index) => (
                <article
                  key={produto.id}
                  className={`group flex min-w-[72vw] max-w-[18rem] snap-center flex-col justify-between overflow-hidden rounded-3xl border bg-card shadow-card transition-all duration-300 hover:border-primary/50 hover:shadow-soft sm:min-w-0 sm:max-w-none ${
                    produto.destaque ? "border-primary/60 ring-1 ring-primary/30 sm:col-span-2 lg:col-span-1" : "border-border/70"
                  }`}
                >
                  <div>
                    <div className="relative flex aspect-square w-full items-center justify-center overflow-hidden bg-secondary/25 sm:aspect-[3/4]">
                      <img
                        src={produto.imagem || kitImg}
                        alt={produto.nome}
                        loading={index < 3 ? "eager" : "lazy"}
                        fetchPriority={index < 3 ? "high" : "auto"}
                        decoding="async"
                        className="h-full w-full object-cover object-center transition duration-500 group-hover:scale-[1.03]"
                      />
                      {produto.destaque ? (
                        <span className="absolute right-3 top-3 rounded-full bg-magenta px-3 py-1 text-[11px] font-semibold text-white shadow-md">
                          Mais procurado
                        </span>
                      ) : null}
                    </div>

                    <div className="p-4 sm:p-6">
                      <span className="inline-block rounded-full bg-secondary px-3 py-1 text-[11px] font-medium text-magenta">
                        {produto.curvatura}
                      </span>
                      <h4 className="mt-3 font-display text-lg leading-snug sm:text-xl">{produto.nome}</h4>
                      <p className="mt-1 text-xs font-medium text-muted-foreground">{produto.subtitulo}</p>
                      {produto.precoPromocional ? (
                        <div className="mt-3 flex flex-wrap items-baseline gap-2">
                          {produto.preco ? <span className="text-xs text-muted-foreground line-through">{produto.preco}</span> : null}
                          <span className="text-sm font-semibold text-magenta">{produto.precoPromocional}</span>
                        </div>
                      ) : produto.preco ? (
                        <p className="mt-3 text-sm font-semibold text-magenta">{produto.preco}</p>
                      ) : null}
                      <p className="mt-3 line-clamp-4 text-sm leading-relaxed text-muted-foreground sm:line-clamp-none">{produto.descricao}</p>

                      <ul className="mt-4 space-y-1.5 border-t border-border/60 pt-3 text-xs text-foreground/80 sm:text-sm">
                        {produto.beneficios.map((beneficio) => (
                          <li key={beneficio} className="flex items-center gap-2">
                            <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-gold" />
                            <span>{beneficio}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="border-t border-border/60 p-4 pt-4 sm:p-6 sm:pt-4">
                    <button
                      type="button"
                      onClick={() => {
                        if (paginaCompleta) addToCart(produto);
                        else window.location.href = "/produtos";
                      }}
                      className={`inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-full px-4 py-3 text-xs font-bold transition sm:text-sm ${
                        produto.destaque
                          ? "bg-primary text-primary-foreground shadow-soft hover:brightness-105"
                          : "border border-primary/55 text-magenta hover:bg-primary hover:text-primary-foreground"
                      }`}
                    >
                      <ShoppingBag className="h-3.5 w-3.5" />
                      {paginaCompleta ? "Adicionar ao carrinho" : "Ver na loja"}
                    </button>
                  </div>
                </article>
              ))
            ) : (
              <div className="rounded-3xl border border-dashed border-primary/30 bg-card p-8 text-center text-sm text-muted-foreground sm:col-span-2 lg:col-span-3">
                Os produtos serão cadastrados em breve. Chame no WhatsApp para consultar a linha disponível no salão.
              </div>
            )}
          </div>

          {!paginaCompleta ? (
            <div className="mt-10 flex justify-center">
              <BotaoLink href="/produtos">Ver loja completa</BotaoLink>
            </div>
          ) : null}
        </div>
        {paginaCompleta ? (
          <div className="mt-14 overflow-hidden rounded-3xl border border-border/70 bg-card p-6 shadow-card sm:p-10 lg:grid lg:grid-cols-[1fr_1.1fr] lg:items-center lg:gap-12">
            <div className="relative">
              {isLoading || isFetching ? (
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
              <span className="absolute bottom-4 left-4 rounded-xl bg-card/90 px-4 py-2 text-xs font-semibold text-magenta backdrop-blur">
                ✨ Recomendado no Salão
              </span>
            </div>

            <div className="mt-8 space-y-5 lg:mt-0">
              <p className="eyebrow flex items-center gap-2">
                <Sparkles className="h-3.5 w-3.5 text-gold" />
                Prescrição personalizada
              </p>
              <h3 className="text-2xl leading-tight sm:text-3xl">
                Não sabe qual produto é o ideal para o seu cabelo?
              </h3>
              <p className="text-sm leading-relaxed text-muted-foreground sm:text-base">
                Cada cacho possui densidade, porosidade e espessura únicas. No Bem Bonita,
                Francielly orienta você sobre a combinação exata de produtos para o melhor resultado em casa.
              </p>
              <BotaoLink
                href={whatsappLink(`Olá, ${SALAO.nome}! Gostaria de uma orientação sobre os produtos ideais para o meu cabelo.`)}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4"
              >
                <MessageCircle className="h-4 w-4" />
                Pedir recomendação no WhatsApp
              </BotaoLink>
            </div>
          </div>
        ) : null}

      </div>
    </section>
  );
}
