import logoBemBonita from "@/assets/logo-bem-bonita.svg";
import { usePublicSiteData } from "@/lib/site-data";

export function Logo({ tone: _tone = "dark" }: { tone?: "dark" | "light" }) {
  const { data } = usePublicSiteData();
  const salonName = data?.settings?.salon_name ?? "Bem Bonita";
  const logoUrl = data?.settings?.logo_url ?? logoBemBonita;

  return (
    <span className="flex min-w-0 items-center select-none">
      <img
        src={logoUrl}
        alt={salonName}
        className="h-10 w-auto max-w-[145px] object-contain sm:h-11 sm:max-w-[170px] lg:h-12 lg:max-w-[190px]"
      />
    </span>
  );
}
