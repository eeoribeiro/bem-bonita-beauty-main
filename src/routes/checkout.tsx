import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, LoaderCircle, Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import { BotaoLink } from "@/components/site/Botao";
import { BotaoFlutuanteWhatsApp } from "@/components/site/BotaoFlutuanteWhatsApp";
import { Footer } from "@/components/site/Footer";
import { Header } from "@/components/site/Header";
import { cartChangeEvent, formatarMoeda, parsePrecoCentavos, quantidadeCarrinho, readCart, saveCart, type CartItem } from "@/lib/cart";
import { usePublicSiteData, type ProductData } from "@/lib/site-data";

export const Route = createFileRoute("/checkout")({
  head: () => ({
    meta: [
      { title: "Checkout | Loja Bem Bonita" },
      { name: "description", content: "Finalize sua compra dos produtos Bem Bonita com retirada no salão ou entrega combinada." },
    ],
  }),
  component: CheckoutPage,
});

function CheckoutPage() {
  const { data, isLoading, isFetching } = usePublicSiteData();
  const [cart, setCart] = useState<CartItem[]>([]);
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [fulfillmentMethod, setFulfillmentMethod] = useState<"pickup" | "motoboy" | "shipping" | "combine">("pickup");
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [deliveryNeighborhood, setDeliveryNeighborhood] = useState("");
  const [deliveryReference, setDeliveryReference] = useState("");

  const products = data?.products ?? [];
  const productsById = useMemo(() => new Map(products.map((product) => [product.id, product])), [products]);
  const cartProducts = cart
    .map((item) => {
      const product = productsById.get(item.id);
      if (!product) return null;
      const unitAmount = parsePrecoCentavos(product.price_text);
      return { ...item, product, unitAmount, total: unitAmount * item.quantity };
    })
    .filter((item): item is CartItem & { product: ProductData; unitAmount: number; total: number } => Boolean(item));
  const cartTotal = cartProducts.reduce((total, item) => total + item.total, 0);
  const cartQuantity = quantidadeCarrinho(cart);
  const needsAddress = fulfillmentMethod === "motoboy" || fulfillmentMethod === "shipping";

  useEffect(() => {
    setCart(readCart());
    const syncCart = () => setCart(readCart());
    window.addEventListener("storage", syncCart);
    window.addEventListener(cartChangeEvent, syncCart);
    return () => {
      window.removeEventListener("storage", syncCart);
      window.removeEventListener(cartChangeEvent, syncCart);
    };
  }, []);

  function updateCartQuantity(id: string, quantity: number) {
    const next =
      quantity <= 0
        ? cart.filter((item) => item.id !== id)
        : cart.map((item) => (item.id === id ? { ...item, quantity: Math.min(20, quantity) } : item));
    setCart(next);
    saveCart(next);
  }

  async function startPagBankCheckout() {
    if (!cartProducts.length) {
      setMessage("Adicione pelo menos um produto ao carrinho.");
      return;
    }
    if (cartProducts.some((item) => !item.unitAmount)) {
      setMessage("Todos os produtos do carrinho precisam ter preço cadastrado.");
      return;
    }
    if (customerName.trim().length < 2 || customerPhone.trim().length < 8) {
      setMessage("Preencha nome e WhatsApp para o pedido aparecer no admin.");
      return;
    }
    if (needsAddress && deliveryAddress.trim().length < 8) {
      setMessage("Preencha o endereço completo para receber em casa.");
      return;
    }

    setCheckoutLoading(true);
    setMessage("");
    try {
      const response = await fetch("/api/pagbank/checkout", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          items: cartProducts.map((item) => ({ id: item.id, quantity: item.quantity })),
          customer: {
            name: customerName,
            phone: customerPhone,
            email: customerEmail,
            fulfillmentMethod,
            deliveryAddress,
            deliveryNeighborhood,
            deliveryReference,
          },
        }),
      });
      const payload = (await response.json()) as { paymentUrl?: string; error?: string };
      if (!response.ok || !payload.paymentUrl) {
        throw new Error(payload.error || "Não foi possível iniciar o pagamento.");
      }
      window.location.href = payload.paymentUrl;
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Não foi possível iniciar o pagamento.");
    } finally {
      setCheckoutLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-blush-soft">
      <Header />
      <main className="page-transition px-5 pb-16 pt-28 sm:pt-32 lg:px-8 lg:pb-28 lg:pt-40">
        <section className="mx-auto max-w-7xl">
          <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="eyebrow">Checkout Bem Bonita</p>
              <h1 className="mt-2 font-display text-4xl leading-tight sm:text-5xl">Finalize sua compra</h1>
              <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base">
                Confira os produtos, informe seus dados e escolha se prefere retirar no salão ou receber em casa.
              </p>
            </div>
            <BotaoLink href="/produtos" variante="outline" className="w-fit">
              <ArrowLeft className="h-4 w-4" />
              Voltar para loja
            </BotaoLink>
          </div>

          <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_26rem] lg:items-start">
            <div className="rounded-[2rem] border border-border/70 bg-card p-4 shadow-card sm:p-6">
              <div className="mb-5 flex items-center justify-between gap-3">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gold">Seu carrinho</p>
                  <h2 className="mt-1 font-display text-2xl">Produtos escolhidos</h2>
                </div>
                <span className="rounded-full bg-secondary px-3 py-1 text-xs font-bold text-magenta">
                  {cartQuantity} item(ns)
                </span>
              </div>

              {isLoading || isFetching ? (
                <div className="grid gap-3">
                  {Array.from({ length: 2 }).map((_, index) => (
                    <div key={index} className="h-28 animate-pulse rounded-2xl bg-secondary/70" />
                  ))}
                </div>
              ) : cartProducts.length ? (
                <div className="grid gap-3">
                  {cartProducts.map((item) => (
                    <article key={item.id} className="rounded-2xl border border-border bg-background/70 p-3 sm:p-4">
                      <div className="flex gap-3 sm:gap-4">
                        <img
                          src={item.product.image_url ?? ""}
                          alt={item.product.name}
                          className="h-20 w-20 shrink-0 rounded-2xl bg-secondary object-cover sm:h-24 sm:w-24"
                        />
                        <div className="min-w-0 flex-1">
                          <h3 className="line-clamp-2 text-sm font-bold sm:text-base">{item.product.name}</h3>
                          <p className="mt-1 text-xs text-muted-foreground">{formatarMoeda(item.unitAmount)} cada</p>
                          <p className="mt-2 text-sm font-bold text-magenta">{formatarMoeda(item.total)}</p>
                        </div>
                      </div>
                      <div className="mt-4 flex items-center justify-between gap-3">
                        <div className="flex items-center gap-2">
                          <button type="button" onClick={() => updateCartQuantity(item.id, item.quantity - 1)} className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-card" aria-label={`Diminuir ${item.product.name}`}>
                            <Minus className="h-4 w-4" />
                          </button>
                          <span className="w-8 text-center text-sm font-bold">{item.quantity}</span>
                          <button type="button" onClick={() => updateCartQuantity(item.id, item.quantity + 1)} className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-card" aria-label={`Aumentar ${item.product.name}`}>
                            <Plus className="h-4 w-4" />
                          </button>
                        </div>
                        <button type="button" onClick={() => updateCartQuantity(item.id, 0)} className="inline-flex h-10 items-center justify-center gap-2 rounded-full bg-red-500/10 px-4 text-xs font-bold text-red-500">
                          <Trash2 className="h-4 w-4" />
                          Remover
                        </button>
                      </div>
                    </article>
                  ))}
                </div>
              ) : (
                <div className="rounded-3xl border border-dashed border-primary/30 bg-background/70 p-8 text-center">
                  <ShoppingBag className="mx-auto h-8 w-8 text-magenta" />
                  <h2 className="mt-3 font-display text-2xl">Seu carrinho está vazio</h2>
                  <p className="mt-2 text-sm text-muted-foreground">Volte para a loja e adicione os produtos da linha Bem Bonita.</p>
                  <BotaoLink href="/produtos" className="mt-5">
                    Escolher produtos
                  </BotaoLink>
                </div>
              )}
            </div>

            <aside className="rounded-[2rem] border border-border/70 bg-card p-4 shadow-card sm:p-6 lg:sticky lg:top-28">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gold">Dados do pedido</p>
              <h2 className="mt-1 font-display text-2xl">Entrega ou retirada</h2>

              <div className="mt-5 grid gap-4">
                <label className="block">
                  <span className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">Nome para o pedido</span>
                  <input value={customerName} onChange={(event) => setCustomerName(event.target.value)} placeholder="Ex.: Maria Silva" className="mt-1 h-12 w-full rounded-2xl border border-border bg-background px-4 text-sm outline-none transition focus:border-primary" />
                </label>
                <label className="block">
                  <span className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">WhatsApp</span>
                  <input value={customerPhone} onChange={(event) => setCustomerPhone(event.target.value)} placeholder="Ex.: (31) 99999-9999" className="mt-1 h-12 w-full rounded-2xl border border-border bg-background px-4 text-sm outline-none transition focus:border-primary" />
                </label>
                <label className="block">
                  <span className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">E-mail opcional</span>
                  <input type="email" value={customerEmail} onChange={(event) => setCustomerEmail(event.target.value)} placeholder="cliente@email.com" className="mt-1 h-12 w-full rounded-2xl border border-border bg-background px-4 text-sm outline-none transition focus:border-primary" />
                </label>

                <div>
                  <span className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">Como quer receber?</span>
                  <div className="mt-2 grid gap-2">
                    {[
                      ["pickup", "Retirar no salão"],
                      ["motoboy", "Receber em casa por motoboy"],
                      ["shipping", "Entrega combinada"],
                      ["combine", "Combinar pelo WhatsApp"],
                    ].map(([value, label]) => (
                      <label key={value} className={`flex cursor-pointer items-center gap-3 rounded-2xl border px-4 py-3 text-sm transition ${fulfillmentMethod === value ? "border-primary bg-primary/10 text-foreground" : "border-border bg-background text-muted-foreground"}`}>
                        <input type="radio" name="fulfillment" value={value} checked={fulfillmentMethod === value} onChange={() => setFulfillmentMethod(value as typeof fulfillmentMethod)} />
                        {label}
                      </label>
                    ))}
                  </div>
                </div>

                {needsAddress ? (
                  <div className="grid gap-3 rounded-3xl border border-primary/20 bg-background/70 p-4">
                    <label className="block">
                      <span className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">Endereço completo</span>
                      <input value={deliveryAddress} onChange={(event) => setDeliveryAddress(event.target.value)} placeholder="Rua, número, complemento" className="mt-1 h-12 w-full rounded-2xl border border-border bg-card px-4 text-sm outline-none transition focus:border-primary" />
                    </label>
                    <label className="block">
                      <span className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">Bairro</span>
                      <input value={deliveryNeighborhood} onChange={(event) => setDeliveryNeighborhood(event.target.value)} placeholder="Ex.: Centro" className="mt-1 h-12 w-full rounded-2xl border border-border bg-card px-4 text-sm outline-none transition focus:border-primary" />
                    </label>
                    <label className="block">
                      <span className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">Referência</span>
                      <input value={deliveryReference} onChange={(event) => setDeliveryReference(event.target.value)} placeholder="Ex.: perto da praça, portão rosa..." className="mt-1 h-12 w-full rounded-2xl border border-border bg-card px-4 text-sm outline-none transition focus:border-primary" />
                    </label>
                    <p className="text-xs leading-relaxed text-muted-foreground">A taxa de entrega pode ser confirmada pelo WhatsApp antes do envio.</p>
                  </div>
                ) : null}

                <div className="rounded-3xl bg-background/70 p-4">
                  <div className="flex items-center justify-between text-sm font-bold">
                    <span>Total</span>
                    <span className="text-lg text-magenta">{formatarMoeda(cartTotal)}</span>
                  </div>
                  <button type="button" onClick={() => void startPagBankCheckout()} disabled={checkoutLoading || !cartProducts.length} className="mt-4 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-primary px-5 text-sm font-bold text-primary-foreground shadow-soft transition hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-60">
                    {checkoutLoading ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <ShoppingBag className="h-4 w-4" />}
                    Pagar online pelo PagBank
                  </button>
                  {message ? <p className="mt-3 rounded-2xl bg-secondary/70 px-4 py-3 text-xs leading-relaxed text-muted-foreground">{message}</p> : null}
                </div>
              </div>
            </aside>
          </div>

          <p className="mt-6 text-center text-xs text-muted-foreground">
            Ao finalizar, você será direcionada para o ambiente seguro do PagBank.
          </p>
          <div className="mt-4 text-center text-xs text-muted-foreground">
            <Link to="/produtos" className="font-semibold text-magenta hover:underline">
              Continuar comprando
            </Link>
          </div>
        </section>
      </main>
      <Footer />
      <BotaoFlutuanteWhatsApp />
    </div>
  );
}
