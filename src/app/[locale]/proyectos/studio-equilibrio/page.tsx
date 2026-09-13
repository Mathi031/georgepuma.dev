import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { MiniCase } from "@/components/MiniCase";
import { miniCase as miniCaseEs } from "@/content/studio-equilibrio.es";
import { miniCase as miniCaseEn } from "@/content/studio-equilibrio.en";
import { JsonLd } from "@/components/JsonLd";
import { content as site, type Locale } from "@/content/site";
import { pageMetadata, techArticleJsonLd } from "@/lib/seo";

const content: Record<Locale, typeof miniCaseEs> = { es: miniCaseEs, en: miniCaseEn };

const pathnameKey = "/proyectos/studio-equilibrio" as const;

function meta(locale: Locale) {
  return {
    locale,
    href: pathnameKey,
    title: site[locale].studioEquilibrio.name + site[locale].ui.meta.caseSuffix,
    description: content[locale].meta.description,
  };
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return pageMetadata(meta(locale as Locale));
}

export default async function StudioEquilibrioPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <>
      <JsonLd data={techArticleJsonLd(meta(locale as Locale))} />
      <MiniCase
        locale={locale as Locale}
        project={site[locale as Locale].studioEquilibrio}
        c={content[locale as Locale]}
      />
    </>
  );
}
