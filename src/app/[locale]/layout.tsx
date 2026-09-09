import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Analytics } from "@vercel/analytics/next";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { routing } from "@/i18n/routing";
import { content, identity, type Locale } from "@/content/site";
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
  const { locale } = await params;
  const { ui } = content[hasLocale(routing.locales, locale) ? locale : routing.defaultLocale];
  return {
    metadataBase: new URL("https://georgepuma.dev"),
    title: {
      default: `${identity.name} — ${identity.title}`,
      template: `%s — ${identity.name}`,
    },
    description: ui.meta.description,
    alternates: {
      canonical: locale === "en" ? "/en" : "/",
      languages: { es: "/", en: "/en", "x-default": "/" },
    },
    openGraph: {
      type: "website",
      locale: ui.meta.ogLocale,
      siteName: "georgepuma.dev",
    },
    // Sin `images` aquí ni en openGraph: Next solo aplica la imagen de convención
    // de archivo (opengraph-image.tsx) si el metadata no declara `images` propio.
    twitter: {
      card: "summary_large_image",
      title: `${identity.name} — ${identity.title}`,
      description: ui.meta.description,
    },
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

  return (
    <html lang={locale}>
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
