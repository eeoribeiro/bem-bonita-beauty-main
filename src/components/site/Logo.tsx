import { usePublicSiteData } from "@/lib/site-data";

const logoBemBonita = "/media/bem-bonita-logo-transparente.png";

export function Logo({ tone: _tone = "dark" }: { tone?: "dark" | "light" }) {
  const { data } = usePublicSiteData();
  const salonName = data?.settings?.salon_name ?? "Bem Bonita";

  return (
    <span className="inline-flex min-w-0 items-center select-none">
      <img
        src={logoBemBonita}
        alt={`${salonName} — Francielly Soares`}
        className="h-10 w-auto max-w-[158px] object-contain drop-shadow-[0_2px_12px_rgba(232,107,177,0.24)] sm:h-11 sm:max-w-[184px] lg:h-12 lg:max-w-[210px]"
        draggable={false}
      />
    </span>
  );
}
