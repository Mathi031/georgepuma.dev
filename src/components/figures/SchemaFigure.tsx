type DomainKey = "courses" | "video" | "users" | "institutions";

type SchemaFigureProps = {
  /** Prefijo de ids aria: la figura puede aparecer más de una vez por sitio. */
  id: string;
  title: string;
  desc: string;
  labels: {
    schema: string;
    rbac: string;
    compliance: string;
    /** Rótulos de dominio del grid — vienen del contenido, nunca hardcodeados. */
    domains: Record<DomainKey, string> & { files: string };
  };
  className?: string;
};

/** Cuadrantes de 3×2 entidades; archivos va aparte como fila inferior. */
const QUADRANTS: { key: DomainKey; x: number; y: number }[] = [
  { key: "courses", x: 38, y: 52 },
  { key: "video", x: 186, y: 52 },
  { key: "users", x: 38, y: 123 },
  { key: "institutions", x: 186, y: 123 },
];
const QUAD_W = 136;
const QUAD_H = 61;

/**
 * Figura del sistema de Notable Learning: el esquema de 29 entidades y los
 * cinco roles de acceso, sin nombrar nada que no esté publicado (NDA). Las
 * entidades se agrupan por dominio con rótulos en micro-mono; los dominios
 * (cursos, video, usuarios, instituciones, archivos) son los que ya describe
 * el caso de estudio. SVG inline a mano para heredar los tokens del sitio
 * (currentColor y var(--color-*)). Ojo: estos var() no pasan por Tailwind, asi
 * que un token borrado no desaparece — cae al valor inicial y el trazo se
 * vuelve invisible. Lo cubre tests/tokens.spec.ts. Sin motion: es una figura,
 * no un adorno. El viewBox es angosto (360) a propósito: el texto interno
 * nunca baja del paso micro en mobile.
 */
export function SchemaFigure({ id, title, desc, labels, className }: SchemaFigureProps) {
  const roles = Array.from({ length: 5 }, (_, i) => 20 + i * 66);

  // Celda-entidad: trazo en tinta para que el grid compita en presencia con
  // las capturas reales; el relleno muted conserva el tono original.
  const cell = (x: number, y: number, key: string) => (
    <rect
      key={key}
      x={x}
      y={y}
      width="10"
      height="10"
      fill="var(--color-text-secondary)"
      fillOpacity="0.45"
      stroke="currentColor"
      strokeOpacity="0.8"
    />
  );

  const domainLabel = (x: number, y: number, text: string) => (
    <text
      x={x}
      y={y}
      fontFamily="var(--font-mono)"
      fontSize="8"
      letterSpacing="0.08em"
      fill="currentColor"
    >
      {text}
    </text>
  );

  return (
    <svg
      role="img"
      aria-labelledby={`${id}-t`}
      aria-describedby={`${id}-d`}
      viewBox="0 36 360 324"
      fill="none"
      data-orientation="horizontal"
      className={`block h-auto w-full max-w-[360px] max-[430px]:hidden ${className ?? ""}`}
    >
      <title id={`${id}-t`}>{title}</title>
      <desc id={`${id}-d`}>{desc}</desc>

      {/* El esquema: 29 entidades sobre 30 posiciones (24 en cuadrantes + 5
          en la fila de archivos; la que falta queda punteada), agrupadas por
          dominio. La escala (500+ escuelas · 10 países) ya la afirma la ficha
          de evidencia. */}
      <rect x="28" y="42" width="304" height="200" stroke="var(--color-border)" />
      {QUADRANTS.map((q) => (
        <g key={q.key}>
          <rect x={q.x} y={q.y} width={QUAD_W} height={QUAD_H} stroke="var(--color-text-secondary)" />
          {domainLabel(q.x + 12, q.y + 13, labels.domains[q.key])}
          {Array.from({ length: 6 }, (_, i) =>
            cell(q.x + 12 + (i % 3) * 51, q.y + 21 + Math.floor(i / 3) * 22, `${q.key}-${i}`),
          )}
        </g>
      ))}
      <g>
        <rect x="38" y="194" width="284" height="39" stroke="var(--color-text-secondary)" />
        {domainLabel(50, 207, labels.domains.files)}
        {Array.from({ length: 5 }, (_, i) => cell(50 + i * 50, 215, `files-${i}`))}
        <rect
          x={50 + 5 * 50}
          y="215"
          width="10"
          height="10"
          stroke="var(--color-primary)"
          strokeDasharray="2 2"
        />
      </g>
      <text
        x="28"
        y="262"
        fontFamily="var(--font-mono)"
        fontSize="12.5"
        fontWeight="500"
        fill="currentColor"
      >
        {labels.schema}
      </text>

      {/* Acceso: cinco roles, sin nombre (NDA). */}
      {roles.map((x) => (
        <line
          key={`c-${x}`}
          x1="180"
          y1="242"
          x2={x + 28}
          y2="286"
          stroke="var(--color-border)"
        />
      ))}
      {roles.map((x) => (
        <g key={`r-${x}`}>
          <rect x={x} y="286" width="56" height="26" stroke="var(--color-text-secondary)" />
          <circle cx={x + 28} cy="296" r="3" stroke="var(--color-text-secondary)" />
          <path
            d={`M${x + 21} 307a7 7 0 0 1 14 0`}
            stroke="var(--color-text-secondary)"
          />
        </g>
      ))}
      <text
        x="20"
        y="342"
        fontFamily="var(--font-mono)"
        fontSize="12.5"
        fontWeight="500"
        fill="currentColor"
      >
        {labels.rbac}
      </text>

      {/* Cumplimiento: FERPA con mini-corchetes de calibración. */}
      <text
        x="322"
        y="342"
        textAnchor="end"
        fontFamily="var(--font-mono)"
        fontSize="12.5"
        fill="var(--color-text-secondary)"
      >
        {labels.compliance}
      </text>
      <path d="M270 328h-6v6" stroke="var(--color-primary)" />
      <path d="M328 346h6v-6" stroke="var(--color-primary)" />
    </svg>
  );
}

/** Fila de 3 dominios de ancho por caja de dominio en el vertical. */
const V_DOMAIN_W = 184;
const V_DOMAIN_H = 46;
const V_DOMAINS_Y = 40;
const V_DOMAIN_GAP = 12;

/**
 * Variante vertical de la misma figura (CAMBIO #4): a ≤430px el horizontal
 * (360 de ancho) no cabe con margen legible, así que se conmuta por CSS a
 * este SVG angosto (viewBox ~220) con los cinco dominios apilados en vez de
 * en cuadrantes. Misma lectura semántica — 29 entidades, RBAC 5 roles,
 * FERPA — y los mismos tokens var(--color-*); solo cambia la disposición.
 * Todo texto a fontSize >= 11 en el viewBox (a diferencia del horizontal,
 * que en mobile no tiene ancho de sobra para subir del paso micro).
 */
export function SchemaFigureVertical({ id, title, desc, labels, className }: SchemaFigureProps) {
  const domains: { key: DomainKey | "files"; label: string }[] = [
    { key: "courses", label: labels.domains.courses },
    { key: "video", label: labels.domains.video },
    { key: "users", label: labels.domains.users },
    { key: "institutions", label: labels.domains.institutions },
    { key: "files", label: labels.domains.files },
  ];

  const cell = (x: number, y: number, key: string) => (
    <rect
      key={key}
      x={x}
      y={y}
      width="10"
      height="10"
      fill="var(--color-text-secondary)"
      fillOpacity="0.45"
      stroke="currentColor"
      strokeOpacity="0.8"
    />
  );

  const domainsBottom = V_DOMAINS_Y + domains.length * (V_DOMAIN_H + V_DOMAIN_GAP) - V_DOMAIN_GAP;
  const rbacY = domainsBottom + 44;
  const roles = Array.from({ length: 5 }, (_, i) => 18 + i * 37);

  return (
    <svg
      role="img"
      aria-labelledby={`${id}-vt`}
      aria-describedby={`${id}-vd`}
      viewBox={`0 0 220 ${rbacY + 150}`}
      fill="none"
      data-orientation="vertical"
      className={`hidden h-auto w-full max-w-[220px] max-[430px]:block ${className ?? ""}`}
    >
      <title id={`${id}-vt`}>{title}</title>
      <desc id={`${id}-vd`}>{desc}</desc>

      {/* Esquema: los mismos 5 dominios que el horizontal, apilados en vez
          de en cuadrantes — la columna angosta no tiene ancho para dos. */}
      {domains.map((d, i) => {
        const y = V_DOMAINS_Y + i * (V_DOMAIN_H + V_DOMAIN_GAP);
        return (
          <g key={d.key}>
            <rect x="18" y={y} width={V_DOMAIN_W} height={V_DOMAIN_H} stroke="var(--color-text-secondary)" />
            <text
              x="28"
              y={y + 17}
              fontFamily="var(--font-mono)"
              fontSize="11"
              letterSpacing="0.04em"
              fill="currentColor"
            >
              {d.label}
            </text>
            {Array.from({ length: 5 }, (_, j) => cell(28 + j * 24, y + 26, `${d.key}-${j}`))}
          </g>
        );
      })}
      <text
        x="18"
        y={domainsBottom + 24}
        fontFamily="var(--font-mono)"
        fontSize="13"
        fontWeight="500"
        fill="currentColor"
      >
        {labels.schema}
      </text>

      {/* Acceso: cinco roles, sin nombre (NDA) — misma forma que el
          horizontal (rectángulo + avatar mínimo), en fila compacta. */}
      {roles.map((x) => (
        <g key={`vr-${x}`}>
          <rect x={x} y={rbacY} width="30" height="26" stroke="var(--color-text-secondary)" />
          <circle cx={x + 15} cy={rbacY + 9} r="3" stroke="var(--color-text-secondary)" />
          <path d={`M${x + 9} ${rbacY + 20}a6 6 0 0 1 12 0`} stroke="var(--color-text-secondary)" />
        </g>
      ))}
      <text
        x="18"
        y={rbacY + 48}
        fontFamily="var(--font-mono)"
        fontSize="13"
        fontWeight="500"
        fill="currentColor"
      >
        {labels.rbac}
      </text>

      {/* Cumplimiento: FERPA con los mismos mini-corchetes de calibración. */}
      <text
        x="18"
        y={rbacY + 78}
        fontFamily="var(--font-mono)"
        fontSize="13"
        fill="var(--color-text-secondary)"
      >
        {labels.compliance}
      </text>
      <path d={`M18 ${rbacY + 88}v6h6`} stroke="var(--color-primary)" />
      <path d={`M${18 + 90} ${rbacY + 88}v6h-6`} stroke="var(--color-primary)" />
    </svg>
  );
}
