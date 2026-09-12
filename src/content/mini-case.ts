/**
 * Mini-caso: la forma reducida del caso de estudio, para los proyectos que
 * no dan para una página larga pero sí tienen decisiones que defender.
 *
 * Una pantalla y media: ficha TL;DR, dos o tres pantallas reales del producto
 * y tres decisiones. Sin notas al pie ni figuras — si un proyecto las pide,
 * es que merece un caso completo, no un mini-caso.
 *
 * Todo es texto plano a propósito: el caso de estudio necesita ReactNode
 * porque su prosa lleva markup inline; aquí el copy es corto y no lo lleva.
 */

import type { InternalRoute, ProjectImage } from "./site";

export type MiniCase = {
  /** El título se compone con el nombre del proyecto y `ui.meta.caseSuffix`. */
  meta: { description: string };
  /** Clave de pathnames de esta página; la usan LocaleSwitcher y el sitemap. */
  route: InternalRoute;
  kicker: string;
  pathSegments: [string, string];
  lead: string;
  /** Ficha TL;DR. El resultado lo afirman las fichas de evidencia del proyecto. */
  tldr: { heading: string; rows: { term: string; text: string }[]; resultTerm: string };
  shots: { id: string; heading: string; frames: { image: ProjectImage; caption: string }[] };
  decisions: { id: string; heading: string; items: { title: string; text: string }[] };
  close: {
    id: string;
    heading: string;
    body: string;
    /**
     * Lo que queda por cerrar. Opcional: si el proyecto no lo declara, no se
     * renderiza ni la etiqueta ni la regla que la separa del cuerpo.
     */
    pending?: string;
    liveHref: string;
    liveLabel: string;
    /**
     * Sin href: lo construye el componente con Link, que pone el prefijo de
     * locale. Uno literal aquí mandaba a la home española desde /en.
     */
    backLabel: string;
  };
};
