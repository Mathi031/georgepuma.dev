import { identity } from "@/content/site";
import { Link } from "@/i18n/navigation";

type BrandProps = {
  /** aria-label localizado ("George Puma — inicio" / "— home"). */
  aria: string;
  /** En las páginas de caso antepone una flecha decorativa ("← George Puma"). */
  back?: boolean;
};

/**
 * Marca del sitio (sección 5.5/5.6 de la spec): el nombre, no el dominio.
 * Server component — reemplaza el brand inline duplicado en la home y en
 * las páginas de caso (con `back`, para el breadcrumb "volver").
 */
export function Brand({ aria, back = false }: BrandProps) {
  return (
    <Link
      href="/"
      aria-label={aria}
      className="inline-flex min-h-11 items-center font-display text-h3 font-semibold motion-link hover:text-primary"
    >
      {back ? <span aria-hidden="true">← </span> : null}
      {identity.name}
    </Link>
  );
}
