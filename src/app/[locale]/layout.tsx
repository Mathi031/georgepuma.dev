import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Analytics } from "@vercel/analytics/next";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { enContentReady, routing } from "@/i18n/routing";
import { content, identity, type Locale } from "@/content/site";
import { robotsFor, siteUrl } from "@/lib/seo";
// Fuentes variables de Fontsource: un archivo por subset cubre todos los pesos,
// y el unicode-range de cada @font-face hace que solo se descargue el latino.
// Hanken Grotesk no se importa aquí: se declara en globals.css contra /public
// para poder precargarla (ver el comentario del @font-face).
import "@fontsource-variable/inter/wght.css";
import "@fontsource-variable/jetbrains-mono/wght.css";
import "../globals.css";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale: raw } = await params;
  const locale = hasLocale(routing.locales, raw) ? raw : routing.defaultLocale;
  const { ui } = content[locale];

  // Solo lo común al locale; las imágenes las declara cada página, la home
  // incluida: si lo hiciera el layout, opengraph-image.tsx (mismo segmento)
  // las pisaría con una URL que redirige.
  return {
    metadataBase: new URL(siteUrl),
    title: {
      default: ui.meta.title,
      template: `%s · ${identity.name}`,
    },
    description: ui.meta.description,
    robots: robotsFor(locale),
    openGraph: {
      type: "website",
      siteName: identity.siteName,
      locale: ui.meta.ogLocale,
    },
    twitter: { card: "summary_large_image" },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }
  setRequestLocale(locale);

  // El idioma del texto, que no siempre es el de la ruta: /en sirve español
  // hasta que exista su traducción, y declararlo `en` haría que un lector de
  // pantalla lo pronunciara con fonética inglesa (WCAG 3.1.1).
  const contentLang = enContentReady ? locale : routing.defaultLocale;

  return (
    <html lang={contentLang}>
      <head>
        {/* Única fuente precargada: la del H1, que es el elemento LCP. Las
            otras dos entran por CSS con font-display: swap. */}
        <link
          rel="preload"
          href="/fonts/hanken-grotesk-latin-wght-normal.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
      </head>
      <body className="font-sans antialiased">
        <a
          href="#contenido"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:bg-surface focus:text-ink focus:px-4 focus:py-2"
        >
          {content[locale as Locale].ui.skipLink}
        </a>
        <NextIntlClientProvider>{children}</NextIntlClientProvider>
        <Analytics />
      </body>
    </html>
  );
}
