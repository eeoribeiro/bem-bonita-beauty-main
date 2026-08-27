import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, CheckCircle2, GraduationCap, MessageCircle, Sparkles, Users } from "lucide-react";

import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { BotaoLink } from "@/components/site/Botao";
import { BotaoFlutuanteWhatsApp } from "@/components/site/BotaoFlutuanteWhatsApp";
import { SALAO, whatsappLink } from "@/lib/salao";
import { useReveal } from "@/hooks/use-reveal";

export const Route = createFileRoute("/cursos")({
  head: () => ({
    meta: [
      { title: "Cursos e Workshops | Bem Bonita Beauty por Francielly Soares" },
      {
        name: "description",
        content:
          "Formação profissional, mentorias e workshops em cabelos crespos e cacheados em Ponte Nova – MG com Francielly Soares.",
      },
    ],
  }),
  component: PaginaCursos,
});

const modulosCursos = [
  {
    titulo: "Formação Completa em Cachos & Crespos",
    subtitulo: "Do diagnóstico capilar à entrega do resultado",
    descricao:
      "Aprenda a analisar porosidade, elasticidade, curvaturas e montar tratamentos personalizados que fidelizam clientes.",
    pontos: ["Classificação de curvaturas 2A a 4C", "Terapia capilar e reposição lipídica", "Fitagem e day after prolongado"],
    status: "Lista de Espera VIP",
  },
  {
    titulo: "Corte a Seco Especializado",
    subtitulo: "Geometria dos cachos e caimento natural",
    descricao:
      "Domine as técnicas de corte em camadas, arredondado e desconectado respeitando o fator encolhimento de cada mecha.",
    pontos: ["Mapeamento da cabeça", "Corte em cabelo seco sem deformar", "Transição capilar e Big Chop"],
    status: "Em Breve",
  },
  {
    titulo: "Mechas e Iluminação Segura",
    subtitulo: "Clareamento sem perder a curvatura dos fios",
    descricao:
      "Aprenda os segredos da descoloração saudável, teste de mecha seguro e matização para realçar o brilho dos cachos.",
    pontos: ["Técnicas de Morena Iluminada", "Preservação da saúde da fibra", "Neutralização e tratamento pós-química"],
    status: "Em Breve",
  },
];

function PaginaCursos() {
  useReveal();

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />

      <main className="pt-28 lg:pt-36">
        {/* Banner Principal */}
        <section className="relative overflow-hidden bg-blush-soft py-16 lg:py-24">
          <div className="mx-auto max-w-7xl px-5 lg:px-8">
            <Link
              to="/"
              className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-magenta hover:underline mb-8"
            >
              <ArrowLeft className="h-4 w-4" /> Voltar ao início
            </Link>

            <div className="max-w-3xl">
              <p className="eyebrow flex items-center gap-2">
                <GraduationCap className="h-4 w-4 text-gold" />
                Educação & Especialização
              </p>
              <h1 className="mt-4 text-4xl sm:text-6xl font-display leading-[1.15]">
                Cursos & Workshops
                <span className="block mt-2 text-gradient-pink font-display italic font-normal text-3xl sm:text-5xl">
                  Aprenda com quem vive a técnica na prática
                </span>
              </h1>
              <p className="mt-6 text-base sm:text-lg leading-relaxed text-muted-foreground">
                Em breve, Francielly Soares abrirá turmas exclusivas e mentorias práticas para
                cabeleireiras e profissionais que desejam se tornar referência no mercado de cabelos
                crespos e cacheados.
              </p>

              <div className="mt-9 flex flex-wrap gap-4">
                <BotaoLink
                  href={whatsappLink(
                    `Olá, Francielly! Gostaria de entrar na lista de espera VIP para os próximos cursos e workshops do Bem Bonita.`,
                  )}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="shadow-soft"
                >
                  <MessageCircle className="h-4 w-4" />
                  Entrar na Lista de Espera VIP
                </BotaoLink>
              </div>
            </div>
          </div>
        </section>

        {/* Grade de Cursos Previstos */}
        <section className="py-20 lg:py-28 bg-background">
          <div className="mx-auto max-w-6xl px-5 lg:px-8">
            <div className="text-center max-w-2xl mx-auto">
              <p className="eyebrow mx-auto flex w-fit items-center gap-2">
                <Sparkles className="h-3.5 w-3.5 text-gold" />
                Grade de Formação
              </p>
              <h2 className="mt-3 text-3xl sm:text-4xl font-display">
                Módulos desenhados para acelerar sua carreira
              </h2>
              <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                Turmas reduzidas com prática em modelos reais e acompanhamento individual.
              </p>
            </div>

            <div className="mt-14 grid gap-8 md:grid-cols-3">
              {modulosCursos.map((curso) => (
                <div
                  key={curso.titulo}
                  className="flex flex-col justify-between rounded-3xl border border-border/70 bg-card p-7 shadow-card transition hover:border-primary/50 hover:shadow-soft"
                >
                  <div>
                    <span className="inline-block rounded-full bg-secondary px-3.5 py-1 text-xs font-semibold text-magenta">
                      {curso.status}
                    </span>
                    <h3 className="mt-4 text-2xl font-display leading-snug">{curso.titulo}</h3>
                    <p className="mt-1 text-xs font-medium text-gold">{curso.subtitulo}</p>
                    <p className="mt-4 text-xs sm:text-sm leading-relaxed text-muted-foreground">
                      {curso.descricao}
                    </p>

                    <ul className="mt-5 space-y-2 border-t border-border/60 pt-4 text-xs text-foreground/85">
                      {curso.pontos.map((ponto) => (
                        <li key={ponto} className="flex items-center gap-2">
                          <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-gold" />
                          <span>{ponto}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="mt-8 pt-4 border-t border-border/60">
                    <BotaoLink
                      href={whatsappLink(
                        `Olá, Francielly! Tenho interesse no curso: ${curso.titulo}. Como faço para saber mais sobre as próximas turmas?`,
                      )}
                      target="_blank"
                      rel="noopener noreferrer"
                      variante="outline"
                      className="w-full text-xs py-2.5"
                    >
                      <MessageCircle className="h-3.5 w-3.5" />
                      Garantir vaga com prioridade
                    </BotaoLink>
                  </div>
                </div>
              ))}
            </div>

            {/* Chamada Final */}
            <div className="mt-16 rounded-[2.5rem] border border-primary/30 bg-secondary/40 p-8 text-center sm:p-12">
              <Users className="mx-auto h-10 w-10 text-magenta" />
              <h3 className="mt-4 text-2xl sm:text-3xl font-display">
                Quer levar um workshop para o seu salão ou cidade?
              </h3>
              <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-muted-foreground">
                Francielly Soares também realiza treinamentos in company e consultorias para equipes
                de salões em Minas Gerais.
              </p>
              <BotaoLink
                href={whatsappLink(
                  `Olá, Francielly! Gostaria de consultar a disponibilidade para um workshop/treinamento in company na minha cidade.`,
                )}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-6"
              >
                <MessageCircle className="h-4 w-4" />
                Falar sobre treinamento exclusivo
              </BotaoLink>
            </div>
          </div>
        </section>
      </main>

      <Footer />
      <BotaoFlutuanteWhatsApp />
    </div>
  );
}
