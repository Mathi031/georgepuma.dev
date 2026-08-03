type SectionHeadingProps = {
  id: string;
  label: string;
};

/**
 * Encabezado de sección estilo ruta: /proyectos, /ia…
 * La barra cobre + etiqueta mono es el índice del sitio; los nombres
 * propios (proyectos, empresas) llevan la jerarquía visual como h3.
 */
export function SectionHeading({ id, label }: SectionHeadingProps) {
  return (
    <div className="mb-8 flex items-center gap-4 sm:mb-10">
      <h2 id={id} className="font-mono text-[13px] font-medium tracking-[0.02em]">
        <span aria-hidden="true" className="text-copper">
          /
        </span>
        {label}
      </h2>
      <span aria-hidden="true" className="h-px flex-1 bg-line" />
    </div>
  );
}
