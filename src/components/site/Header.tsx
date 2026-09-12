import { useEffect, useMemo, useState } from "react";
import { LoaderCircle, Menu, MessageCircle, Minus, Moon, Plus, ShoppingBag, Sun, Trash2, X } from "lucide-react";

import { BotaoLink } from "./Botao";
import { Logo } from "./Logo";
import { cartChangeEvent, formatarMoeda, parsePrecoCentavos, quantidadeCarrinho, readCart, saveCart, type CartItem } from "@/lib/cart";
import { contatoLink, SALAO } from "@/lib/salao";
import { usePublicSiteData, type ProductData } from "@/lib/site-data";
import { useTheme } from "@/hooks/use-theme";

const NAV_ITEMS = [
  { label: "Início", href: "/#inicio" },
  { label: "Francielly", href: "/francielly" },
  { label: "Serviços", href: "/servicos" },
  { label: "Galeria", href: "/#resultados" },
  { label: "Loja", href: "/produtos" },
  { label: "Contato", href: "/#localizacao" },
] as const;

function CartButton() {
  const { data } = usePublicSiteData();
  const [cart, setCart] = useState<CartItem[]>([]);
  const [open, setOpen] = useState(false);
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [message, setMessage] = useState("");
  const products = data?.products ?? [];
  const productsById = useMemo(() => new Map(products.map((product) => [product.id, product])), [products]);
  const cartProducts = cart
    .map((item) => {
      const product = productsById.get(item.id);
      if (!product) return null;
      const unitAmount = parsePrecoCentavos(product.price_text);
      return {
        ...item,
        product,
        unitAmount,
        total: unitAmount * item.quantity,
      };
    })
    .filter((item): item is CartItem & { product: ProductData; unitAmount: number; total: number } => Boolean(item));
  const cartTotal = cartProducts.reduce((total, item) => total + item.total, 0);
  const cartQuantity = quantidadeCarrinho(cart);

  useEffect(() => {
    setCart(readCart());

    const syncCart = () => setCart(readCart());
    const openCart = () => {
      setCart(readCart());
      setOpen(true);
    };

    window.addEventListener("storage", syncCart);
    window.addEventListener(cartChangeEvent, syncCart);
    window.addEventListener("bem-bonita-cart-open", openCart);
    return () => {
      window.removeEventListener("storage", syncCart);
      window.removeEventListener(cartChangeEvent, syncCart);
      window.removeEventListener("bem-bonita-cart-open", openCart);
    };
  }, []);

  useEffect(() => {
    if (!open) return;
    const closeWithEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", closeWithEscape);
    return () => window.removeEventListener("keydown", closeWithEscape);
  }, [open]);

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

    setCheckoutLoading(true);
    setMessage("");
    try {
      const response = await fetch("/api/pagbank/checkout", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          items: cartProducts.map((item) => ({ id: item.id, quantity: item.quantity })),
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
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-border/60 bg-card/55 text-foreground backdrop-blur-md transition-colors hover:border-primary hover:text-magenta sm:h-11 sm:w-11 lg:h-9 lg:w-9"
        aria-label={`Abrir carrinho${cartQuantity ? ` com ${cartQuantity} item(ns)` : ""}`}
      >
        <ShoppingBag className="h-4 w-4" />
        {cartQuantity ? (
          <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-bold leading-none text-primary-foreground shadow-soft">
            {cartQuantity}
          </span>
        ) : null}
      </button>

      {open ? (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Carrinho de compras"
          onMouseDown={(event) => event.target === event.currentTarget && setOpen(false)}
          className="pointer-events-auto fixed inset-0 z-[90] flex justify-end bg-black/45 p-3 backdrop-blur-sm sm:p-5"
        >
          <aside className="flex h-full w-full max-w-md flex-col overflow-hidden rounded-[2rem] border border-border/70 bg-background shadow-2xl">
            <div className="flex items-start justify-between gap-4 border-b border-border p-5">
              <div>
                <p className="eyebrow">Carrinho online</p>
                <h2 className="mt-1 font-display text-2xl">Sua compra Bem Bonita</h2>
                <p className="mt-1 text-xs text-muted-foreground">Finalize pelo PagBank com Pix ou cartão.</p>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-border bg-card text-foreground"
                aria-label="Fechar carrinho"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="flex-1 space-y-3 overflow-y-auto p-5">
              {cartProducts.length ? (
                cartProducts.map((item) => (
                  <div key={item.id} className="rounded-2xl border border-border bg-card p-3">
                    <div className="flex gap-3">
                      <img
                        src={item.product.image_url ?? ""}
                        alt={item.product.name}
                        className="h-16 w-16 shrink-0 rounded-xl bg-secondary object-cover"
                      />
                      <div className="min-w-0 flex-1">
                        <p className="line-clamp-2 text-sm font-semibold">{item.product.name}</p>
                        <p className="mt-1 text-xs text-muted-foreground">{formatarMoeda(item.unitAmount)} cada</p>
                      </div>
                    </div>
                    <div className="mt-3 flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => updateCartQuantity(item.id, item.quantity - 1)}
                          className="flex h-9 w-9 items-center justify-center rounded-full border border-border bg-background"
                          aria-label={`Diminuir ${item.product.name}`}
                        >
                          <Minus className="h-3.5 w-3.5" />
                        </button>
                        <span className="w-6 text-center text-sm font-bold">{item.quantity}</span>
                        <button
                          type="button"
                          onClick={() => updateCartQuantity(item.id, item.quantity + 1)}
                          className="flex h-9 w-9 items-center justify-center rounded-full border border-border bg-background"
                          aria-label={`Aumentar ${item.product.name}`}
                        >
                          <Plus className="h-3.5 w-3.5" />
                        </button>
                      </div>
                      <button
                        type="button"
                        onClick={() => updateCartQuantity(item.id, 0)}
                        className="flex h-9 w-9 items-center justify-center rounded-full bg-red-500/10 text-red-500"
                        aria-label={`Remover ${item.product.name}`}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="rounded-2xl border border-dashed border-primary/30 bg-card p-5 text-center text-sm text-muted-foreground">
                  Seu carrinho está vazio. Vá até a Loja e adicione os produtos.
                </div>
              )}
            </div>

            <div className="border-t border-border p-5">
              <div className="mb-4 flex items-center justify-between text-sm font-bold">
                <span>Total</span>
                <span className="text-magenta">{formatarMoeda(cartTotal)}</span>
              </div>
              <button
                type="button"
                onClick={() => void startPagBankCheckout()}
                disabled={checkoutLoading || !cartProducts.length}
                className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-primary px-5 text-sm font-bold text-primary-foreground shadow-soft transition hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {checkoutLoading ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <ShoppingBag className="h-4 w-4" />}
                Pagar online pelo PagBank
              </button>
              {message ? (
                <p className="mt-3 rounded-2xl bg-secondary/50 px-4 py-3 text-xs leading-relaxed text-muted-foreground">
                  {message}
                </p>
              ) : null}
            </div>
          </aside>
        </div>
      ) : null}
    </>
  );
}

export function Header() {
  const [aberto, setAberto] = useState(false);
  const [rolou, setRolou] = useState(false);
  const { toggleTheme, isLight } = useTheme();

  useEffect(() => {
    const onScroll = () => setRolou(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = aberto ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [aberto]);

  useEffect(() => {
    if (!aberto) return;
    const fecharComEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setAberto(false);
    };
    window.addEventListener("keydown", fecharComEscape);
    return () => window.removeEventListener("keydown", fecharComEscape);
  }, [aberto]);

  const agendar = contatoLink(`Olá, ${SALAO.nome}! Gostaria de agendar um horário.`);

  return (
    <header className="pointer-events-none fixed inset-x-0 top-0 z-50 px-2.5 pt-2.5 sm:px-5 sm:pt-4">
      <div
        className={`pointer-events-auto relative mx-auto grid w-full max-w-[60rem] origin-top grid-cols-[minmax(0,1fr)_auto] items-center gap-2 rounded-[1.6rem] border border-border/45 bg-background/82 px-3 shadow-[0_12px_40px_-20px_rgba(0,0,0,0.55)] backdrop-blur-xl transition-[transform,padding,background-color,box-shadow] duration-300 ease-out sm:gap-3 sm:rounded-full sm:px-5 ${
          rolou
            ? "scale-[0.96] bg-background/88 py-2 shadow-[0_16px_44px_-18px_rgba(0,0,0,0.68)] sm:scale-[0.9]"
            : "scale-100 py-2.5 sm:py-3"
        }`}
      >
        <a href="/" className="min-w-0" aria-label="Bem Bonita — início">
          <Logo />
        </a>

        <div className="flex items-center gap-2 sm:gap-3">
          <nav className="hidden items-center gap-3 lg:flex" aria-label="Menu principal">
            {NAV_ITEMS.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="whitespace-nowrap text-[13px] font-semibold text-foreground/78 transition-colors hover:text-magenta"
              >
                {item.label}
              </a>
            ))}
            <button
              type="button"
              onClick={toggleTheme}
              className="flex h-9 w-9 items-center justify-center rounded-full border border-border/70 bg-card text-foreground/80 transition-colors hover:border-primary hover:text-magenta"
              aria-label={isLight ? "Ativar modo escuro" : "Ativar modo claro"}
              title={isLight ? "Ativar modo escuro" : "Ativar modo claro"}
            >
              {isLight ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
            </button>
            <BotaoLink
              href={agendar}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2.5 text-xs"
            >
              Solicitar avaliação
            </BotaoLink>
          </nav>

          <CartButton />

          <button
            type="button"
            onClick={toggleTheme}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-border/60 bg-card/55 text-foreground backdrop-blur-md sm:h-11 sm:w-11 lg:hidden"
            aria-label={isLight ? "Ativar modo escuro" : "Ativar modo claro"}
          >
            {isLight ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
          </button>

          <button
            type="button"
            onClick={() => setAberto((v) => !v)}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-border/60 bg-card/55 text-foreground backdrop-blur-md sm:h-11 sm:w-11 lg:hidden"
            aria-expanded={aberto}
            aria-controls="menu-mobile"
            aria-label={aberto ? "Fechar menu" : "Abrir menu"}
          >
            {aberto ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        {aberto ? (
          <div
            id="menu-mobile"
            className="absolute left-0 right-0 top-[calc(100%+0.65rem)] max-h-[calc(100vh-6rem)] overflow-y-auto rounded-[1.75rem] border border-border/50 bg-background/95 p-3 shadow-2xl backdrop-blur-2xl lg:hidden"
          >
            <nav className="flex flex-col" aria-label="Menu mobile">
              {NAV_ITEMS.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  onClick={() => setAberto(false)}
                  className="rounded-2xl px-4 py-3.5 text-base font-medium text-foreground/85 transition-colors hover:bg-secondary/70 hover:text-magenta"
                >
                  {item.label}
                </a>
              ))}
            </nav>
            <BotaoLink
              href={agendar}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 w-full"
              onClick={() => setAberto(false)}
            >
              <MessageCircle className="h-4 w-4" />
              Solicitar avaliação
            </BotaoLink>
          </div>
        ) : null}
      </div>
    </header>
  );
}
