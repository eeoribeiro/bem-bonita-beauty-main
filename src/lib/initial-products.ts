import type { ProductData } from "./site-data";
import shampooImg from "@/assets/produto-shampoo.jpg";
import mascaraImg from "@/assets/produto-mascara.jpg";
import finalizadorImg from "@/assets/produto-finalizador.jpg";
import oleoImg from "@/assets/produto-oleo.jpg";
import kitImg from "@/assets/produto-kit.jpg";

export const initialProducts: ProductData[] = [
  { id: "pending-product-1", name: "Kit Completo Bem Bonita", subtitle: "Tratamento, nutrição e finalização diária", hair_type: "Curvaturas 2A a 4C & Transição", description: "A experiência completa do salão para manter seus cachos hidratados, nutridos e com definição impecável entre as visitas.", benefits: ["Cronograma completo em casa", "Controle de frizz e retenção de umidade", "Economia e resultado profissional"], image_url: kitImg, storage_path: null, featured: true, sort_order: 1, published: true },
  { id: "pending-product-2", name: "Shampoo Nutritivo Suave", subtitle: "Limpeza equilibrada sem ressecar", hair_type: "Todos os tipos de cachos e crespos", description: "Fórmula com ativos botânicos que limpa o couro cabeludo suavemente preservando a oleosidade natural das pontas.", benefits: ["Livre de sulfatos agressivos", "Espuma cremosa e hidratante", "Ação desembaraçante"], image_url: shampooImg, storage_path: null, featured: false, sort_order: 2, published: true },
  { id: "pending-product-3", name: "Máscara de Nutrição Profunda", subtitle: "Reposição lipídica e maciez imediata", hair_type: "Cachos 3A-3C e Crespos 4A-4C", description: "Tratamento intensivo com manteigas nobres para recuperar fios ressecados, devolver a elasticidade e o toque aveludado.", benefits: ["Combate o ressecamento severo", "Ação antifrizz imediata", "Brilho e maleabilidade"], image_url: mascaraImg, storage_path: null, featured: false, sort_order: 3, published: true },
  { id: "pending-product-4", name: "Finalizador Ativador de Cachos", subtitle: "Definição prolongada e memória de cachos", hair_type: "Ondulados, cacheados e crespos", description: "Leave-in de alta performance que modela sem pesar, garantindo day after prolongado e proteção contra umidade.", benefits: ["Fixação flexível sem efeito duro", "Proteção térmica e solar", "Definição com movimento"], image_url: finalizadorImg, storage_path: null, featured: false, sort_order: 4, published: true },
  { id: "pending-product-5", name: "Óleo Reparador Iluminador", subtitle: "Nutrição e selagem das pontas", hair_type: "Todas as curvaturas", description: "Blend de óleos leves para selar cutículas e garantir brilho instantâneo.", benefits: ["Toque seco e ultra leve", "Selagem anti-pontas duplas", "Perfume delicado"], image_url: oleoImg, storage_path: null, featured: false, sort_order: 5, published: true },
];
