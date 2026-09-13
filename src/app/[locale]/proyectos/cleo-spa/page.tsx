import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { MiniCase } from "@/components/MiniCase";
import { miniCase as miniCaseEs } from "@/content/cleo-spa.es";
import { miniCase as miniCaseEn } from "@/content/cleo-spa.en";
import { JsonLd } from "@/components/JsonLd";
import { content as site, type Locale } from "@/content/site";
import { pageMetadata, techArticleJsonLd } from "@/lib/seo";

const content: Record<Locale, typeof miniCaseEs> = { es: miniCaseEs, en: miniCaseEn };

const pathnameKey = "/proyectos/cleo-spa" as const;

function meta(locale: Locale) {
  return {
    locale,
    href: pathnameKey,
    title: site[locale].cleoSpa.name + site[locale].ui.meta.caseSuffix,
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

export default async function CleoSpaPage({
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
        project={site[locale as Locale].cleoSpa}
        c={content[locale as Locale]}
      />
    </>
  );
}
