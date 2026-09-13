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
  /** Fallback WebP: lo entiende todo navegador y pesa la mitad que PNG. */
  src: string;
  /** AVIF del mismo render, preferido por <picture>. Lo emite `pnpm images`. */
  avif?: string;
  width: number;
  height: number;
  alt: string;
  /**
   * Descriptor 2x del mismo recorte (srcset "src 1x, src2x 2x"). Opcional:
   * las capturas sin recorte dedicado (Cleo, projsync) no lo llevan.
   */
  src2x?: string;
  avif2x?: string;
};

/**
 * Unión discriminada: `external: false` obliga a que el href sea una ruta
 * conocida, así el typecheck impide enlazar a un mini-caso que no existe.
 */
export type ProjectLink =
  | { href: string; label: string; external: true }
  | { href: InternalRoute; label: string; external: false };

export type ProjectProof = { value: string; context: string };

export type Project = {
  slug: string;
  name: string;
  level: "destacado" | "destacado-secundario" | "menor";
  badge?: string;
  /** Rol/cliente · contexto · fechas. */
  meta: string;
  summary: string;
  /** Solo en la card destacada. */
  decision?: string;
  proofs: ProjectProof[];
  /** @deprecated conservado solo porque MiniCase y notable-learning lo leen. */
  evidence: EvidenceItem[];
  stack: string[];
  link: ProjectLink;
  image?: ProjectImage;
  /** Recorte 16:10 para la card "menor"; si falta, se usa `image`. */
  crop?: ProjectImage;
};

/**
 * Un puesto de la trayectoria. Los cinco con cuerpo se renderizan como
 * accordion; el compacto (antes de 2022) solo lleva cabecera, así que los
 * campos del cuerpo son opcionales en vez de una unión discriminada para un
 * único caso.
 */
export type ExperienceItem = {
  company: string;
  role: string;
  period: string;
  /** Tipo de vínculo: empleo, contrato, contrato por proyecto o freelance. */
  type: string;
  /** Solo país (y "Remoto" cuando aplica); nunca ciudad. */
  location: string;
  /** Línea visible en la cabecera, con el tratamiento del CAMBIO #5. */
  impact: string;
  context?: string;
  scope?: string[];
  result?: string;
  /** Enlace terciario al final del resultado. */
  resultLink?: { href: InternalRoute; label: string };
  tech?: string[];
  /** Sin cuerpo expandible: se renderiza como fila, no como accordion. */
  compact?: boolean;
  /** Etiqueta que abre un grupo por encima de este ítem. */
  group?: string;
};

const repo = "https://github.com/Mathi031/georgepuma.dev";
const github = "https://github.com/Mathi031";
const linkedin = "https://www.linkedin.com/in/mathi031/";
const email = "george@georgepuma.dev";

export const identity = {
  name: "George Puma",
  fullName: "George Miguel Puma Salcedo",
  title: "Full Stack Developer",
  email,
  github,
  repo,
  ci: `${repo}/actions/workflows/ci.yml`,
  linkedin,
  /** Nombres no traducibles. */
  social: [
    { name: "GitHub", href: github },
    { name: "LinkedIn", href: linkedin },
    { name: "Email", href: `mailto:${email}` },
  ] as const,
  url: "https://georgepuma.dev",
  siteName: "georgepuma.dev",
  /**
   * La ciudad que ya declara la línea meta del hero. Va como `homeLocation`
   * y no como `address`: es una ubicación, no un domicilio postal.
   */
  location: { locality: "Arequipa", country: "PE" },
};

/**
 * Ids de sección (a la vez ancla y valor de aria-labelledby). No traducibles:
 * viven junto a identity, igual que el resto del vocabulario estructural.
 */
export const sectionIds = {
  work: "trabajo",
  method: "metodo",
  experience: "experiencia",
  stack: "stack",
  contact: "contacto",
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
