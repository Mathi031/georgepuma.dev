type MetricSize = "hero" | "row" | "list";

/**
 * `context` es obligatorio a propósito: un dato sin fuente no se puede defender
 * en una entrevista, que es la regla editorial del sitio.
 *
 * Sin nowrap: en una fila de tres métricas cada columna puede partir el dato
 * en dos líneas, lo que no puede es solaparse con la vecina.
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

// Columna de dato de 320 px y no 280 porque el dato más largo del sitio mide 306 px.
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
        className={`grid grid-safe gap-x-step-24 gap-y-step-24 md:grid-cols-3 ${className}`}
      >
        {items.map((m) => (
          <div key={m.value} data-metric className="break-safe min-w-0">
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
