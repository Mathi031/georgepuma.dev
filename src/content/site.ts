/**
 * Contenido del sitio, tipado. El "CMS" es git: editar contenido = commit.
 * Regla editorial: cada afirmación debe ser defendible en una entrevista.
 *
 * El copy vive por locale en site.es.ts / site.en.ts; aquí quedan los tipos,
 * la identidad (no traducible) y el selector. `Record<Locale, typeof es>`
 * hace que typecheck falle si a un locale le falta una clave.
 */

import { routing } from "@/i18n/routing";
import * as es from "./site.es";
import * as en from "./site.en";

export type Locale = "es" | "en";

/**
 * Rutas que next-intl sabe traducir. El enlace de un proyecto o apunta a una
 * de estas —y entonces lo renderiza <Link>, que le pone el prefijo de
 * locale— o sale del sitio.
 */
export type InternalRoute = keyof typeof routing.pathnames;

export type EvidenceItem = { value: string; source: string };

export type ProjectImage = {
  /**
   * Fallback bajo public/, p. ej. "/screenshots/cleo-spa.webp". WebP y no
   * PNG: lo entiende todo navegador que ejecute este sitio, y pesa la mitad.
   */
  src: string;
  /** AVIF del mismo render, preferido por <picture>. Lo emite `pnpm images`. */
  avif?: string;
  width: number;
  height: number;
  alt: string;
};

/**
 * Unión discriminada: `external: false` obliga a que el href sea una ruta
 * conocida, así el typecheck impide enlazar a un mini-caso que no existe.
 */
export type ProjectLink =
  | { href: string; label: string; external: true }
  | { href: InternalRoute; label: string; external: false };

export type Project = {
  slug: string;
  name: string;
  role: string;
  summary: string;
  evidence: EvidenceItem[];
  stack: string[];
  link: ProjectLink;
  /** Captura curada del producto. Opcional: la card no reserva hueco sin ella. */
  image?: ProjectImage;
};

export type ExperienceItem = {
  company: string;
  role: string;
  period: string;
  location: string;
  lines: string[];
};

export const identity = {
  name: "George Puma",
  fullName: "George Miguel Puma Salcedo",
  title: "Full Stack Developer",
  email: "george@georgepuma.dev",
  github: "https://github.com/Mathi031",
  repo: "https://github.com/Mathi031/georgepuma.dev",
  linkedin: "https://www.linkedin.com/in/mathi031/",
  cvUrl: "/cv-george-puma.pdf", // TODO: subir el PDF a /public
  /** Dominio de producción. Base de metadataBase, canonical y JSON-LD. */
  url: "https://georgepuma.dev",
  /** og:site_name y la firma del header. */
  siteName: "georgepuma.dev",
  /**
   * La ciudad que ya declara la línea meta del hero. Va como `homeLocation`
   * y no como `address`: es una ubicación, no un domicilio postal.
   */
  location: { locality: "Arequipa", country: "PE" },
};

/**
 * Rutas indexables: la home más la página propia de cada proyecto que la
 * tenga. Las consumen el sitemap y el spec, así que un proyecto nuevo entra
 * en ambos sin tocar ninguna lista.
 */
export const indexedRoutes: InternalRoute[] = [
  "/",
  ...es.projects.flatMap((p) => (p.link.external ? [] : [p.link.href])),
];

/**
 * Rutas con opengraph-image.tsx propio; las demás anuncian la de la home, que
 * es la que Next les sirve. No se deriva del disco porque seo.ts también viaja
 * al navegador, así que la contrasta un test contra los archivos reales.
 */
export const ROUTES_WITH_OWN_OG: readonly InternalRoute[] = [
  "/",
  "/proyectos/cleo-spa",
  "/proyectos/ronatello",
  "/proyectos/studio-equilibrio",
];

export const content: Record<Locale, typeof es> = { es, en };
