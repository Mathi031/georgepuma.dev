import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { Evidence } from "@/components/Evidence";
import { LocaleSwitcher } from "@/components/LocaleSwitcher";
import { content as site, type Locale } from "@/content/site";
import { getPathname, Link } from "@/i18n/navigation";
import { caseStudy as caseEs } from "@/content/notable-learning.es";
import { caseStudy as caseEn } from "@/content/notable-learning.en";

const content: Record<Locale, typeof caseEs> = { es: caseEs, en: caseEn };

const pathnameKey = "/proyectos/notable-learning" as const;

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

const h2 = "display-md text-display-md font-semibold";
const body = "text-body leading-[1.75] text-muted max-w-[65ch]";
const sectionGap = "mt-14 sm:mt-16";

export default async function NotableLearningPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const c = content[locale as Locale];

  return (
    <>
      <header className="mx-auto flex max-w-[720px] flex-wrap items-baseline justify-between gap-x-5 gap-y-2 px-5 pt-6 sm:px-9">
        <Link href="/" className="font-mono text-micro font-medium no-underline transition-colors hover:text-copper">
          <span aria-hidden="true" className="text-copper">←</span> georgepuma.dev
        </Link>
        <div className="flex flex-wrap items-baseline gap-x-5 gap-y-2">
          <p className="font-mono text-micro text-muted">
            <span aria-hidden="true" className="text-copper">/</span>{c.pathSegments[0]}
            <span aria-hidden="true" className="text-copper">/</span>{c.pathSegments[1]}
          </p>
          <LocaleSwitcher
            locale={locale as Locale}
            href="/proyectos/notable-learning"
            aria={site[locale as Locale].ui.langAria}
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
              Notable Learning<span aria-hidden="true" className="text-copper">.</span>
            </h1>
            <p className="mt-5 max-w-[60ch] text-title leading-[1.7] text-muted">
              {c.lead}
            </p>
            <div className="mt-6 flex flex-wrap gap-2.5">
              {c.chips.map((chip) => (
                <Evidence key={chip.value} value={chip.value} source={chip.source} />
              ))}
            </div>
            <p className="mt-6 font-mono text-micro leading-[1.8] text-muted">
              TypeScript · React 19 · Next.js 16 · Prisma · PostgreSQL · GCS · Mux
            </p>
            <div className="mt-10 h-px bg-line sm:mt-12" />
          </header>

          <section className={sectionGap} aria-labelledby={c.context.id}>
            <h2 id={c.context.id} className={h2}>{c.context.heading}</h2>
            <div className={`mt-4 space-y-4 ${body}`}>
              {c.context.body.map((paragraph, i) => (
                <p key={i}>{paragraph}</p>
              ))}
            </div>
          </section>

          <section className={sectionGap} aria-labelledby={c.decision.id}>
            <h2 id={c.decision.id} className={h2}>{c.decision.heading}</h2>
            <p className={`mt-4 ${body}`}>{c.decision.intro}</p>
            <ol className="mt-6">
              {c.decision.principles.map((p, i) => (
                <li key={p.title} className={`flex gap-4 border-t border-line py-5 ${i === c.decision.principles.length - 1 ? "border-b" : ""}`}>
                  <span aria-hidden="true" className="pt-0.5 font-mono text-micro text-copper">
                    0{i + 1}
                  </span>
                  <div>
                    <h3 className="text-title font-semibold">{p.title}</h3>
                    <p className="mt-1.5 max-w-[58ch] text-small text-muted">{p.text}</p>
                  </div>
                </li>
              ))}
            </ol>
            <p className={`mt-6 ${body}`}>{c.decision.outro}</p>
          </section>

          <section className={sectionGap} aria-labelledby={c.war.id}>
            <h2 id={c.war.id} className={h2}>{c.war.heading}</h2>
            <p className={`mt-4 ${body}`}>{c.war.intro}</p>
            <ul className="mt-6">
              {c.war.layers.map((l, i) => (
                <li key={l.label} className={`border-t border-line py-5 ${i === c.war.layers.length - 1 ? "border-b" : ""}`}>
                  <p className="font-mono text-micro text-copper">{l.label}</p>
                  <h3 className="mt-1.5 text-title font-semibold">{l.title}</h3>
                  <p className="mt-1.5 max-w-[58ch] text-small text-muted">{l.text}</p>
                </li>
              ))}
            </ul>
            <div className={`mt-6 space-y-4 ${body}`}>
              {c.war.after.map((paragraph, i) => (
                <p key={i}>{paragraph}</p>
              ))}
            </div>
          </section>

          <section className={sectionGap} aria-labelledby={c.guards.id}>
            <h2 id={c.guards.id} className={h2}>{c.guards.heading}</h2>
            <p className={`mt-4 ${body}`}>{c.guards.body}</p>
            <blockquote className="mt-10 max-w-[56ch]">
              <span aria-hidden="true" className="mb-5 block h-0.5 w-9 bg-copper" />
              <p className="display-md text-display-md font-medium leading-[1.45]">
                {c.guards.quote}
              </p>
            </blockquote>
          </section>

          <section className={sectionGap} aria-labelledby={c.better.id}>
            <h2 id={c.better.id} className={h2}>{c.better.heading}</h2>
            <p className={`mt-4 ${body}`}>{c.better.body}</p>
          </section>

          <section className={sectionGap} aria-labelledby={c.close.id}>
            <h2 id={c.close.id} className={h2}>{c.close.heading}</h2>
            <p className={`mt-4 mb-7 ${body}`}>{c.close.body}</p>
            {/* href con prefijo de locale hardcodeado en el contenido; <a> plano. */}
            <a
              href={c.close.backHref}
              className="font-mono text-small font-medium underline decoration-line underline-offset-[5px] transition-colors hover:text-copper hover:decoration-copper"
            >
              <span aria-hidden="true" className="text-copper">←</span> {c.close.backLabel}
            </a>
          </section>

          <footer className="mt-14 border-t border-line pt-6 sm:mt-16">
            <p className="mb-3 font-mono text-micro tracking-[0.04em] text-muted">{c.notesLabel}</p>
            <ol className="space-y-2.5">
              {c.notes.map((nota, i) => (
                <li key={nota} id={`nota-${i + 1}`} className="flex max-w-[62ch] gap-3 text-small leading-[1.6] text-muted">
                  <a href={`#ref-${i + 1}`} aria-label={c.backToRefAria(i + 1)} className="font-mono text-micro text-copper no-underline">
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
