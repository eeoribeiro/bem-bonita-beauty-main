import { Instagram, MapPin, MessageCircle, Navigation } from "lucide-react";

import { BotaoLink } from "./Botao";
import { TituloSecao } from "./TituloSecao";
import { SALAO, whatsappLink } from "@/lib/salao";
import { usePublicSiteData } from "@/lib/site-data";

export function Localizacao() {
  const { data } = usePublicSiteData();
  const settings = data?.settings;
  const endereco = settings?.address ?? SALAO.endereco;
  const instagram = settings?.instagram ?? SALAO.instagram;
  const instagramUrl = `https://instagram.com/${instagram.replace("@", "")}`;
  return (
    <section id="localizacao" className="bg-background py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <div data-reveal className="reveal">
          <TituloSecao
            eyebrow="Localização"
            titulo="Venha nos visitar em Ponte Nova"
            texto={endereco + "."}
          />
        </div>

        <div className="mt-12 grid gap-8 lg:grid-cols-[1.1fr_1fr]">
          <div
            data-reveal
            className="reveal overflow-hidden rounded-[2rem] border border-border/60 shadow-card"
          >
            <iframe
              title="Mapa da localização do salão Bem Bonita"
              src={SALAO.mapaUrl}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="h-[22rem] w-full border-0 lg:h-full"
            />
          </div>

          <div data-reveal className="reveal flex flex-col gap-4">
            <InfoItem icone={MapPin} titulo="Endereço" texto={endereco} />
            {settings?.landmark ? (
              <InfoItem icone={Navigation} titulo="Ponto de referência" texto={settings.landmark} />
            ) : null}
            {settings?.business_hours_text ? (
              <InfoItem
                icone={MessageCircle}
                titulo="Horário de atendimento"
                texto={settings.business_hours_text}
              />
            ) : null}
            <InfoItem icone={Instagram} titulo="Instagram" texto={instagram} href={instagramUrl} />

            <div className="mt-2 flex flex-wrap gap-3">
              <BotaoLink href={SALAO.rotaUrl} target="_blank" rel="noopener noreferrer">
                <Navigation className="h-4 w-4" />
                Como chegar
              </BotaoLink>
              <BotaoLink
                href={whatsappLink(
                  `Olá, ${SALAO.nome}! Gostaria de consultar os horários disponíveis.`,
                )}
                target="_blank"
                rel="noopener noreferrer"
                variante="outline"
              >
                <MessageCircle className="h-4 w-4" />
                Consultar horários pelo WhatsApp
              </BotaoLink>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function InfoItem({
  icone: Icone,
  titulo,
  texto,
  href,
}: {
  icone: typeof MapPin;
  titulo: string;
  texto: string;
  href?: string;
}) {
  return (
    <div className="grid grid-cols-[auto_minmax(0,1fr)] items-start gap-4 rounded-2xl border border-border/60 bg-card p-5 shadow-card">
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-secondary">
        <Icone className="h-4.5 w-4.5 text-magenta" />
      </span>
      <div className="min-w-0">
        <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">{titulo}</p>
        {href ? (
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-1 block text-sm font-medium text-magenta hover:underline"
          >
            {texto}
          </a>
        ) : (
          <p className="mt-1 text-sm leading-relaxed">{texto}</p>
        )}
      </div>
    </div>
  );
}
