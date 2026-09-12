type DomainKey = "courses" | "video" | "users" | "institutions";

type Labels = {
  kicker: string;
  schema: string;
  rbac: string;
  compliance: string;
  domains: Record<DomainKey, string> & { files: string };
  /** Segunda línea de cada nodo. Usuarios usa `rbac`. */
  details: { courses: string; video: string; institutions: [string, string]; files: string };
};

type SchemaSvgProps = {
  /** Prefijo de los ids de title/desc. */
  id: string;
  title: string;
  desc: string;
  labels: Labels;
  className?: string;
};

type SchemaFigureProps = SchemaSvgProps & {
  caption: string;
  /**
   * Añade el SVG vertical y conmuta por CSS en 431 px (Tailwind compila
   * `max-[431px]` como `width < 431px`, así que 430 ya va en vertical). Solo
   * la home lo usa: la página del caso conserva el horizontal en todo ancho.
   */
  vertical?: boolean;
};

const NODE_H = 91;
const NODE_GAP = 117;

// Horizontal: cuatro nodos 2×2 dentro del contenedor y archivos fuera, debajo.
const H_NODE_W = 190;
const H_COL = [28, 262] as const;
const H_ROW = [28, 145] as const;
const H_FILES_Y = 308;

// Vertical: una columna de cuatro nodos en un viewBox de 360, el ancho que a
// 360 px de viewport (320 útiles) deja los 12,5 del viewBox en 11,1 px.
const V_NODE_W = 312;
const V_X = 24;
const V_ROWS = [28, 145, 262, 379] as const;
const V_FILES_Y = 542;

const mono = { fontFamily: "var(--font-mono)", fontSize: 12.5 } as const;

/**
 * Nodo de dominio. Los colores van por var(): estos atributos no pasan por
 * Tailwind, así que un token borrado no falla el build, cae al valor inicial y
 * el trazo se vuelve invisible. Lo cubre tests/tokens.spec.ts.
 */
function node(
  key: string,
  x: number,
  y: number,
  w: number,
  label: string,
  details: readonly string[],
  highlight = false,
) {
  const ink = highlight ? "var(--color-primary)" : "currentColor";
  const sub = highlight ? "var(--color-primary)" : "var(--color-text-secondary)";
  return (
    <g key={key}>
      <rect
        x={x + 0.5}
        y={y + 0.5}
        width={w}
        height={NODE_H}
        fill={highlight ? "var(--color-accent-muted)" : "var(--color-surface)"}
        stroke={ink}
        strokeWidth="1.25"
      />
      <text x={x + 24} y={y + 32} {...mono} fontWeight="500" letterSpacing="0.07em" fill={ink}>
        {label.toUpperCase()}
      </text>
      {details.map((d, i) => (
        <text key={d} x={x + 24} y={y + 54 + i * 19} {...mono} fill={sub}>
          {d}
        </text>
      ))}
    </g>
  );
}

/** Flecha vertical de y1 a y2 en x. */
function arrow(x: number, y1: number, y2: number) {
  return (
    <g key={`a-${x}`} stroke="currentColor">
      <line x1={x} y1={y1} x2={x} y2={y2} />
      <path d={`M${x - 4} ${y2 - 6}l4 6 4-6`} />
    </g>
  );
}

/** SVG horizontal: viewBox de 480, el de escritorio y de la página del caso. */
export function SchemaSvg({ id, title, desc, labels, className }: SchemaSvgProps) {
  const cx = (i: 0 | 1) => H_COL[i] + H_NODE_W / 2 + 0.5;
  const cy = (i: 0 | 1) => H_ROW[i] + NODE_H / 2 + 0.5;
  const nodesBottom = H_ROW[1] + NODE_H + 1;

  return (
    <svg
      role="img"
      aria-labelledby={`${id}-t`}
      aria-describedby={`${id}-d`}
      viewBox="0 0 480 350"
      fill="none"
      className={className}
    >
      <title id={`${id}-t`}>{title}</title>
      <desc id={`${id}-d`}>{desc}</desc>

      <rect x="0.5" y="0.5" width="479" height="277" fill="var(--color-bg)" stroke="var(--color-border)" />

      <g stroke="currentColor">
        <line x1={H_COL[0] + H_NODE_W + 1} y1={cy(0)} x2={H_COL[1]} y2={cy(0)} />
        <line x1={H_COL[0] + H_NODE_W + 1} y1={cy(1)} x2={H_COL[1]} y2={cy(1)} />
        <line x1={cx(0)} y1={H_ROW[0] + NODE_H + 1} x2={cx(0)} y2={H_ROW[1]} />
        <line x1={cx(1)} y1={H_ROW[0] + NODE_H + 1} x2={cx(1)} y2={H_ROW[1]} />
      </g>

      {node("courses", H_COL[0], H_ROW[0], H_NODE_W, labels.domains.courses, [labels.details.courses])}
      {node("video", H_COL[1], H_ROW[0], H_NODE_W, labels.domains.video, [labels.details.video])}
      {node("users", H_COL[0], H_ROW[1], H_NODE_W, labels.domains.users, [labels.rbac])}
      {node("institutions", H_COL[1], H_ROW[1], H_NODE_W, labels.domains.institutions, labels.details.institutions, true)}

      {arrow(cx(0), nodesBottom, H_FILES_Y)}
      {arrow(cx(1), nodesBottom, H_FILES_Y)}

      <rect
        x={H_COL[0] + 0.5}
        y={H_FILES_Y + 0.5}
        width={H_COL[1] + H_NODE_W - H_COL[0]}
        height="40"
        fill="var(--color-surface)"
        stroke="currentColor"
        strokeWidth="1.25"
      />
      <text x={H_COL[0] + 24} y={H_FILES_Y + 25} {...mono} fontWeight="500" letterSpacing="0.07em" fill="currentColor">
        {labels.domains.files.toUpperCase()}
      </text>
      <text
        x={H_COL[1] + H_NODE_W - 24}
        y={H_FILES_Y + 25}
        textAnchor="end"
        {...mono}
        fill="var(--color-text-secondary)"
      >
        {labels.details.files}
      </text>
    </svg>
  );
}

/**
 * SVG vertical para móvil: misma información en una columna. Los ids llevan
 * el sufijo `-v` porque convive en el DOM con el horizontal; el que está
 * oculto por CSS (display: none) no entra en el árbol de accesibilidad.
 */
export function SchemaSvgVertical({ id, title, desc, labels, className }: SchemaSvgProps) {
  const cx = V_X + V_NODE_W / 2 + 0.5;
  const last = V_ROWS[V_ROWS.length - 1]!;
  const nodesBottom = last + NODE_H + 1;

  return (
    <svg
      role="img"
      aria-labelledby={`${id}-v-t`}
      aria-describedby={`${id}-v-d`}
      viewBox="0 0 360 604"
      fill="none"
      className={className}
    >
      <title id={`${id}-v-t`}>{title}</title>
      <desc id={`${id}-v-d`}>{desc}</desc>

      {/* 27 y no 28: nodesBottom ya incluye el +1 del borde; el margen bajo el
          último nodo queda en 28, el mismo que arriba. */}
      <rect x="0.5" y="0.5" width="359" height={nodesBottom + 27} fill="var(--color-bg)" stroke="var(--color-border)" />

      <g stroke="currentColor">
        {V_ROWS.slice(0, -1).map((y) => (
          <line key={y} x1={cx} y1={y + NODE_H + 1} x2={cx} y2={y + NODE_GAP} />
        ))}
      </g>

      {node("courses", V_X, V_ROWS[0], V_NODE_W, labels.domains.courses, [labels.details.courses])}
      {node("video", V_X, V_ROWS[1], V_NODE_W, labels.domains.video, [labels.details.video])}
      {node("users", V_X, V_ROWS[2], V_NODE_W, labels.domains.users, [labels.rbac])}
      {node("institutions", V_X, V_ROWS[3], V_NODE_W, labels.domains.institutions, labels.details.institutions, true)}

      {arrow(cx, nodesBottom, V_FILES_Y)}

      {/* Archivos en dos líneas: el detalle no cabe a la derecha del rótulo. */}
      <rect
        x={V_X + 0.5}
        y={V_FILES_Y + 0.5}
        width={V_NODE_W}
        height="61"
        fill="var(--color-surface)"
        stroke="currentColor"
        strokeWidth="1.25"
      />
      <text x={V_X + 24} y={V_FILES_Y + 25} {...mono} fontWeight="500" letterSpacing="0.07em" fill="currentColor">
        {labels.domains.files.toUpperCase()}
      </text>
      <text x={V_X + 24} y={V_FILES_Y + 48} {...mono} fill="var(--color-text-secondary)">
        {labels.details.files}
      </text>
    </svg>
  );
}

/**
 * Figura completa: fila de rótulos, SVG y pie. Con `vertical`, ambos SVG van
 * al DOM y cada rama declara su display (trampa 1: `hidden` sin prefijo
 * perdería contra un `block` de variante).
 */
export function SchemaFigure({ id, title, desc, labels, caption, className, vertical = false }: SchemaFigureProps) {
  const svg = { id, title, desc, labels };
  return (
    <figure className={`min-w-0 ${className ?? ""}`}>
      <p className="flex justify-between gap-step-16 font-mono text-metadata uppercase text-muted">
        <span>
          {labels.kicker}&nbsp;·&nbsp;{labels.schema}
        </span>
        <span>{labels.compliance}</span>
      </p>
      <SchemaSvg
        {...svg}
        className={`mt-step-8 h-auto w-full ${vertical ? "block max-[431px]:hidden" : "block"}`}
      />
      {vertical && <SchemaSvgVertical {...svg} className="mt-step-8 hidden h-auto w-full max-[431px]:block" />}
      <figcaption className="mt-step-16 text-caption text-muted">{caption}</figcaption>
    </figure>
  );
}
