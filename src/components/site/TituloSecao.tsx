import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

export function TituloSecao({
  eyebrow,
  titulo,
  texto,
  tone = "dark",
  className,
  children,
}: {
  eyebrow?: string;
  titulo: string;
  texto?: string;
  tone?: "dark" | "light";
  className?: string;
  children?: ReactNode;
}) {
  const light = tone === "light";
  return (
    <div className={cn("max-w-2xl", className)}>
      {eyebrow ? <p className={cn("eyebrow", light && "text-gold")}>{eyebrow}</p> : null}
      <h2
        className={cn(
          "mt-3 text-3xl leading-tight sm:text-4xl md:text-[2.75rem]",
          light ? "text-ink-foreground" : "text-foreground",
        )}
      >
        {titulo}
      </h2>
      <span className="rule-gold mt-5 max-w-[7rem]" />
      {texto ? (
        <p
          className={cn(
            "mt-5 text-base leading-relaxed",
            light ? "text-ink-foreground/75" : "text-muted-foreground",
          )}
        >
          {texto}
        </p>
      ) : null}
      {children}
    </div>
  );
}
