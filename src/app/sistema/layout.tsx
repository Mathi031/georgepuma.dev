import "@fontsource-variable/inter/wght.css";
import "@fontsource-variable/jetbrains-mono/wght.css";
import "../globals.css";

/**
 * Layout propio de la referencia visual. Vive fuera de [locale], así que
 * necesita su <html> y sus propios imports de CSS: no hereda los del layout
 * por locale.
 *
 * lang="es" fijo y sin selector de idioma: es una herramienta interna, no una
 * página del sitio, y no se traduce.
 */
export default function SistemaLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body className="font-sans antialiased">{children}</body>
    </html>
  );
}
