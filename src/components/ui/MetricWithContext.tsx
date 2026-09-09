type MetricSize = "hero" | "row" | "list";

/**
 * Métrica con contexto (sección 5.12 de la spec).
 *
 * "Nunca un número sin su línea de contexto": por eso `context` es obligatorio
 * en el tipo. Un dato sin fuente no se puede defender en una entrevista, que es
 * la regla editorial del sitio, y el tipo lo hace imposible de omitir.
 *
 * Ningún contenedor lleva nowrap (sección 4): en una fila de tres métricas cada
 * columna puede partir el dato en dos líneas, lo que no puede es solaparse con
 * la vecina. De ahí break-safe (min-width: 0 + overflow-wrap: anywhere).
 */
const numeralSize: Record<MetricSize, string> = {
  hero: "text-numeral",
  row: "text-numeral-row",
  list: "text-numeral-list",
};

export function MetricWithContext({
  value,
  context,
  size = "row",
  className = "",
}: {
  value: string;
  context: string;
  size?: MetricSize;
  className?: string;
}) {
  return (
    <div className={`break-safe ${className}`}>
      <p className={`font-mono font-medium text-primary ${numeralSize[size]}`}>{value}</p>
      <p className="mt-step-8 text-body-small text-muted">{context}</p>
    </div>
  );
}

/**
 * Disposición en lista para casos de estudio: columna de dato de 320 px.
 * 320 y no 280 porque el dato más largo del sitio mide 306 px.
 * En móvil la columna desaparece y el dato queda sobre el contexto.
 */
export function MetricList({
  items,
  className = "",
}: {
  items: { value: string; context: string }[];
  className?: string;
}) {
  return (
    <dl className={className}>
      {items.map((m) => (
        <div
          key={m.value}
          className="grid-safe grid gap-step-8 border-t border-rule py-step-24 md:grid-cols-[320px_1fr] md:gap-step-24"
        >
          <dt className="break-safe font-mono text-numeral-list font-medium text-primary">
            {m.value}
          </dt>
          <dd className="break-safe text-body-small text-muted">{m.context}</dd>
        </div>
      ))}
    </dl>
  );
}
