/**
 * Mini-caso Studio Equilibrio — contenido en inglés. Misma regla que el
 * español: nada que no esté ya publicado en la ficha del proyecto o en las
 * capturas.
 */

import type { MiniCase } from "./mini-case";

export const miniCase: MiniCase = {
  meta: {
    description:
      "Demo SaaS for fitness studios: bookings with capacity, memberships and billing with PDF receipts. Solo, with 30 E2E tests and LCP < 2 s.",
  },
  route: "/proyectos/studio-equilibrio",
  kicker: "Mini-case · Design to production, solo · 2.5 weeks",
  pathSegments: ["projects", "studio-equilibrio"],
  lead: "Demo SaaS for fitness studios — bookings, memberships, billing and analytics — built end to end from a business brief. A demo, held to the standard of a real product.",
  tldr: {
    heading: "summary",
    rows: [
      {
        term: "problem",
        text: "A fitness studio lives on three flows that cannot fail: the class has capacity, the membership renews and the charge arrives with its receipt.",
      },
      {
        term: "role",
        text: "Commissioned by Junto AI as a sales demo to win clients. Design to production, solo: from brief to an end-to-end demo in 2.5 weeks.",
      },
      {
        term: "scope",
        text: "Class bookings with capacity · memberships and packages · billing with PDF receipts · retention analytics.",
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
          src: "/screenshots/studio-equilibrio-horario.webp",
          avif: "/screenshots/studio-equilibrio-horario.avif",
          width: 1280,
          height: 800,
          alt: "Weekly class schedule: cards per day with class name, time, coach and capacity occupancy.",
        },
        caption:
          "Schedule: every class declares its capacity — the booking is bounded from the calendar onward.",
      },
      {
        image: {
          src: "/screenshots/studio-equilibrio-miembros.webp",
          avif: "/screenshots/studio-equilibrio-miembros.avif",
          width: 1280,
          height: 1422,
          alt: "Members table with search, filters by status and plan, and CSV export: each row carries active membership, next charge, last class attended and status.",
        },
        caption:
          "Members: membership, next charge and last attendance in a single row — the state of the business, per person.",
      },
      {
        image: {
          src: "/screenshots/studio-equilibrio-cobros.webp",
          avif: "/screenshots/studio-equilibrio-cobros.avif",
          width: 1280,
          height: 1422,
          alt: "Billing screen: cards with totals for overdue, failed, due and collected, and a table of renewals per member with concept, amount, due date, status and a button to record the payment.",
        },
        caption:
          "Billing: overdue or due renewals, failed ones and recent payments — billing as a work queue, not a report.",
      },
    ],
  },
  decisions: {
    id: "decisions",
    heading: "Three decisions that hold up the rest",
    items: [
      {
        title: "Capacity lives in the class, not on trust",
        text: "Every class in the schedule declares its capacity and occupancy is read right there. Booking means taking a finite spot, and the weekly schedule — class, time, coach and capacity — is the source of truth for what can be sold.",
      },
      {
        title: "Renewal is a work queue",
        text: "Memberships and packages generate charges with a due date, and the billing screen sorts them by what demands action: overdue, failed, due, collected. Every payment is recorded and leaves its PDF receipt — billing is not an end-of-month report, it is daily operation.",
      },
      {
        title: "A demo held to production standards",
        text: "Built end to end from a business brief and covered by 30 E2E tests with Playwright, with LCP < 2 s measured on mobile over 4G. That is the point of the demo: the standard doesn't drop because the product is a sales piece.",
      },
    ],
  },
  close: {
    id: "closing",
    heading: "What it left behind",
    body: "The piece of the grid that shows full range on a tightly scoped commission: from the business brief to a navigable product — bookings, memberships, billing and analytics — operable end to end in the live demo.",
    liveHref: "https://studio-equilibrio-demo.vercel.app",
    liveLabel: "See the live demo",
    backLabel: "Back to projects",
  },
};
