import { Evidence } from "@/components/Evidence";
import { LocaleSwitcher } from "@/components/LocaleSwitcher";
import { ScreenshotFrame } from "@/components/ScreenshotFrame";
import { ThemeToggle } from "@/components/ThemeToggle";
import type { MiniCase as MiniCaseContent } from "@/content/mini-case";
import { content as site, type Locale, type Project } from "@/content/site";
import { Link } from "@/i18n/navigation";

type MiniCaseProps = {
  locale: Locale;
  /** Ficha del proyecto en site.*.ts: nombre, evidencias y stack salen de ahí. */
  project: Project;
  c: MiniCaseContent;
};

const h2 = "display-md text-display-md font-semibold";
const sectionGap = "mt-14 sm:mt-16";

/**
 * Plantilla de mini-caso: misma jerarquía y mismos dispositivos que el caso
 * de estudio (cabecera de ruta, ficha TL;DR en cobre, encabezados con kicker)
 * pero en una pantalla y media. Los tres mini-casos la comparten para que se
 * lean como un mismo formato y no como tres páginas parecidas.
 *
 * El nombre, las fichas de evidencia y el stack no se duplican aquí: vienen
 * de site.*.ts, que es lo que ya afirma la tarjeta del grid.
 */
export function MiniCase({ locale, project, c }: MiniCaseProps) {
  const s = site[locale];

  return (
    <>
      <header className="mx-auto flex max-w-[720px] flex-wrap items-baseline justify-between gap-x-5 gap-y-2 px-5 pt-6 sm:px-9">
        <Link
          href="/"
          className="font-mono text-micro font-medium no-underline transition-colors hover:text-copper"
        >
          <span aria-hidden="true" className="text-copper">←</span> georgepuma.dev
        </Link>
        <div className="flex flex-wrap items-baseline gap-x-5 gap-y-2">
          <p className="font-mono text-micro text-muted">
            <span aria-hidden="true" className="text-copper">/</span>{c.pathSegments[0]}
            <span aria-hidden="true" className="text-copper">/</span>{c.pathSegments[1]}
          </p>
          <LocaleSwitcher locale={locale} href={c.route} aria={s.ui.langAria} />
          <ThemeToggle aria={s.ui.themeAria} />
        </div>
      </header>

      <main id="contenido">
        <article className="mx-auto max-w-[720px] px-5 pb-16 pt-16 sm:px-9 sm:pt-24">
          <header>
            <p className="mb-4 font-mono text-micro text-muted">{c.kicker}</p>
            <h1 className="display text-balance text-display font-bold">
              {project.name}
              <span aria-hidden="true" className="text-copper">.</span>
            </h1>
            <p className="mt-5 max-w-[60ch] text-title leading-[1.7]">{c.lead}</p>
            <section
              aria-label={c.tldr.heading}
              className="calibrated mt-8 bg-copper-surface px-6 py-3 [--corner-size:18px] sm:px-8 sm:py-4"
            >
              <dl>
                {c.tldr.rows.map((row) => (
                  <div
                    key={row.term}
                    className="grid gap-1 border-b border-line py-3.5 sm:grid-cols-[7rem_1fr] sm:gap-6"
                  >
                    <dt className="font-mono text-micro leading-[1.7] text-muted">{row.term}</dt>
                    <dd className="text-small">{row.text}</dd>
                  </div>
                ))}
                <div className="grid gap-2 py-3.5 sm:grid-cols-[7rem_1fr] sm:gap-6">
                  <dt className="font-mono text-micro leading-[1.7] text-muted">
                    {c.tldr.resultTerm}
                  </dt>
                  <dd className="flex flex-wrap gap-2.5">
                    {project.evidence.map((chip) => (
                      <Evidence key={chip.value} value={chip.value} source={chip.source} />
                    ))}
                  </dd>
                </div>
              </dl>
            </section>
            <p className="mt-6 font-mono text-micro leading-[1.8] text-muted">
              {project.stack.join(" · ")}
            </p>
            <div className="mt-10 h-px bg-line sm:mt-12" />
          </header>

          {/* Las capturas van antes que las decisiones: en un mini-caso la
              evidencia entra primero y el argumento la explica. */}
          <section className={sectionGap} aria-labelledby={c.shots.id}>
            <p aria-hidden="true" className="mb-2 font-mono text-micro text-muted">
              <span className="text-copper">/</span>
              {c.shots.id}
            </p>
            <h2 id={c.shots.id} className={h2}>
              {c.shots.heading}
            </h2>
            <div className="mt-6 space-y-8">
              {c.shots.frames.map((frame) => (
                <ScreenshotFrame
                  key={frame.image.src}
                  image={frame.image}
                  caption={frame.caption}
                />
              ))}
            </div>
          </section>

          <section className={sectionGap} aria-labelledby={c.decisions.id}>
            <p aria-hidden="true" className="mb-2 font-mono text-micro text-muted">
              <span className="text-copper">/</span>
              {c.decisions.id}
            </p>
            <h2 id={c.decisions.id} className={h2}>
              {c.decisions.heading}
            </h2>
            <ol className="mt-6">
              {c.decisions.items.map((item, i) => (
                <li
                  key={item.title}
                  className={`flex gap-4 border-t border-line py-5 ${i === c.decisions.items.length - 1 ? "border-b" : ""}`}
                >
                  <span aria-hidden="true" className="pt-0.5 font-mono text-micro text-copper">
                    0{i + 1}
                  </span>
                  <div>
                    <h3 className="text-title font-semibold">{item.title}</h3>
                    <p className="mt-1.5 max-w-[58ch] text-small">{item.text}</p>
                  </div>
                </li>
              ))}
            </ol>
          </section>

          <section className={sectionGap} aria-labelledby={c.close.id}>
            <p aria-hidden="true" className="mb-2 font-mono text-micro text-muted">
              <span className="text-copper">/</span>
              {c.close.id}
            </p>
            <h2 id={c.close.id} className={h2}>
              {c.close.heading}
            </h2>
            <p className="mt-4 mb-7 max-w-[65ch] text-body leading-[1.75]">{c.close.body}</p>
            <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
              <a
                href={c.close.liveHref}
                rel="noopener"
                className="bg-ink px-5 py-2.5 text-small font-medium text-paper transition-colors hover:bg-copper"
              >
                <span aria-hidden="true">↗</span> {c.close.liveLabel}
              </a>
              {/* href con prefijo de locale en el contenido; <a> plano, igual
                  que el cierre del caso de estudio. */}
              <a
                href={c.close.backHref}
                className="text-small font-medium underline decoration-line underline-offset-[5px] transition-colors hover:text-copper hover:decoration-copper"
              >
                <span aria-hidden="true" className="text-copper">←</span> {c.close.backLabel}
              </a>
            </div>
          </section>
        </article>
      </main>
    </>
  );
}
