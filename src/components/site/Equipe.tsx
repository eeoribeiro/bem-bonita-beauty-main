import { HeartHandshake, MessageCircle, Sparkles, UserCheck } from "lucide-react";

import { BotaoLink } from "./Botao";
import { initialProfessionals } from "@/lib/initial-content";
import { whatsappLink } from "@/lib/salao";
import { usePublicSiteData, type ProfessionalData } from "@/lib/site-data";
import { SafeImage } from "./SafeImage";
import fotoFrancielly from "@/assets/sobre-francielly.jpg";
import fotoMechas from "@/assets/resultado-mechas.jpg";
import fotoDefinicao from "@/assets/servico-definicao.jpg";

const fotosEquipeFallback = [fotoFrancielly, fotoMechas, fotoDefinicao];

export function Equipe() {
  const { data } = usePublicSiteData();
  const equipe =
    data?.professionals && data.professionals.length > 0
      ? data.professionals
      : (initialProfessionals as ProfessionalData[]);

  return (
    <section id="equipe" className="py-20 lg:py-28 bg-blush-soft border-y border-border/70">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <div className="text-center max-w-2xl mx-auto">
          <p className="eyebrow mx-auto flex w-fit items-center gap-2">
            <Sparkles className="h-3.5 w-3.5 text-gold" />
            Nossa Equipe
          </p>
          <h2 className="mt-3 text-3xl sm:text-4xl font-display">
            Profissionais dedicadas à beleza dos seus cachos
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
            No salão Bem Bonita, você conta com um time qualificado e apaixonado por valorizar a
            curvatura natural, saúde capilar e autoestima.
          </p>
        </div>

        <div className="mt-14 grid gap-8 md:grid-cols-3">
          {equipe.map((membro, index) => (
            <div
              key={membro.id || index}
              className="group rounded-3xl border border-border/80 bg-card p-6 shadow-card transition-all duration-300 hover:-translate-y-1 hover:border-primary hover:shadow-soft flex flex-col justify-between"
            >
              <div>
                <div className="relative aspect-[4/5] w-full overflow-hidden rounded-2xl bg-secondary/50 border border-border/60">
                  <SafeImage
                    src={membro.image_url?.startsWith("/media/") ? (fotosEquipeFallback[index] ?? fotoFrancielly) : (membro.image_url ?? fotosEquipeFallback[index] ?? fotoFrancielly)}
                    fallbackSrc={fotosEquipeFallback[index] ?? fotoFrancielly}
                    alt={`Foto de ${membro.name}`}
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                  />
                  <div className="absolute top-3 left-3 rounded-full bg-black/60 px-3 py-1 text-xs font-semibold text-white backdrop-blur">
                    {index === 0 ? "Fundadora" : "Especialista"}
                  </div>
                </div>

                <div className="mt-5">
                  <h3 className="text-lg font-display font-semibold">{membro.name}</h3>
                  <p className="text-xs font-medium uppercase tracking-wider text-magenta mt-1">
                    {membro.role}
                  </p>
                  <p className="mt-3 text-xs leading-relaxed text-muted-foreground line-clamp-3">
                    {membro.bio}
                  </p>
                </div>
              </div>

              <div className="mt-6 border-t border-border pt-4">
                <BotaoLink
                  href={whatsappLink(
                    `Olá! Gostaria de agendar um horário com a ${membro.name.split(" ")[0]} no salão Bem Bonita.`,
                  )}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full justify-center text-xs py-2.5 shadow-xs"
                >
                  <MessageCircle className="h-3.5 w-3.5" />
                  Agendar com {membro.name.split(" ")[0]}
                </BotaoLink>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
