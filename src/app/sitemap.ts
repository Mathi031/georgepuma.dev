import type { MetadataRoute } from "next";
import { getPathname } from "@/i18n/navigation";

const base = "https://georgepuma.dev";
const routes = [
  { href: "/", priority: 1 },
  { href: "/proyectos/notable-learning", priority: 0.8 },
  { href: "/proyectos/cleo-spa", priority: 0.6 },
] as const;

const abs = (locale: "es" | "en", href: (typeof routes)[number]["href"]) =>
  `${base}${getPathname({ locale, href })}`;

export default function sitemap(): MetadataRoute.Sitemap {
  return routes.flatMap(({ href, priority }) =>
    (["es", "en"] as const).map((locale) => ({
      url: abs(locale, href),
      changeFrequency: "monthly" as const,
      priority,
      alternates: {
        languages: { es: abs("es", href), en: abs("en", href) },
      },
    })),
  );
}
