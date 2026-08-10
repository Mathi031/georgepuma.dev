/**
 * Contenido del sitio, tipado. El "CMS" es git: editar contenido = commit.
 * Regla editorial: cada afirmación debe ser defendible en una entrevista.
 *
 * El copy vive por locale en site.es.ts / site.en.ts; aquí quedan los tipos,
 * la identidad (no traducible) y el selector. `Record<Locale, typeof es>`
 * hace que typecheck falle si a un locale le falta una clave.
 */

import * as es from "./site.es";
import * as en from "./site.en";

export type Locale = "es" | "en";

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

export type Project = {
  slug: string;
  name: string;
  role: string;
  summary: string;
  evidence: EvidenceItem[];
  stack: string[];
  link: { href: string; label: string; external: boolean };
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
};

export const content: Record<Locale, typeof es> = { es, en };
