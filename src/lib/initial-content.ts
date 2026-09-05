export const initialServices = [
  {
    name: "Corte e Finalização",
    description:
      "É necessário que o cabelo esteja limpo, seco e finalizado. O corte é feito a seco, depois lavamos e finalizamos.",
    price_text: "R$120,00",
    sort_order: 1,
  },
  {
    name: "Ozonioterapia + Óleo Essencial",
    description: "Lavanda, palma rosa e laranja doce. Duração: 3 semanas.",
    price_text: "R$270,00",
    sort_order: 2,
  },
  {
    name: "Cachoterapia",
    description:
      "Assidificação + Nutrição + Reconstrução + Hidratação + bimeciação. Pacote para 4 semanas.",
    price_text: "R$370,00",
    sort_order: 3,
  },
  {
    name: "Escova e Prancha",
    description:
      "Lavagem com shampoo de nutrição + hidratação por 7 minutos no lavatório. TP R$50,00; TS R$65,00; C R$75,00; GG R$80,00.",
    price_text: "A partir de R$50,00",
    sort_order: 4,
  },
  {
    name: "Soltura de Cachos",
    description: "Pré-química + Química + Tratamento + Finalização.",
    price_text: "R$350,00",
    sort_order: 5,
  },
  {
    name: "Cronograma de Tratamento Capilar",
    description:
      "Detox + Assidificação + Hidronutrição + Reconstrução + Restauração. Pacote para 4 semanas.",
    price_text: "R$370,00",
    sort_order: 6,
  },
  {
    name: "Lavagem + Finalização",
    description: "",
    price_text: "R$50,00",
    sort_order: 7,
  },
  { name: "Cauterização Capilar", description: "", price_text: "R$180,00", sort_order: 8 },
  {
    name: "Permanente Afro",
    description: "Pré-química + Relaxamento + Permanente + Tratamento + Finalização.",
    price_text: "R$530,00",
    sort_order: 9,
  },
  {
    name: "Desprogressiva",
    description: "6 sessões: Limpeza dos fios + Corte + Pré-química + Química + Loção onduladora.",
    price_text: "R$900,00",
    sort_order: 10,
  },
  {
    name: "Coloração",
    description: "Com produto do salão: R$120,00; com produto do cliente: R$80,00.",
    price_text: "R$80,00 a R$120,00",
    sort_order: 11,
  },
  { name: "Tratamento + Escova", description: "", price_text: "R$168,00", sort_order: 12 },
].map((service) => ({
  ...service,
  benefits: [] as string[],
  image_url: null,
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
