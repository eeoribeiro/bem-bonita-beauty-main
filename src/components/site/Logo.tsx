export function Logo({ tone = "dark" }: { tone?: "dark" | "light" }) {
  return (
    <span className="flex flex-col leading-none">
      <span
        className={`font-display text-2xl tracking-tight ${
          tone === "light" ? "text-ink-foreground" : "text-foreground"
        }`}
      >
        Bem <span className="text-gradient-pink font-semibold">Bonita</span>
      </span>
      <span
        className={`mt-1 text-[0.6rem] uppercase tracking-[0.3em] ${
          tone === "light" ? "text-gold" : "text-muted-foreground"
        }`}
      >
        Cachos &amp; Crespos
      </span>
    </span>
  );
}
