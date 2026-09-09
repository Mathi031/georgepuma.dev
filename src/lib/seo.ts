import type { Metadata } from "next";
import {
  content,
  identity,
  ROUTES_WITH_OWN_OG,
  type InternalRoute,
  type Locale,
} from "@/content/site";
import { getPathname } from "@/i18n/navigation";
import { enContentReady, routing } from "@/i18n/routing";

/**
 * Metadatos del sitio. Aquí no vive ninguna cadena de contenido: los textos
 * salen de src/content y las rutas de getPathname, nunca de concatenar.
 * Todo lo que expone /en a los buscadores depende de `enContentReady`.
 */

export const siteUrl = identity.url;

export const absoluteUrl = (locale: Locale, href: InternalRoute) =>
  siteUrl + getPathname({ locale, href });

/** El español sin prefijo es la forma canónica, así que también es x-default. */
export function alternatesFor(locale: Locale, href: InternalRoute): Metadata["alternates"] {
  const es = absoluteUrl("es", href);
  return {
    canonical: absoluteUrl(locale, href),
    languages: {
      es,
      "x-default": es,
      ...(enContentReady ? { en: absoluteUrl("en", href) } : {}),
    },
  };
}

/** Mientras el contenido inglés sea el español, /en no se indexa (pero sí se sigue). */
export const robotsFor = (locale: Locale): Metadata["robots"] =>
  locale === "en" && !enContentReady ? { index: false, follow: true } : undefined;

/**
 * El segmento es el interno (`/proyectos/...`) y no el localizado, porque la
 * imagen la sirve la carpeta del proyecto: por eso no pasa por getPathname.
 */
const ogImageUrl = (locale: Locale, href: InternalRoute) => {
  const dir = href !== "/" && ROUTES_WITH_OWN_OG.includes(href) ? href : "";
  const prefix = locale === routing.defaultLocale ? "" : `/${locale}`;
  return `${siteUrl}${prefix}${dir}/opengraph-image`;
};

type PageMeta = { locale: Locale; href: InternalRoute; title: string; description: string };

/**
 * Título y descripción se declaran explícitos en ambos bloques: sin esto las
 * subpáginas heredaban del layout y anunciaban en Twitter el título de la home.
 */
function socialFor({ locale, href, title, description }: PageMeta): Metadata {
  const { ui } = content[locale];
  const image = { url: ogImageUrl(locale, href), width: 1200, height: 630, type: "image/png" };
  const other = routing.locales.find((l) => l !== locale);
  return {
    openGraph: {
      type: "website",
      siteName: identity.siteName,
      locale: ui.meta.ogLocale,
      ...(enContentReady && other ? { alternateLocale: content[other].ui.meta.ogLocale } : {}),
      title,
      description,
      url: absoluteUrl(locale, href),
      images: [image],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
    },
  };
}

/**
 * `ownTitle: false` omite el título: la home usa el `default` del layout, y
 * declararlo otra vez lo pasaría por el template y duplicaría el nombre.
 */
export function pageMetadata(meta: PageMeta & { ownTitle?: boolean }): Metadata {
  return {
    ...(meta.ownTitle === false ? {} : { title: meta.title }),
    description: meta.description,
    alternates: alternatesFor(meta.locale, meta.href),
    robots: robotsFor(meta.locale),
    ...socialFor(meta),
  };
}

/** @id estable al que apuntan los TechArticle. */
const personId = `${siteUrl}/#person`;

export function personJsonLd(locale: Locale) {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": personId,
    name: identity.name,
    alternateName: identity.fullName,
    jobTitle: identity.title,
    url: absoluteUrl(locale, "/"),
    email: `mailto:${identity.email}`,
    sameAs: [identity.github, identity.linkedin],
    homeLocation: {
      "@type": "Place",
      address: {
        "@type": "PostalAddress",
        addressLocality: identity.location.locality,
        addressCountry: identity.location.country,
      },
    },
    inLanguage: locale,
  };
}

export function techArticleJsonLd({ locale, href, title, description }: PageMeta) {
  return {
    "@context": "https://schema.org",
    "@type": "TechArticle",
    headline: title,
    description,
    url: absoluteUrl(locale, href),
    inLanguage: locale,
    image: ogImageUrl(locale, href),
    // La Person completa se declara una sola vez, en la home.
    author: { "@id": personId },
    publisher: { "@id": personId },
    // Sin datePublished: no hay fecha de publicación real que declarar.
  };
}
