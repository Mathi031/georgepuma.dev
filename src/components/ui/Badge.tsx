import type { ReactNode } from "react";

type BadgeVariant = "outline" | "accent" | "success" | "warning" | "error";

/**
 * Badge (sección 5.7 de la spec): mono, mayúsculas, radio 2. No es
 * interactivo: no lleva hover ni foco.
 *
 * Las variantes semánticas ponen el color en el texto y en el borde, nunca en
 * un relleno saturado: el color no puede ser el único portador del significado,
 * por eso el texto siempre dice el estado.
 */
const variants: Record<BadgeVariant, string> = {
  outline: "border border-rule text-muted",
  accent: "bg-accent-muted text-primary",
  success: "border border-success text-success",
  warning: "border border-warning text-warning",
  error: "border border-error text-error",
};

export function Badge({
  variant = "outline",
  children,
  className = "",
}: {
  variant?: BadgeVariant;
  children: ReactNode;
  className?: string;
}) {
  return (
    <span
      className={`inline-flex items-center rounded-sm px-2 py-1 font-mono text-metadata uppercase ${variants[variant]} ${className}`}
    >
      {children}
    </span>
  );
}
