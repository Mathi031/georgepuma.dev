/**
 * Caso de estudio Notable Learning — contenido en inglés.
 * Temporal: re-exporta el español hasta integrar la traducción aprobada. La
 * descripción de metadatos sí está en inglés: es lo que lee el buscador.
 */
import { caseStudy as es } from "./notable-learning.es";

export type { CaseStudy } from "./notable-learning.es";

export const caseStudy = {
  ...es,
  meta: {
    description:
      "K-12 LMS for 500+ schools: a content editor designed around its failure modes and a four-layer PDF bug that ended in a streaming proxy.",
  },
};
