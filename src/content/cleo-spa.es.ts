/**
 * Mini-caso Cleo Spa — contenido en español.
 *
 * Regla de este archivo: nada que no esté ya publicado en la ficha del
 * proyecto (site.es.ts) o visible en las capturas. Sin métricas nuevas.
 */

import type { MiniCase } from "./mini-case";

export const miniCase: MiniCase = {
  meta: {
    title: "Cleo Spa — mini-caso",
    description:
      "Inventario y catálogo para un salón de belleza en Arequipa: ledger de stock insert-only con lotes FEFO y tres roles con permisos en base de datos y aplicación.",
  },
  route: "/proyectos/cleo-spa",
  kicker: "Mini-caso · Cliente directo · en producción",
  pathSegments: ["proyectos", "cleo-spa"],
  lead: "Inventario, catálogo público y reservas para un salón de belleza en Arequipa. La herramienta que el personal usa a diario — no una vitrina.",
  tldr: {
    heading: "resumen",
    rows: [
      {
        term: "problema",
        text: "Un salón necesita saber qué stock tiene, quién lo movió y qué se puede reservar, sin que eso dependa de la memoria de nadie.",
      },
      {
        term: "rol",
        text: "Cliente directo: base de datos, panel de operación y catálogo público. En producción.",
      },
      {
        term: "alcance",
        text: "Ledger de stock inmutable con lotes FEFO · RLS default-deny en 16 tablas · tres roles operativos (dueña, cajera, estilista).",
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
          src: "/screenshots/cleo-spa-movimientos.webp",
          avif: "/screenshots/cleo-spa-movimientos.avif",
          width: 1280,
          height: 1129,
          alt: "Tabla de movimientos de inventario: cada fila lleva tipo, producto y variante, cantidad con signo, ubicación, fecha y autor.",
        },
        caption:
          "Movimientos: cada fila es un asiento del ledger. Entrada, consumo, venta o merma, siempre con cantidad firmada y autor.",
      },
      {
        image: {
          src: "/screenshots/cleo-spa-usuarios.webp",
          avif: "/screenshots/cleo-spa-usuarios.avif",
          width: 1280,
          height: 1178,
          alt: "Pantalla de usuarios: formulario de invitación con selector de rol y tres cuentas del equipo, cada una con su rol y un botón para desactivarla.",
        },
        caption:
          "Usuarios: los tres roles operativos. Se invita por correo y se desactiva — no se borra.",
      },
      {
        image: {
          src: "/screenshots/cleo-spa-catalogo.webp",
          avif: "/screenshots/cleo-spa-catalogo.avif",
          width: 1280,
          height: 847,
          alt: "Tabla del catálogo: nombre del producto, marca y línea, número de variantes y estado.",
        },
        caption: "Catálogo: marca, línea y variantes — la base sobre la que se mueve el stock.",
      },
    ],
  },
  decisions: {
    id: "decisiones",
    heading: "Tres decisiones que sostienen el resto",
    items: [
      {
        title: "El stock no se edita, se registra",
        text: "Cada movimiento entra como fila nueva con cantidad firmada, ubicación, fecha y autor. Una corrección no reescribe el pasado: entra como un ajuste más. El saldo de cualquier producto es la suma de su ledger, así que la pregunta «quién movió esto y cuándo» siempre tiene respuesta.",
      },
      {
        title: "Lotes FEFO, y el aviso antes del vencimiento",
        text: "El stock se lleva por lotes y las salidas consumen primero el que vence antes. El panel abre con dos alertas —bajo mínimo y lotes por vencer— porque un vencimiento se descubre tarde o no se descubre.",
      },
      {
        title: "Tres roles, la misma frontera en dos capas",
        text: "Dueña, cajera y estilista. Los permisos viven en la base de datos con RLS default-deny sobre 16 tablas, y la aplicación repite esa frontera: la interfaz no ofrece lo que la base va a rechazar. Que la regla esté abajo es lo que hace que valga aunque el panel se equivoque.",
      },
    ],
  },
  close: {
    id: "cierre",
    heading: "Lo que dejó",
    body: "De aquí salió el starter kit con el que Ronatello llegó a producción en 12 días: el mismo esqueleto de roles, RLS y CI, ya discutido una vez.",
    liveHref: "https://cleospa.pe",
    liveLabel: "Ver el sitio en vivo",
    backHref: "/#proyectos",
    backLabel: "Volver a proyectos",
  },
};
