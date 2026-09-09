import { defineRouting } from "next-intl/routing";

/**
 * El contenido inglés todavía no existe: los *.en.* re-exportan el español
 * salvo las descripciones de metadatos. Mientras sea false, /en se sirve pero
 * no se indexa; ponerlo en true es todo lo que hace falta para abrirlo.
 */
export const enContentReady = false;

export const routing = defineRouting({
  locales: ["es", "en"],
  defaultLocale: "es",
  localePrefix: "as-needed",
  // El header `Link` del middleware emitiría hreflang de /en siempre,
  // contradiciendo al HTML, que los condiciona a enContentReady.
  alternateLinks: false,
  // Con detección activa, un navegador en inglés recibía un 307 de / a /en,
  // que es noindex y sirve español. El idioma se elige con el selector.
  localeDetection: false,
  pathnames: {
    "/": "/",
    "/proyectos/notable-learning": {
      es: "/proyectos/notable-learning",
      en: "/projects/notable-learning",
    },
    "/proyectos/cleo-spa": {
      es: "/proyectos/cleo-spa",
      en: "/projects/cleo-spa",
    },
    "/proyectos/ronatello": {
      es: "/proyectos/ronatello",
      en: "/projects/ronatello",
    },
    "/proyectos/studio-equilibrio": {
      es: "/proyectos/studio-equilibrio",
      en: "/projects/studio-equilibrio",
    },
  },
});
