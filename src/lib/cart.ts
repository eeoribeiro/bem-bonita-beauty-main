export type CartItem = {
  id: string;
  quantity: number;
};

export const cartStorageKey = "bem-bonita-cart";
export const cartChangeEvent = "bem-bonita-cart-change";

export function parsePrecoCentavos(preco?: string | null) {
  const cleaned = (preco ?? "")
    .replace(/[^\d,.-]/g, "")
    .replace(/\./g, "")
    .replace(",", ".");
  const value = Number.parseFloat(cleaned);
  if (!Number.isFinite(value) || value <= 0) return 0;
  return Math.round(value * 100);
}

export function getProductPriceText(product: { price_text?: string | null; promotional_price_text?: string | null }) {
  return product.promotional_price_text?.trim() || product.price_text?.trim() || "";
}

export function formatarMoeda(centavos: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(centavos / 100);
}

export function readCart() {
  if (typeof window === "undefined") return [];
  try {
    const savedCart = window.localStorage.getItem(cartStorageKey);
    if (!savedCart) return [];
    const parsed = JSON.parse(savedCart) as CartItem[];
    if (!Array.isArray(parsed)) return [];
    return parsed
      .map((item) => ({
        id: typeof item.id === "string" ? item.id : "",
        quantity: Math.min(20, Math.max(1, Number(item.quantity) || 1)),
      }))
      .filter((item) => item.id);
  } catch {
    return [];
  }
}

export function saveCart(cart: CartItem[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(cartStorageKey, JSON.stringify(cart));
  window.dispatchEvent(new CustomEvent(cartChangeEvent, { detail: cart }));
}

export function quantidadeCarrinho(cart: CartItem[]) {
  return cart.reduce((total, item) => total + item.quantity, 0);
}
