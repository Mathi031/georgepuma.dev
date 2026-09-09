import type { ReactNode } from "react";

/**
 * Card (sección 5.9 de la spec): `rule` es la card de lista (sin fondo, regla
 * superior) y `surface` la que lleva captura (fondo surface + borde).
 *
 * Sin sombras: la elevación del sistema es superficie más borde. Con
 * `interactive` el borde de cualquiera de las dos variantes pasa a `text` en
 * hover (en la card de lista, la regla superior).
 */
export function Card({
  variant = "rule",
  interactive = false,
  children,
  className = "",
}: {
  variant?: "rule" | "surface";
  /** Añade el hover de borde. Solo tiene sentido si la card entera navega. */
  interactive?: boolean;
  children: ReactNode;
  className?: string;
}) {
  const shape =
    variant === "surface"
      ? "rounded-md border border-rule bg-surface p-step-16"
      : "border-t border-rule pt-step-24";
  const hover = interactive ? "motion-card hover:border-ink" : "";

  return <div className={`grid-safe ${shape} ${hover} ${className}`}>{children}</div>;
}
