import finalizadorImg from "@/assets/produto-finalizador.jpg";
import kitImg from "@/assets/produto-kit.jpg";
import mascaraImg from "@/assets/produto-mascara.jpg";
import oleoImg from "@/assets/produto-oleo.jpg";
import shampooImg from "@/assets/produto-shampoo.jpg";
import type { ProductData, ProductOptionData } from "@/lib/site-data";

export interface ProdutoItem {
  id: string;
  nome: string;
  subtitulo: string;
  curvatura: string;
  descricao: string;
  beneficios: string[];
  imagem: string;
  categoria?: string | null;
  opcoes?: ProductOptionData[] | null;
  preco?: string | null;
  precoPromocional?: string | null;
  destaque?: boolean;
}

export const fallbackProductImage = kitImg;

export const produtosLinha: ProdutoItem[] = [
  {
    id: "kit-completo",
    nome: "Kit Completo Bem Bonita",
    subtitulo: "Tratamento, nutrição e finalização diária",
    curvatura: "Curvaturas 2A a 4C & Transição",
    descricao:
      "A experiência completa do salão para manter seus cachos hidratados, nutridos e com definição impecável entre as visitas.",
    beneficios: [
      "Cronograma completo em casa",
      "Controle de frizz e retenção de umidade",
      "Economia e resultado profissional",
    ],
    imagem: kitImg,
    destaque: true,
  },
  {
    id: "shampoo",
    nome: "Shampoo Nutritivo Suave",
    subtitulo: "Limpeza equilibrada sem ressecar",
    curvatura: "Todos os tipos de cachos e crespos",
    descricao:
      "Fórmula com ativos botânicos que limpa o couro cabeludo suavemente preservando a oleosidade natural das pontas.",
    beneficios: ["Livre de sulfatos agressivos", "Espuma cremosa e hidratante", "Ação desembaraçante"],
    imagem: shampooImg,
  },
  {
    id: "mascara",
    nome: "Máscara de Nutrição Profunda",
    subtitulo: "Reposição lipídica e maciez imediata",
    curvatura: "Cachos 3A-3C e Crespos 4A-4C",
    descricao:
      "Tratamento intensivo com manteigas nobres para recuperar fios ressecados, devolver elasticidade e toque aveludado.",
    beneficios: ["Combate o ressecamento severo", "Ação antifrizz imediata", "Brilho e maleabilidade"],
    imagem: mascaraImg,
  },
  {
    id: "finalizador",
    nome: "Finalizador Ativador de Cachos",
    subtitulo: "Definição prolongada e memória de cachos",
    curvatura: "Ondulados, cacheados e crespos",
    descricao:
      "Leave-in de alta performance que modela sem pesar, garantindo day after prolongado e proteção contra umidade.",
    beneficios: ["Fixação flexível sem efeito duro", "Proteção térmica e solar", "Definição com movimento"],
    imagem: finalizadorImg,
  },
  {
    id: "oleo",
    nome: "Óleo Reparador Iluminador",
    subtitulo: "Nutrição e selagem das pontas",
    curvatura: "Todas as curvaturas",
    descricao:
      "Blend de óleos leves para quebrar o durinho da finalização, selar cutículas e garantir brilho instantâneo.",
    beneficios: ["Toque seco e ultra leve", "Selagem anti-pontas duplas", "Perfume delicado e sofisticado"],
    imagem: oleoImg,
  },
];

export function mapProductData(products: ProductData[]): ProdutoItem[] {
  return products.map((product) => ({
    id: product.id,
    nome: product.name,
    subtitulo: product.subtitle,
    curvatura: product.hair_type,
    descricao: product.description,
    beneficios: product.benefits,
    imagem: product.image_url ?? "",
    categoria: product.category,
    opcoes: product.product_options,
    preco: product.price_text,
    precoPromocional: product.promotional_price_text,
    destaque: product.featured,
  }));
}

export function normalizeText(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

export function produtoSlug(produto: ProdutoItem) {
  const base = normalizeText(produto.nome)
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
  return base || produto.id;
}

export function findProdutoBySlug(products: ProdutoItem[], slug: string) {
  const wanted = normalizeText(slug).replace(/\/$/, "");
  if (!wanted) return undefined;
  return (
    products.find((produto) => produtoSlug(produto) === wanted) ??
    products.find((produto) => produto.id === slug) ??
    products.find((produto) => produto.id === wanted)
  );
}

export function getActiveOptions(product: ProdutoItem) {
  return (product.opcoes ?? []).filter((option) => option.active !== false && option.name?.trim());
}

export function getSelectedOption(product: ProdutoItem, selectedOptions: Record<string, string>) {
  const options = getActiveOptions(product);
  if (!options.length) return null;
  const selectedId = selectedOptions[product.id] ?? options[0]?.id;
  return options.find((option) => option.id === selectedId) ?? options[0] ?? null;
}

export function getOptionStock(option: ProductOptionData | null) {
  return Math.max(0, Number(option?.stock ?? 20) || 0);
}

export function formatarPrecoTexto(preco?: string | null) {
  const text = (preco ?? "").trim();
  if (!text) return "";
  if (/^r\$\s?/i.test(text) || /^rs\b/i.test(text)) return text;
  return `R$ ${text}`;
}

export function getUnitPriceText(priceText?: string | null, sizeText?: string | null) {
  const cents = Number(
    (priceText ?? "")
      .replace(/[^\d,.-]/g, "")
      .replace(/\./g, "")
      .replace(",", "."),
  );
  const size = Number((sizeText ?? "").replace(/[^\d,]/g, "").replace(",", "."));
  if (!Number.isFinite(cents) || cents <= 0 || !Number.isFinite(size) || size <= 0) return "";
  return `${new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(cents / size)}/ml`;
}
