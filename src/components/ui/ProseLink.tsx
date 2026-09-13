import type { ComponentProps, ReactNode } from "react";

// Subrayado permanente: en prosa es lo único que distingue el enlace del texto
// sin depender del color.
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
