import { setRequestLocale } from "next-intl/server";
import { Evidence } from "@/components/Evidence";
import { LocaleSwitcher } from "@/components/LocaleSwitcher";
import { SectionHeading } from "@/components/SectionHeading";
import { content, identity, type Locale } from "@/content/site";
import { Link } from "@/i18n/navigation";

const container = "mx-auto max-w-[880px] px-5 sm:px-9";
const sectionGap = "pt-24 sm:pt-32";

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const { ui, hero, projects, experience, stack, aiWorkflow } = content[locale as Locale];

  return (
    <>
      <header className={`${container} flex flex-wrap items-baseline justify-between gap-x-5 gap-y-2 pt-6`}>
        <p className="font-mono text-micro font-medium">georgepuma.dev</p>
        <div className="flex flex-wrap items-baseline gap-x-5 gap-y-2">
          <nav aria-label={ui.sectionsAria} className="flex flex-wrap gap-x-4 gap-y-2 font-mono text-micro">
            {Object.values(ui.sections).map((s) => (
              <a key={s} href={`#${s}`} className="text-muted transition-colors hover:text-copper">
                /{s}
              </a>
            ))}
          </nav>
          <LocaleSwitcher locale={locale as Locale} href="/" aria={ui.langAria} />
        </div>
      </header>

      <main id="contenido">
        {/* ── Hero ───────────────────────────────────────────── */}
        <section className={`${container} pt-16 sm:pt-24`}>
          <p className="mb-6 font-mono text-micro tracking-[0.03em] text-muted">
            {identity.fullName} <span aria-hidden="true" className="text-copper">·</span>{" "}
            {ui.metaLine[0]} <span aria-hidden="true" className="text-copper">·</span> {ui.metaLine[1]}{" "}
            <span aria-hidden="true" className="text-copper">·</span> {ui.metaLine[2]}
          </p>
          <h1 className="display max-w-[17ch] text-balance text-display font-bold">
            {hero.headline.replace(/\.$/, "")}
            <span aria-hidden="true" className="text-copper">.</span>{" "}
            <span className="inline-block underline decoration-copper decoration-2 underline-offset-8">
              {hero.thesis}
            </span>
          </h1>
          <p className="mt-6 max-w-[54ch] text-body text-muted">
            <strong className="font-medium text-ink">{hero.positioning.lead}</strong>{" "}
            {hero.positioning.rest}
          </p>
          <ul className="mt-7 flex flex-wrap gap-2.5" aria-label={ui.evidenceAria}>
            {hero.evidence.map((e) => (
              <li key={e.value}>
                <Evidence value={e.value} source={e.source} />
              </li>
            ))}
          </ul>
          <nav aria-label={ui.linksAria} className="mt-8 flex flex-wrap items-center gap-x-5 gap-y-3">
            <a
              href={`mailto:${identity.email}`}
              className="bg-ink px-5 py-2.5 font-mono text-small font-medium text-paper transition-colors hover:bg-copper"
            >
              {ui.writeMe}
            </a>
            {[
              { href: identity.github, label: "GitHub ↗" },
              { href: identity.linkedin, label: "LinkedIn ↗" },
              { href: identity.cvUrl, label: ui.cvLabel },
            ].map((l) => (
              <a
                key={l.label}
                href={l.href}
                rel="noopener"
                className="font-mono text-small font-medium underline decoration-line underline-offset-[5px] transition-colors hover:text-copper hover:decoration-copper"
              >
                {l.label}
              </a>
            ))}
          </nav>
        </section>

        {/* ── Proyectos ──────────────────────────────────────── */}
        <section aria-labelledby={ui.sections.projects} className={`${container} ${sectionGap} scroll-mt-6`} id={ui.sections.projects}>
          <SectionHeading id={`${ui.sections.projects}-h`} label={ui.sections.projects} />
          <ul>
            {projects.map((p, i) => (
              <li key={p.slug} className={`border-line py-9 ${i > 0 ? "border-t" : ""}`}>
                <h3 className="display-md text-display-md font-semibold">{p.name}</h3>
                <p className="mt-1.5 font-mono text-micro text-muted">{p.role}</p>
                <p className="mt-4 max-w-[62ch] text-body text-muted">{p.summary}</p>
                <div className="mt-5 flex flex-wrap gap-2.5">
                  {p.evidence.map((e) => (
                    <Evidence key={e.value} value={e.value} source={e.source} />
                  ))}
                </div>
                <p className="mt-5 font-mono text-micro leading-[1.8] text-muted">
                  {p.stack.join(" · ")}
                </p>
                {p.link.external ? (
                  <a
                    href={p.link.href}
                    rel="noopener"
                    className="mt-5 inline-block font-mono text-small font-medium underline decoration-line underline-offset-[5px] transition-colors hover:text-copper hover:decoration-copper"
                  >
                    <span aria-hidden="true" className="text-copper">↗</span> {p.link.label}
                  </a>
                ) : (
                  <Link
                    // ponytail: el único link interno; si aparece otro, tipar Project.link.href
                    href={p.link.href as "/proyectos/notable-learning"}
                    className="mt-5 inline-block font-mono text-small font-medium underline decoration-line underline-offset-[5px] transition-colors hover:text-copper hover:decoration-copper"
                  >
                    <span aria-hidden="true" className="text-copper">→</span> {p.link.label}
                  </Link>
                )}
              </li>
            ))}
          </ul>
        </section>

        {/* ── IA ─────────────────────────────────────────────── */}
        <section aria-labelledby={ui.sections.ai} className={`${container} ${sectionGap} scroll-mt-6`} id={ui.sections.ai}>
          <SectionHeading id={`${ui.sections.ai}-h`} label={ui.sections.ai} />
          <div className="max-w-[65ch] space-y-5 text-body leading-[1.75]">
            <p>
              <strong className="font-medium">{aiWorkflow.intro.lead}</strong>{" "}
              {aiWorkflow.intro.rest}
            </p>
            <p className="text-muted">{aiWorkflow.highlight}</p>
            <p className="text-muted">{aiWorkflow.honestyIntro}</p>
          </div>

          {/* La pull quote es el segundo momento tipográfico del sitio. */}
          <blockquote className="mt-10 max-w-[36rem] sm:mt-12">
            <span aria-hidden="true" className="mb-5 block h-0.5 w-9 bg-copper" />
            <p className="display-md text-display-md font-medium leading-[1.45]">
              {aiWorkflow.honestyQuote}
            </p>
          </blockquote>

          <div className="mt-10 sm:mt-12">
            <p className="mb-3.5 font-mono text-micro tracking-[0.04em] text-muted">
              {ui.pipelineKicker}
            </p>
            <p className="flex flex-wrap items-center gap-x-2.5 gap-y-2 font-mono text-micro">
              {aiWorkflow.pipeline.map((step, i) => (
                <span key={step} className="contents">
                  {i > 0 && (
                    <span aria-hidden="true" className="text-copper">
                      →
                    </span>
                  )}
                  <span
                    className={
                      i === aiWorkflow.pipeline.length - 1
                        ? "border border-copper px-2.5 py-1.5 text-copper"
                        : "border border-line px-2.5 py-1.5"
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
        <section aria-labelledby={ui.sections.experience} className={`${container} ${sectionGap} scroll-mt-6`} id={ui.sections.experience}>
          <SectionHeading id={`${ui.sections.experience}-h`} label={ui.sections.experience} />
          <ol>
            {experience.map((job, i) => (
              <li
                key={job.company}
                className={`grid gap-1 border-line py-7 sm:grid-cols-[10.5rem_1fr] sm:gap-6 ${i > 0 ? "border-t" : ""}`}
              >
                <p className="font-mono text-micro leading-[1.7] text-muted">{job.period}</p>
                <div>
                  <h3 className="text-title font-semibold">
                    {job.company} <span className="font-normal text-muted">— {job.role}</span>
                  </h3>
                  <p className="mt-0.5 font-mono text-micro text-muted">{job.location}</p>
                  {job.lines.map((line) => (
                    <p key={line} className="mt-2 max-w-[56ch] text-small text-muted">
                      {line}
                    </p>
                  ))}
                </div>
              </li>
            ))}
          </ol>
        </section>

        {/* ── Stack ──────────────────────────────────────────── */}
        <section aria-labelledby={ui.sections.stack} className={`${container} ${sectionGap} scroll-mt-6`} id={ui.sections.stack}>
          <SectionHeading id={`${ui.sections.stack}-h`} label={ui.sections.stack} />
          <dl>
            {[stack.primary, stack.solid, stack.growing].map((group, i) => (
              <div
                key={group.label}
                className={`grid gap-1 border-line py-5 sm:grid-cols-[10.5rem_1fr] sm:gap-6 ${i > 0 ? "border-t" : ""}`}
              >
                <dt className="font-mono text-micro leading-[1.7] text-muted">{group.label}</dt>
                <dd className="font-mono text-small leading-[1.9]">{group.items.join(" · ")}</dd>
              </div>
            ))}
          </dl>
        </section>

        {/* ── Contacto ───────────────────────────────────────── */}
        <section aria-labelledby={ui.sections.contact} className={`${container} ${sectionGap} scroll-mt-6 pb-20 sm:pb-24`} id={ui.sections.contact}>
          <SectionHeading id={`${ui.sections.contact}-h`} label={ui.sections.contact} />
          <p className="mb-7 max-w-[55ch] text-body text-muted">
            {ui.contact}
          </p>
          <a
            href={`mailto:${identity.email}`}
            className="display inline-block break-all text-display-md font-bold underline decoration-line decoration-2 underline-offset-8 transition-colors hover:text-copper hover:decoration-copper"
          >
            {identity.email}
          </a>
        </section>
      </main>

      <footer className={`${container} border-t border-line pb-10 pt-6`}>
        <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2 font-mono text-micro text-muted">
          <p>
            © {new Date().getFullYear()} {identity.fullName}
          </p>
          <p>
            Next.js · TypeScript · Vercel ·{" "}
            <a
              href={identity.repo}
              rel="noopener"
              className="underline underline-offset-4 transition-colors hover:text-copper"
            >
              {ui.footerSource}
            </a>
          </p>
        </div>
      </footer>
    </>
  );
}
