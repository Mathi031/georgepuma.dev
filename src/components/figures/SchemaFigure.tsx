type SchemaFigureProps = {
  /** Prefijo de ids aria: la figura puede aparecer más de una vez por sitio. */
  id: string;
  title: string;
  desc: string;
  labels: { schema: string; rbac: string; compliance: string };
  className?: string;
};

/**
 * Figura del sistema de Notable Learning: el esquema de 29 entidades y los
 * cinco roles de acceso, sin nombrar nada que no esté publicado (NDA). SVG
 * inline a mano para heredar los tokens del sitio (currentColor y
 * var(--color-*)) en ambos temas. Sin motion: es una figura, no un adorno.
 * El viewBox es angosto (360) a propósito: el texto interno nunca baja del
 * paso micro en mobile.
 */
export function SchemaFigure({ id, title, desc, labels, className }: SchemaFigureProps) {
  // 30 posiciones y 29 entidades reales: la celda que falta queda punteada.
  const cells = Array.from({ length: 30 }, (_, i) => ({
    x: 44 + (i % 6) * 48,
    y: 60 + Math.floor(i / 6) * 22,
  }));
  const roles = Array.from({ length: 5 }, (_, i) => 20 + i * 66);

  return (
    <svg
      role="img"
      aria-labelledby={`${id}-t`}
      aria-describedby={`${id}-d`}
      viewBox="0 36 360 256"
      fill="none"
      className={`h-auto w-full max-w-[360px] ${className ?? ""}`}
    >
      <title id={`${id}-t`}>{title}</title>
      <desc id={`${id}-d`}>{desc}</desc>

      {/* El esquema: 29 entidades sobre una retícula de 30. La escala
          (500+ escuelas · 10 países) ya la afirma la ficha de evidencia. */}
      <rect x="28" y="42" width="304" height="130" stroke="var(--color-line)" />
      {cells.map((c, i) =>
        i < 29 ? (
          <rect
            key={i}
            x={c.x}
            y={c.y}
            width="10"
            height="10"
            fill="var(--color-muted)"
            opacity="0.45"
          />
        ) : (
          <rect
            key={i}
            x={c.x}
            y={c.y}
            width="10"
            height="10"
            stroke="var(--color-copper)"
            strokeDasharray="2 2"
          />
        ),
      )}
      <text
        x="28"
        y="192"
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
          y1="172"
          x2={x + 28}
          y2="218"
          stroke="var(--color-line)"
        />
      ))}
      {roles.map((x) => (
        <g key={`r-${x}`}>
          <rect x={x} y="218" width="56" height="26" stroke="var(--color-muted)" />
          <circle cx={x + 28} cy="228" r="3" stroke="var(--color-muted)" />
          <path
            d={`M${x + 21} 239a7 7 0 0 1 14 0`}
            stroke="var(--color-muted)"
          />
        </g>
      ))}
      <text
        x="20"
        y="274"
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
        y="274"
        textAnchor="end"
        fontFamily="var(--font-mono)"
        fontSize="12.5"
        fill="var(--color-muted)"
      >
        {labels.compliance}
      </text>
      <path d="M270 260h-6v6" stroke="var(--color-copper)" />
      <path d="M328 278h6v-6" stroke="var(--color-copper)" />
    </svg>
  );
}
