import type { Metadata } from "next";
import { headers } from "next/headers";
import { notFound } from "next/navigation";
import { Analytics } from "@vercel/analytics/next";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { routing } from "@/i18n/routing";
import { content, identity, type Locale } from "@/content/site";
import "@fontsource-variable/archivo/wdth.css";
import "@fontsource/ibm-plex-mono/400.css";
import "@fontsource/ibm-plex-mono/500.css";
import "../globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://georgepuma.dev"),
  title: {
    default: `${identity.name} — ${identity.title}`,
    template: `%s — ${identity.name}`,
  },
  description:
    "Full Stack Developer — React, Next.js, TypeScript. Cinco años construyendo productos web empresariales, con flujos de desarrollo asistidos por IA.",
  openGraph: {
    type: "website",
    locale: "es_PE",
    siteName: "georgepuma.dev",
  },
  // Sin `images` aquí ni en openGraph: Next solo aplica la imagen de convención
  // de archivo (opengraph-image.tsx) si el metadata no declara `images` propio.
  twitter: {
    card: "summary_large_image",
    title: `${identity.name} — ${identity.title}`,
    description:
      "Full Stack Developer — React, Next.js, TypeScript. Cinco años construyendo productos web empresariales, con flujos de desarrollo asistidos por IA.",
  },
};

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
  // La CSP usa un nonce por request (middleware): el HTML no puede
  // prerenderizarse. Leer headers() fuerza el render dinámico.
  await headers();

  return (
    <html lang={locale}>
      <body className="font-sans antialiased">
        <a
          href="#contenido"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:bg-paper focus:text-ink focus:px-4 focus:py-2"
        >
          {content[locale as Locale].ui.skipLink}
        </a>
        <NextIntlClientProvider>{children}</NextIntlClientProvider>
        <Analytics />
      </body>
    </html>
  );
}
