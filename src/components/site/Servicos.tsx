import {
  Brush,
  Droplets,
  MessageCircle,
  Palette,
  Scissors,
  Sparkles,
  WandSparkles,
  Waves,
  type LucideIcon,
} from "lucide-react";

import { BotaoLink } from "./Botao";
import { TituloSecao } from "./TituloSecao";
import { contatoLink, SALAO } from "@/lib/salao";
import { initialServices } from "@/lib/initial-content";
import { usePublicSiteData } from "@/lib/site-data";

type ServicoView = {
  id: string;
  nome: string;
  descricao: string;
  preco?: string | null;
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

function montarServicos(dataServices?: Array<{ id: string; name: string; description: string; price_text: string }>, isError = false) {
  if (dataServices?.length) {
    return dataServices.map((service) => ({
      id: service.id,
      nome: service.name,
      descricao: service.description || obterDescricaoCurta(service.name),
      preco: service.price_text,
    }));
  }

  if (isError) {
    return initialServices.map((service) => ({
      id: service.name,
      nome: service.name,
      descricao: service.description || obterDescricaoCurta(service.name),
      preco: service.price_text,
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

function obterIconeServico(nome: string): LucideIcon {
  const normalizado = nome.toLowerCase();
  if (normalizado.includes("corte")) return Scissors;
  if (normalizado.includes("cacho") || normalizado.includes("permanente") || normalizado.includes("soltura")) return Waves;
  if (normalizado.includes("hidr") || normalizado.includes("nutri") || normalizado.includes("lavagem")) return Droplets;
  if (normalizado.includes("colora") || normalizado.includes("mecha")) return Sparkles;
  if (normalizado.includes("escova") || normalizado.includes("prancha")) return Brush;
  if (normalizado.includes("ozon") || normalizado.includes("óleo")) return Palette;
  return WandSparkles;
}

function ServiceCard({ servico }: { servico: ServicoView }) {
  const Icone = obterIconeServico(servico.nome);

  return (
    <article className="rounded-2xl bg-white p-6 text-[#24141d] shadow-[0_6px_18px_rgba(180,90,130,0.14)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_12px_28px_rgba(180,90,130,0.2)]">
      <div className="flex items-start justify-between gap-4">
        <Icone className="h-9 w-9 text-[#c4477e]" strokeWidth={1.6} aria-hidden="true" />
        {servico.preco ? (
          <span className="shrink-0 rounded-full bg-[#fde1ec] px-3 py-1 text-xs font-bold text-[#c4477e]">
            {servico.preco}
          </span>
        ) : null}
      </div>
      <h3 className="mt-5 font-sans text-lg font-bold leading-snug">{servico.nome}</h3>
      <p className="mt-3 text-sm leading-relaxed text-[#6f6067]">{servico.descricao}</p>
    </article>
  );
}

export function Servicos({ paginaCompleta = false }: { paginaCompleta?: boolean }) {
  const { data, isError, isLoading } = usePublicSiteData();
  const servicos = montarServicos(data?.services, isError);
  const servicosExibidos = paginaCompleta ? servicos : servicos.slice(0, 3);

  return (
    <section id="servicos" className={`bg-gradient-to-b from-[#fff7fa] to-[#fdf2f6] py-20 text-[#24141d] lg:py-28 ${paginaCompleta ? "pt-32 lg:pt-40" : ""}`}>
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <div data-reveal className="reveal mx-auto max-w-3xl text-center">
          <TituloSecao
            eyebrow={paginaCompleta ? "Serviços" : "Serviços em destaque"}
            titulo={paginaCompleta ? "Cuidados para cada momento do seu cabelo" : "Escolha o cuidado ideal para os seus cachos"}
            texto={
              paginaCompleta
                ? "Cortes, tratamentos e finalizações pensados para valorizar cabelos cacheados, crespos, ondulados e em transição."
                : "Uma prévia dos atendimentos mais procurados no Bem Bonita."
            }
            className="mx-auto text-center [&>span]:mx-auto"
          />
        </div>

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {isLoading
            ? Array.from({ length: paginaCompleta ? 8 : 3 }, (_, index) => (
                <div key={index} className="h-52 animate-pulse rounded-2xl bg-white/70 shadow-[0_6px_18px_rgba(180,90,130,0.12)]" />
              ))
            : servicosExibidos.map((servico) => <ServiceCard key={servico.id} servico={servico} />)}
        </div>

        {!paginaCompleta ? (
          <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <BotaoLink href="/servicos">Ver todos os serviços</BotaoLink>
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
