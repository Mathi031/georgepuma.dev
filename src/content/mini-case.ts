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
  meta: { title: string; description: string };
  /** Clave de pathnames de esta página; la usan LocaleSwitcher y el sitemap. */
  route: InternalRoute;
  kicker: string;
  /** Segmentos de la ruta tal y como se muestran en la cabecera. */
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
    /** Enlace al producto en vivo: sale de la tarjeta del grid y aterriza aquí. */
    liveHref: string;
    liveLabel: string;
    backHref: string;
    backLabel: string;
  };
};
