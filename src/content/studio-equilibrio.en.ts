/**
 * Mini-caso Studio Equilibrio — contenido en inglés.
 * Temporal: re-exporta el español hasta integrar la traducción aprobada. La
 * descripción de metadatos sí está en inglés: es lo que lee el buscador.
 */
import { miniCase as es } from "./studio-equilibrio.es";

export const miniCase = {
  ...es,
  meta: {
    description:
      "Demo SaaS for fitness studios: capacity-limited bookings, memberships and billing with PDF receipts. Built solo, with 30 E2E tests and LCP under 2 s.",
  },
};
