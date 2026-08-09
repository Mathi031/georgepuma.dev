type PipelineFigureProps = {
  /** Prefijo de ids aria: la figura podría repetirse en una misma página. */
  id: string;
  title: string;
  desc: string;
  steps: { label: string; title: string }[];
  resolution: string;
  className?: string;
};

/**
 * Figura del pipeline de diagnóstico (la "guerra" del caso): capas apiladas
 * que se destapan en orden y desembocan en la resolución, en cobre — la voz
 * de lo verificado. Misma filosofía que SchemaFigure: SVG inline a mano con
 * los tokens del sitio, title/desc accesibles, sin motion, y viewBox angosto
 * (360) para que el texto nunca baje del paso micro en mobile.
 */
export function PipelineFigure({
  id,
  title,
  desc,
  steps,
  resolution,
  className,
}: PipelineFigureProps) {
  const stepH = 46;
  const gap = 24;
  const resY = 2 + steps.length * (stepH + gap);
  const height = resY + 38;

  return (
    <svg
      role="img"
      aria-labelledby={`${id}-t`}
      aria-describedby={`${id}-d`}
      viewBox={`0 0 360 ${height}`}
      fill="none"
      className={`h-auto w-full max-w-[360px] ${className ?? ""}`}
    >
      <title id={`${id}-t`}>{title}</title>
      <desc id={`${id}-d`}>{desc}</desc>

      {steps.map((step, i) => {
        const y = 2 + i * (stepH + gap);
        return (
          <g key={step.label}>
            <rect x="20" y={y} width="320" height={stepH} stroke="var(--color-line)" />
            <text
              x="34"
              y={y + 19}
              fontFamily="var(--font-mono)"
              fontSize="12.5"
              fill="var(--color-copper)"
            >
              {step.label}
            </text>
            <text
              x="34"
              y={y + 36}
              fontFamily="var(--font-sans)"
              fontSize="13"
              fill="currentColor"
            >
              {step.title}
            </text>
            <line
              x1="180"
              y1={y + stepH}
              x2="180"
              y2={y + stepH + gap - 4}
              stroke="var(--color-line)"
            />
            <path
              d={`M175 ${y + stepH + gap - 5}l5 5 5-5`}
              stroke="var(--color-line)"
            />
          </g>
        );
      })}

      <rect x="20" y={resY} width="320" height="34" stroke="var(--color-copper)" />
      <text
        x="180"
        y={resY + 21}
        textAnchor="middle"
        fontFamily="var(--font-mono)"
        fontSize="12.5"
        fontWeight="500"
        fill="var(--color-copper)"
      >
        {resolution}
      </text>
    </svg>
  );
}
