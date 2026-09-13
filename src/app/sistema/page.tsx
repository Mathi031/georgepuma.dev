import type { Metadata } from "next";
import { SectionHeading } from "@/components/SectionHeading";
import { Badge } from "@/components/ui/Badge";
import { Button, ButtonLink } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { Divider } from "@/components/ui/Divider";
import { MetricList, MetricWithContext } from "@/components/ui/MetricWithContext";
import { ProseLink } from "@/components/ui/ProseLink";
import { TagList } from "@/components/ui/Tag";

/**
 * Referencia visual del design system. Es una herramienta de revisión, no una
 * página del sitio: por eso vive fuera de [locale] (no necesita traducción, no
 * entra en InternalRoute ni en el selector de idioma) y va con noindex.
 *
 * No se añade a src/app/sitemap.ts, que enumera sus rutas a mano.
 */
export const metadata: Metadata = {
  title: "Referencia del design system",
  robots: { index: false, follow: false },
};

// El hex es solo etiqueta: la muestra se pinta con var(), así que si
// globals.css cambia y esta lista no, el desajuste se ve en la propia página.
const COLORS: { name: string; value: string; use: string; ratio?: string }[] = [
  { name: "--color-bg", value: "#F6F6F4", use: "Fondo de página" },
  { name: "--color-surface", value: "#FFFFFF", use: "Cards con captura" },
  { name: "--color-surface-muted", value: "#EDEEEA", use: "Chips, código, disabled" },
  { name: "--color-border", value: "#D9DAD6", use: "Reglas finas", ratio: "1.3:1 decorativo" },
  { name: "--color-border-hover", value: "#DEDFDA", use: "Hover de borde" },
  { name: "--color-rule-strong", value: "#17181C", use: "Regla de sección, timeline" },
  { name: "--color-text", value: "#17181C", use: "Tinta principal", ratio: "16.39:1 AAA" },
  { name: "--color-text-secondary", value: "#585B66", use: "Meta, captions", ratio: "6.25:1 AA" },
  { name: "--color-primary", value: "#1B3A5C", use: "Enlaces, CTA, numerales", ratio: "10.74:1 AAA" },
  { name: "--color-primary-hover", value: "#2B5A8C", use: "Hover del primario", ratio: "6.59:1 AA" },
  { name: "--color-accent-muted", value: "#E4EBF3", use: "Badge, nodo, selección", ratio: "9.67:1 con primary" },
  { name: "--color-success", value: "#196B45", use: "Badge semántico", ratio: "6.01:1 AA" },
  { name: "--color-warning", value: "#7D5400", use: "Badge semántico", ratio: "6.18:1 AA" },
  { name: "--color-error", value: "#B3261E", use: "Badge semántico", ratio: "6.04:1 AA" },
  { name: "--color-focus", value: "#1B3A5C", use: "Anillo de foco 2 px" },
];

const TYPE: { role: string; cls: string; spec: string }[] = [
  { role: "h1", cls: "font-display text-h1 font-semibold", spec: "Hanken 600 / 46 / 1.1 / -0.015em" },
  { role: "h2", cls: "font-display text-h2 font-semibold", spec: "Hanken 600 / 32 / 1.2 / -0.015em" },
  { role: "h3-featured", cls: "text-h3-featured font-semibold", spec: "Inter 600 / 22 / 1.3" },
  { role: "h3", cls: "text-h3 font-semibold", spec: "Inter 600 / 20 / 1.4" },
  { role: "lead", cls: "text-lead", spec: "Inter 400 / 20 / 1.5" },
  { role: "body", cls: "text-body", spec: "Inter 400 / 17 / 1.65 / 66ch" },
  { role: "body-small", cls: "text-body-small", spec: "Inter 400 / 15 / 1.6" },
  { role: "metadata", cls: "font-mono text-metadata uppercase", spec: "JetBrains 400 / 12.5 / 0.07em" },
  { role: "label", cls: "text-label font-medium", spec: "Inter 500 / 13 / 0.01em" },
  { role: "code", cls: "font-mono text-code", spec: "JetBrains 400 / 14 / 1.6" },
  { role: "caption", cls: "text-caption", spec: "Inter 400 / 14 / 1.5" },
  { role: "footnote", cls: "text-footnote", spec: "Inter 400 / 13 / 1.5" },
  { role: "numeral", cls: "font-mono text-numeral font-medium text-primary", spec: "JetBrains 500 / 20-17-15" },
];

const SPACING = [4, 8, 12, 16, 24, 32, 48, 64, 96, 128];

const SAMPLE = `export function Button({ variant = "primary" }: Props) {
  // La línea destacada usa primary, el único acento del sistema.
  return <button className={variants[variant]} />;
}`;

function Row({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="grid-safe border-t border-rule py-step-24">
      <p className="mb-step-16 font-mono text-metadata uppercase text-muted">{title}</p>
      {children}
    </div>
  );
}

export default function SistemaPage() {
  return (
    <main className="mx-auto max-w-page px-5 py-step-48 md:px-8 lg:px-10">
      <header className="mb-step-64">
        <p className="font-mono text-metadata uppercase text-muted">Referencia interna</p>
        <h1 className="mt-step-8 font-display text-h1 font-semibold">Design system C2</h1>
        <p className="mt-step-32 max-w-[66ch] text-lead text-muted">
          Cuaderno técnico. Light-only, un solo acento, sin sombras ni gradientes. Esta página
          no está indexada y no forma parte del sitio público.
        </p>
      </header>

      <section aria-labelledby="color" className="mb-step-96">
        <SectionHeading id="color" label="Color" />
        <ul className="grid gap-step-16 md:grid-cols-2 lg:grid-cols-3">
          {COLORS.map((c) => (
            <li key={c.name} className="grid-safe rounded-md border border-rule bg-surface p-step-16">
              <div
                className="mb-step-12 h-16 w-full rounded-sm border border-rule"
                style={{ background: `var(${c.name})` }}
              />
              <p className="break-safe font-mono text-metadata uppercase">{c.name}</p>
              <p className="mt-step-4 font-mono text-metadata text-muted">{c.value}</p>
              <p className="mt-step-8 text-body-small text-muted">{c.use}</p>
              {c.ratio ? (
                <p className="mt-step-4 text-footnote text-muted">{c.ratio}</p>
              ) : null}
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="tipografia" className="mb-step-96">
        <SectionHeading id="tipografia" label="Tipografía" />
        {TYPE.map((t) => (
          <div key={t.role} className="grid-safe grid gap-step-8 border-t border-rule py-step-24 md:grid-cols-[320px_1fr]">
            <div className="break-safe">
              <p className="font-mono text-metadata uppercase text-primary">{t.role}</p>
              <p className="mt-step-4 text-footnote text-muted">{t.spec}</p>
            </div>
            <p className={`break-safe ${t.cls}`}>
              Construyo productos web que llegan a producción
            </p>
          </div>
        ))}
      </section>

      <section aria-labelledby="spacing" className="mb-step-96">
        <SectionHeading id="spacing" label="Spacing" />
        <p className="mb-step-32 max-w-[66ch] text-body-small text-muted">
          Escala cerrada. Las primitivas nuevas solo usan estos diez pasos, expuestos como
          step-4 … step-128.
        </p>
        <ul>
          {SPACING.map((s) => (
            <li key={s} className="grid-safe grid grid-cols-[80px_1fr] items-center gap-step-16 border-t border-rule py-step-12">
              <span className="font-mono text-numeral-list font-medium text-primary">{s}</span>
              <span className="block h-4 rounded-sm bg-accent-muted" style={{ width: `${s}px` }} />
            </li>
          ))}
        </ul>
      </section>

      <section id="primitivas-seccion" aria-labelledby="primitivas" className="mb-step-96">
        <SectionHeading id="primitivas" label="Primitivas" />

        <Row title="Botón primario — default / hover / active / disabled">
          <div className="flex flex-wrap items-center gap-step-16">
            <Button>Escríbeme</Button>
            <Button disabled>No disponible</Button>
          </div>
        </Row>

        <Row title="Botón secundario">
          <div className="flex flex-wrap items-center gap-step-16">
            <Button variant="secondary">Ver el trabajo</Button>
            <Button variant="secondary" disabled>
              No disponible
            </Button>
          </div>
        </Row>

        <Row title="Botón terciario / enlace CTA">
          <div className="flex flex-wrap items-center gap-step-16">
            <ButtonLink variant="tertiary" href="#primitivas-seccion">
              <span className="nowrap-token">Ver el trabajo&nbsp;&rarr;</span>
            </ButtonLink>
          </div>
        </Row>

        <Row title="Enlace en prosa">
          <p className="max-w-[66ch] text-body">
            El subrayado es permanente y en hover pasa a primary:{" "}
            <ProseLink href="#primitivas-seccion">un enlace dentro de un párrafo</ProseLink>, para que
            se distinga sin depender del color.
          </p>
        </Row>

        <Row title="Badge — borde / accent / semánticos">
          <div className="flex flex-wrap items-center gap-step-12">
            <Badge>En producción</Badge>
            <Badge variant="accent">Disponible</Badge>
            <Badge variant="success">Activo</Badge>
            <Badge variant="warning">En revisión</Badge>
            <Badge variant="error">Caído</Badge>
          </div>
        </Row>

        <Row title="Tags de tecnología">
          <TagList items={["Next.js", "TypeScript", "Tailwind", "Supabase", "Playwright"]} />
        </Row>

        <Row title="Divider — normal y fuerte">
          <Divider className="my-step-16" />
          <Divider strong className="my-step-24" />
        </Row>

        <Row title="Métrica con contexto — hero / fila / lista">
          <div className="flex flex-wrap gap-step-48">
            <MetricWithContext size="hero" value="500+" context="escuelas en producción" />
            <MetricWithContext size="row" value="WCAG 2.1 AA" context="requisito contractual" />
            <MetricWithContext size="list" value="-40%" context="tiempo de carga inicial" />
          </div>
          <MetricList
            className="mt-step-32"
            items={[
              { value: "500+ escuelas", context: "LMS en producción desde 2025" },
              { value: "WCAG 2.1 AA", context: "verificado con axe en CI" },
            ]}
          />
        </Row>

        <Row title="Card — regla superior y superficie">
          <div className="grid gap-step-24 md:grid-cols-2">
            <Card>
              <h3 className="text-h3 font-semibold">Card con regla</h3>
              <p className="mt-step-8 text-body-small text-muted">
                Sin fondo propio. Es la card de lista.
              </p>
            </Card>
            <Card variant="surface" interactive>
              <h3 className="text-h3 font-semibold">Card con superficie</h3>
              <p className="mt-step-8 text-body-small text-muted">
                Fondo surface y borde; en hover el borde pasa a text.
              </p>
            </Card>
          </div>
        </Row>

        <Row title="Bloque de código — línea destacada">
          <CodeBlock code={SAMPLE} highlight={[2]} label="Ejemplo de bloque de código" />
        </Row>

        <Row title="No ruptura — nowrap solo en tres tokens">
          <p className="max-w-[66ch] text-body-small text-muted">
            <span className="nowrap-token">GMT&#8209;5</span> ·{" "}
            <span className="nowrap-token">12&nbsp;jun&nbsp;2026</span> ·{" "}
            <span className="nowrap-token">CI&nbsp;&#8599;</span>
          </p>
        </Row>
      </section>

      <footer className="border-t border-rule py-step-24 font-mono text-metadata uppercase text-muted">
        Referencia interna — no indexada
      </footer>
    </main>
  );
}
