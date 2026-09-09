import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { ActiveSection } from "@/components/ActiveSection";
import { Brand } from "@/components/Brand";
import { Evidence } from "@/components/Evidence";
import { JsonLd } from "@/components/JsonLd";
import { LocaleSwitcher } from "@/components/LocaleSwitcher";
import { ScreenshotFrame } from "@/components/ScreenshotFrame";
import { SectionHeading } from "@/components/SectionHeading";
import { SocialIcon } from "@/components/SocialIcon";
import { SchemaFigure } from "@/components/figures/SchemaFigure";
import { Badge } from "@/components/ui/Badge";
import { ButtonLink } from "@/components/ui/Button";
import { MetricWithContext } from "@/components/ui/MetricWithContext";
import { content, identity, sectionIds, type Locale } from "@/content/site";
import { Link } from "@/i18n/navigation";
import { pageMetadata, personJsonLd } from "@/lib/seo";

const container = "mx-auto max-w-[880px] px-5 sm:px-9";
const sectionGap = "pt-24 sm:pt-32";
const cardLink =
  "mt-4 inline-block text-small font-medium underline decoration-rule underline-offset-[5px] transition-colors hover:text-primary hover:decoration-primary";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const { ui } = content[locale as Locale];
  return pageMetadata({
    locale: locale as Locale,
    href: "/",
    title: ui.meta.title,
    description: ui.meta.description,
    ownTitle: false, // el título de la home es el `default` del layout
  });
}

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const { ui, hero, anchorProject, gridProjects, schemaFigure, experience, stack, aiWorkflow } =
    content[locale as Locale];

  return (
    <>
      <JsonLd data={personJsonLd(locale as Locale)} />
      <header
        className={`${container} flex flex-wrap items-center justify-between gap-y-step-16 pt-step-24 [@media(min-width:361px)]:gap-y-step-24 md:flex-nowrap`}
      >
        <Brand aria={ui.brandAria} />
        <nav
          aria-label={ui.sectionsAria}
          data-section-nav
          className="order-3 flex w-full flex-wrap gap-x-step-16 [@media(min-width:361px)]:gap-x-step-24 md:order-none md:w-auto"
        >
          {(
            [
              [sectionIds.work, ui.nav.work],
              [sectionIds.method, ui.nav.method],
              [sectionIds.experience, ui.nav.experience],
              [sectionIds.contact, ui.nav.contact],
            ] as const
          ).map(([id, label]) => (
            <a
              key={id}
              href={`#${id}`}
              className="inline-flex min-h-11 items-center border-b border-transparent text-body-small font-medium motion-link hover:text-primary aria-[current=location]:border-ink"
            >
              {label}
            </a>
          ))}
        </nav>
        <LocaleSwitcher locale={locale as Locale} href="/" aria={ui.langAria} />
        <ActiveSection />
      </header>

      <main id="contenido">
        {/* ── Hero ───────────────────────────────────────────── */}
        <section className={`${container} pt-16 sm:pt-24`}>
          <div className="flex flex-wrap items-center gap-step-12">
            <Badge variant="accent">{ui.availability}</Badge>
            <p className="font-mono text-metadata text-muted">{hero.status}</p>
          </div>
          <h1 className="mt-step-24 max-w-[20ch] text-balance font-display text-h1 font-semibold">
            {hero.headline}
          </h1>
          <p className="mt-step-32 max-w-[66ch] text-lead">{hero.lead}</p>
          {/* Regla entre filas solo en móvil: en desktop las tres columnas del
              grid ya se distinguen por el espacio horizontal. */}
          <ul
            aria-label={ui.evidenceAria}
            className="mt-step-48 grid grid-safe gap-x-step-24 divide-y divide-rule md:grid-cols-3 md:divide-y-0"
          >
            {hero.evidence.map((e) => (
              <li key={e.value} className="min-w-0 py-step-16 md:py-0">
                <MetricWithContext value={e.value} context={e.source} size="hero" />
              </li>
            ))}
          </ul>
          <nav
            aria-label={ui.linksAria}
            className="mt-step-48 flex flex-col gap-step-16 md:flex-row md:flex-wrap md:items-center"
          >
            <ButtonLink href={`#${sectionIds.work}`} className="w-full md:w-auto">
              {hero.ctas.work}
            </ButtonLink>
            <ButtonLink
              variant="secondary"
              href={identity.cvUrl}
              download
              className="w-full md:w-auto"
            >
              {hero.ctas.cv}
            </ButtonLink>
            <ul className="flex gap-step-8 xl:ml-auto">
              {identity.social.map((s) => (
                <li key={s.name}>
                  <a
                    href={s.href}
                    rel="noopener"
                    className="inline-flex h-11 w-11 items-center justify-center motion-link hover:text-primary"
                  >
                    <SocialIcon name={s.name} />
                    <span className="sr-only">{s.name}</span>
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </section>

        {/* ── Proyectos ──────────────────────────────────────── */}
        <section
          aria-labelledby={`${sectionIds.work}-h`}
          className={`${container} ${sectionGap} scroll-mt-6`}
          id={sectionIds.work}
        >
          <SectionHeading id={`${sectionIds.work}-h`} label={ui.headings.work} index="01" />

          {/* Ancla: Notable Learning ordena la lectura de la sección — y es
              el bloque ancla del home. */}
          <article className="rounded-sm bg-accent-muted px-6 py-8 sm:px-10 sm:py-10">
            <h3 className="display text-display-md font-bold">{anchorProject.name}</h3>
            <p className="mt-1.5 font-mono text-micro text-muted">{anchorProject.role}</p>
            <p className="mt-4 max-w-[62ch] text-body">{anchorProject.summary}</p>
            <div className="mt-5 flex flex-wrap gap-x-step-48 gap-y-step-24">
              {anchorProject.evidence.map((e) => (
                <Evidence key={e.value} value={e.value} source={e.source} />
              ))}
            </div>
            <SchemaFigure id="schema-home" className="mt-8" {...schemaFigure} />
            {anchorProject.image ? (
              <div className="mt-8">
                <ScreenshotFrame image={anchorProject.image} />
              </div>
            ) : null}
            <p className="mt-6 font-mono text-micro leading-[1.8] text-muted">
              {anchorProject.stack.join(" · ")}
            </p>
            <Link
              href="/proyectos/notable-learning"
              className="mt-6 inline-flex min-h-11 items-center rounded-md bg-primary px-5 py-2.5 text-small font-medium text-white transition-colors hover:bg-primary-hover"
            >
              <span aria-hidden="true">→</span> {anchorProject.link.label}
            </Link>
          </article>

          <ul className="mt-2 grid gap-x-10 sm:grid-cols-2">
            {gridProjects.map((p) => (
              <li key={p.slug} className="border-t border-rule py-8">
                {p.image ? (
                  <div className="mb-5">
                    <ScreenshotFrame image={p.image} />
                  </div>
                ) : null}
                <h3 className="display-md text-title font-semibold">{p.name}</h3>
                <p className="mt-1 font-mono text-micro text-muted">{p.role}</p>
                <p className="mt-3 max-w-[62ch] text-small">{p.summary}</p>
                <div className="mt-4 flex flex-wrap gap-x-step-48 gap-y-step-24">
                  {p.evidence.map((e) => (
                    <Evidence key={e.value} value={e.value} source={e.source} />
                  ))}
                </div>
                <p className="mt-4 font-mono text-micro leading-[1.8] text-muted">
                  {p.stack.join(" · ")}
                </p>
                {/* La flecha distingue el destino sin depender del color:
                    ↗ sale del sitio, → se queda dentro. */}
                {p.link.external ? (
                  <a
                    href={p.link.href}
                    rel="noopener"
                    className={cardLink}
                  >
                    <span aria-hidden="true" className="text-primary">↗</span> {p.link.label}
                  </a>
                ) : (
                  <Link href={p.link.href} className={cardLink}>
                    <span aria-hidden="true" className="text-primary">→</span> {p.link.label}
                  </Link>
                )}
              </li>
            ))}
          </ul>
        </section>

        {/* ── IA ─────────────────────────────────────────────── */}
        <section
          aria-labelledby={`${sectionIds.method}-h`}
          className={`${container} ${sectionGap} scroll-mt-6`}
          id={sectionIds.method}
        >
          <SectionHeading id={`${sectionIds.method}-h`} label={ui.headings.method} index="02" />
          <div className="max-w-[65ch] space-y-5 text-body leading-[1.75]">
            <p>
              <strong className="font-medium">{aiWorkflow.intro.lead}</strong>{" "}
              {aiWorkflow.intro.rest}
            </p>
            <p>{aiWorkflow.highlight}</p>
            <p>{aiWorkflow.honestyIntro}</p>
          </div>

          {/* La pull quote sigue siendo el segundo momento tipográfico del
              sitio, pero ya no invierte a papel sobre tinta: el sistema es
              light-only y la elevación se construye con surface + borde, sin
              sombra ni bloque oscuro. La regla de acento marca el arranque. */}
          <div className="mt-10 rounded-md border border-rule bg-surface px-6 py-8 sm:mt-12 sm:px-10 sm:py-10">
            <blockquote className="max-w-[36rem]">
              <span aria-hidden="true" className="mb-5 block h-0.5 w-9 bg-primary" />
              <p className="display-md text-display-md font-medium leading-[1.45]">
                {aiWorkflow.honestyQuote}
              </p>
            </blockquote>
          </div>

          <div className="mt-10 sm:mt-12">
            <p className="mb-3.5 font-mono text-micro tracking-[0.04em] text-muted">
              {ui.pipelineKicker}
            </p>
            <p className="flex flex-wrap items-center gap-x-2.5 gap-y-2 font-mono text-micro">
              {aiWorkflow.pipeline.map((step, i) => (
                <span key={step} className="contents">
                  {i > 0 && (
                    <span aria-hidden="true" className="text-primary">
                      →
                    </span>
                  )}
                  <span
                    className={
                      i === aiWorkflow.pipeline.length - 1
                        ? "border border-primary px-2.5 py-1.5 text-primary"
                        : "border border-rule px-2.5 py-1.5"
                    }
                  >
                    {step}
                  </span>
                </span>
              ))}
            </p>
            <p className="mt-3.5 max-w-[58ch] text-small leading-[1.6] text-muted">
              {aiWorkflow.pipelineNote}
            </p>
          </div>
        </section>

        {/* ── Experiencia ────────────────────────────────────── */}
        <section
          aria-labelledby={`${sectionIds.experience}-h`}
          className={`${container} ${sectionGap} scroll-mt-6`}
          id={sectionIds.experience}
        >
          <SectionHeading id={`${sectionIds.experience}-h`} label={ui.headings.experience} index="03" />
          <ol>
            {experience.map((job, i) => (
              <li
                key={job.company}
                className={`grid gap-1 border-rule py-7 sm:grid-cols-[10.5rem_1fr] sm:gap-6 ${i > 0 ? "border-t" : ""}`}
              >
                <p className="font-mono text-micro leading-[1.7] text-muted">{job.period}</p>
                <div>
                  <h3 className="text-title font-semibold">
                    {job.company} <span className="font-normal text-muted">— {job.role}</span>
                  </h3>
                  <p className="mt-0.5 font-mono text-micro text-muted">{job.location}</p>
                  {job.lines.map((line) => (
                    <p key={line} className="mt-2 max-w-[56ch] text-small">
                      {line}
                    </p>
                  ))}
                </div>
              </li>
            ))}
          </ol>
        </section>

        {/* ── Stack ──────────────────────────────────────────── */}
        <section
          aria-labelledby={`${sectionIds.stack}-h`}
          className={`${container} ${sectionGap} scroll-mt-6`}
          id={sectionIds.stack}
        >
          <SectionHeading id={`${sectionIds.stack}-h`} label={ui.headings.stack} index="04" />
          <dl>
            {[stack.primary, stack.solid, stack.growing].map((group, i) => (
              <div
                key={group.label}
                className={`grid gap-1 border-rule py-5 sm:grid-cols-[10.5rem_1fr] sm:gap-6 ${i > 0 ? "border-t" : ""}`}
              >
                <dt className="font-mono text-micro leading-[1.7] text-muted">{group.label}</dt>
                <dd className="font-mono text-small leading-[1.9]">{group.items.join(" · ")}</dd>
              </div>
            ))}
          </dl>
        </section>

        {/* ── Contacto ───────────────────────────────────────── */}
        <section
          aria-labelledby={`${sectionIds.contact}-h`}
          className={`${container} ${sectionGap} scroll-mt-6 pb-20 sm:pb-24`}
          id={sectionIds.contact}
        >
          <SectionHeading id={`${sectionIds.contact}-h`} label={ui.headings.contact} index="05" />
          <p className="mb-7 max-w-[55ch] text-body">
            {ui.contact}
          </p>
          <a
            href={`mailto:${identity.email}`}
            className="display inline-block break-all text-display-md font-bold underline decoration-rule decoration-2 underline-offset-8 transition-colors hover:text-primary hover:decoration-primary"
          >
            {identity.email}
          </a>
        </section>
      </main>

      <footer
        className={`${container} flex flex-col gap-step-8 border-t border-rule pb-step-64 pt-step-24 font-mono text-metadata text-muted sm:flex-row sm:justify-between`}
      >
        <p>
          © {new Date().getFullYear()} {identity.fullName}
        </p>
        <p>
          <a href={identity.repo} rel="noopener" className="motion-link hover:text-primary">
            {ui.footer.source}
          </a>{" "}
          · <a href={identity.ci} rel="noopener" className="motion-link hover:text-primary">
            {ui.footer.ci}
          </a>
        </p>
      </footer>
    </>
  );
}
