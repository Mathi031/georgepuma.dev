import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["es", "en"],
  defaultLocale: "es",
  localePrefix: "as-needed",
  pathnames: {
    "/": "/",
    "/proyectos/notable-learning": {
      es: "/proyectos/notable-learning",
      en: "/projects/notable-learning",
    },
  },
});
