import type { MetadataRoute } from "next";
import { indexedRoutes } from "@/content/site";
import { absoluteUrl } from "@/lib/seo";
import { enContentReady } from "@/i18n/routing";

/**
 * Las rutas salen del contenido, así que un proyecto nuevo entra solo. Las de
 * /en solo aparecen con el contenido listo: hasta entonces son noindex, y
 * anunciarlas contradiría a la propia página.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  // La home manda sobre los casos; entre casos no hay jerarquía.
  const priorityOf = (href: string) => (href === "/" ? 1 : 0.8);

  return indexedRoutes.flatMap((href) => {
    const languages = {
      es: absoluteUrl("es", href),
      ...(enContentReady ? { en: absoluteUrl("en", href) } : {}),
    };
    const locales = enContentReady ? (["es", "en"] as const) : (["es"] as const);

    return locales.map((locale) => ({
      url: absoluteUrl(locale, href),
      changeFrequency: "monthly" as const,
      priority: priorityOf(href),
      alternates: { languages },
    }));
  });
}
