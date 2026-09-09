import { MetricWithContext } from "@/components/ui/MetricWithContext";

type EvidenceProps = {
  value: string;
  source: string;
};

/**
 * Capa de nombre sobre MetricWithContext (sección 5.12 de la spec). Se
 * conserva porque `evidence` es el vocabulario del contenido (EvidenceItem en
 * src/content/site.ts) y esta fase no reestructura secciones. Todo el estilo
 * vive en la primitiva.
 */
export function Evidence({ value, source }: EvidenceProps) {
  return <MetricWithContext value={value} context={source} size="row" />;
}
