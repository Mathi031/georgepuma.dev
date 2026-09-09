/**
 * Mini-caso Ronatello — contenido en inglés.
 * Temporal: re-exporta el español hasta integrar la traducción aprobada. La
 * descripción de metadatos sí está en inglés: es lo que lee el buscador.
 */
import { miniCase as es } from "./ronatello.es";

export const miniCase = {
  ...es,
  meta: {
    description:
      "Production site for a liquor store in Arequipa: time-bound promotions, capacity-limited bookings and its own admin panel. Brief to deploy in 12 days.",
  },
};
