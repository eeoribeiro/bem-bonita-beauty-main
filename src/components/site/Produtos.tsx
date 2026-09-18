import { CheckCircle2, MessageCircle, Sparkles, ShoppingBag, X } from "lucide-react";
import { useEffect, useState } from "react";

import { BotaoLink } from "./Botao";
import { TituloSecao } from "./TituloSecao";
import { useMobileAutoCarousel } from "@/hooks/use-mobile-auto-carousel";
import { cartItemKey, parsePrecoCentavos, quantidadeCarrinho, readCart, saveCart, type CartItem } from "@/lib/cart";
import { SALAO, whatsappLink } from "@/lib/salao";
import { usePublicSiteData, type ProductOptionData } from "@/lib/site-data";

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
  categoria?: string | null;
  opcoes?: ProductOptionData[] | null;
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
  const [categoriaAtiva, setCategoriaAtiva] = useState("todas");
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>({});
  const [modalProduct, setModalProduct] = useState<ProdutoItem | null>(null);
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
        categoria: product.category,
        opcoes: product.product_options,
        preco: product.price_text,
        precoPromocional: product.promotional_price_text,
        destaque: product.featured,
      }))
    : isError
      ? produtosLinha
      : [];
  const categorias = Array.from(
    new Set(products.map((product) => product.categoria?.trim()).filter((category): category is string => Boolean(category))),
  );
  const produtosFiltrados = paginaCompleta && categoriaAtiva !== "todas"
    ? products.filter((product) => product.categoria?.trim() === categoriaAtiva)
    : products;
  const produtosExibidos = paginaCompleta
    ? produtosFiltrados
    : [...products].sort((a, b) => Number(Boolean(b.destaque)) - Number(Boolean(a.destaque))).slice(0, 3);
  const cartQuantity = quantidadeCarrinho(cart);

  useEffect(() => {
    setCart(readCart());
  }, []);

  useEffect(() => {
    if (!modalProduct) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const closeWithEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setModalProduct(null);
    };
    window.addEventListener("keydown", closeWithEscape);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", closeWithEscape);
    };
  }, [modalProduct]);

  function getActiveOptions(product: ProdutoItem) {
    return (product.opcoes ?? []).filter((option) => option.active !== false && option.name?.trim());
  }

  function getSelectedOption(product: ProdutoItem) {
    const options = getActiveOptions(product);
    if (!options.length) return null;
    const selectedId = selectedOptions[product.id] ?? options[0]?.id;
    return options.find((option) => option.id === selectedId) ?? options[0] ?? null;
  }

  function addToCart(product: ProdutoItem) {
    const selectedOption = getSelectedOption(product);
    const priceText = selectedOption?.price_text || product.precoPromocional || product.preco;
    if (!parsePrecoCentavos(priceText)) {
      setCheckoutMessage("Esse produto precisa ter preço cadastrado para vender online.");
      return;
    }
    const optionId = selectedOption?.id;
    const currentCart = readCart();
    const nextCart = (() => {
      const existing = currentCart.find((item) => cartItemKey(item) === cartItemKey({ id: product.id, optionId }));
      if (existing) {
        return currentCart.map((item) =>
          cartItemKey(item) === cartItemKey({ id: product.id, optionId }) ? { ...item, quantity: Math.min(20, item.quantity + 1) } : item,
        );
      }
      return [...currentCart, { id: product.id, optionId, quantity: 1 }];
    })();
    setCart(nextCart);
    saveCart(nextCart);
    setCheckoutMessage(`${selectedOption ? `${selectedOption.name} — ` : ""}${product.nome} foi adicionado ao carrinho.`);
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
                  ? `${cartQuantity} item(ns) na sacola`
                  : "Escolha seus produtos"
                : "Compra online na loja completa"}
            </span>
          </div>
          {paginaCompleta && categorias.length ? (
            <div className="-mx-5 mb-7 flex gap-2 overflow-x-auto px-5 pb-2 sm:mx-0 sm:flex-wrap sm:overflow-visible sm:px-0 sm:pb-0">
              <button
                type="button"
                onClick={() => setCategoriaAtiva("todas")}
                className={`shrink-0 rounded-full border px-4 py-2 text-sm font-semibold transition ${categoriaAtiva === "todas" ? "border-primary bg-primary text-primary-foreground" : "border-border bg-card text-muted-foreground hover:border-primary hover:text-foreground"}`}
              >
                Todas
              </button>
              {categorias.map((categoria) => (
                <button
                  key={categoria}
                  type="button"
                  onClick={() => setCategoriaAtiva(categoria)}
                  className={`shrink-0 rounded-full border px-4 py-2 text-sm font-semibold transition ${categoriaAtiva === categoria ? "border-primary bg-primary text-primary-foreground" : "border-border bg-card text-muted-foreground hover:border-primary hover:text-foreground"}`}
                >
                  {categoria}
                </button>
              ))}
            </div>
          ) : null}
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
                (() => {
                  const selectedOption = getSelectedOption(produto);
                  const displayImage = selectedOption?.image_url || produto.imagem || kitImg;
                  const displayPrice = selectedOption?.price_text || produto.precoPromocional || produto.preco;
                  return (
                <article
                  key={produto.id}
                  className={`group flex min-w-[72vw] max-w-[18rem] snap-center flex-col justify-between overflow-hidden rounded-3xl border bg-card shadow-card transition-all duration-300 hover:border-primary/50 hover:shadow-soft sm:min-w-0 sm:max-w-none ${
                    produto.destaque ? "border-primary/60 ring-1 ring-primary/30 sm:col-span-2 lg:col-span-1" : "border-border/70"
                  }`}
                >
                  <div>
                    <div className="relative flex aspect-square w-full items-center justify-center overflow-hidden bg-secondary/25 sm:aspect-[3/4]">
                      <img
                        src={displayImage}
                        alt={selectedOption ? `${produto.nome} - ${selectedOption.name}` : produto.nome}
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
                        {produto.categoria || produto.curvatura}
                      </span>
                      <h4 className="mt-3 font-display text-lg leading-snug sm:text-xl">{produto.nome}</h4>
                      <p className="mt-1 text-xs font-medium text-muted-foreground">{produto.subtitulo}</p>
                      {selectedOption ? (
                        displayPrice ? <p className="mt-3 text-sm font-semibold text-magenta">{displayPrice}</p> : null
                      ) : produto.precoPromocional ? (
                        <div className="mt-3 flex flex-wrap items-baseline gap-2">
                          {produto.preco ? <span className="text-xs text-muted-foreground line-through">{produto.preco}</span> : null}
                          <span className="text-sm font-semibold text-magenta">{produto.precoPromocional}</span>
                        </div>
                      ) : displayPrice ? (
                        <p className="mt-3 text-sm font-semibold text-magenta">{displayPrice}</p>
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
                        if (paginaCompleta) setModalProduct(produto);
                        else window.location.href = "/produtos";
                      }}
                      className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-full bg-primary px-4 py-3 text-xs font-bold text-primary-foreground shadow-soft transition hover:brightness-105 sm:text-sm"
                    >
                      <ShoppingBag className="h-3.5 w-3.5" />
                      {paginaCompleta ? "Adicionar ao carrinho" : "Ver na loja"}
                    </button>
                  </div>
                </article>
                  );
                })()
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
      {modalProduct ? (() => {
        const activeOptions = getActiveOptions(modalProduct);
        const selectedOption = getSelectedOption(modalProduct);
        const displayImage = selectedOption?.image_url || modalProduct.imagem || kitImg;
        const displayPrice = selectedOption?.price_text || modalProduct.precoPromocional || modalProduct.preco;
        return (
          <div
            role="dialog"
            aria-modal="true"
            aria-label={`Detalhes de ${modalProduct.nome}`}
            className="fixed inset-0 z-[220] flex items-center justify-center bg-black/45 p-4 backdrop-blur-md"
            onMouseDown={(event) => event.target === event.currentTarget && setModalProduct(null)}
          >
            <div className="max-h-[92vh] w-full max-w-5xl overflow-y-auto rounded-[2rem] border border-border/70 bg-card shadow-2xl">
              <div className="sticky top-0 z-10 flex items-center justify-between gap-4 border-b border-border bg-card/90 p-4 backdrop-blur sm:p-5">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.22em] text-magenta">Produto Bem Bonita</p>
                  <h2 className="mt-1 font-display text-2xl leading-tight sm:text-3xl">{modalProduct.nome}</h2>
                </div>
                <button
                  type="button"
                  onClick={() => setModalProduct(null)}
                  className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-border bg-background text-foreground transition hover:border-primary hover:text-magenta"
                  aria-label="Fechar detalhes do produto"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="grid gap-6 p-4 sm:p-6 lg:grid-cols-[0.9fr_1.1fr] lg:p-8">
                <div className="space-y-4">
                  <div className="overflow-hidden rounded-[1.6rem] bg-secondary/30 shadow-card">
                    <img
                      src={displayImage}
                      alt={selectedOption ? `${modalProduct.nome} - ${selectedOption.name}` : modalProduct.nome}
                      className="aspect-[4/5] w-full object-cover object-center"
                    />
                  </div>
                  <div className="rounded-3xl bg-secondary/60 p-4">
                    <p className="text-xs font-bold uppercase tracking-[0.18em] text-gold">Preço</p>
                    <p className="mt-1 text-2xl font-bold text-magenta">{displayPrice || "Consulte"}</p>
                    {selectedOption?.size ? (
                      <p className="mt-1 text-sm text-muted-foreground">Tamanho: {selectedOption.size}</p>
                    ) : null}
                  </div>
                </div>

                <div className="space-y-5">
                  <div>
                    <span className="inline-flex rounded-full bg-secondary px-3 py-1 text-[11px] font-semibold text-magenta">
                      {modalProduct.categoria || modalProduct.curvatura}
                    </span>
                    {modalProduct.subtitulo ? <p className="mt-3 text-sm font-semibold text-foreground">{modalProduct.subtitulo}</p> : null}
                    <p className="mt-3 text-sm leading-relaxed text-muted-foreground sm:text-base">{modalProduct.descricao}</p>
                  </div>

                  {activeOptions.length ? (
                    <div>
                      <p className="text-xs font-bold uppercase tracking-[0.18em] text-foreground">Escolha o produto separado</p>
                      <div className="mt-3 grid gap-3 sm:grid-cols-2">
                        {activeOptions.map((option) => {
                          const checked = selectedOption?.id === option.id;
                          return (
                            <button
                              key={option.id}
                              type="button"
                              onClick={() => setSelectedOptions((current) => ({ ...current, [modalProduct.id]: option.id }))}
                              className={`flex items-center gap-3 rounded-2xl border p-3 text-left transition ${
                                checked
                                  ? "border-primary bg-primary/10 ring-2 ring-primary/20"
                                  : "border-border bg-background hover:border-primary/60"
                              }`}
                            >
                              <img
                                src={option.image_url || modalProduct.imagem || kitImg}
                                alt={option.name}
                                className="h-16 w-16 shrink-0 rounded-xl bg-secondary object-cover"
                              />
                              <span className="min-w-0 flex-1">
                                <span className="block font-bold text-foreground">{option.name}</span>
                                {option.size ? <span className="mt-0.5 block text-xs text-muted-foreground">{option.size}</span> : null}
                                {option.price_text ? <span className="mt-1 block text-sm font-bold text-magenta">{option.price_text}</span> : null}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ) : null}

                  {modalProduct.beneficios.length ? (
                    <div>
                      <p className="text-xs font-bold uppercase tracking-[0.18em] text-foreground">Benefícios</p>
                      <ul className="mt-3 grid gap-2 text-sm text-foreground/80">
                        {modalProduct.beneficios.map((beneficio) => (
                          <li key={beneficio} className="flex gap-2">
                            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-gold" />
                            <span>{beneficio}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ) : null}

                  <button
                    type="button"
                    onClick={() => {
                      addToCart(modalProduct);
                      setModalProduct(null);
                    }}
                    className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-primary px-5 text-sm font-bold text-primary-foreground shadow-soft transition hover:brightness-105"
                  >
                    <ShoppingBag className="h-4 w-4" />
                    Adicionar ao carrinho
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
      })() : null}
    </section>
  );
}
