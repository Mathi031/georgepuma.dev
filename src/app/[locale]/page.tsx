import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { ActiveSection } from "@/components/ActiveSection";
import { Brand } from "@/components/Brand";
import { JsonLd } from "@/components/JsonLd";
import { LocaleSwitcher } from "@/components/LocaleSwitcher";
import { ScreenshotFrame } from "@/components/ScreenshotFrame";
import { SectionHeading } from "@/components/SectionHeading";
import { SocialIcon } from "@/components/SocialIcon";
import { SchemaFigure } from "@/components/figures/SchemaFigure";
import { Badge } from "@/components/ui/Badge";
import { ButtonLink, buttonLinkClass } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { MetricList, MetricWithContext } from "@/components/ui/MetricWithContext";
import { TagList } from "@/components/ui/Tag";
import {
  content,
  identity,
  sectionIds,
  type ExperienceItem,
  type Locale,
} from "@/content/site";
import { Link } from "@/i18n/navigation";
import { pageMetadata, personJsonLd } from "@/lib/seo";

const container = "mx-auto max-w-(--container-page) px-5 sm:px-9 xl:px-10";
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

/**
 * Cabecera de un puesto: meta, titular e impacto. La comparten el <summary>
 * de los expandibles y el <div> del compacto, por eso los textos van en
 * <span class="block">: el modelo de contenido de <summary> es phrasing más
 * un encabezado, y un <p> ahí no es marcado válido.
 */
function JobHeader({ job }: { job: ExperienceItem }) {
  return (
    <div className="min-w-0">
      <span className="relative block font-mono text-metadata uppercase text-muted md:before:absolute md:before:top-[0.55em] md:before:-left-[36px] md:before:size-[7px] md:before:rounded-full md:before:bg-text">
        <span className="nowrap-token">{job.period}</span>&nbsp;·&nbsp;{job.type}&nbsp;·&nbsp;
        {job.location}
      </span>
      <h3 className="mt-step-8 text-h3 font-semibold">
        {job.company} — {job.role}
      </h3>
      {/* La jerarquía va por peso y color, no por tamaño: a 390 el
          20/17 anterior no se distinguía. */}
      <span className="mt-step-16 block max-w-[66ch] text-body font-medium">{job.impact}</span>
    </div>
  );
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

  // Cleo Spa queda fuera: es la destacada secundaria y se renderiza aparte.
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
          className="order-3 flex w-full flex-wrap gap-x-step-16 [@media(min-width:361px)]:gap-x-step-24 md:order-none md:ml-auto md:w-auto md:pr-step-24"
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
        {/* A ancho completo del contenedor: la regla y la fila de pruebas
            alinean con las secciones de abajo; solo H1 y lead llevan límite
            de lectura. */}
        <section className={`${container} pt-16 sm:pt-24`}>
          <div>
            <p className="font-mono text-metadata uppercase text-muted">{hero.status}</p>
            <Badge variant="accent" className="mt-step-16">
              {ui.availability}
            </Badge>
            <h1 className="mt-step-32 max-w-[680px] font-display text-h1 font-semibold">
              {hero.headline}
            </h1>
            <p className="mt-step-32 max-w-[66ch] text-lead">{hero.lead}</p>
            <hr className="mt-step-48 border-rule" />
            <ul
              aria-label={ui.evidenceAria}
              className="mt-step-32 grid grid-safe gap-x-step-24 gap-y-step-32 md:grid-cols-3"
            >
              {hero.evidence.map((e) => (
                <li key={e.value} className="min-w-0">
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
                href={hero.ctas.cvUrl}
                download
                className="w-full md:w-auto"
              >
                {hero.ctas.cv}
              </ButtonLink>
              <ul className="mt-step-16 flex gap-step-16 md:mt-0 md:ml-auto">
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
          </div>
        </section>

        <section
          aria-labelledby={`${sectionIds.work}-h`}
          className={`${container} ${sectionGap} scroll-mt-6`}
          id={sectionIds.work}
        >
          <SectionHeading id={`${sectionIds.work}-h`} label={ui.headings.work} index="01" />

          <Card
            as="article"
            data-level="destacado"
            className="mt-step-32 grid grid-safe gap-x-step-48 gap-y-step-32 xl:grid-cols-[7fr_5fr]"
          >
            <div className="min-w-0 pt-step-16">
              <p className="font-mono text-metadata uppercase text-muted">{anchorProject.meta}</p>
              <h3 className="mt-step-8 text-h3-featured font-semibold">{anchorProject.name}</h3>
              <p className="mt-step-16 max-w-[62ch] text-body">{anchorProject.summary}</p>
              {anchorProject.decision ? (
                <p className="mt-step-16 max-w-[62ch] text-body">{anchorProject.decision}</p>
              ) : null}
              <hr className="mt-step-32 border-rule" />
              <MetricList layout="row" items={anchorProject.proofs} className="mt-step-24" />
              <TagList items={anchorProject.stack} className="mt-step-24" />
              {!anchorProject.link.external && (
                <Link
                  href={anchorProject.link.href}
                  aria-label={linkName(anchorProject.link.label, anchorProject.name)}
                  className={`${buttonLinkClass("tertiary")} mt-step-24`}
                >
                  {anchorProject.link.label}
                </Link>
              )}
            </div>
            <SchemaFigure id="schema-home" vertical className="pt-step-16" {...schemaFigure} />
          </Card>

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

        <section
          aria-labelledby={`${sectionIds.method}-h`}
          className={`${container} ${sectionGap} scroll-mt-6`}
          id={sectionIds.method}
        >
          <SectionHeading
            id={`${sectionIds.method}-h`}
            label={ui.headings.method}
            kicker={ui.nav.method}
            index="02"
            lead={aiWorkflow.lead}
          />

          <div className="grid grid-safe gap-x-step-48 gap-y-step-24 border-t border-rule pt-step-48 lg:grid-cols-[288px_1fr]">
            <p className="font-mono text-metadata uppercase text-muted">{aiWorkflow.kicker}</p>
            <div className="min-w-0">
              <div className="max-w-[66ch] space-y-step-24 text-body">
                <p>
                  <strong className="font-medium">{aiWorkflow.intro.lead}</strong>{" "}
                  {aiWorkflow.intro.rest}
                </p>
                <p>{aiWorkflow.highlight}</p>
                <p>{aiWorkflow.honestyIntro}</p>
              </div>

              <blockquote className="mt-step-32 max-w-[60ch] border-l border-text pl-step-32">
                <p className="text-h3-featured font-normal">{aiWorkflow.honestyQuote}</p>
              </blockquote>

              {/* En HTML y no con PipelineFigure: aquí el texto es texto. */}
              <figure className="mt-step-48">
                <ol aria-label={ui.pipelineKicker} className="flex flex-col md:flex-row md:items-stretch">
                  {aiWorkflow.pipeline.map((step, i) => {
                    const last = i === aiWorkflow.pipeline.length - 1;
                    return (
                      <li key={step} className="flex min-w-0 flex-col md:flex-auto md:flex-row">
                        {i > 0 && (
                          <span aria-hidden="true" className="flex flex-none items-center justify-center self-center md:w-step-16">
                            <svg
                              width="24"
                              height="24"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              className="rotate-90 md:rotate-0"
                            >
                              <path d="M0 12h23M18 7l5 5-5 5" />
                            </svg>
                          </span>
                        )}
                        <span
                          className={`flex min-w-0 items-center px-step-12 py-step-12 font-mono text-metadata uppercase md:flex-auto md:justify-center md:text-center ${last
                              ? "border-[1.25px] border-primary bg-accent-muted text-primary"
                              : "border-[1.25px] border-text bg-surface"
                            }`}
                        >
                          {step}
                        </span>
                      </li>
                    );
                  })}
                </ol>
                <figcaption className="mt-step-16 text-caption text-muted">{aiWorkflow.pipelineNote}</figcaption>
              </figure>
            </div>
          </div>

          <div className="mt-step-48 grid grid-safe gap-x-step-48 gap-y-step-24 border-t border-rule pt-step-48 lg:grid-cols-[288px_1fr]">
            <p className="font-mono text-metadata uppercase text-muted">{aiWorkflow.quality.kicker}</p>
            <ol className="min-w-0 space-y-step-16">
              {aiWorkflow.quality.items.map((item, i) => (
                <li key={item} className="grid grid-cols-[48px_1fr] gap-x-step-8 text-body">
                  <span aria-hidden="true" className="font-mono text-numeral-list font-medium leading-[1.65] text-primary">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="max-w-[66ch]">{item}</span>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section
          aria-labelledby={`${sectionIds.experience}-h`}
          className={`${container} ${sectionGap} scroll-mt-6`}
          id={sectionIds.experience}
        >
          <SectionHeading
            id={`${sectionIds.experience}-h`}
            label={ui.headings.experience}
            kicker={ui.headings.experienceKicker}
            index="03"
          />

          {/* Accordion nativo: <details> por puesto, sin JS ni estado. El
              primero abre por defecto y abrir uno no cierra los demás, que es
              el comportamiento por defecto de <details> sin atributo name. */}
          <div className="grid grid-safe gap-x-step-48 gap-y-step-48 xl:grid-cols-[8fr_4fr]">
            <div className="min-w-0">
            <ol className="min-w-0 md:border-l md:border-text">
              {experience.filter((job) => !job.group).map((job, i) => (
                <li
                  key={job.company}
                  className="border-t border-rule md:ml-step-32 md:first:border-t-0"
                >
                  {job.compact ? (
                    <div className="py-step-24">
                      <JobHeader job={job} />
                    </div>
                  ) : (
                    <details className="group" open={i === 0}>
                      {/* list-none más el pseudo-elemento de WebKit: el
                          triángulo nativo se retira en los dos motores. La
                          retícula deja el indicador a la derecha y el resto
                          de la cabecera en la primera columna. */}
                      <summary className="grid cursor-pointer list-none grid-cols-[1fr_auto] items-start gap-x-step-16 py-step-24 [&::-webkit-details-marker]:hidden">
                        <JobHeader job={job} />
                        <span
                          aria-hidden="true"
                          className="font-mono text-h3 leading-[1.2] text-muted"
                        >
                          <span className="group-open:hidden">+</span>
                          <span className="hidden group-open:inline">−</span>
                        </span>
                      </summary>
                      <dl className="motion-accordion pb-step-32">
                        {[
                          { label: ui.experience.context, body: <p className="max-w-[66ch] text-body-small">{job.context}</p> },
                          {
                            label: ui.experience.scope,
                            body: (
                              <ol className="grid gap-y-step-8">
                                {(job.scope ?? []).map((item, n) => (
                                  <li key={item} className="grid grid-cols-[32px_1fr] gap-x-step-8 text-body-small">
                                    <span
                                      aria-hidden="true"
                                      className="font-mono text-numeral-list font-medium leading-[1.6] text-primary"
                                    >
                                      {String(n + 1).padStart(2, "0")}
                                    </span>
                                    <span className="max-w-[66ch]">{item}</span>
                                  </li>
                                ))}
                              </ol>
                            ),
                          },
                          {
                            label: ui.experience.result,
                            body: (
                              <>
                                <p className="max-w-[66ch] text-body-small">{job.result}</p>
                                {job.resultLink ? (
                                  <Link
                                    href={job.resultLink.href}
                                    className={`${buttonLinkClass("tertiary")} mt-step-8`}
                                  >
                                    {job.resultLink.label}
                                  </Link>
                                ) : null}
                              </>
                            ),
                          },
                          { label: ui.experience.tech, body: <TagList items={job.tech ?? []} /> },
                        ].map(({ label, body }) => (
                          <div
                            key={label}
                            className="grid gap-y-step-8 border-t border-rule py-step-16 lg:grid-cols-[3fr_9fr] lg:gap-x-step-24"
                          >
                            <dt className="font-mono text-metadata uppercase text-muted">{label}</dt>
                            <dd className="min-w-0">{body}</dd>
                          </div>
                        ))}
                      </dl>
                    </details>
                  )}
                </li>
              ))}
            </ol>

            {/* La etiqueta de grupo divide la trayectoria: no pertenece al
                puesto que le sigue, así que va fuera de la lista y el grupo
                abre su propia lista. */}
            {experience
              .filter((job) => job.group)
              .map((job) => (
                <div key={job.company}>
                  <p className="border-t border-rule pt-step-32 font-mono text-metadata uppercase text-muted md:ml-step-32">
                    {job.group}
                  </p>
                  <ol className="min-w-0 md:border-l md:border-text">
                    <li className="md:ml-step-32">
                      <div className="py-step-24">
                        <JobHeader job={job} />
                      </div>
                    </li>
                  </ol>
                </div>
              ))}
            </div>

            <div id={sectionIds.stack} className="min-w-0 self-start border-t border-rule pt-10 scroll-mt-6">
              <h3 className="font-mono text-metadata uppercase text-muted">{ui.headings.stack}</h3>
              <dl className="mt-step-24 space-y-step-24">
                {[stack.primary, stack.solid, stack.growing].map((group) => (
                  <div key={group.label}>
                    <dt className="font-mono text-metadata uppercase text-muted">{group.label}</dt>
                    <dd className="mt-step-8 font-mono text-body-small">{group.items.join(" · ")}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </section>

        <section
          aria-labelledby={`${sectionIds.contact}-h`}
          className={`${container} ${sectionGap} scroll-mt-6 pb-20 sm:pb-24`}
          id={sectionIds.contact}
        >
          <SectionHeading id={`${sectionIds.contact}-h`} label={ui.headings.contact} index="04" />
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
