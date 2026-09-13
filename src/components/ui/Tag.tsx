// Texto separado por `·` y no chips: siete chips ocupan tres filas en 390 px.
// Los espacios alrededor del separador son normales a propósito: la lista
// puede partir en cualquier punto, lo que no puede es invadir la columna vecina.
export function TagList({ items, className = "" }: { items: string[]; className?: string }) {
  return (
    <p className={`break-safe font-mono text-metadata text-muted ${className}`}>
      {items.join(" · ")}
    </p>
  );
}
