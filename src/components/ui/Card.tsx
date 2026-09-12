import type { ComponentProps, ReactNode } from "react";

/**
 * Sin sombras: la elevación del sistema es superficie más borde. `as` existe
 * porque en #trabajo la card tiene que ser el propio `article` con
 * `data-level`, para que borde y hover vivan en la raíz semántica y no en un
 * div envolvente.
 */
export function Card({
  as: As = "div",
  variant = "rule",
  interactive = false,
  children,
  className = "",
  ...props
}: {
  as?: "div" | "article";
  variant?: "rule" | "surface";
  /** Solo tiene sentido si la card entera navega. */
  interactive?: boolean;
  children: ReactNode;
  className?: string;
} & ComponentProps<"div">) {
  const shape =
    variant === "surface"
      ? "rounded-md border border-rule bg-surface p-step-16"
      : "border-t border-rule pt-step-24";
  const hover = interactive ? "motion-card hover:border-ink" : "";

  return (
    <As className={`grid-safe ${shape} ${hover} ${className}`} {...props}>
      {children}
    </As>
  );
}
