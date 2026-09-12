/**
 * Mini-caso Cleo Spa — contenido en inglés. Misma regla que el español:
 * nada que no esté ya publicado en la ficha del proyecto o en las capturas.
 */

import type { MiniCase } from "./mini-case";

export const miniCase: MiniCase = {
  meta: {
    description:
      "Inventory and catalog for a beauty salon in Arequipa: insert-only stock ledger with FEFO batches and three roles enforced in the database and the app.",
  },
  route: "/proyectos/cleo-spa",
  kicker: "Mini-case · Direct client · in production",
  pathSegments: ["projects", "cleo-spa"],
  lead: "Inventory, public catalog and bookings for a beauty salon in Arequipa. The tool the staff uses every day — not a showcase.",
  tldr: {
    heading: "summary",
    rows: [
      {
        term: "problem",
        text: "A salon needs to know what stock it has, who moved it and what can be booked, without any of that depending on someone's memory.",
      },
      {
        term: "role",
        text: "Direct client: database, operations panel and public catalog. In production.",
      },
      {
        term: "scope",
        text: "Immutable stock ledger with FEFO batches · default-deny RLS on 16 tables · three operational roles (owner, cashier, stylist).",
      },
    ],
    resultTerm: "result",
  },
  shots: {
    id: "screens",
    heading: "The product, unretouched",
    frames: [
      {
        image: {
          src: "/screenshots/cleo-spa-movimientos.webp",
          avif: "/screenshots/cleo-spa-movimientos.avif",
          width: 1280,
          height: 1129,
          alt: "Inventory movements table: each row carries type, product and variant, signed quantity, location, date and author.",
        },
        caption:
          "Movements: each row is a ledger entry. Receipt, consumption, sale or shrinkage, always with a signed quantity and an author.",
      },
      {
        image: {
          src: "/screenshots/cleo-spa-usuarios.webp",
          avif: "/screenshots/cleo-spa-usuarios.avif",
          width: 1280,
          height: 1178,
          alt: "Users screen: invitation form with a role selector and three team accounts, each with its role and a button to deactivate it.",
        },
        caption:
          "Users: the three operational roles. Invited by email and deactivated — never deleted.",
      },
      {
        image: {
          src: "/screenshots/cleo-spa-catalogo.webp",
          avif: "/screenshots/cleo-spa-catalogo.avif",
          width: 1280,
          height: 847,
          alt: "Catalog table: product name, brand and line, number of variants and status.",
        },
        caption: "Catalog: brand, line and variants — the base the stock moves on.",
      },
    ],
  },
  decisions: {
    id: "decisions",
    heading: "Three decisions that hold up the rest",
    items: [
      {
        title: "Stock isn't edited, it's recorded",
        text: "Every movement goes in as a new row with a signed quantity, location, date and author. A correction does not rewrite the past: it goes in as one more adjustment. The balance of any product is the sum of its ledger, so the question “who moved this and when” always has an answer.",
      },
      {
        title: "FEFO batches, and the warning before expiry",
        text: "Stock is tracked by batch and outgoing movements consume the one that expires first. The panel opens with two alerts — below minimum and batches about to expire — because expired stock gets found late or not at all.",
      },
      {
        title: "Three roles, the same boundary in two layers",
        text: "Owner, cashier and stylist. Permissions live in the database with default-deny RLS on 16 tables, and the application repeats that boundary: the interface does not offer what the database is going to reject. Having the rule at the bottom is what makes it hold even when the UI gets it wrong.",
      },
    ],
  },
  close: {
    id: "closing",
    heading: "What it left behind",
    body: "This is where the starter kit came from that took Ronatello to production in 12 days: the same skeleton of roles, RLS and CI, already argued through once.",
    pending:
      "The migrations are versioned and idempotent, but they're still applied with a tool " +
      "outside the repository: a clean environment can't be spun up from scratch. It's the " +
      "first thing I'd close before the project changes hands.",
    liveHref: "https://cleospa.pe",
    liveLabel: "See the live site",
    backLabel: "Back to projects",
  },
};
