import { MessageCircle, Palette, Scissors, Sparkles, WandSparkles, Waves } from "lucide-react";

import { BotaoLink } from "./Botao";
import { SafeImage } from "./SafeImage";
import { TituloSecao } from "./TituloSecao";
import { useMobileAutoCarousel } from "@/hooks/use-mobile-auto-carousel";
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

type ServicesCardStyle = "photo" | "compact";

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

function obterIconeServico(nome: string) {
  const normalizado = nome.toLowerCase();
  if (normalizado.includes("corte")) return Scissors;
  if (normalizado.includes("colora") || normalizado.includes("mecha")) return Palette;
  if (normalizado.includes("cacho") || normalizado.includes("permanente") || normalizado.includes("soltura")) return Waves;
  return WandSparkles;
}

function ServiceCard({ servico, style }: { servico: ServicoView; style: ServicesCardStyle }) {
  const fallback = obterImagemServico(servico.nome);
  const Icone = obterIconeServico(servico.nome);

  if (style === "compact") {
    return (
      <article className="group flex h-full min-h-[21rem] flex-col rounded-[2rem] border border-border/75 bg-card p-6 text-card-foreground shadow-[0_12px_38px_rgba(0,0,0,0.14)] transition duration-300 hover:-translate-y-1 hover:border-primary/50 hover:shadow-soft">
        <div className="flex items-start justify-between gap-4">
          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-secondary text-magenta transition duration-300 group-hover:bg-primary group-hover:text-primary-foreground">
            <Icone className="h-6 w-6" aria-hidden="true" />
          </span>
          {servico.preco ? (
            <span className="rounded-full bg-secondary px-3 py-1 text-[11px] font-bold text-magenta">
              {servico.preco}
            </span>
          ) : null}
        </div>
        {servico.destaque ? (
          <span className="mt-5 inline-flex w-fit items-center gap-1.5 rounded-full bg-primary px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-primary-foreground shadow-soft">
            <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
            Destaque
          </span>
        ) : null}
        <h3 className="mt-7 font-sans text-xl font-bold leading-snug">{servico.nome}</h3>
        <p className="mt-4 flex-1 text-sm leading-relaxed text-muted-foreground">{servico.descricao}</p>
        <BotaoLink
          href={whatsappLink(`Olá, ${SALAO.nome}! Gostaria de agendar o serviço: ${servico.nome}.`)}
          target="_blank"
          rel="noopener noreferrer"
          variante="outline"
          className="mt-8 w-full"
        >
          <MessageCircle className="h-4 w-4" />
          Agendar pelo WhatsApp
        </BotaoLink>
      </article>
    );
  }

  return (
    <article className="group flex h-full min-h-full flex-col overflow-hidden rounded-[2rem] border border-white/10 bg-card text-card-foreground shadow-[0_18px_50px_rgba(0,0,0,0.18)] transition duration-300 hover:-translate-y-1 hover:border-primary/45 hover:shadow-soft">
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
  const cardStyle: ServicesCardStyle = data?.settings?.services_card_style === "compact" ? "compact" : "photo";
  const carouselRef = useMobileAutoCarousel<HTMLDivElement>();
  const sectionTitle =
    paginaCompleta
      ? data?.settings?.services_title?.trim() || "Cuidados para cada momento do seu cabelo"
      : "Escolha o cuidado ideal para os seus cachos";
  const sectionText =
    data?.settings?.services_description?.trim() ||
    (paginaCompleta
      ? "Cortes, tratamentos e finalizações pensados para valorizar cabelos cacheados, crespos, ondulados e em transição."
      : "A tabela completa de atendimentos para escolher o cuidado ideal antes de chamar no WhatsApp.");

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
            eyebrow={paginaCompleta ? "Serviços" : "Serviços do Salão Bem Bonita"}
            titulo={sectionTitle}
            texto={sectionText}
            className="mx-auto text-center [&>span]:mx-auto"
          />
        </div>

        <div
          ref={carouselRef}
          className="-mx-5 mt-10 flex snap-x snap-mandatory gap-4 overflow-x-auto px-5 pb-4 sm:mx-0 sm:grid sm:grid-cols-2 sm:overflow-visible sm:px-0 sm:pb-0 lg:mt-12 xl:grid-cols-4"
        >
          {isLoading
            ? Array.from({ length: paginaCompleta ? 8 : 6 }, (_, index) => (
                <div
                  key={index}
                  className="h-80 min-w-[78vw] snap-center animate-pulse rounded-[2rem] bg-card/70 shadow-[0_6px_18px_rgba(180,90,130,0.12)] sm:min-w-0"
                />
              ))
            : servicosExibidos.map((servico) => (
                <div key={servico.id} className="flex min-w-[78vw] snap-center sm:min-w-0">
                  <ServiceCard servico={servico} style={cardStyle} />
                </div>
              ))}
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
