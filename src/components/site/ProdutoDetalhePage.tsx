import { Link, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, CheckCircle2, Minus, Plus, ShoppingBag, Sparkles } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import { BotaoFlutuanteWhatsApp } from "@/components/site/BotaoFlutuanteWhatsApp";
import { Footer } from "@/components/site/Footer";
import { Header } from "@/components/site/Header";
import { cartItemKey, parsePrecoCentavos, readCart, saveCart, type CartItem } from "@/lib/cart";
import {
  fallbackProductImage,
  findProdutoBySlug,
  getActiveOptions,
  getOptionStock,
  getSelectedOption,
  getUnitPriceText,
  mapProductData,
  produtosLinha,
  produtoSlug,
} from "@/lib/product-catalog";
import { usePublicSiteData } from "@/lib/site-data";

export function ProdutoDetalhePage({ slug }: { slug: string }) {
  const navigate = useNavigate();
  const { data, isError, isFetching, isLoading } = usePublicSiteData();
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>({});
  const [quantity, setQuantity] = useState(1);
  const [notice, setNotice] = useState("");
  const [cart, setCart] = useState<CartItem[]>([]);

  useEffect(() => {
    setCart(readCart());
  }, []);

  const products = useMemo(
    () => (data ? mapProductData(data.products) : isError ? produtosLinha : []),
    [data, isError],
  );
  const product = useMemo(() => findProdutoBySlug(products, slug), [products, slug]);
  const selectedOption = product ? getSelectedOption(product, selectedOptions) : null;
  const activeOptions = product ? getActiveOptions(product) : [];
  const displayImage = selectedOption?.image_url || product?.imagem || fallbackProductImage;
  const displayPrice = selectedOption?.price_text || product?.precoPromocional || product?.preco || "";
  const stock = getOptionStock(selectedOption);
  const disabled = stock <= 0 || !parsePrecoCentavos(displayPrice);
  const unitPrice = getUnitPriceText(displayPrice, selectedOption?.size);
  const relatedProducts = product
    ? products.filter((item) => item.id !== product.id && item.categoria && item.categoria === product.categoria).slice(0, 6)
    : [];

  function goCheckout() {
    window.location.href = "/checkout";
  }

  function addToCart(redirect = false) {
    if (!product) return;
    if (!parsePrecoCentavos(displayPrice)) {
      setNotice("Esse produto precisa ter preço cadastrado para vender online.");
      return;
    }
    const optionId = selectedOption?.id;
    const amount = Math.min(Math.max(1, quantity), stock || 1);
    const currentCart = readCart();
    const nextCart = (() => {
      const existing = currentCart.find((item) => cartItemKey(item) === cartItemKey({ id: product.id, optionId: optionId ?? null }));
      if (existing) {
        return currentCart.map((item) =>
          cartItemKey(item) === cartItemKey({ id: product.id, optionId: optionId ?? null })
            ? { ...item, quantity: Math.min(stock || 20, item.quantity + amount) }
            : item,
        );
      }
      return [...currentCart, optionId ? { id: product.id, optionId, quantity: amount } : { id: product.id, quantity: amount }];
    })();
    setCart(nextCart);
    saveCart(nextCart);
    setNotice("Produto adicionado à sacola.");
    if (redirect) goCheckout();
  }

  function buyNow() {
    if (!product) return;
    const amount = Math.min(Math.max(1, quantity), stock || 1);
    const item: CartItem = selectedOption?.id
      ? { id: product.id, optionId: selectedOption.id, quantity: amount }
      : { id: product.id, quantity: amount };
    saveCart([item]);
    goCheckout();
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="page-transition px-5 pt-28 pb-16 lg:pt-40 lg:pb-24">
        <section className="mx-auto max-w-7xl">
          <button
            type="button"
            onClick={() => void navigate({ to: "/produtos" })}
            className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2 text-sm font-semibold text-foreground transition hover:border-primary hover:text-magenta"
          >
            <ArrowLeft className="h-4 w-4" />
            Voltar para a loja
          </button>

          {isLoading || isFetching ? (
            <div className="mt-8 grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
              <div className="aspect-square animate-pulse rounded-[2rem] bg-secondary/70" />
              <div className="space-y-4">
                <div className="h-8 w-2/3 animate-pulse rounded bg-secondary/70" />
                <div className="h-24 animate-pulse rounded-3xl bg-secondary/60" />
                <div className="h-48 animate-pulse rounded-3xl bg-secondary/50" />
              </div>
            </div>
          ) : product ? (
            <div className="mt-8 grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
              <div className="lg:sticky lg:top-28">
                <div className="overflow-hidden rounded-[2rem] border border-border/70 bg-card shadow-soft">
                  <img
                    src={displayImage}
                    alt={selectedOption ? `${product.nome} - ${selectedOption.name}` : product.nome}
                    className="aspect-[4/5] w-full object-cover object-center"
                  />
                </div>
                <div className="mt-4 rounded-[1.8rem] border border-primary/25 bg-primary/10 p-5 shadow-card">
                  <p className="text-xs font-bold uppercase tracking-[0.2em] text-gold">Preço</p>
                  <p className="mt-2 text-3xl font-black text-magenta">{displayPrice || "Consulte"}</p>
                  {unitPrice ? <p className="mt-1 text-sm text-muted-foreground">{unitPrice}</p> : null}
                  {selectedOption?.size ? <p className="mt-1 text-sm text-muted-foreground">Tamanho: {selectedOption.size}</p> : null}
                  <p className={`mt-3 text-sm font-bold ${stock ? "text-emerald-500" : "text-red-400"}`}>
                    {stock ? `${stock} disponível(is)` : "Sem estoque"}
                  </p>
                </div>
              </div>

              <div className="rounded-[2rem] border border-border/70 bg-card p-5 shadow-card sm:p-8">
                <p className="eyebrow">Produto Bem Bonita</p>
                <h1 className="mt-3 font-display text-3xl leading-tight sm:text-5xl">{product.nome}</h1>
                <div className="mt-4 inline-flex max-w-full items-start gap-2 rounded-2xl border border-primary/20 bg-primary/10 px-4 py-3 text-sm font-bold leading-relaxed text-foreground shadow-[0_12px_30px_rgba(224,72,154,0.08)]">
                  <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-gold" />
                  <span>{product.subtitulo}</span>
                </div>
                <p className="mt-5 text-base leading-relaxed text-muted-foreground">{product.descricao}</p>

                {activeOptions.length ? (
                  <div className="mt-8">
                    <p className="text-xs font-bold uppercase tracking-[0.18em] text-foreground">Escolha o produto separado</p>
                    <div className="mt-4 grid gap-3 sm:grid-cols-2">
                      {activeOptions.map((option) => {
                        const checked = selectedOption?.id === option.id;
                        const optionStock = getOptionStock(option);
                        return (
                          <button
                            key={option.id}
                            type="button"
                            disabled={optionStock <= 0}
                            aria-pressed={checked}
                            onClick={() => {
                              setSelectedOptions((current) => ({ ...current, [product.id]: option.id }));
                              setQuantity(1);
                            }}
                            className={`flex items-center gap-3 rounded-2xl border p-3 text-left transition ${
                              optionStock <= 0
                                ? "cursor-not-allowed border-border bg-muted/40 opacity-55"
                                : checked
                                ? "border-primary bg-primary/10 ring-2 ring-primary/20"
                                : "border-border bg-background hover:border-primary/60"
                            }`}
                          >
                            <img
                              src={option.image_url || product.imagem || fallbackProductImage}
                              alt={option.name}
                              className="h-16 w-16 shrink-0 rounded-xl bg-secondary object-cover"
                            />
                            <span className="min-w-0 flex-1">
                              <span className={`block font-bold text-foreground ${optionStock <= 0 ? "line-through" : ""}`}>{option.name}</span>
                              {option.size ? <span className={`mt-0.5 block text-xs text-muted-foreground ${optionStock <= 0 ? "line-through" : ""}`}>{option.size}</span> : null}
                              {option.price_text ? <span className="mt-1 block text-sm font-bold text-magenta">{option.price_text}</span> : null}
                              <span className="mt-0.5 block text-[11px] text-muted-foreground">{optionStock ? `${optionStock} em estoque` : "Sem estoque"}</span>
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ) : null}

                {product.beneficios.length ? (
                  <div className="mt-8">
                    <p className="text-xs font-bold uppercase tracking-[0.18em] text-foreground">Benefícios</p>
                    <ul className="mt-4 grid gap-2 text-sm text-foreground/80">
                      {product.beneficios.map((beneficio) => (
                        <li key={beneficio} className="flex gap-2">
                          <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-gold" />
                          <span>{beneficio}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : null}

                <div className="mt-8">
                  <p className="text-xs font-bold uppercase tracking-[0.18em] text-foreground">Quantidade</p>
                  <div className="mt-3 flex w-fit items-center rounded-full border border-border bg-background p-1">
                    <button type="button" onClick={() => setQuantity((value) => Math.max(1, value - 1))} className="flex h-10 w-10 items-center justify-center rounded-full bg-card" aria-label="Diminuir quantidade">
                      <Minus className="h-4 w-4" />
                    </button>
                    <span className="w-12 text-center text-sm font-bold">{quantity}</span>
                    <button type="button" onClick={() => setQuantity((value) => Math.min(stock || 1, value + 1))} className="flex h-10 w-10 items-center justify-center rounded-full bg-card" aria-label="Aumentar quantidade">
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                {notice ? <p className="mt-5 rounded-2xl bg-secondary px-4 py-3 text-xs font-semibold text-magenta">{notice}</p> : null}

                <div className="mt-8 grid gap-3 sm:grid-cols-2">
                  <button
                    type="button"
                    disabled={disabled}
                    onClick={buyNow}
                    className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-primary px-5 text-sm font-bold text-primary-foreground shadow-soft transition hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    Comprar agora
                  </button>
                  <button
                    type="button"
                    disabled={disabled}
                    onClick={() => addToCart(false)}
                    className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full border border-primary bg-card px-5 text-sm font-bold text-magenta transition hover:bg-primary hover:text-primary-foreground disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <ShoppingBag className="h-4 w-4" />
                    Adicionar ao carrinho
                  </button>
                </div>

                {cart.length ? <p className="mt-4 text-xs text-muted-foreground">Sua sacola já tem {cart.reduce((total, item) => total + item.quantity, 0)} item(ns).</p> : null}
              </div>
            </div>
          ) : (
            <div className="mt-10 rounded-[2rem] border border-dashed border-primary/35 bg-card p-8 text-center shadow-card">
              <p className="font-display text-3xl">Produto não encontrado</p>
              <p className="mt-3 text-sm text-muted-foreground">Volte para a loja e escolha outro produto da linha Bem Bonita.</p>
            </div>
          )}

          {relatedProducts.length ? (
            <div className="mt-12">
              <p className="eyebrow">Da mesma linha</p>
              <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {relatedProducts.map((item) => (
                  <Link
                    key={item.id}
                    to="/$slug"
                    params={{ slug: produtoSlug(item) }}
                    className="rounded-3xl bg-card p-3 shadow-card transition hover:-translate-y-1"
                  >
                    <img src={item.imagem || fallbackProductImage} alt={item.nome} className="aspect-square w-full rounded-2xl object-cover" />
                    <p className="mt-3 font-bold text-foreground">{item.nome}</p>
                    <p className="mt-1 text-sm text-muted-foreground">{item.subtitulo}</p>
                  </Link>
                ))}
              </div>
            </div>
          ) : null}
        </section>
      </main>
      <Footer />
      <BotaoFlutuanteWhatsApp />
    </div>
  );
}
