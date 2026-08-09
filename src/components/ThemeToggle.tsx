"use client";

type ThemeToggleProps = {
  /** aria-label localizado ("Cambiar tema"). */
  aria: string;
};

/**
 * Toggle claro/oscuro. Sin estado React: el glifo visible lo decide el CSS
 * (globals.css) a partir de data-theme y prefers-color-scheme, así que el
 * SSR nunca desincroniza. La elección persiste en localStorage y la aplica
 * el script inline del layout antes del primer paint. Quien nunca toca el
 * botón sigue al sistema; quien lo toca fija su elección.
 */
export function ThemeToggle({ aria }: ThemeToggleProps) {
  const toggle = () => {
    const root = document.documentElement;
    const current =
      root.dataset.theme ??
      (matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
    const next = current === "dark" ? "light" : "dark";
    root.dataset.theme = next;
    try {
      localStorage.setItem("theme", next);
    } catch {
      /* sin storage (modo privado): el toggle funciona, no persiste */
    }
  };

  return (
    <button
      type="button"
      aria-label={aria}
      onClick={toggle}
      className="text-muted transition-colors hover:text-copper"
    >
      <svg
        className="theme-glyph-light"
        aria-hidden="true"
        width="15"
        height="15"
        viewBox="0 0 16 16"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinecap="round"
      >
        <circle cx="8" cy="8" r="3.4" />
        <path d="M8 1.2v1.8M8 13v1.8M1.2 8H3M13 8h1.8M3.2 3.2l1.3 1.3M11.5 11.5l1.3 1.3M12.8 3.2l-1.3 1.3M4.5 11.5l-1.3 1.3" />
      </svg>
      <svg
        className="theme-glyph-dark"
        aria-hidden="true"
        width="15"
        height="15"
        viewBox="0 0 16 16"
        fill="currentColor"
      >
        <path d="M13.4 9.9A5.9 5.9 0 1 1 6.1 2.6a5.4 5.4 0 0 0 7.3 7.3Z" />
      </svg>
    </button>
  );
}
