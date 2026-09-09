import type { ComponentProps } from "react";
import { Link } from "@/i18n/navigation";
import type { Locale } from "@/content/site";

type Href = ComponentProps<typeof Link>["href"];

type LocaleSwitcherProps = {
  locale: Locale;
  /** Clave de pathnames de la página actual ("/", "/proyectos/notable-learning"). */
  href: Href;
  /** aria-label localizado ("Idioma" / "Language"). */
  aria: string;
};

/**
 * Selector ES / EN (sección 5.6 de la spec). El activo no es un enlace:
 * navegar al idioma en el que ya estás no hace nada, así que es un <span> con
 * aria-current. Ambos llevan target de 44x44 porque en móvil es uno de los
 * controles más pequeños del header.
 */
export function LocaleSwitcher({ locale, href, aria }: LocaleSwitcherProps) {
  const item = (l: Locale) =>
    l === locale ? (
      <span
        aria-current="true"
        className="inline-flex min-h-11 min-w-11 items-center justify-center font-medium text-ink"
      >
        {l.toUpperCase()}
      </span>
    ) : (
      <Link
        href={href}
        locale={l}
        hrefLang={l}
        className="inline-flex min-h-11 min-w-11 items-center justify-center text-muted motion-link hover:text-primary"
      >
        {l.toUpperCase()}
      </Link>
    );

  return (
    <nav aria-label={aria} className="flex items-center font-mono text-label">
      {item("es")}
      <span aria-hidden="true" className="text-muted">
        /
      </span>
      {item("en")}
    </nav>
  );
}
