import logoBemBonita from "@/assets/logo-bem-bonita.svg";
import { usePublicSiteData } from "@/lib/site-data";

export function Logo({ tone: _tone = "dark" }: { tone?: "dark" | "light" }) {
  const { data } = usePublicSiteData();
  const salonName = data?.settings?.salon_name ?? "Bem Bonita";
  const logoUrl = data?.settings?.logo_url ?? logoBemBonita;

  return (
    <span className="inline-flex min-w-0 items-center rounded-2xl bg-white/95 px-2 py-1 shadow-[0_8px_24px_rgba(36,20,29,0.08)] ring-1 ring-black/5 select-none dark:bg-white dark:ring-white/15">
      <img
        src={logoUrl}
        alt={salonName}
        className="h-10 w-auto max-w-[145px] object-contain sm:h-11 sm:max-w-[170px] lg:h-12 lg:max-w-[190px]"
      />
    </span>
  );
}
