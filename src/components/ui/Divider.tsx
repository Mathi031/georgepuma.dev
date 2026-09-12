// role="presentation": la estructura ya la dan los encabezados, y un separator
// anunciado por el lector de pantalla en cada bloque solo añade ruido.
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
