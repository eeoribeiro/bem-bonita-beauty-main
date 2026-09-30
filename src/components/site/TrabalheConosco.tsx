import { BriefcaseBusiness, CheckCircle2, FileText, GraduationCap, LoaderCircle, Paperclip, Send, Sparkles, UserRound } from "lucide-react";
import { useState, type FormEvent } from "react";

import { Botao } from "./Botao";
import { getSupabaseClient, supabaseConfigurado } from "@/lib/supabase";

export function TrabalheConosco({ paginaCompleta = false }: { paginaCompleta?: boolean }) {
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
  const [curriculo, setCurriculo] = useState<File | null>(null);
  const [enviando, setEnviando] = useState(false);
  const [erro, setErro] = useState("");
  const [sucesso, setSucesso] = useState("");

  async function enviarCurriculo(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErro("");
    setSucesso("");

    if (!form.nome.trim() || !form.whatsapp.trim()) {
      setErro("Preencha pelo menos nome e WhatsApp.");
      return;
    }

    if (!supabaseConfigurado) {
      setErro("O envio de currículo ainda não está configurado neste ambiente.");
      return;
    }

    if (curriculo && curriculo.size > 10 * 1024 * 1024) {
      setErro("O PDF deve ter no máximo 10 MB.");
      return;
    }

    setEnviando(true);
    try {
      const supabase = getSupabaseClient();
      let resumeStoragePath: string | null = null;

      if (curriculo) {
        const safeName = curriculo.name.replace(/[^\w.\-]+/g, "-").toLowerCase();
        resumeStoragePath = `curriculos/${Date.now()}-${crypto.randomUUID()}-${safeName}`;
        const { error: uploadError } = await supabase.storage
          .from("career-resumes")
          .upload(resumeStoragePath, curriculo, {
            contentType: "application/pdf",
            cacheControl: "3600",
            upsert: false,
          });

        if (uploadError) {
          throw new Error(
            uploadError.message.includes("bucket") || uploadError.message.includes("not found")
              ? "Falta criar o bucket de currículos. Rode o SQL supabase/career-applications.sql no Supabase."
              : uploadError.message,
          );
        }
      }

      const { error: insertError } = await supabase.from("career_applications").insert({
        full_name: form.nome.trim(),
        whatsapp: form.whatsapp.trim(),
        city_neighborhood: form.cidade.trim() || null,
        interest_area: form.area.trim() || null,
        experience: form.experiencia.trim() || null,
        courses: form.cursos.trim() || null,
        availability: form.disponibilidade.trim() || null,
        instagram: form.instagram.trim() || null,
        message: form.mensagem.trim() || null,
        resume_file_name: curriculo?.name ?? null,
        resume_storage_path: resumeStoragePath,
      });

      if (insertError) {
        throw new Error(
          insertError.message.includes("career_applications") || insertError.message.includes("schema")
            ? "Falta criar a tabela de currículos. Rode o SQL supabase/career-applications.sql no Supabase."
            : insertError.message,
        );
      }

      setForm({
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
      setCurriculo(null);
      setSucesso("Currículo enviado com sucesso. A equipe Bem Bonita vai avaliar pelo painel do site.");
    } catch (error) {
      setErro(error instanceof Error ? error.message : "Não foi possível enviar o currículo agora.");
    } finally {
      setEnviando(false);
    }
  }

  return (
    <section
      id="trabalhe-conosco"
      className={`relative overflow-hidden bg-blush-soft text-foreground ${paginaCompleta ? "py-14 lg:py-20" : "py-16 lg:py-24"}`}
    >
      <div className="pointer-events-none absolute -left-24 top-8 h-72 w-72 rounded-full bg-primary/15 blur-3xl" />
      <div className="pointer-events-none absolute -right-20 bottom-0 h-80 w-80 rounded-full bg-gold/10 blur-3xl" />
      <div className="relative mx-auto grid max-w-7xl gap-10 px-5 lg:grid-cols-[0.9fr_1.1fr] lg:items-start lg:px-8">
        <div>
          <p className="eyebrow flex w-fit items-center gap-2">
            <Sparkles className="h-3.5 w-3.5 text-gold" />
            Oportunidades Bem Bonita
          </p>
          <h2 className="mt-4 font-display text-4xl leading-tight sm:text-6xl">
            Trabalhe conosco
          </h2>
          <p className="mt-5 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">
            Preencha seus dados e anexe seu currículo em PDF. O envio fica salvo no painel administrativo do site para a equipe avaliar com calma.
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
                  <h3 className="mt-3 text-sm font-bold">{item.title}</h3>
                  <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{item.text}</p>
                </div>
              );
            })}
          </div>
        </div>

        <form onSubmit={enviarCurriculo} className="rounded-[2rem] border border-border/70 bg-card p-5 shadow-soft sm:p-8">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Nome completo" value={form.nome} onChange={(nome) => setForm({ ...form, nome })} />
            <Field label="WhatsApp" value={form.whatsapp} onChange={(whatsapp) => setForm({ ...form, whatsapp })} placeholder="(31) 99999-9999" />
            <Field label="Cidade / bairro" value={form.cidade} onChange={(cidade) => setForm({ ...form, cidade })} />
            <Field label="Área de interesse" value={form.area} onChange={(area) => setForm({ ...form, area })} placeholder="Ex.: auxiliar, manicure, cabelo, atendimento" />
            <Field label="Experiência profissional" value={form.experiencia} onChange={(experiencia) => setForm({ ...form, experiencia })} multiline />
            <Field label="Cursos e formações" value={form.cursos} onChange={(cursos) => setForm({ ...form, cursos })} multiline />
            <Field label="Disponibilidade" value={form.disponibilidade} onChange={(disponibilidade) => setForm({ ...form, disponibilidade })} placeholder="Ex.: manhã, tarde, sábado..." />
            <Field label="Instagram ou portfólio" value={form.instagram} onChange={(instagram) => setForm({ ...form, instagram })} placeholder="@seuperfil" />
            <label className="block sm:col-span-2">
              <span className="text-sm font-bold text-foreground">Currículo em PDF</span>
              <span className="mt-1 flex min-h-14 cursor-pointer items-center justify-between gap-3 rounded-2xl border border-dashed border-primary/35 bg-background px-4 py-3 text-sm text-muted-foreground transition hover:border-primary hover:text-foreground">
                <span className="flex min-w-0 items-center gap-2">
                  <Paperclip className="h-4 w-4 shrink-0 text-magenta" />
                  <span className="truncate">{curriculo ? curriculo.name : "Selecionar PDF do currículo"}</span>
                </span>
                <span className="shrink-0 rounded-full bg-primary/15 px-3 py-1 text-[11px] font-bold text-magenta">
                  PDF
                </span>
                <input
                  type="file"
                  accept="application/pdf,.pdf"
                  className="sr-only"
                  onChange={(event) => {
                    const file = event.target.files?.[0] ?? null;
                    if (file && file.type !== "application/pdf" && !file.name.toLowerCase().endsWith(".pdf")) {
                      window.alert("Selecione um arquivo PDF.");
                      event.target.value = "";
                      return;
                    }
                    setCurriculo(file);
                  }}
                />
              </span>
              <span className="mt-2 flex items-start gap-2 text-xs leading-relaxed text-muted-foreground">
                <FileText className="mt-0.5 h-3.5 w-3.5 shrink-0 text-magenta" />
                O arquivo fica salvo com segurança no site e aparece na aba “Currículos” do painel administrativo.
              </span>
            </label>
            <div className="sm:col-span-2">
              <Field label="Mensagem adicional" value={form.mensagem} onChange={(mensagem) => setForm({ ...form, mensagem })} multiline />
            </div>
          </div>
          {erro ? (
            <p role="alert" className="mt-5 rounded-2xl border border-red-400/30 bg-red-500/10 p-3 text-sm text-red-200">
              {erro}
            </p>
          ) : null}
          {sucesso ? (
            <p role="status" className="mt-5 flex items-start gap-2 rounded-2xl border border-emerald-400/30 bg-emerald-500/10 p-3 text-sm text-emerald-200">
              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />
              {sucesso}
            </p>
          ) : null}
          <Botao type="submit" disabled={enviando} className="mt-6 w-full disabled:opacity-60">
            {enviando ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
            {enviando ? "Enviando currículo..." : "Enviar currículo para o site"}
          </Botao>
          <p className="mt-3 text-center text-xs leading-relaxed text-muted-foreground">
            Nome e WhatsApp são obrigatórios. O PDF é opcional, mas recomendado.
          </p>
        </form>
      </div>
    </section>
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
