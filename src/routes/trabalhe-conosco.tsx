import { createFileRoute } from "@tanstack/react-router";
import { BriefcaseBusiness, GraduationCap, MessageCircle, Sparkles, UserRound } from "lucide-react";
import { useMemo, useState } from "react";

import { BotaoLink } from "@/components/site/Botao";
import { BotaoFlutuanteWhatsApp } from "@/components/site/BotaoFlutuanteWhatsApp";
import { Footer } from "@/components/site/Footer";
import { Header } from "@/components/site/Header";
import { whatsappLink } from "@/lib/salao";

export const Route = createFileRoute("/trabalhe-conosco")({
  head: () => ({
    meta: [
      { title: "Trabalhe conosco | Bem Bonita" },
      {
        name: "description",
        content: "Preencha seu currículo para oportunidades no salão Bem Bonita em Ponte Nova/MG.",
      },
    ],
  }),
  component: TrabalheConoscoPage,
});

function TrabalheConoscoPage() {
  const [form, setForm] = useState({
    nome: "",
    whatsapp: "",
    cidade: "",
    area: "",
    experiencia: "",
    cursos: "",
    disponibilidade: "",
    instagram: "",
    mensagem: "",
  });

  const whatsappHref = useMemo(() => {
    const linhas = [
      "Olá! Vim pelo site do Bem Bonita e quero enviar meu currículo para trabalhar com vocês.",
      "",
      `Nome: ${form.nome || "Não informado"}`,
      `WhatsApp: ${form.whatsapp || "Não informado"}`,
      `Cidade/bairro: ${form.cidade || "Não informado"}`,
      `Área de interesse: ${form.area || "Não informado"}`,
      `Experiência: ${form.experiencia || "Não informado"}`,
      `Cursos/formações: ${form.cursos || "Não informado"}`,
      `Disponibilidade: ${form.disponibilidade || "Não informado"}`,
      `Instagram/portfólio: ${form.instagram || "Não informado"}`,
      `Mensagem: ${form.mensagem || "Não informado"}`,
    ];
    return whatsappLink(linhas.join("\n"));
  }, [form]);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <main className="page-transition pt-24 sm:pt-28 lg:pt-36">
        <section className="relative overflow-hidden bg-blush-soft py-14 lg:py-20">
          <div className="pointer-events-none absolute -left-24 top-8 h-72 w-72 rounded-full bg-primary/15 blur-3xl" />
          <div className="pointer-events-none absolute -right-20 bottom-0 h-80 w-80 rounded-full bg-gold/10 blur-3xl" />
          <div className="relative mx-auto grid max-w-7xl gap-10 px-5 lg:grid-cols-[0.9fr_1.1fr] lg:items-start lg:px-8">
            <div>
              <p className="eyebrow flex w-fit items-center gap-2">
                <Sparkles className="h-3.5 w-3.5 text-gold" />
                Oportunidades Bem Bonita
              </p>
              <h1 className="mt-4 font-display text-4xl leading-tight sm:text-6xl">
                Trabalhe conosco
              </h1>
              <p className="mt-5 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">
                Preencha seu currículo de forma simples. As informações serão enviadas pelo WhatsApp para a equipe avaliar seu perfil.
              </p>
              <div className="mt-8 grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
                {[
                  { icon: UserRound, title: "Seu perfil", text: "Conte quem você é e onde mora." },
                  { icon: BriefcaseBusiness, title: "Experiência", text: "Mostre em quais áreas já atuou." },
                  { icon: GraduationCap, title: "Formação", text: "Informe cursos, práticas e disponibilidade." },
                ].map((item) => {
                  const Icon = item.icon;
                  return (
                    <div key={item.title} className="rounded-3xl border border-border/70 bg-card/75 p-4 shadow-card">
                      <Icon className="h-5 w-5 text-magenta" />
                      <h2 className="mt-3 text-sm font-bold">{item.title}</h2>
                      <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{item.text}</p>
                    </div>
                  );
                })}
              </div>
            </div>

            <form className="rounded-[2rem] border border-border/70 bg-card p-5 shadow-soft sm:p-8">
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Nome completo" value={form.nome} onChange={(nome) => setForm({ ...form, nome })} />
                <Field label="WhatsApp" value={form.whatsapp} onChange={(whatsapp) => setForm({ ...form, whatsapp })} placeholder="(31) 99999-9999" />
                <Field label="Cidade / bairro" value={form.cidade} onChange={(cidade) => setForm({ ...form, cidade })} />
                <Field label="Área de interesse" value={form.area} onChange={(area) => setForm({ ...form, area })} placeholder="Ex.: auxiliar, manicure, cabelo, atendimento" />
                <Field label="Experiência profissional" value={form.experiencia} onChange={(experiencia) => setForm({ ...form, experiencia })} multiline />
                <Field label="Cursos e formações" value={form.cursos} onChange={(cursos) => setForm({ ...form, cursos })} multiline />
                <Field label="Disponibilidade" value={form.disponibilidade} onChange={(disponibilidade) => setForm({ ...form, disponibilidade })} placeholder="Ex.: manhã, tarde, sábado..." />
                <Field label="Instagram ou portfólio" value={form.instagram} onChange={(instagram) => setForm({ ...form, instagram })} placeholder="@seuperfil" />
                <div className="sm:col-span-2">
                  <Field label="Mensagem adicional" value={form.mensagem} onChange={(mensagem) => setForm({ ...form, mensagem })} multiline />
                </div>
              </div>
              <BotaoLink href={whatsappHref} target="_blank" rel="noopener noreferrer" className="mt-6 w-full">
                <MessageCircle className="h-4 w-4" />
                Enviar currículo pelo WhatsApp
              </BotaoLink>
              <p className="mt-3 text-center text-xs leading-relaxed text-muted-foreground">
                O botão abre o WhatsApp com seu currículo preenchido em texto. Revise a mensagem antes de enviar.
              </p>
            </form>
          </div>
        </section>
      </main>
      <Footer />
      <BotaoFlutuanteWhatsApp />
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
  multiline,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  multiline?: boolean;
}) {
  return (
    <label className={multiline ? "block sm:col-span-2" : "block"}>
      <span className="text-sm font-bold text-foreground">{label}</span>
      {multiline ? (
        <textarea
          rows={4}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder={placeholder}
          className="admin-input mt-1 resize-y"
        />
      ) : (
        <input
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder={placeholder}
          className="admin-input mt-1"
        />
      )}
    </label>
  );
}
