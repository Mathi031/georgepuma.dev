import Link from "next/link";
import { setRequestLocale } from "next-intl/server";
import { Evidence } from "@/components/Evidence";
import { SectionHeading } from "@/components/SectionHeading";
import { aiWorkflow, experience, hero, identity, projects, stack } from "@/content/site";

const container = "mx-auto max-w-[880px] px-5 sm:px-9";
const sectionGap = "pt-24 sm:pt-32";

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <>
      <header className={`${container} flex flex-wrap items-baseline justify-between gap-x-5 gap-y-2 pt-6`}>
        <p className="font-mono text-[13px] font-medium">georgepuma.dev</p>
        <nav aria-label="Secciones" className="flex flex-wrap gap-x-4 gap-y-2 font-mono text-[12.5px]">
          {["proyectos", "ia", "experiencia", "stack", "contacto"].map((s) => (
            <a key={s} href={`#${s}`} className="text-muted transition-colors hover:text-copper">
              /{s}
            </a>
          ))}
        </nav>
      </header>

      <main id="contenido">
        {/* ── Hero ───────────────────────────────────────────── */}
        <section className={`${container} pt-16 sm:pt-24`}>
          <p className="mb-6 font-mono text-[12.5px] tracking-[0.03em] text-muted">
            {identity.fullName} <span aria-hidden="true" className="text-copper">·</span>{" "}
            Arequipa, Perú <span aria-hidden="true" className="text-copper">·</span> GMT-5{" "}
            <span aria-hidden="true" className="text-copper">·</span> remoto
          </p>
          <h1 className="display max-w-[17ch] text-balance text-[clamp(36px,5.6vw,56px)] font-bold leading-[1.04]">
            {hero.headline.replace(/\.$/, "")}
            <span aria-hidden="true" className="text-copper">.</span>{" "}
            <span className="inline-block underline decoration-copper decoration-2 underline-offset-8">
              {hero.thesis}
            </span>
          </h1>
          <p className="mt-6 max-w-[54ch] text-[16.5px] leading-[1.7] text-muted">
            <strong className="font-medium text-ink">
              Full Stack Developer — React, Next.js, TypeScript.
            </strong>{" "}
            Cinco años construyendo productos empresariales: EdTech, e-commerce, ERP y
            facturación electrónica. Diseño flujos de desarrollo asistidos por IA y los
            trato como lo que son: ingeniería.
          </p>
          <ul className="mt-7 flex flex-wrap gap-2.5" aria-label="Evidencia verificable">
            {hero.evidence.map((e) => (
              <li key={e.value}>
                <Evidence value={e.value} source={e.source} />
              </li>
            ))}
          </ul>
          <nav aria-label="Enlaces principales" className="mt-8 flex flex-wrap items-center gap-x-5 gap-y-3">
            <a
              href={`mailto:${identity.email}`}
              className="bg-ink px-5 py-2.5 font-mono text-[13.5px] font-medium text-paper transition-colors hover:bg-copper"
            >
              Escríbeme
            </a>
            {[
              { href: identity.github, label: "GitHub ↗" },
              { href: identity.linkedin, label: "LinkedIn ↗" },
              { href: identity.cvUrl, label: "CV en PDF ↓" },
            ].map((l) => (
              <a
                key={l.label}
                href={l.href}
                rel="noopener"
                className="font-mono text-[13.5px] font-medium underline decoration-line underline-offset-[5px] transition-colors hover:text-copper hover:decoration-copper"
              >
                {l.label}
              </a>
            ))}
          </nav>
        </section>

        {/* ── Proyectos ──────────────────────────────────────── */}
        <section aria-labelledby="proyectos" className={`${container} ${sectionGap} scroll-mt-6`} id="proyectos">
          <SectionHeading id="proyectos-h" label="proyectos" />
          <ul>
            {projects.map((p, i) => (
              <li key={p.slug} className={`border-line py-9 ${i > 0 ? "border-t" : ""}`}>
                <h3 className="display-md text-[clamp(21px,3vw,26px)] font-semibold">{p.name}</h3>
                <p className="mt-1.5 font-mono text-[12.5px] text-muted">{p.role}</p>
                <p className="mt-4 max-w-[62ch] text-[15.5px] leading-[1.7] text-muted">{p.summary}</p>
                <div className="mt-5 flex flex-wrap gap-2.5">
                  {p.evidence.map((e) => (
                    <Evidence key={e.value} value={e.value} source={e.source} />
                  ))}
                </div>
                <p className="mt-5 font-mono text-[12.5px] leading-[1.8] text-muted">
                  {p.stack.join(" · ")}
                </p>
                {p.link.external ? (
                  <a
                    href={p.link.href}
                    rel="noopener"
                    className="mt-5 inline-block font-mono text-[13.5px] font-medium underline decoration-line underline-offset-[5px] transition-colors hover:text-copper hover:decoration-copper"
                  >
                    <span aria-hidden="true" className="text-copper">↗</span> {p.link.label}
                  </a>
                ) : (
                  <Link
                    href={p.link.href}
                    className="mt-5 inline-block font-mono text-[13.5px] font-medium underline decoration-line underline-offset-[5px] transition-colors hover:text-copper hover:decoration-copper"
                  >
                    <span aria-hidden="true" className="text-copper">→</span> {p.link.label}
                  </Link>
                )}
              </li>
            ))}
          </ul>
        </section>

        {/* ── IA ─────────────────────────────────────────────── */}
        <section aria-labelledby="ia" className={`${container} ${sectionGap} scroll-mt-6`} id="ia">
          <SectionHeading id="ia-h" label="ia" />
          <div className="max-w-[65ch] space-y-5 text-[15.5px] leading-[1.75]">
            <p>
              <strong className="font-medium">No uso IA como autocompletado: diseño sistemas con ella.</strong>{" "}
              Mi flujo principal es Claude Code — subagentes especializados, servidores MCP y
              comandos propios — y trato la configuración de agentes como lo que es:
              ingeniería, con sus reglas, sus casos borde y su mantenimiento.
            </p>
            <p className="text-muted">{aiWorkflow.highlight}</p>
            <p className="text-muted">{aiWorkflow.honestyIntro}</p>
          </div>

          {/* La pull quote es el segundo momento tipográfico del sitio. */}
          <blockquote className="mt-10 max-w-[36rem] sm:mt-12">
            <span aria-hidden="true" className="mb-5 block h-0.5 w-9 bg-copper" />
            <p className="display-md text-[clamp(21px,3.2vw,30px)] font-medium leading-[1.45]">
              {aiWorkflow.honestyQuote}
            </p>
          </blockquote>

          <div className="mt-10 sm:mt-12">
            <p className="mb-3.5 font-mono text-[11.5px] tracking-[0.04em] text-muted">
              pipeline · revisor de PRs
            </p>
            <p className="flex flex-wrap items-center gap-x-2.5 gap-y-2 font-mono text-[12px]">
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
            <p className="mt-3.5 max-w-[58ch] text-[13.5px] leading-[1.6] text-muted">
              {aiWorkflow.pipelineNote}
            </p>
          </div>
        </section>

        {/* ── Experiencia ────────────────────────────────────── */}
        <section aria-labelledby="experiencia" className={`${container} ${sectionGap} scroll-mt-6`} id="experiencia">
          <SectionHeading id="experiencia-h" label="experiencia" />
          <ol>
            {experience.map((job, i) => (
              <li
                key={job.company}
                className={`grid gap-1 border-line py-7 sm:grid-cols-[10.5rem_1fr] sm:gap-6 ${i > 0 ? "border-t" : ""}`}
              >
                <p className="font-mono text-[12.5px] leading-[1.7] text-muted">{job.period}</p>
                <div>
                  <h3 className="text-[16.5px] font-semibold">
                    {job.company} <span className="font-normal text-muted">— {job.role}</span>
                  </h3>
                  <p className="mt-0.5 font-mono text-[12px] text-muted">{job.location}</p>
                  {job.lines.map((line) => (
                    <p key={line} className="mt-2 max-w-[56ch] text-[14.5px] leading-[1.65] text-muted">
                      {line}
                    </p>
                  ))}
                </div>
              </li>
            ))}
          </ol>
        </section>

        {/* ── Stack ──────────────────────────────────────────── */}
        <section aria-labelledby="stack" className={`${container} ${sectionGap} scroll-mt-6`} id="stack">
          <SectionHeading id="stack-h" label="stack" />
          <dl>
            {[stack.primary, stack.solid, stack.growing].map((group, i) => (
              <div
                key={group.label}
                className={`grid gap-1 border-line py-5 sm:grid-cols-[10.5rem_1fr] sm:gap-6 ${i > 0 ? "border-t" : ""}`}
              >
                <dt className="font-mono text-[12.5px] leading-[1.7] text-muted">{group.label}</dt>
                <dd className="font-mono text-[13.5px] leading-[1.9]">{group.items.join(" · ")}</dd>
              </div>
            ))}
          </dl>
        </section>

        {/* ── Contacto ───────────────────────────────────────── */}
        <section aria-labelledby="contacto" className={`${container} ${sectionGap} scroll-mt-6 pb-20 sm:pb-24`} id="contacto">
          <SectionHeading id="contacto-h" label="contacto" />
          <p className="mb-7 max-w-[55ch] text-[16.5px] leading-[1.7] text-muted">
            Busco roles full stack o frontend, de preferencia remotos. Si crees que encajo
            en tu equipo, escríbeme — respondo siempre.
          </p>
          <a
            href={`mailto:${identity.email}`}
            className="display inline-block break-all text-[clamp(20px,3.6vw,34px)] font-bold underline decoration-line decoration-2 underline-offset-8 transition-colors hover:text-copper hover:decoration-copper"
          >
            {identity.email}
          </a>
        </section>
      </main>

      <footer className={`${container} border-t border-line pb-10 pt-6`}>
        <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2 font-mono text-[12px] text-muted">
          <p>
            © {new Date().getFullYear()} {identity.fullName}
          </p>
          <p>
            Next.js · TypeScript · Vercel ·{" "}
            <a
              href="https://github.com/Mathi031"
              rel="noopener"
              className="underline underline-offset-4 transition-colors hover:text-copper"
            >
              código fuente
            </a>
          </p>
        </div>
      </footer>
    </>
  );
}
