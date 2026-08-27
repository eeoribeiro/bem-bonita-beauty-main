import { usePublicSiteData } from "@/lib/site-data";

export function Logo({ tone = "dark" }: { tone?: "dark" | "light" }) {
  const { data } = usePublicSiteData();
  const salonName = data?.settings?.salon_name ?? "Bem Bonita";
  const logoUrl = data?.settings?.logo_url;

  if (logoUrl) {
    return (
      <span className="flex items-center">
        <img
          src={logoUrl}
          alt={salonName}
          className="h-10 sm:h-12 w-auto max-w-[180px] object-contain select-none"
        />
      </span>
    );
  }

  const parts = salonName.split(" ");
  const firstWord = parts[0] ?? "Bem";
  const restWords = parts.slice(1).join(" ") || "Bonita";

  return (
    <span className="flex flex-col leading-none select-none">
      <span
        className={`font-display text-2xl tracking-tight ${
          tone === "light" ? "text-ink-foreground" : "text-foreground"
        }`}
      >
        {firstWord}{" "}
        <span className="text-gradient-pink font-display italic font-semibold">{restWords}</span>
      </span>
      <span
        className={`mt-1 text-[0.6rem] uppercase tracking-[0.3em] font-medium ${
          tone === "light" ? "text-gold" : "text-muted-foreground"
        }`}
      >
        Cachos &amp; Crespos
      </span>
    </span>
  );
}
