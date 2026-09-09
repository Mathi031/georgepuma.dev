/**
 * Divider (sección 5.13 de la spec): regla de 1 px, `border` dentro de un
 * bloque o `rule-strong` para inicio de sección y timeline.
 *
 * role="presentation" porque es decorativo: la estructura ya la dan los
 * encabezados y las secciones, y un separator anunciado por el lector de
 * pantalla en cada bloque solo añade ruido.
 */
export function Divider({
  strong = false,
  className = "",
}: {
  strong?: boolean;
  className?: string;
}) {
  return (
    <hr
      role="presentation"
      className={`h-px border-0 ${strong ? "bg-rule-strong" : "bg-rule"} ${className}`}
    />
  );
}
