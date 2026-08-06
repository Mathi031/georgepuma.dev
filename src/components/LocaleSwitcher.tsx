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

/** Selector ES / EN: texto plano, el locale activo en cobre. */
export function LocaleSwitcher({ locale, href, aria }: LocaleSwitcherProps) {
  const item = (l: Locale) =>
    l === locale ? (
      <span aria-current="true" className="font-medium text-copper">
        {l.toUpperCase()}
      </span>
    ) : (
      <Link
        href={href}
        locale={l}
        hrefLang={l}
        className="text-muted transition-colors hover:text-copper"
      >
        {l.toUpperCase()}
      </Link>
    );

  return (
    <nav aria-label={aria} className="font-mono text-[12.5px]">
      {item("es")}
      <span aria-hidden="true" className="text-muted"> / </span>
      {item("en")}
    </nav>
  );
}
