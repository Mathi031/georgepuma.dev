/**
 * Mini-caso Cleo Spa — contenido en inglés.
 * Temporal: re-exporta el español hasta integrar la traducción aprobada. La
 * descripción de metadatos sí está en inglés: es lo que lee el buscador.
 */
import { miniCase as es } from "./cleo-spa.es";

export const miniCase = {
  ...es,
  meta: {
    description:
      "Inventory and catalog for a beauty salon in Arequipa: insert-only stock ledger with FEFO batches and three roles enforced in the database and the app.",
  },
};
