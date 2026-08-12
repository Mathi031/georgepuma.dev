import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { MiniCase } from "@/components/MiniCase";
import { miniCase as miniCaseEs } from "@/content/studio-equilibrio.es";
import { miniCase as miniCaseEn } from "@/content/studio-equilibrio.en";
import { content as site, type Locale } from "@/content/site";
import { getPathname } from "@/i18n/navigation";

const content: Record<Locale, typeof miniCaseEs> = { es: miniCaseEs, en: miniCaseEn };

const pathnameKey = "/proyectos/studio-equilibrio" as const;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const c = content[locale as Locale];
  const es = getPathname({ locale: "es", href: pathnameKey });
  const en = getPathname({ locale: "en", href: pathnameKey });
  return {
    title: c.meta.title,
    description: c.meta.description,
    alternates: {
      canonical: locale === "en" ? en : es,
      languages: { es, en, "x-default": es },
    },
  };
}

export default async function StudioEquilibrioPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <MiniCase
      locale={locale as Locale}
      project={site[locale as Locale].studioEquilibrio}
      c={content[locale as Locale]}
    />
  );
}
