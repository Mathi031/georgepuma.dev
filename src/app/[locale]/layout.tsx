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
  // La CSP usa un nonce por request (middleware): el HTML no puede
  // prerenderizarse, y el script inline del tema debe llevar ese nonce.
  const nonce = (await headers()).get("x-nonce") ?? undefined;

  return (
    // suppressHydrationWarning: el script del tema añade data-theme a <html>
    // antes de que React hidrate; el atributo no viene del servidor.
    <html lang={locale} suppressHydrationWarning>
      <body className="font-sans antialiased">
        {/* Aplica la elección guardada antes del primer paint (sin FOUC).
            Sin elección guardada no fija nada: manda prefers-color-scheme. */}
        <script
          nonce={nonce}
          dangerouslySetInnerHTML={{
            __html:
              'try{var t=localStorage.getItem("theme");if(t==="light"||t==="dark")document.documentElement.dataset.theme=t}catch(e){}',
          }}
        />
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
