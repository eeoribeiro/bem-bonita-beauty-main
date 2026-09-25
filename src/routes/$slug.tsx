import { createFileRoute, redirect } from "@tanstack/react-router";

import { ProdutoDetalhePage } from "@/components/site/ProdutoDetalhePage";
import { normalizeText } from "@/lib/product-catalog";

// Rotas estáticas (arquivos em src/routes) têm prioridade sobre /$slug no
// TanStack Router. A lista abaixo é uma proteção extra para URLs inválidas.
const RESERVED_SLUGS = new Set([
  "admin",
  "api",
  "checkout",
  "cursos",
  "feedbacks",
  "francielly",
  "index",
  "pedido",
  "privacidade",
  "produtos",
  "servicos",
  "site-access",
]);

export const Route = createFileRoute("/$slug")({
  head: () => ({
    meta: [
      { title: "Detalhes do produto | Bem Bonita" },
      { name: "description", content: "Veja detalhes, tamanhos e opções do produto Bem Bonita." },
    ],
  }),
  beforeLoad: ({ params }) => {
    if (RESERVED_SLUGS.has(normalizeText(params.slug))) {
      throw redirect({ to: "/produtos", replace: true });
    }
  },
  component: ProdutoSlugPage,
});

function ProdutoSlugPage() {
  const { slug } = Route.useParams();
  return <ProdutoDetalhePage slug={slug} />;
}
