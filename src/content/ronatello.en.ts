/**
 * Mini-caso Ronatello — contenido en inglés. Misma regla que el español:
 * nada que no esté ya publicado en la ficha del proyecto o en las capturas.
 */

import type { MiniCase } from "./mini-case";

export const miniCase: MiniCase = {
  meta: {
    description:
      "Production site for a liquor store in Arequipa: promotions with validity dates, bookings with capacity limits and its own admin panel. From brief to deployment in 12 days.",
  },
  route: "/proyectos/ronatello",
  kicker: "Mini-case · Direct client · 12 days to production",
  pathSegments: ["projects", "ronatello"],
  lead: "Production site for a newly opened neighborhood liquor store in Arequipa: promotions with validity dates, bookings with capacity limits and its own admin panel. From brief to deployment in 12 days.",
  tldr: {
    heading: "summary",
    rows: [
      {
        term: "problem",
        text: "A newly opened liquor store needs to publish promotions that expire, take bookings without exceeding capacity and manage all of it from its own panel.",
      },
      {
        term: "role",
        text: "Direct client: from brief to deployment in 12 days, reusing the starter kit extracted from Cleo Spa. In production.",
      },
      {
        term: "scope",
        text: "24 routes (9 public + admin panel) · business rules in Postgres with RLS · CI that spins up a real Supabase stack.",
      },
    ],
    resultTerm: "result",
  },
  shots: {
    id: "screens",
    heading: "The product, as it is",
    frames: [
      {
        image: {
          src: "/screenshots/ronatello-promociones.webp",
          avif: "/screenshots/ronatello-promociones.avif",
          width: 1280,
          height: 720,
          alt: "Promotions table in the panel: each row with the combo, price, validity range, capacity and status — active or ended — and actions to edit and unpublish.",
        },
        caption:
          "Promotions: validity dates and capacity in plain view. The ended one stays in the table — history, not deletion.",
      },
      {
        image: {
          src: "/screenshots/ronatello-reservas.webp",
          avif: "/screenshots/ronatello-reservas.avif",
          width: 1280,
          height: 720,
          alt: "Bookings table: code, promotion, customer with buttons to call or open WhatsApp, delivery and status; expired ones show a final-status note kept as history.",
        },
        caption:
          "Bookings: an expired one becomes a record only — kept as history, with the phone still visible in case the customer needs to be contacted.",
      },
      {
        image: {
          src: "/screenshots/ronatello-dashboard.webp",
          avif: "/screenshots/ronatello-dashboard.avif",
          width: 1280,
          height: 720,
          alt: "Home panel with four cards: bookings awaiting a reply, promotions closing soon, products published on the site versus those not, and access to the public site.",
        },
        caption:
          "The panel opens with what is actionable: what awaits a reply, what closes soon and what the customer sees — or does not see.",
      },
    ],
  },
  decisions: {
    id: "decisions",
    heading: "Three decisions that hold up the rest",
    items: [
      {
        title: "A promotion knows when it is alive",
        text: "Every promotion carries a validity range and a capacity, and its status is read from there: active or ended. It can be unpublished early, but an ended one does not disappear — it stays in the table as a history of what was offered.",
      },
      {
        title: "An expired booking is a record, not a pending item",
        text: "Bookings deduct capacity from their promotion and expire if nobody replies in time. An expired, delivered or cancelled booking moves to a final status: it is kept as history, no longer accepts actions, and the customer's phone stays visible in case they need to be contacted.",
      },
      {
        title: "The rules live in Postgres, and CI tests them for real",
        text: "Business rules live in Postgres with RLS and CI spins up a real Supabase stack — the same skeleton of roles, RLS and CI extracted from Cleo Spa. Reusing decisions already argued through once is what made it possible to go from brief to deployment in 12 days.",
      },
    ],
  },
  close: {
    id: "closing",
    heading: "What it left behind",
    body: "The proof that the starter kit extracted from Cleo Spa works: the same skeleton of roles, RLS and CI, from brief to production in 12 days. What was an extraction there was a deadline here.",
    liveHref: "https://ronatello.pe",
    liveLabel: "See the live site",
    backLabel: "Back to projects",
  },
};
