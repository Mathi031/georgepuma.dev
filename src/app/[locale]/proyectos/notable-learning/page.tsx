import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { Brand } from "@/components/Brand";
import { Evidence } from "@/components/Evidence";
import { LocaleSwitcher } from "@/components/LocaleSwitcher";
import { PipelineFigure } from "@/components/figures/PipelineFigure";
import { SchemaFigure } from "@/components/figures/SchemaFigure";
import { JsonLd } from "@/components/JsonLd";
import { content as site, sectionIds, type Locale } from "@/content/site";
import { Link } from "@/i18n/navigation";
import { pageMetadata, techArticleJsonLd } from "@/lib/seo";
import { caseStudy as caseEs } from "@/content/notable-learning.es";
import { caseStudy as caseEn } from "@/content/notable-learning.en";

const content: Record<Locale, typeof caseEs> = { es: caseEs, en: caseEn };

const pathnameKey = "/proyectos/notable-learning" as const;

function meta(locale: Locale) {
  return {
    locale,
    href: pathnameKey,
    title: site[locale].anchorProject.name + site[locale].ui.meta.caseSuffix,
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

const h2 = "display-md text-display-md font-semibold";
const body = "text-body leading-[1.75] max-w-[65ch]";
const sectionGap = "mt-14 sm:mt-16";

// El kicker es decorativo: la estructura la llevan los h2.
function CaseHeading({ id, heading }: { id: string; heading: string }) {
  return (
    <>
      <p aria-hidden="true" className="mb-2 font-mono text-micro text-muted">
        <span className="text-primary">/</span>
        {id}
      </p>
      <h2 id={id} className={h2}>
        {heading}
      </h2>
    </>
  );
}

export default async function NotableLearningPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const c = content[locale as Locale];
  const s = site[locale as Locale];

  return (
    <>
      <JsonLd data={techArticleJsonLd(meta(locale as Locale))} />
      <header className="mx-auto flex max-w-[720px] flex-wrap items-baseline justify-between gap-x-5 gap-y-2 px-5 pt-6 sm:px-9">
        <Brand aria={s.ui.brandAria} back />
        <div className="flex flex-wrap items-baseline gap-x-5 gap-y-2">
          <p className="font-mono text-micro text-muted">
            <span aria-hidden="true" className="text-primary">/</span>{c.pathSegments[0]}
            <span aria-hidden="true" className="text-primary">/</span>{c.pathSegments[1]}
          </p>
          <LocaleSwitcher
            locale={locale as Locale}
            href="/proyectos/notable-learning"
            aria={s.ui.langAria}
          />
        </div>
      </header>

      <main id="contenido">
        <article className="mx-auto max-w-[720px] px-5 pb-16 pt-16 sm:px-9 sm:pt-24">
          <header>
            <p className="mb-4 font-mono text-micro text-muted">
              {c.kicker}
            </p>
            <h1 className="display text-balance text-display font-bold">
              Notable Learning<span aria-hidden="true" className="text-primary">.</span>
            </h1>
            <p className="mt-5 max-w-[60ch] text-title leading-[1.7]">
              {c.lead}
            </p>
            <section
              aria-label={c.tldr.heading}
              className="rounded-sm mt-8 bg-accent-muted px-6 py-3 sm:px-8 sm:py-4"
            >
              <dl>
                {c.tldr.rows.map((row) => (
                  <div
                    key={row.term}
                    className="grid gap-1 border-b border-rule py-3.5 sm:grid-cols-[7rem_1fr] sm:gap-6"
                  >
                    <dt className="font-mono text-micro leading-[1.7] text-muted">{row.term}</dt>
                    <dd className="text-small">{row.text}</dd>
                  </div>
                ))}
                <div className="grid gap-2 py-3.5 sm:grid-cols-[7rem_1fr] sm:gap-6">
                  <dt className="font-mono text-micro leading-[1.7] text-muted">
                    {c.tldr.resultTerm}
                  </dt>
                  <dd className="flex flex-wrap gap-x-step-48 gap-y-step-24">
                    {c.chips.map((chip) => (
                      <Evidence key={chip.value} value={chip.value} source={chip.source} />
                    ))}
                  </dd>
                </div>
              </dl>
            </section>
            <p className="mt-6 font-mono text-micro leading-[1.8] text-muted">
              {s.anchorProject.stack.join(" · ")}
            </p>
            <div className="mt-10 h-px bg-rule sm:mt-12" />
          </header>

          <section className={sectionGap} aria-labelledby={c.context.id}>
            <CaseHeading id={c.context.id} heading={c.context.heading} />
            <div className={`mt-4 space-y-4 ${body}`}>
              {c.context.body.map((paragraph, i) => (
                <p key={i}>{paragraph}</p>
              ))}
            </div>
            <SchemaFigure id="schema-case" className="mt-8" {...s.schemaFigure} />
          </section>

          <section className={sectionGap} aria-labelledby={c.decision.id}>
            <CaseHeading id={c.decision.id} heading={c.decision.heading} />
            <p className={`mt-4 ${body}`}>{c.decision.intro}</p>
            <ol className="mt-6">
              {c.decision.principles.map((p, i) => (
                <li key={p.title} className={`flex gap-4 border-t border-rule py-5 ${i === c.decision.principles.length - 1 ? "border-b" : ""}`}>
                  <span aria-hidden="true" className="pt-0.5 font-mono text-micro text-primary">
                    0{i + 1}
                  </span>
                  <div>
                    <h3 className="text-title font-semibold">{p.title}</h3>
                    <p className="mt-1.5 max-w-[58ch] text-small">{p.text}</p>
                  </div>
                </li>
              ))}
            </ol>
            <p className={`mt-6 ${body}`}>{c.decision.outro}</p>
          </section>

          <section className={sectionGap} aria-labelledby={c.war.id}>
            <CaseHeading id={c.war.id} heading={c.war.heading} />
            <p className={`mt-4 ${body}`}>{c.war.intro}</p>
            <ul className="mt-6">
              {c.war.layers.map((l, i) => (
                <li key={l.label} className={`border-t border-rule py-5 ${i === c.war.layers.length - 1 ? "border-b" : ""}`}>
                  <p className="font-mono text-micro text-primary">{l.label}</p>
                  <h3 className="mt-1.5 text-title font-semibold">{l.title}</h3>
                  <p className="mt-1.5 max-w-[58ch] text-small">{l.text}</p>
                </li>
              ))}
            </ul>
            <PipelineFigure
              id="pipeline-pdf"
              className="mt-8"
              {...c.war.figure}
              steps={c.war.layers.map(({ label, title }) => ({ label, title }))}
            />
            <div className={`mt-8 space-y-4 ${body}`}>
              {c.war.after.map((paragraph, i) => (
                <p key={i}>{paragraph}</p>
              ))}
            </div>
          </section>

          <section className={sectionGap} aria-labelledby={c.guards.id}>
            <CaseHeading id={c.guards.id} heading={c.guards.heading} />
            <p className={`mt-4 ${body}`}>{c.guards.body}</p>
            <blockquote className="mt-10 max-w-[56ch]">
              <span aria-hidden="true" className="mb-5 block h-0.5 w-9 bg-primary" />
              <p className="display-md text-display-md font-medium leading-[1.45]">
                {c.guards.quote}
              </p>
            </blockquote>
          </section>

          <section className={sectionGap} aria-labelledby={c.better.id}>
            <CaseHeading id={c.better.id} heading={c.better.heading} />
            <p className={`mt-4 ${body}`}>{c.better.body}</p>
          </section>

          <section className={sectionGap} aria-labelledby={c.close.id}>
            <CaseHeading id={c.close.id} heading={c.close.heading} />
            <p className={`mt-4 mb-7 ${body}`}>{c.close.body}</p>
            {/* Link de next-intl: pone el prefijo del locale actual. */}
            <Link
              href={{ pathname: "/", hash: sectionIds.work }}
              className="text-small font-medium underline decoration-rule underline-offset-[5px] transition-colors hover:text-primary hover:decoration-primary"
            >
              <span aria-hidden="true" className="text-primary">←</span> {c.close.backLabel}
            </Link>
          </section>

          <footer className="mt-14 border-t border-rule pt-6 sm:mt-16">
            <p className="mb-3 font-mono text-micro tracking-[0.04em] text-muted">{c.notesLabel}</p>
            <ol className="space-y-2.5">
              {c.notes.map((nota, i) => (
                <li key={nota} id={`nota-${i + 1}`} className="flex max-w-[62ch] gap-3 text-small leading-[1.6] text-muted">
                  <a href={`#ref-${i + 1}`} aria-label={c.backToRefAria(i + 1)} className="font-mono text-micro text-primary no-underline">
                    {i + 1}
                  </a>
                  <span>{nota}</span>
                </li>
              ))}
            </ol>
          </footer>
        </article>
      </main>
    </>
  );
}
