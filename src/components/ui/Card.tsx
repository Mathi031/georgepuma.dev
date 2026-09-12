import type { ComponentProps, ReactNode } from "react";

/**
 * Card (sección 5.9 de la spec): `rule` es la card de lista (sin fondo, regla
 * superior) y `surface` la que lleva captura (fondo surface + borde).
 *
 * Sin sombras: la elevación del sistema es superficie más borde. Con
 * `interactive` el borde de cualquiera de las dos variantes pasa a `text` en
 * hover (en la card de lista, la regla superior).
 *
 * `as`: #trabajo (CAMBIO #4) necesita que la card sea el propio `article`
 * con `data-level`, así el borde/regla y el hover viven en la raíz semántica
 * en vez de en un div envolvente.
 */
export function Card({
  as: As = "div",
  variant = "rule",
  interactive = false,
  children,
  className = "",
  ...props
}: {
  /** Solo los contenedores que la card admite: acota lo que el spread de props de div puede recibir. */
  as?: "div" | "article";
  variant?: "rule" | "surface";
  /** Añade el hover de borde. Solo tiene sentido si la card entera navega. */
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
