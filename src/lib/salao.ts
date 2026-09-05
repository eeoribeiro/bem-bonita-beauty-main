/**
 * Dados fixos do salão Bem Bonita.
 * Conteúdos editáveis continuam vindo do /admin e do Supabase.
 */

export const WHATSAPP_NUMERO = "5531996792131";
export const WHATSAPP_EXIBICAO = "(31) 99679-2131";

export const TEM_WHATSAPP = Boolean(WHATSAPP_NUMERO);

export const SALAO = {
  nome: "Bem Bonita",
  profissional: "Francielly Soares",
  cidade: "Ponte Nova – MG",
  endereco:
    "Av. Francisco Vieira Martins, 595 — Lanna Shopping, sala 118, primeiro andar — Ponte Nova/MG",
  instagram: "@salaobembonita_cielly",
  instagramUrl: "https://instagram.com/salaobembonita_cielly",
  mapaUrl:
    "https://www.google.com/maps?q=Av.+Francisco+Vieira+Martins,+595,+Lanna+Shopping,+Ponte+Nova,+MG&output=embed",
  rotaUrl:
    "https://www.google.com/maps/dir/?api=1&destination=Av.+Francisco+Vieira+Martins,+595,+Lanna+Shopping,+Ponte+Nova+MG",
} as const;

export function whatsappLink(mensagem: string) {
  const texto = encodeURIComponent(mensagem);
  return WHATSAPP_NUMERO
    ? `https://wa.me/${WHATSAPP_NUMERO}?text=${texto}`
    : `https://wa.me/?text=${texto}`;
}

export function contatoLink(mensagem: string) {
  return TEM_WHATSAPP ? whatsappLink(mensagem) : SALAO.instagramUrl;
}

export const CONTATO_LABEL = TEM_WHATSAPP ? "Falar pelo WhatsApp" : "Falar pelo Instagram";

export const MENU = [
  { label: "Início", href: "/#inicio" },
  { label: "Francielly", href: "/francielly" },
  { label: "Serviços", href: "/servicos" },
  { label: "Loja", href: "/produtos" },
  { label: "Feedbacks", href: "/feedbacks" },
  { label: "Contato", href: "/#localizacao" },
] as const;
