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
    <div data-metric className={`break-safe ${className}`}>
      <p className={`font-mono font-medium text-primary ${numeralSize[size]}`}>{value}</p>
      <p className="mt-step-8 text-body-small text-muted">{context}</p>
    </div>
  );
}

/**
 * Disposición en lista para casos de estudio: columna de dato de 320 px.
 * 320 y no 280 porque el dato más largo del sitio mide 306 px.
 * En móvil la columna desaparece y el dato queda sobre el contexto.
 *
 * `layout="row"` (CAMBIO #4): tres columnas desde 768, apiladas con regla
 * entre filas en móvil — mismo patrón que la fila de evidencia del hero.
 * Numeral a text-numeral-row (17px) en vez del text-numeral-list de la lista.
 */
export function MetricList({
  items,
  layout = "list",
  className = "",
}: {
  items: { value: string; context: string }[];
  layout?: "list" | "row";
  className?: string;
}) {
  if (layout === "row") {
    return (
      <dl
        className={`grid grid-safe gap-x-step-24 divide-y divide-rule md:grid-cols-3 md:divide-y-0 ${className}`}
      >
        {items.map((m) => (
          <div key={m.value} data-metric className="break-safe min-w-0 py-step-16 md:py-0">
            <dt className="font-mono text-numeral-row font-medium text-primary">{m.value}</dt>
            <dd className="mt-step-8 text-body-small text-muted">{m.context}</dd>
          </div>
        ))}
      </dl>
    );
  }

  return (
    <dl className={className}>
      {items.map((m) => (
        <div
          key={m.value}
          data-metric
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
