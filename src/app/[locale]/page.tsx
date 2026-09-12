import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { ActiveSection } from "@/components/ActiveSection";
import { Brand } from "@/components/Brand";
import { JsonLd } from "@/components/JsonLd";
import { LocaleSwitcher } from "@/components/LocaleSwitcher";
import { ScreenshotFrame } from "@/components/ScreenshotFrame";
import { SectionHeading } from "@/components/SectionHeading";
import { SocialIcon } from "@/components/SocialIcon";
import { SchemaFigure, SchemaFigureVertical } from "@/components/figures/SchemaFigure";
import { Badge } from "@/components/ui/Badge";
import { ButtonLink, buttonLinkClass } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { MetricList, MetricWithContext } from "@/components/ui/MetricWithContext";
import { TagList } from "@/components/ui/Tag";
import {
  content,
  identity,
  sectionIds,
  type Locale,
} from "@/content/site";
import { Link } from "@/i18n/navigation";
import { pageMetadata, personJsonLd } from "@/lib/seo";

const container = "mx-auto max-w-[880px] px-5 sm:px-9";
const sectionGap = "pt-24 sm:pt-32";
/**
 * Nombre accesible del enlace de una card: tres cards dicen "Leer el
 * mini-caso →", así que se añade el proyecto. El texto visible va primero
 * (WCAG 2.5.3) y la flecha se omite: es visual, no se lee.
 */
const linkName = (label: string, name: string) => `${label.replace(/\s*[→↗]$/u, "")}: ${name}`;

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
  const {
    ui,
    hero,
    anchorProject,
    cleoSpa,
    gridProjects,
    schemaFigure,
    experience,
    stack,
    aiWorkflow,
  } = content[locale as Locale];

  // Menores: los tres proyectos del grid salvo Cleo Spa, que es la destacada
  // secundaria. La card "menor" usa `crop` (16:10) si el proyecto lo trae.
  const minorProjects = gridProjects
    .filter((p) => p.slug !== "cleo-spa")
    .map((p) => ({ ...p, capture: p.crop ?? p.image }));

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
          className={`mx-auto max-w-(--container-page) px-5 sm:px-9 xl:px-10 ${sectionGap} scroll-mt-6`}
          id={sectionIds.work}
        >
          <SectionHeading id={`${sectionIds.work}-h`} label={ui.headings.work} index="01" />

          {/* Notable Learning — destacada: la card ES el article (borde, regla
              y raíz de a11y viven en él). Grid 7/5 en xl, apilada antes. */}
          <Card
            as="article"
            data-level="destacado"
            className="mt-step-32 grid grid-safe gap-x-step-48 gap-y-step-32 px-step-32 pb-step-32 pt-step-32 xl:grid-cols-[7fr_5fr]"
          >
            <div className="min-w-0">
              <h3 className="text-h3-featured font-semibold">{anchorProject.name}</h3>
              <p className="mt-step-8 font-mono text-metadata uppercase text-muted">{anchorProject.meta}</p>
              <p className="mt-step-16 max-w-[62ch] text-body-small">{anchorProject.summary}</p>
              {anchorProject.decision ? (
                <p className="mt-step-16 max-w-[62ch] text-body-small">{anchorProject.decision}</p>
              ) : null}
              <MetricList layout="row" items={anchorProject.proofs} className="mt-step-32" />
              <TagList items={anchorProject.stack} className="mt-step-32" />
              {!anchorProject.link.external && (
                <Link
                  href={anchorProject.link.href}
                  aria-label={linkName(anchorProject.link.label, anchorProject.name)}
                  className={`${buttonLinkClass("tertiary")} mt-step-32`}
                >
                  {anchorProject.link.label}
                </Link>
              )}
            </div>
            {/* xl: ocupa la columna 5/12; <430: SchemaFigure conmuta sola al
                vertical por CSS (max-[430px]). */}
            <div className="min-w-0">
              <SchemaFigure id="schema-home" {...schemaFigure} />
              <SchemaFigureVertical id="schema-home" {...schemaFigure} />
            </div>
          </Card>

          {/* Cleo Spa — destacada secundaria: grid 6/6, captura a la derecha
              desde xl, debajo a ancho completo antes. */}
          <Card
            as="article"
            data-level="destacado-secundario"
            className="mt-step-32 grid grid-safe gap-x-step-48 gap-y-step-24 xl:grid-cols-2"
          >
            <div className="min-w-0">
              <Badge variant="outline">{cleoSpa.badge}</Badge>
              <h3 className="mt-step-16 text-h3 font-semibold">{cleoSpa.name}</h3>
              <p className="mt-step-8 font-mono text-metadata uppercase text-muted">{cleoSpa.meta}</p>
              <p className="mt-step-16 max-w-[62ch] text-body-small">{cleoSpa.summary}</p>
              <MetricList layout="row" items={cleoSpa.proofs} className="mt-step-24" />
              <TagList items={cleoSpa.stack} className="mt-step-24" />
              {!cleoSpa.link.external && (
                <Link
                  href={cleoSpa.link.href}
                  aria-label={linkName(cleoSpa.link.label, cleoSpa.name)}
                  className={`${buttonLinkClass("tertiary")} mt-step-24`}
                >
                  {cleoSpa.link.label}
                </Link>
              )}
            </div>
            {cleoSpa.image ? (
              <ScreenshotFrame
                image={cleoSpa.image}
                sizes="(min-width: 1280px) 536px, (min-width: 640px) calc(100vw - 72px), calc(100vw - 40px)"
              />
            ) : null}
          </Card>

          {/* Menores: fila de tres desde xl, dos columnas 768–1024, una en
              móvil. projsync sin captura, card `rule`; las otras `surface`. */}
          <ul className="mt-step-32 grid grid-safe grid-cols-1 gap-step-24 sm:grid-cols-2 xl:grid-cols-3">
            {minorProjects.map((p) => (
              <li key={p.slug} className="min-w-0">
                <Card
                  as="article"
                  data-level="menor"
                  variant={p.capture ? "surface" : "rule"}
                  interactive
                  className="h-full"
                >
                  {p.capture ? (
                    <ScreenshotFrame
                      image={p.capture}
                      sizes="(min-width: 1280px) 324px, (min-width: 640px) calc(50vw - 82px), calc(100vw - 74px)"
                    />
                  ) : null}
                  <div className={p.capture ? "mt-step-16" : ""}>
                    <Badge variant="outline">{p.badge}</Badge>
                    <h3 className="mt-step-16 text-h3 font-semibold">{p.name}</h3>
                    <p className="mt-step-8 font-mono text-metadata uppercase text-muted">{p.meta}</p>
                    <p className="mt-step-16 text-body-small">{p.summary}</p>
                    {p.proofs[0] ? (
                      <MetricWithContext
                        value={p.proofs[0].value}
                        context={p.proofs[0].context}
                        size="row"
                        className="mt-step-24"
                      />
                    ) : null}
                    <TagList items={p.stack} className="mt-step-24" />
                    {p.link.external ? (
                      <a
                        href={p.link.href}
                        rel="noopener"
                        aria-label={linkName(p.link.label, p.name)}
                        className={`${buttonLinkClass("tertiary")} mt-step-24`}
                      >
                        {p.link.label}
                      </a>
                    ) : (
                      <Link
                        href={p.link.href}
                        aria-label={linkName(p.link.label, p.name)}
                        className={`${buttonLinkClass("tertiary")} mt-step-24`}
                      >
                        {p.link.label}
                      </Link>
                    )}
                  </div>
                </Card>
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
