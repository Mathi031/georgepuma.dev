import { MetricWithContext } from "@/components/ui/MetricWithContext";

type EvidenceProps = {
  value: string;
  source: string;
};

/** Alias de MetricWithContext con el vocabulario del contenido (EvidenceItem). */
export function Evidence({ value, source }: EvidenceProps) {
  return <MetricWithContext value={value} context={source} size="row" />;
}
