import type { ComponentProps, ReactNode } from "react";

/**
 * Enlace en prosa (secciones 1 y 5.4 de la spec).
 *
 * El subrayado es permanente, no aparece en hover: en prosa es lo único que
 * distingue el enlace del texto sin depender del color. Sin estado visited:
 * el sitio es una sola página y un morado rompería la tinta única.
 */
export function ProseLink({
  className = "",
  children,
  ...props
}: { children: ReactNode } & ComponentProps<"a">) {
  return (
    <a
      className={`text-ink underline decoration-ink underline-offset-[3px] motion-link hover:text-primary hover:decoration-primary ${className}`}
      {...props}
    >
      {children}
    </a>
  );
}
