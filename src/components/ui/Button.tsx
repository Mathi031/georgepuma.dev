import type { ComponentProps, ReactNode } from "react";

type Variant = "primary" | "secondary" | "tertiary";

/**
 * Botón del sistema (sección 5.1-5.3 de la spec).
 *
 * Un botón no es un enlace: `Button` renderiza <button> y `ButtonLink` renderiza
 * <a>. Comparten estilo, no elemento, para que el lector de pantalla anuncie
 * "botón" solo cuando algo ejecuta una acción y "enlace" cuando navega.
 *
 * El foco es siempre el outline global de globals.css, nunca un cambio de
 * color. La transición pasa por motion-link, que es 0s bajo reduced-motion.
 */
const base =
  "inline-flex min-h-11 items-center justify-center gap-2 text-label font-medium motion-link";

const variants: Record<Variant, string> = {
  primary:
    "rounded-md bg-primary px-5 text-white hover:bg-primary-hover active:bg-ink " +
    "disabled:bg-surface-muted disabled:text-muted disabled:cursor-not-allowed",
  // En disabled el relleno pasa a surface-muted, igual que el primario: un
  // borde de 1.3:1 sobre bg no basta por sí solo para comunicar el estado.
  secondary:
    "rounded-md border border-ink px-5 text-ink hover:border-primary hover:text-primary " +
    "active:bg-surface-muted disabled:border-rule disabled:bg-surface-muted " +
    "disabled:text-muted disabled:cursor-not-allowed",
  tertiary:
    "text-primary underline underline-offset-[3px] hover:text-primary-hover " +
    "disabled:text-muted disabled:no-underline disabled:cursor-not-allowed",
};

export function Button({
  variant = "primary",
  className = "",
  children,
  ...props
}: { variant?: Variant; children: ReactNode } & ComponentProps<"button">) {
  return (
    <button className={`${base} ${variants[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
}

export function ButtonLink({
  variant = "primary",
  className = "",
  children,
  ...props
}: { variant?: Variant; children: ReactNode } & ComponentProps<"a">) {
  return (
    <a className={`${base} ${variants[variant]} ${className}`} {...props}>
      {children}
    </a>
  );
}

/**
 * Mismas clases de ButtonLink, para componer sobre `Link` de next-intl
 * (que necesita ser el propio elemento con prefijo de locale, no envolver
 * un <a>). ponytail: helper de una línea en vez de un tercer componente.
 */
export function buttonLinkClass(variant: Variant = "primary") {
  return `${base} ${variants[variant]}`;
}
