import { createFileRoute } from "@tanstack/react-router";

import { ProdutoDetalhePage } from "@/components/site/ProdutoDetalhePage";

// Mantida por compatibilidade com links antigos (/produtos/<id>): renderiza
// a mesma página do produto, que resolve também pelo id do produto.
export const Route = createFileRoute("/produtos/$produtoId")({
  head: () => ({
    meta: [
      { title: "Detalhes do produto | Bem Bonita" },
      { name: "description", content: "Veja detalhes, tamanhos e opções do produto Bem Bonita." },
    ],
  }),
  component: ProdutoLegacyPage,
});

function ProdutoLegacyPage() {
  const { produtoId } = Route.useParams();
  return <ProdutoDetalhePage slug={produtoId} />;
}
