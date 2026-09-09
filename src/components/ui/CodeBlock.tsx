/**
 * Bloque de código (sección 5.16 de la spec). Como máximo dos tonos más
 * `primary` para una única línea destacada: sin resaltado de sintaxis, que
 * metería colores fuera del sistema.
 *
 * `highlight` recibe números de línea en base 1. La línea destacada no se marca
 * solo con color: lleva también fondo `accent-muted`.
 *
 * overflow-x-auto porque el código no se parte: desplaza el contenedor, nunca
 * la página.
 */
export function CodeBlock({
  code,
  highlight = [],
  className = "",
}: {
  code: string;
  highlight?: number[];
  className?: string;
}) {
  const lines = code.replace(/\n$/, "").split("\n");

  return (
    <pre
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
