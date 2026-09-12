import { Divider } from "@/components/ui/Divider";

type SectionHeadingProps = {
  id: string;
  label: string;
  index?: string;
  /** Texto de la meta cuando difiere del H2. */
  kicker?: string;
  lead?: string;
};

/**
 * La regla es decorativa: la estructura la aporta el H2, que es quien recibe
 * el id al que apunta el aria-labelledby de la sección.
 */
export function SectionHeading({ id, label, index, kicker, lead }: SectionHeadingProps) {
  return (
    <div className="mb-step-48">
      <Divider strong />
      {index ? (
        <p className="mt-step-24 font-mono text-metadata uppercase text-muted">
          {index}&nbsp;·&nbsp;{kicker ?? label}
        </p>
      ) : null}
      <h2
        id={id}
        className={`font-display text-h2 font-semibold ${index ? "mt-step-8" : "mt-step-24"}`}
      >
        {label}
      </h2>
      {lead ? <p className="mt-step-24 max-w-[66ch] text-lead">{lead}</p> : null}
    </div>
  );
}
