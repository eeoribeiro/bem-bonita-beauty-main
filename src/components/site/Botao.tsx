import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from "react";

import { cn } from "@/lib/utils";

type Variante = "pink" | "outline" | "gold" | "ghostLight";

const base =
  "inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-medium tracking-wide transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background";

const variantes: Record<Variante, string> = {
  pink: "bg-primary text-primary-foreground shadow-soft hover:bg-magenta hover:-translate-y-0.5",
  outline: "border border-primary/50 text-magenta hover:border-magenta hover:bg-secondary/60",
  gold: "border border-gold/70 text-gold hover:bg-gold hover:text-gold-foreground",
  ghostLight:
    "border border-ink-foreground/25 text-ink-foreground hover:border-gold hover:text-gold",
};

export function BotaoLink({
  variante = "pink",
  className,
  children,
  ...props
}: AnchorHTMLAttributes<HTMLAnchorElement> & {
  variante?: Variante;
  children: ReactNode;
}) {
  return (
    <a className={cn(base, variantes[variante], className)} {...props}>
      {children}
    </a>
  );
}

export function Botao({
  variante = "pink",
  className,
  children,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & {
  variante?: Variante;
  children: ReactNode;
}) {
  return (
    <button className={cn(base, variantes[variante], className)} {...props}>
      {children}
    </button>
  );
}
