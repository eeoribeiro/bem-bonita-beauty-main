import { MessageCircle, Sparkles } from "lucide-react";

import { BotaoLink } from "./Botao";
import { SafeImage } from "./SafeImage";
import { TituloSecao } from "./TituloSecao";
import { contatoLink, SALAO, whatsappLink } from "@/lib/salao";
import { initialServices } from "@/lib/initial-content";
import { usePublicSiteData } from "@/lib/site-data";

type ServicoView = {
  id: string;
  nome: string;
  descricao: string;
  preco?: string | null;
  destaque?: boolean | null;
  imagem?: string | null;
};

const servicosBase = [
  {
    nome: "Corte e Finalização",
    descricao: "Corte a seco pensado para valorizar o caimento natural dos cachos.",
  },
  {
    nome: "Cachos e Finalização",
    descricao: "Definição, soltura e acabamento para cachos mais leves e desenhados.",
  },
  {
    nome: "Hidratação e Nutrição",
    descricao: "Tratamentos para devolver maciez, brilho e movimento aos fios.",
  },
  {
    nome: "Coloração",
    descricao: "Cor com cuidado, respeitando a saúde e a estrutura dos cabelos.",
  },
  {
    nome: "Reconstrução Capilar",
    descricao: "Reposição de força para fios fragilizados por química, calor ou ressecamento.",
  },
  {
    nome: "Cronograma Capilar",
    descricao: "Plano de tratamento com etapas de detox, hidratação, nutrição e restauração.",
  },
  {
    nome: "Ozonioterapia",
    descricao: "Cuidado complementar para couro cabeludo e fios com óleos essenciais.",
  },
  {
    nome: "Escova e Prancha",
    descricao: "Finalização polida com lavagem, cuidado e acabamento profissional.",
  },
] satisfies Array<Omit<ServicoView, "id">>;

function montarServicos(
  dataServices?: Array<{
    id: string;
    name: string;
    description: string;
    price_text: string;
    featured?: boolean | null;
    image_url?: string | null;
    sort_order?: number;
  }>,
  isError = false,
) {
  if (dataServices?.length) {
    return [...dataServices]
      .sort((a, b) => Number(Boolean(b.featured)) - Number(Boolean(a.featured)))
      .map((service) => ({
        id: service.id,
        nome: service.name,
        descricao: service.description || obterDescricaoCurta(service.name),
        preco: service.price_text,
        destaque: service.featured,
        imagem: service.image_url,
      }));
  }

  if (isError) {
    return initialServices.map((service) => ({
      id: service.name,
      nome: service.name,
      descricao: service.description || obterDescricaoCurta(service.name),
      preco: service.price_text,
      imagem: service.image_url,
    }));
  }

  return servicosBase.map((service) => ({
    id: service.nome,
    ...service,
  }));
}

function obterDescricaoCurta(nome: string) {
  const normalizado = nome.toLowerCase();
  if (normalizado.includes("corte")) return "Corte personalizado para valorizar formato, volume e movimento.";
  if (normalizado.includes("ozon")) return "Tratamento complementar com ativos para cuidado do couro cabeludo.";
  if (normalizado.includes("cacho")) return "Técnicas para definição, soltura e saúde dos cachos.";
  if (normalizado.includes("escova") || normalizado.includes("prancha")) return "Finalização com lavagem, cuidado e acabamento profissional.";
  if (normalizado.includes("colora")) return "Cor com cuidado para preservar brilho, maciez e resistência.";
  if (normalizado.includes("hidr") || normalizado.includes("nutri")) return "Tratamento para devolver água, maciez e brilho aos fios.";
  if (normalizado.includes("reconstru") || normalizado.includes("cauter")) return "Reposição de força para fios sensibilizados ou quebradiços.";
  return "Atendimento capilar personalizado para realçar sua beleza natural.";
}

function obterImagemServico(nome: string) {
  const normalizado = nome.toLowerCase();
  if (normalizado.includes("mecha") || normalizado.includes("colora")) return "/media/resultado-mechas-cachos.jpg";
  if (normalizado.includes("penteado") || normalizado.includes("trança")) return "/media/penteado-trancas-douradas.jpg";
  if (normalizado.includes("corte")) return "/media/resultado-corte-cacheado.jpg";
  if (normalizado.includes("hidr") || normalizado.includes("nutri") || normalizado.includes("lavagem")) return "/media/servico-definicao.jpg";
  if (normalizado.includes("cacho") || normalizado.includes("permanente") || normalizado.includes("soltura")) return "/media/resultado-definicao.jpg";
  return "/media/resultado-cachos-longos.jpg";
}

function ServiceCard({ servico }: { servico: ServicoView }) {
  const fallback = obterImagemServico(servico.nome);

  return (
    <article className="group flex min-h-full flex-col overflow-hidden rounded-[2rem] border border-white/10 bg-card text-card-foreground shadow-[0_18px_50px_rgba(0,0,0,0.18)] transition duration-300 hover:-translate-y-1 hover:border-primary/45 hover:shadow-soft">
      <div className="relative aspect-[4/3] overflow-hidden bg-secondary/50">
        <SafeImage
          src={servico.imagem ?? fallback}
          fallbackSrc={fallback}
          alt={`Foto do serviço ${servico.nome}`}
          loading="lazy"
          decoding="async"
          className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.035]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-transparent" />
        {servico.preco ? (
          <span className="absolute right-4 top-4 rounded-full bg-black/55 px-3 py-1 text-[11px] font-bold text-white shadow-lg backdrop-blur">
            {servico.preco}
          </span>
        ) : null}
        {servico.destaque ? (
          <span className="absolute left-4 top-4 inline-flex items-center gap-1.5 rounded-full bg-primary px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-primary-foreground shadow-soft">
            <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
            Destaque
          </span>
        ) : null}
      </div>
      <div className="flex flex-1 flex-col p-5 sm:p-6">
        <h3 className="font-sans text-lg font-bold leading-snug">{servico.nome}</h3>
        <p className="mt-3 flex-1 text-sm leading-relaxed text-muted-foreground">{servico.descricao}</p>
      </div>
      <BotaoLink
        href={whatsappLink(`Olá, ${SALAO.nome}! Gostaria de agendar o serviço: ${servico.nome}.`)}
        target="_blank"
        rel="noopener noreferrer"
        variante="outline"
        className="mx-5 mb-5 mt-auto w-[calc(100%-2.5rem)]"
      >
        <MessageCircle className="h-4 w-4" />
        Agendar pelo WhatsApp
      </BotaoLink>
    </article>
  );
}

export function Servicos({ paginaCompleta = false }: { paginaCompleta?: boolean }) {
  const { data, isError, isLoading } = usePublicSiteData();
  const servicos = montarServicos(data?.services, isError);
  const servicosExibidos = servicos;

  return (
    <section
      id="servicos"
      className={`bg-blush-soft py-16 text-foreground lg:py-28 ${
        paginaCompleta ? "pt-28 lg:pt-40" : ""
      }`}
    >
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <div data-reveal className="reveal mx-auto max-w-3xl text-center">
          <TituloSecao
            eyebrow={paginaCompleta ? "Serviços" : "Serviços em destaque"}
            titulo={paginaCompleta ? "Cuidados para cada momento do seu cabelo" : "Escolha o cuidado ideal para os seus cachos"}
            texto={
              paginaCompleta
                ? "Cortes, tratamentos e finalizações pensados para valorizar cabelos cacheados, crespos, ondulados e em transição."
                : "A tabela completa de atendimentos para escolher o cuidado ideal antes de chamar no WhatsApp."
            }
            className="mx-auto text-center [&>span]:mx-auto"
          />
        </div>

        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:mt-12 xl:grid-cols-4">
          {isLoading
            ? Array.from({ length: paginaCompleta ? 8 : 6 }, (_, index) => (
                <div key={index} className="h-80 animate-pulse rounded-[2rem] bg-card/70 shadow-[0_6px_18px_rgba(180,90,130,0.12)]" />
              ))
            : servicosExibidos.map((servico) => <ServiceCard key={servico.id} servico={servico} />)}
        </div>

        {!paginaCompleta ? (
          <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <BotaoLink
              href={contatoLink(`Olá, ${SALAO.nome}! Gostaria de agendar uma avaliação.`)}
              target="_blank"
              rel="noopener noreferrer"
              variante="outline"
            >
              <MessageCircle className="h-4 w-4" />
              Agendar pelo WhatsApp
            </BotaoLink>
          </div>
        ) : null}
      </div>
    </section>
  );
}
