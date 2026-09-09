/**
 * Tags de tecnología (sección 5.8 de la spec).
 *
 * Texto mono separado por `·`, no chips: siete chips ocupan tres filas en un
 * viewport de 390 px. Como cadena única fluye y rompe donde haga falta.
 *
 * El separador va con espacios normales a propósito. La regla de no ruptura
 * (sección 4) prohíbe nowrap en contenedores de tags: la lista puede partir en
 * cualquier espacio, lo que no puede es invadir la columna vecina.
 */
export function TagList({ items, className = "" }: { items: string[]; className?: string }) {
  return (
    <p className={`break-safe font-mono text-metadata text-muted ${className}`}>
      {items.join(" · ")}
    </p>
  );
}
