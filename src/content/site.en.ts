/**
 * Contenido del sitio en inglés.
 * Temporal: re-exporta el español hasta integrar la traducción aprobada (ver
 * en-content-review.md). Los metadatos sí están en inglés: son lo que ve el
 * buscador. El export local de `ui` gana sobre el `export *`.
 */
import { ui as esUi } from "./site.es";

export * from "./site.es";

export const ui = {
  ...esUi,
  nav: {
    work: "Work",
    method: "How I work",
    experience: "Experience",
    contact: "Contact",
  },
  brandAria: "George Puma — home",
  availability: "AVAILABLE NOW",
  footer: {
    source: "source code ↗",
    ci: "CI ↗",
  },
  meta: {
    // El título no se traduce: nombre, rol y tecnologías son los mismos.
    title: "George Puma — Full Stack Developer (React, Next.js, PostgreSQL)",
    description:
      "Full Stack Developer — React, Next.js, TypeScript. Five years building enterprise web products, with AI-assisted development workflows.",
    caseSuffix: " — case study",
    ogLocale: "en_US",
  },
};
