import { createFileRoute, Link } from "@tanstack/react-router";

import { SALAO } from "@/lib/salao";

export const Route = createFileRoute("/privacidade")({
  head: () => ({
    meta: [
      { title: "Política de Privacidade | Bem Bonita" },
      {
        name: "description",
        content: "Saiba como o site do salão Bem Bonita trata informações de visitantes.",
      },
    ],
  }),
  component: Privacidade,
});

function Privacidade() {
  return (
    <main className="min-h-screen bg-background px-5 py-16 lg:py-24">
      <article className="mx-auto max-w-3xl">
        <Link to="/" className="text-sm font-medium text-magenta hover:underline">
          ← Voltar ao site
        </Link>
        <p className="eyebrow mt-10">Privacidade</p>
        <h1 className="mt-4 text-4xl sm:text-5xl">Política de Privacidade</h1>
        <p className="mt-5 text-sm text-muted-foreground">Última atualização: agosto de 2026.</p>

        <div className="mt-10 space-y-8 leading-relaxed text-muted-foreground">
          <section>
            <h2 className="text-2xl text-foreground">Sobre este site</h2>
            <p className="mt-3">
              Este site apresenta os serviços do {SALAO.nome}, em Ponte Nova – MG. Não realizamos
              cadastro, pagamento ou confirmação automática de agendamentos pelo site.
            </p>
          </section>
          <section>
            <h2 className="text-2xl text-foreground">Contato e dados pessoais</h2>
            <p className="mt-3">
              Ao clicar nos botões de contato, você será direcionada ao WhatsApp. Qualquer
              informação enviada nessa plataforma será tratada conforme as políticas do WhatsApp e
              usada apenas para atendimento e agendamento.
            </p>
          </section>
          <section>
            <h2 className="text-2xl text-foreground">Dados técnicos</h2>
            <p className="mt-3">
              O provedor de hospedagem pode registrar informações técnicas essenciais, como endereço
              IP, navegador e horário de acesso, para segurança e funcionamento do serviço. Este
              site não utiliza formulário próprio nem vende dados pessoais.
            </p>
          </section>
          <section>
            <h2 className="text-2xl text-foreground">Dúvidas</h2>
            <p className="mt-3">
              Para solicitar informações sobre privacidade, entre em contato pelo perfil oficial{" "}
              {SALAO.instagram}.
            </p>
          </section>
        </div>
      </article>
    </main>
  );
}
