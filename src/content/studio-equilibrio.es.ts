/**
 * Mini-caso Studio Equilibrio — contenido en español.
 *
 * Regla de este archivo: nada que no esté ya publicado en la ficha del
 * proyecto (site.es.ts) o visible en las capturas. Sin métricas nuevas.
 */

import type { MiniCase } from "./mini-case";

export const miniCase: MiniCase = {
  meta: {
    title: "Studio Equilibrio — mini-caso",
    description:
      "SaaS demo para estudios de fitness: reservas con cupo, membresías y facturación con recibos PDF — construido en solitario de extremo a extremo, con 30 pruebas E2E y LCP < 2 s.",
  },
  route: "/proyectos/studio-equilibrio",
  kicker: "Mini-caso · Diseño a producción, en solitario · 2.5 semanas",
  pathSegments: ["proyectos", "studio-equilibrio"],
  lead: "SaaS demo para estudios de fitness — reservas, membresías, facturación y analítica — construido de extremo a extremo a partir de un brief comercial. Una demo, con el estándar de un producto real.",
  tldr: {
    heading: "resumen",
    rows: [
      {
        term: "problema",
        text: "Un estudio de fitness vive de tres flujos que no pueden fallar: que la clase tenga cupo, que la membresía se renueve y que el cobro llegue con su recibo.",
      },
      {
        term: "rol",
        text: "Diseño a producción, en solitario: de un brief comercial a una demo de extremo a extremo en 2.5 semanas.",
      },
      {
        term: "alcance",
        text: "Reservas de clases con cupo · membresías y paquetes · facturación con recibos PDF · analítica de retención.",
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
          src: "/screenshots/studio-equilibrio-horario.webp",
          avif: "/screenshots/studio-equilibrio-horario.avif",
          width: 1280,
          height: 800,
          alt: "Horario semanal de clases: tarjetas por día con nombre de la clase, hora, coach y ocupación del cupo.",
        },
        caption:
          "Horario: cada clase declara su cupo — la reserva nace acotada desde el calendario.",
      },
      {
        image: {
          src: "/screenshots/studio-equilibrio-miembros.webp",
          avif: "/screenshots/studio-equilibrio-miembros.avif",
          width: 1280,
          height: 1422,
          alt: "Tabla de miembros con búsqueda, filtros por estado y plan, y exportación a CSV: cada fila lleva membresía activa, próximo cobro, última clase asistida y estado.",
        },
        caption:
          "Miembros: membresía, próximo cobro y última asistencia en una sola fila — el estado del negocio, por persona.",
      },
      {
        image: {
          src: "/screenshots/studio-equilibrio-cobros.webp",
          avif: "/screenshots/studio-equilibrio-cobros.avif",
          width: 1280,
          height: 1422,
          alt: "Pantalla de cobros: tarjetas con totales de vencido, fallido, por cobrar y cobrado, y tabla de renovaciones por miembro con concepto, monto, vencimiento, estado y botón para registrar el pago.",
        },
        caption:
          "Cobros: renovaciones vencidas o por cobrar, fallidos y pagos recientes — la facturación como cola de trabajo, no como reporte.",
      },
    ],
  },
  decisions: {
    id: "decisiones",
    heading: "Tres decisiones que sostienen el resto",
    items: [
      {
        title: "El cupo vive en la clase, no en la buena fe",
        text: "Cada clase del horario declara su capacidad y la ocupación se lee ahí mismo. Reservar es ocupar un lugar finito, y el horario semanal — clase, hora, coach y cupo — es la fuente de verdad de lo que se puede vender.",
      },
      {
        title: "La renovación es una cola de trabajo",
        text: "Membresías y paquetes generan cobros con vencimiento, y la pantalla de cobros los ordena por lo que exige acción: vencido, fallido, por cobrar, cobrado. Cada pago se registra y deja su recibo en PDF — la facturación no es un reporte a fin de mes, es operación diaria.",
      },
      {
        title: "Una demo con el estándar de producción",
        text: "Construida de extremo a extremo a partir de un brief comercial y cubierta por 30 pruebas E2E con Playwright, con LCP < 2 s medido en móvil con 4G. El punto de la demo es ese: el estándar no baja porque no haya cliente.",
      },
    ],
  },
  close: {
    id: "cierre",
    heading: "Lo que dejó",
    body: "La pieza del grid que muestra el rango completo sin un cliente de por medio: del brief comercial al producto navegable — reservas, membresías, cobros y analítica — operable de extremo a extremo en la demo en vivo.",
    liveHref: "https://studio-equilibrio-demo.vercel.app",
    liveLabel: "Ver el demo en vivo",
    backHref: "/#proyectos",
    backLabel: "Volver a proyectos",
  },
};
