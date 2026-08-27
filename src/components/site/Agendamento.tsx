import { useState, type FormEvent } from "react";
import { CheckCircle, MapPin, MessageCircle, Send, Sparkles, User, Scissors, Calendar, Clock } from "lucide-react";

import { Botao, BotaoLink } from "./Botao";
import { SALAO, whatsappLink } from "@/lib/salao";

const servicosOpcoes = [
  "Corte Especializado",
  "Definição e Finalização de Cachos",
  "Tratamento Capilar (Nutrição / Reconstrução)",
  "Mechas e Iluminação em Cachos",
  "Penteados e Tranças",
  "Cronograma Capilar",
  "Consultoria e Avaliação Geral",
];

const curvaturasOpcoes = [
  "Ondulado (2A - 2C)",
  "Cacheado (3A - 3C)",
  "Crespo (4A - 4C)",
  "Em Transição Capilar",
  "Quero descobrir no atendimento",
];

const periodosOpcoes = [
  "Manhã (09h às 12h)",
  "Tarde (13h às 18h)",
  "Sábado",
  "Primeiro horário disponível",
];

export function Agendamento() {
  const [nome, setNome] = useState("");
  const [servico, setServico] = useState(servicosOpcoes[0]);
  const [curvatura, setCurvatura] = useState(curvaturasOpcoes[1]);
  const [periodo, setPeriodo] = useState(periodosOpcoes[0]);
  const [observacao, setObservacao] = useState("");

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    const linhas = [
      `Olá, ${SALAO.nome}! Gostaria de agendar um atendimento personalizado.`,
      "",
      `👤 *Nome:* ${nome.trim() || "Não informado"}`,
      `✂️ *Serviço desejado:* ${servico}`,
      `🌀 *Tipo de curvatura:* ${curvatura}`,
      `⏰ *Preferência de horário:* ${periodo}`,
    ];

    if (observacao.trim()) {
      linhas.push(`💬 *Detalhes/Dúvida:* ${observacao.trim()}`);
    }

    const mensagemFinal = linhas.join("\n");
    const url = whatsappLink(mensagemFinal);
    window.open(url, "_blank", "noopener,noreferrer");
  };

  return (
    <section id="agendamento" className="relative overflow-hidden bg-ink py-20 lg:py-28 text-ink-foreground">
      <div
        aria-hidden
        className="absolute -left-20 top-10 h-80 w-80 rounded-full bg-primary/20 blur-3xl pointer-events-none"
      />
      <div
        aria-hidden
        className="absolute -right-20 bottom-10 h-80 w-80 rounded-full bg-gold/15 blur-3xl pointer-events-none"
      />

      <div className="relative mx-auto max-w-5xl px-5 lg:px-8">
        <div className="text-center max-w-3xl mx-auto">
          <p className="mx-auto flex w-fit items-center gap-2 text-xs uppercase tracking-[0.22em] text-gold font-medium">
            <Sparkles className="h-3.5 w-3.5" />
            Atendimento Personalizado
          </p>
          <h2 className="mt-4 text-3xl sm:text-5xl font-display leading-tight">
            Pronta para viver a sua transformação?
          </h2>
          <p className="mt-4 text-sm sm:text-base leading-relaxed text-ink-foreground/75">
            Preencha os dados abaixo para preparar seu atendimento sob medida. Você será direcionada
            diretamente ao WhatsApp com a mensagem pronta para envio.
          </p>
        </div>

        <div className="mt-12 rounded-[2.5rem] border border-border/40 bg-card/90 p-6 shadow-2xl backdrop-blur sm:p-10 lg:p-12 text-foreground">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid gap-6 sm:grid-cols-2">
              {/* Nome */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                  <span className="flex items-center gap-1.5">
                    <User className="h-3.5 w-3.5 text-magenta" /> Seu Nome Completo
                  </span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Amanda Silva"
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  className="admin-input mt-0 bg-background text-foreground"
                />
              </div>

              {/* Serviço */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                  <span className="flex items-center gap-1.5">
                    <Scissors className="h-3.5 w-3.5 text-magenta" /> Serviço de Interesse
                  </span>
                </label>
                <select
                  value={servico}
                  onChange={(e) => setServico(e.target.value)}
                  className="admin-input mt-0 bg-background text-foreground"
                >
                  {servicosOpcoes.map((op) => (
                    <option key={op} value={op}>
                      {op}
                    </option>
                  ))}
                </select>
              </div>

              {/* Curvatura */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                  <span className="flex items-center gap-1.5">
                    <Sparkles className="h-3.5 w-3.5 text-gold" /> Tipo de Cabelo / Curvatura
                  </span>
                </label>
                <select
                  value={curvatura}
                  onChange={(e) => setCurvatura(e.target.value)}
                  className="admin-input mt-0 bg-background text-foreground"
                >
                  {curvaturasOpcoes.map((op) => (
                    <option key={op} value={op}>
                      {op}
                    </option>
                  ))}
                </select>
              </div>

              {/* Período */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                  <span className="flex items-center gap-1.5">
                    <Clock className="h-3.5 w-3.5 text-magenta" /> Melhor Período para Atendimento
                  </span>
                </label>
                <select
                  value={periodo}
                  onChange={(e) => setPeriodo(e.target.value)}
                  className="admin-input mt-0 bg-background text-foreground"
                >
                  {periodosOpcoes.map((op) => (
                    <option key={op} value={op}>
                      {op}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Observações */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                Observações ou Dúvidas sobre o seu cabelo (opcional)
              </label>
              <textarea
                rows={3}
                placeholder="Conte-nos brevemente o que você deseja (ex: recuperar definição, clarear sem danificar, corte em camadas)..."
                value={observacao}
                onChange={(e) => setObservacao(e.target.value)}
                className="admin-input mt-0 bg-background text-foreground resize-y"
              />
            </div>

            {/* Ações */}
            <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-border/50">
              <p className="text-xs text-muted-foreground flex items-center gap-2 text-center sm:text-left">
                <CheckCircle className="h-4 w-4 text-green-500 shrink-0" />
                Seus dados serão enviados diretamente ao WhatsApp do salão.
              </p>

              <Botao type="submit" className="w-full sm:w-auto px-8 py-3 shadow-soft">
                <MessageCircle className="h-4 w-4" />
                Continuar no WhatsApp
              </Botao>
            </div>
          </form>
        </div>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-4 text-center">
          <BotaoLink
            href="#localizacao"
            variante="outline"
            className="border-ink-foreground/35 text-ink-foreground hover:bg-ink-foreground/10 text-xs"
          >
            <MapPin className="h-4 w-4" />
            Ver endereço e como chegar no Lanna Shopping
          </BotaoLink>
        </div>
      </div>
    </section>
  );
}
