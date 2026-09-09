import { Divider } from "@/components/ui/Divider";

type SectionHeadingProps = {
  id: string;
  label: string;
  /** Numeral de sección en mono ("01"). Opcional: no todas lo llevan. */
  index?: string;
};

/**
 * Encabezado de sección (secciones 2 y 5.13 de la spec): regla `rule-strong`
 * de 1 px, 24 px por encima del H2, con la meta numerada entre ambos.
 *
 * La regla es decorativa: la estructura la aporta el propio encabezado, que es
 * quien recibe el id al que apunta el aria-labelledby de la sección.
 */
export function SectionHeading({ id, label, index }: SectionHeadingProps) {
  return (
    <div className="mb-step-48">
      <Divider strong />
      {index ? (
        <p className="mt-step-24 font-mono text-metadata uppercase text-muted">{index}</p>
      ) : null}
      <h2
        id={id}
        className={`font-display text-h2 font-semibold ${index ? "mt-step-8" : "mt-step-24"}`}
      >
        {label}
      </h2>
    </div>
  );
}
