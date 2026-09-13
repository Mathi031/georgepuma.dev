/**
 * Sin resaltado de sintaxis: metería colores fuera del sistema. `highlight`
 * recibe números de línea en base 1.
 */
export function CodeBlock({
  code,
  label,
  highlight = [],
  className = "",
}: {
  code: string;
  /** Nombre del bloque para el lector de pantalla: es una región enfocable. */
  label: string;
  highlight?: number[];
  className?: string;
}) {
  const lines = code.replace(/\n$/, "").split("\n");

  return (
    // Desborda en horizontal: sin tabindex no se recorre con teclado, y sin
    // role/label el lector anuncia una región anónima.
    <pre
      tabIndex={0}
      role="region"
      aria-label={label}
      className={`grid-safe overflow-x-auto rounded-sm border border-rule bg-surface-muted p-step-16 font-mono text-code text-ink ${className}`}
    >
      <code>
        {lines.map((line, i) => (
          <span
            key={i}
            className={
              highlight.includes(i + 1) ? "block bg-accent-muted text-primary" : "block"
            }
          >
            {line || " "}
          </span>
        ))}
      </code>
    </pre>
  );
}
