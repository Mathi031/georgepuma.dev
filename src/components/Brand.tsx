import { identity } from "@/content/site";
import { Link } from "@/i18n/navigation";

type BrandProps = {
  aria: string;
  /** Antepone una flecha decorativa en las páginas de caso. */
  back?: boolean;
};

export function Brand({ aria, back = false }: BrandProps) {
  return (
    <Link
      href="/"
      aria-label={aria}
      className="inline-flex min-h-11 items-center font-mono text-body-small font-medium motion-link hover:text-primary"
    >
      {back ? <span aria-hidden="true">← </span> : null}
      {identity.siteName}
    </Link>
  );
}
