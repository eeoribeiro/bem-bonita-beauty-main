import { createFileRoute, Link } from "@tanstack/react-router";
import { LoaderCircle, PackageCheck, Search, ShoppingBag } from "lucide-react";
import { useEffect, useState } from "react";

import { BotaoFlutuanteWhatsApp } from "@/components/site/BotaoFlutuanteWhatsApp";
import { Footer } from "@/components/site/Footer";
import { Header } from "@/components/site/Header";
import { formatarMoeda } from "@/lib/cart";

export const Route = createFileRoute("/pedido")({
  head: () => ({
    meta: [
      { title: "Acompanhar pedido | Bem Bonita" },
      { name: "description", content: "Acompanhe sua compra da Loja Bem Bonita pelo código do pedido e WhatsApp." },
    ],
  }),
  component: PedidoPage,
});

type OrderTrack = {
  reference_id: string;
  customer_name: string;
  customer_phone: string;
  fulfillment_method: string;
  delivery_address?: string | null;
  delivery_neighborhood?: string | null;
  delivery_reference?: string | null;
  status: string;
  total_amount: number;
  created_at: string;
  product_order_items?: Array<{ product_name: string; quantity: number; total_amount: number }>;
};

const statusLabels: Record<string, string> = {
  pending: "Pedido recebido",
  paid: "Pagamento confirmado",
  preparing: "Separando pedido",
  ready: "Pronto para retirada/entrega",
  out_for_delivery: "Saiu para entrega",
  completed: "Concluído",
  cancelled: "Cancelado",
  refunded: "Devolvido/Reembolsado",
  manual_review: "Conferindo pedido",
};

const fulfillmentLabels: Record<string, string> = {
  pickup: "Retirada no salão",
  motoboy: "Entrega por motoboy",
};

function PedidoPage() {
  const [referenceId, setReferenceId] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [order, setOrder] = useState<OrderTrack | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const ref = params.get("ref") ?? "";
    const phoneParam = params.get("phone") ?? "";
    setReferenceId(ref);
    setPhone(phoneParam);
    if (ref && phoneParam) void trackOrder(ref, phoneParam);
  }, []);

  async function trackOrder(ref = referenceId, phoneValue = phone) {
    setLoading(true);
    setMessage("");
    setOrder(null);
    try {
      const response = await fetch("/api/orders/track", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ referenceId: ref, phone: phoneValue }),
      });
      const payload = (await response.json()) as { order?: OrderTrack; error?: string };
      if (!response.ok || !payload.order) throw new Error(payload.error || "Não foi possível localizar o pedido.");
      setOrder(payload.order);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Não foi possível localizar o pedido.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-blush-soft">
      <Header />
      <main className="page-transition px-5 pb-16 pt-28 sm:pt-32 lg:px-8 lg:pb-28 lg:pt-40">
        <section className="mx-auto max-w-5xl">
          <div className="rounded-[2rem] border border-border/70 bg-card p-6 text-center shadow-card sm:p-10">
            <PackageCheck className="mx-auto h-12 w-12 text-magenta" />
            <p className="eyebrow mt-5">Loja Bem Bonita</p>
            <h1 className="mt-2 font-display text-4xl leading-tight sm:text-5xl">Acompanhar pedido</h1>
            <p className="mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base">
              Consulte o status da sua compra com o código do pedido e o WhatsApp informado na compra.
            </p>
          </div>

          <div className="mt-6 grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
            <form
              onSubmit={(event) => {
                event.preventDefault();
                void trackOrder();
              }}
              className="rounded-[2rem] border border-border/70 bg-card p-5 shadow-card sm:p-6"
            >
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gold">Acompanhar pedido</p>
              <h2 className="mt-1 font-display text-2xl">Consulte sua compra</h2>
              <label className="mt-5 block">
                <span className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">Código do pedido</span>
                <input value={referenceId} onChange={(event) => setReferenceId(event.target.value)} placeholder="bem-bonita-..." className="mt-1 h-12 w-full rounded-2xl border border-border bg-background px-4 text-sm outline-none focus:border-primary" />
              </label>
              <label className="mt-4 block">
                <span className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">WhatsApp usado na compra</span>
                <input value={phone} onChange={(event) => setPhone(event.target.value)} placeholder="(31) 99999-9999" className="mt-1 h-12 w-full rounded-2xl border border-border bg-background px-4 text-sm outline-none focus:border-primary" />
              </label>
              <button type="submit" disabled={loading} className="mt-5 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-primary px-5 text-sm font-bold text-primary-foreground shadow-soft disabled:opacity-60">
                {loading ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
                Acompanhar pedido
              </button>
              {message ? <p className="mt-3 rounded-2xl bg-secondary/70 px-4 py-3 text-xs text-muted-foreground">{message}</p> : null}
            </form>

            <div className="rounded-[2rem] border border-border/70 bg-card p-5 shadow-card sm:p-6">
              {order ? (
                <div>
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gold">Status</p>
                      <h2 className="mt-1 font-display text-2xl">{statusLabels[order.status] ?? order.status}</h2>
                    </div>
                    <span className="rounded-full bg-secondary px-3 py-1 text-xs font-bold text-magenta">{formatarMoeda(order.total_amount)}</span>
                  </div>
                  <div className="mt-5 rounded-3xl bg-background/70 p-4 text-sm text-muted-foreground">
                    <p className="font-semibold text-foreground">{order.customer_name}</p>
                    <p className="mt-1">Código: {order.reference_id}</p>
                    <p className="mt-1">{fulfillmentLabels[order.fulfillment_method] ?? "Entrega/retirada"}</p>
                    {order.delivery_address ? <p className="mt-1">Endereço: {order.delivery_address}</p> : null}
                    {order.delivery_neighborhood ? <p className="mt-1">Bairro: {order.delivery_neighborhood}</p> : null}
                  </div>
                  <div className="mt-5 grid gap-2">
                    {(order.product_order_items ?? []).map((item) => (
                      <div key={item.product_name} className="flex items-center justify-between gap-3 rounded-2xl border border-border bg-background/70 p-3 text-sm">
                        <span>{item.quantity}x {item.product_name}</span>
                        <span className="font-bold text-magenta">{formatarMoeda(item.total_amount)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="flex min-h-72 flex-col items-center justify-center rounded-3xl border border-dashed border-primary/30 bg-background/70 p-8 text-center">
                  <PackageCheck className="h-10 w-10 text-magenta" />
                  <h2 className="mt-3 font-display text-2xl">Acompanhe por aqui</h2>
                  <p className="mt-2 text-sm text-muted-foreground">Use o código do pedido e o WhatsApp da compra para ver o andamento.</p>
                </div>
              )}
            </div>
          </div>

          <div className="mt-6 flex flex-wrap justify-center gap-3 text-sm">
            <Link to="/produtos" className="inline-flex items-center gap-2 rounded-full border border-primary/40 px-5 py-3 font-bold text-magenta">
              <ShoppingBag className="h-4 w-4" /> Voltar para loja
            </Link>
          </div>
        </section>
      </main>
      <Footer />
      <BotaoFlutuanteWhatsApp />
    </div>
  );
}
