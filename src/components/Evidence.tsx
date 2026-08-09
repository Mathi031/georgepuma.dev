type EvidenceProps = {
  value: string;
  source: string;
};

/**
 * Ficha de evidencia — la firma visual del sitio.
 * Cada métrica se muestra junto a su fuente de verificación, enmarcada por
 * los corchetes de calibración (.calibrated): un dispositivo, un significado
 * ("esto está verificado"), compartido con las capturas reales de producto.
 */
export function Evidence({ value, source }: EvidenceProps) {
  return (
    <span className="evidence calibrated">
      <span className="font-medium text-ink">{value}</span>
      <span aria-hidden="true" className="text-copper">
        ·
      </span>
      <span className="text-muted">{source}</span>
    </span>
  );
}
