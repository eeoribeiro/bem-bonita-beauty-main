import tratamento from "@/assets/servico-tratamento.jpg";
import definicao from "@/assets/servico-definicao.jpg";
import mechas from "@/assets/servico-mechas.jpg";
import penteado from "@/assets/servico-penteado.jpg";
import corte from "@/assets/servico-corte.jpg";
import cronograma from "@/assets/servico-cronograma.jpg";
import consultoria from "@/assets/servico-consultoria.jpg";

export const initialServices = [
  {
    name: "Corte especializado em cachos",
    description:
      "Corte a seco, mecha a mecha, desenhado de acordo com a curvatura, fator encolhimento e volume dos seus fios.",
    image_url: corte,
    sort_order: 1,
  },
  {
    name: "Tratamentos capilares & Terapia",
    description:
      "Hidratação profunda, nutrição lipídica e reconstrução com aminoácidos para devolver a força e elasticidade aos cachos.",
    image_url: tratamento,
    sort_order: 2,
  },
  {
    name: "Definição e finalização de cachos",
    description:
      "Técnicas de fitagem estruturada e finalizações exclusivas que prolongam o day after e realçam a definição natural.",
    image_url: definicao,
    sort_order: 3,
  },
  {
    name: "Mechas e iluminação segura",
    description:
      "Clareamento saudável para cabelos crespos e cacheados, preservando a integridade da fibra e a curvatura dos cachos.",
    image_url: mechas,
    sort_order: 4,
  },
  {
    name: "Cronograma capilar personalizado",
    description:
      "Plano de tratamento contínuo com diagnósticos periódicos, indicado para transição capilar e recuperação pós-química.",
    image_url: cronograma,
    sort_order: 5,
  },
  {
    name: "Penteados e produções",
    description:
      "Penteados sofisticados para festas, noivas, formaturas e eventos sociais valorizando o volume e textura natural.",
    image_url: penteado,
    sort_order: 6,
  },
  {
    name: "Consultoria e avaliação capilar",
    description:
      "Orientação personalizada sobre curvatura, porosidade, rotina de lavagem e manutenção Home Care.",
    image_url: consultoria,
    sort_order: 7,
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
    sort_order: 1,
  },
  {
    title: "Mechas que valorizam os cachos",
    alt_text: "Cabelos cacheados longos com mechas iluminadas",
    image_url: "/media/resultado-mechas-cachos.jpg",
    category: "cachos",
    sort_order: 2,
  },
  {
    title: "Definição e brilho",
    alt_text: "Cachos definidos vistos de perto após finalização",
    image_url: "/media/resultado-definicao.jpg",
    category: "cachos",
    sort_order: 3,
  },
  {
    title: "Comprimento com leveza",
    alt_text: "Cabelos longos e naturalmente cacheados após atendimento",
    image_url: "/media/resultado-cachos-naturais.jpg",
    category: "cachos",
    sort_order: 4,
  },
  {
    title: "Corte e finalização",
    alt_text: "Corte curto cacheado com finalização definida",
    image_url: "/media/resultado-corte-cacheado.jpg",
    category: "cachos",
    sort_order: 5,
  },
  {
    title: "Tranças com detalhes dourados",
    alt_text: "Penteado com tranças laterais e acessórios dourados",
    image_url: "/media/penteado-trancas-douradas.jpg",
    category: "penteados",
    sort_order: 6,
  },
  {
    title: "Tranças criativas e coloridas",
    alt_text: "Penteado com tranças e toque de cor",
    image_url: "/media/penteado-trancas-coloridas.jpg",
    category: "penteados",
    sort_order: 7,
  },
  {
    title: "Coque elegante com tranças",
    alt_text: "Coque alto estruturado com tranças para festa",
    image_url: "/media/penteado-coque-trancas.jpg",
    category: "penteados",
    sort_order: 8,
  },
].map((item) => ({
  ...item,
  description: null,
  storage_path: null,
  category_id: null,
  published: true,
}));

export const initialProfessionals = [
  {
    name: "Francielly Soares",
    role: "Fundadora & Especialista em Cachos",
    bio: "Idealizadora do salão Bem Bonita, especialista em corte a seco, diagnóstico capilar e transição para curvaturas naturais.",
    image_url: "/media/sobre-francielly.jpg",
    storage_path: null,
    whatsapp: "5531996792131",
    instagram: "@salaobembonita_cielly",
    sort_order: 1,
    active: true,
  },
  {
    name: "Especialista em Mechas & Cor",
    role: "Colorista & Terapeuta Capilar",
    bio: "Focada em técnicas de iluminação segura, mechas em cabelos crespos e cacheados e protocolos de proteção da fibra capilar.",
    image_url: "/media/resultado-mechas.jpg",
    storage_path: null,
    whatsapp: "5531996792131",
    instagram: "@salaobembonita_cielly",
    sort_order: 2,
    active: true,
  },
  {
    name: "Especialista em Tratamentos & Definição",
    role: "Terapeuta Capilar & Finalização",
    bio: "Responsável pelos cronogramas intensivos, nutrição profunda, definição de cachos e consultoria de rotina home care.",
    image_url: "/media/servico-definicao.jpg",
    storage_path: null,
    whatsapp: "5531996792131",
    instagram: "@salaobembonita_cielly",
    sort_order: 3,
    active: true,
  },
];
