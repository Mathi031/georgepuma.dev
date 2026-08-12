/**
 * Mini-caso Ronatello — contenido en español.
 *
 * Regla de este archivo: nada que no esté ya publicado en la ficha del
 * proyecto (site.es.ts) o visible en las capturas. Sin métricas nuevas.
 */

import type { MiniCase } from "./mini-case";

export const miniCase: MiniCase = {
  meta: {
    title: "Ronatello — mini-caso",
    description:
      "Sitio de producción para una licorería en Arequipa: promociones con vigencia, reservas con cupo y panel propio — del brief al despliegue en 12 días con las reglas en Postgres (RLS).",
  },
  route: "/proyectos/ronatello",
  kicker: "Mini-caso · Cliente directo · 12 días a producción",
  pathSegments: ["proyectos", "ronatello"],
  lead: "Sitio de producción para una licorería de barrio recién abierta en Arequipa: promociones con vigencia, reservas con cupo y panel de administración propio. Del brief al despliegue en 12 días.",
  tldr: {
    heading: "resumen",
    rows: [
      {
        term: "problema",
        text: "Una licorería recién abierta necesita publicar promociones que caducan, tomar reservas sin pasarse del cupo y administrarlo todo desde un panel propio.",
      },
      {
        term: "rol",
        text: "Cliente directo: del brief al despliegue en 12 días, reutilizando el starter kit extraído de Cleo Spa. En producción.",
      },
      {
        term: "alcance",
        text: "24 rutas (9 públicas + panel de administración) · reglas de negocio en Postgres con RLS · CI que levanta un stack Supabase real.",
      },
    ],
    resultTerm: "resultado",
  },
  shots: {
    id: "pantallas",
    heading: "El producto, sin maquillaje",
    frames: [
      {
        image: {
          src: "/screenshots/ronatello-promociones.webp",
          avif: "/screenshots/ronatello-promociones.avif",
          width: 1280,
          height: 720,
          alt: "Tabla de promociones del panel: cada fila con el combo, precio, rango de vigencia, cupo y estado — vigente o finalizada — y acciones para editar y despublicar.",
        },
        caption:
          "Promociones: vigencia con fechas y cupo a la vista. La finalizada sigue en la tabla — historial, no borrado.",
      },
      {
        image: {
          src: "/screenshots/ronatello-reservas.webp",
          avif: "/screenshots/ronatello-reservas.avif",
          width: 1280,
          height: 720,
          alt: "Tabla de reservas: código, promoción, cliente con botones para llamar o abrir WhatsApp, entrega y estado; las vencidas muestran una nota de estado final que se conserva como historial.",
        },
        caption:
          "Reservas: una vencida pasa a solo registro — se conserva como historial y el teléfono sigue visible por si hay que contactar al cliente.",
      },
      {
        image: {
          src: "/screenshots/ronatello-dashboard.webp",
          avif: "/screenshots/ronatello-dashboard.avif",
          width: 1280,
          height: 720,
          alt: "Panel de inicio con cuatro tarjetas: reservas que esperan respuesta, promociones que cierran pronto, productos publicados en la web frente a los que no, y acceso al sitio público.",
        },
        caption:
          "El panel abre con lo accionable: qué espera respuesta, qué cierra pronto y qué ve — o no ve — el cliente.",
      },
    ],
  },
  decisions: {
    id: "decisiones",
    heading: "Tres decisiones que sostienen el resto",
    items: [
      {
        title: "Una promoción sabe cuándo vive",
        text: "Cada promoción lleva rango de vigencia y cupo, y el estado se lee de ahí: vigente o finalizada. Se puede despublicar antes de tiempo, pero la finalizada no desaparece — queda en la tabla como historial de lo que se ofreció.",
      },
      {
        title: "Una reserva vencida es un registro, no un pendiente",
        text: "Las reservas descuentan cupo de su promoción y vencen si nadie responde a tiempo. Una reserva vencida, entregada o cancelada pasa a estado final: se conserva como historial, ya no admite acciones, y el teléfono del cliente queda visible por si hay que contactarlo.",
      },
      {
        title: "Las reglas viven en Postgres, y el CI las prueba de verdad",
        text: "Las reglas de negocio viven en Postgres con RLS y el CI levanta un stack Supabase real — el mismo esqueleto de roles, RLS y CI extraído de Cleo Spa. Reutilizar decisiones ya discutidas una vez es lo que permitió ir del brief al despliegue en 12 días.",
      },
    ],
  },
  close: {
    id: "cierre",
    heading: "Lo que dejó",
    body: "La prueba de que el starter kit extraído de Cleo Spa funciona: el mismo esqueleto de roles, RLS y CI, del brief a producción en 12 días. Lo que allá fue una extracción, aquí fue plazo.",
    liveHref: "https://ronatello.pe",
    liveLabel: "Ver el sitio en vivo",
    backHref: "/#proyectos",
    backLabel: "Volver a proyectos",
  },
};
