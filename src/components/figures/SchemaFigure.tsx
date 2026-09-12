type DomainKey = "courses" | "video" | "users" | "institutions";

type SchemaFigureProps = {
  /** Prefijo de los ids de title/desc. */
  id: string;
  title: string;
  desc: string;
  labels: {
    kicker: string;
    schema: string;
    rbac: string;
    compliance: string;
    domains: Record<DomainKey, string> & { files: string };
    /** Segunda línea de cada nodo. Usuarios usa `rbac`. */
    details: { courses: string; video: string; institutions: [string, string]; files: string };
  };
  caption: string;
  className?: string;
};

// Cuatro nodos 2×2 dentro del contenedor y el nodo de archivos fuera, debajo.
const NODE_W = 190;
const NODE_H = 91;
const COL = [28, 262] as const;
const ROW = [28, 145] as const;
const FILES_Y = 308;

/**
 * SVG inline para heredar los tokens del sitio. Ojo: estos var() no pasan por
 * Tailwind, así que un token borrado no falla el build: cae al valor inicial y
 * el trazo se vuelve invisible. Lo cubre tests/tokens.spec.ts.
 *
 * Un solo SVG para todos los anchos: a 390 escala a ~0,73 y los rótulos quedan
 * en ~9 px; <title> y <desc> llevan la lectura.
 */
export function SchemaFigure({ id, title, desc, labels, caption, className }: SchemaFigureProps) {
  const mono = { fontFamily: "var(--font-mono)", fontSize: 12.5 } as const;

  const node = (
    key: string,
    x: number,
    y: number,
    label: string,
    details: readonly string[],
    highlight = false,
  ) => {
    const ink = highlight ? "var(--color-primary)" : "currentColor";
    const sub = highlight ? "var(--color-primary)" : "var(--color-text-secondary)";
    return (
      <g key={key}>
        <rect
          x={x + 0.5}
          y={y + 0.5}
          width={NODE_W}
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
  };

  const arrow = (x: number) => (
    <g key={`a-${x}`} stroke="currentColor">
      <line x1={x} y1={ROW[1] + NODE_H + 1} x2={x} y2={FILES_Y} />
      <path d={`M${x - 4} ${FILES_Y - 6}l4 6 4-6`} />
    </g>
  );

  const cx = (i: 0 | 1) => COL[i] + NODE_W / 2 + 0.5;
  const cy = (i: 0 | 1) => ROW[i] + NODE_H / 2 + 0.5;

  return (
    <figure className={`min-w-0 ${className ?? ""}`}>
      <p className="flex justify-between gap-step-16 font-mono text-metadata uppercase text-muted">
        <span>
          {labels.kicker}&nbsp;·&nbsp;{labels.schema}
        </span>
        <span>{labels.compliance}</span>
      </p>
      <svg
        role="img"
        aria-labelledby={`${id}-t`}
        aria-describedby={`${id}-d`}
        viewBox="0 0 480 350"
        fill="none"
        className="mt-step-8 block h-auto w-full"
      >
        <title id={`${id}-t`}>{title}</title>
        <desc id={`${id}-d`}>{desc}</desc>

        <rect x="0.5" y="0.5" width="479" height="277" fill="var(--color-bg)" stroke="var(--color-border)" />

        <g stroke="currentColor">
          <line x1={COL[0] + NODE_W + 1} y1={cy(0)} x2={COL[1]} y2={cy(0)} />
          <line x1={COL[0] + NODE_W + 1} y1={cy(1)} x2={COL[1]} y2={cy(1)} />
          <line x1={cx(0)} y1={ROW[0] + NODE_H + 1} x2={cx(0)} y2={ROW[1]} />
          <line x1={cx(1)} y1={ROW[0] + NODE_H + 1} x2={cx(1)} y2={ROW[1]} />
        </g>

        {node("courses", COL[0], ROW[0], labels.domains.courses, [labels.details.courses])}
        {node("video", COL[1], ROW[0], labels.domains.video, [labels.details.video])}
        {node("users", COL[0], ROW[1], labels.domains.users, [labels.rbac])}
        {node("institutions", COL[1], ROW[1], labels.domains.institutions, labels.details.institutions, true)}

        {arrow(cx(0))}
        {arrow(cx(1))}

        <rect
          x={COL[0] + 0.5}
          y={FILES_Y + 0.5}
          width={COL[1] + NODE_W - COL[0]}
          height="40"
          fill="var(--color-surface)"
          stroke="currentColor"
          strokeWidth="1.25"
        />
        <text x={COL[0] + 24} y={FILES_Y + 25} {...mono} fontWeight="500" letterSpacing="0.07em" fill="currentColor">
          {labels.domains.files.toUpperCase()}
        </text>
        <text
          x={COL[1] + NODE_W - 24}
          y={FILES_Y + 25}
          textAnchor="end"
          {...mono}
          fill="var(--color-text-secondary)"
        >
          {labels.details.files}
        </text>
      </svg>
      <figcaption className="mt-step-16 text-caption text-muted">{caption}</figcaption>
    </figure>
  );
}
