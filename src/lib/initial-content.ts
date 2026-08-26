import tratamento from "@/assets/servico-tratamento.jpg";
import definicao from "@/assets/servico-definicao.jpg";
import mechas from "@/assets/servico-mechas.jpg";
import penteado from "@/assets/servico-penteado.jpg";

export const initialServices = [
  {
    name: "Tratamentos capilares",
    description:
      "Hidratação, nutrição e reconstrução para devolver força, maciez e brilho aos fios.",
    image_url: tratamento,
    sort_order: 0,
  },
  {
    name: "Definição e finalização de cachos",
    description:
      "Técnicas de finalização que respeitam o formato natural do seu cacho e prolongam a definição.",
    image_url: definicao,
    sort_order: 1,
  },
  {
    name: "Mechas e iluminação",
    description:
      "Coloração pensada para cabelos texturizados, com cuidado na saúde do fio e no resultado luminoso.",
    image_url: mechas,
    sort_order: 2,
  },
  {
    name: "Penteados",
    description:
      "Penteados para festas, casamentos e ocasiões especiais, valorizando o volume natural.",
    image_url: penteado,
    sort_order: 3,
  },
].map((service) => ({
  ...service,
  benefits: [] as string[],
  storage_path: null,
  cta_label: "Conversar sobre este serviço",
  published: true,
}));

export const initialPortfolioCategories = [
  { name: "Cachos", slug: "cachos", sort_order: 0, active: true },
  { name: "Penteados", slug: "penteados", sort_order: 1, active: true },
  {
    name: "Conteúdo inicial importado",
    slug: "system-initial-content",
    sort_order: 999,
    active: false,
  },
];

export const initialContentMarker = "system-initial-content";

export const initialPortfolio = [
  {
    title: "Finalização com movimento",
    alt_text: "Cabelos longos com ondas e cachos finalizados no salão Bem Bonita",
    image_url: "/media/resultado-cachos-longos.jpg",
    category: "cachos",
    sort_order: 0,
  },
  {
    title: "Mechas que valorizam os cachos",
    alt_text: "Cabelos cacheados longos com mechas iluminadas",
    image_url: "/media/resultado-mechas-cachos.jpg",
    category: "cachos",
    sort_order: 1,
  },
  {
    title: "Definição e brilho",
    alt_text: "Cachos definidos vistos de perto após finalização",
    image_url: "/media/resultado-definicao.jpg",
    category: "cachos",
    sort_order: 2,
  },
  {
    title: "Comprimento com leveza",
    alt_text: "Cabelos longos e naturalmente cacheados após atendimento",
    image_url: "/media/resultado-cachos-naturais.jpg",
    category: "cachos",
    sort_order: 3,
  },
  {
    title: "Corte e finalização",
    alt_text: "Corte curto cacheado com finalização definida",
    image_url: "/media/resultado-corte-cacheado.jpg",
    category: "cachos",
    sort_order: 4,
  },
  {
    title: "Tranças com detalhes dourados",
    alt_text: "Penteado com tranças laterais e acessórios dourados",
    image_url: "/media/penteado-trancas-douradas.jpg",
    category: "penteados",
    sort_order: 5,
  },
  {
    title: "Tranças criativas e coloridas",
    alt_text: "Penteado com tranças e elásticos coloridos",
    image_url: "/media/penteado-trancas-coloridas.jpg",
    category: "penteados",
    sort_order: 6,
  },
  {
    title: "Tranças laterais personalizadas",
    alt_text: "Penteado lateral com tranças e acessórios rosa",
    image_url: "/media/penteado-trancas-rosa.jpg",
    category: "penteados",
    sort_order: 7,
  },
].map((item) => ({
  ...item,
  description: null,
  storage_path: null,
  published: true,
}));
