/**
 * Contenido del sitio en inglés. Misma forma que `site.es.ts`; `site.ts`
 * cruza los tipos.
 */

import type { EvidenceItem, ExperienceItem, Project } from "./site";

export const ui = {
  skipLink: "Skip to content",
  sectionsAria: "Sections",
  langAria: "Language",
  brandAria: "georgepuma.dev — home",
  availability: "AVAILABLE NOW",
  nav: {
    work: "Work",
    method: "How I work",
    experience: "Experience",
    contact: "Contact",
  },
  headings: {
    work: "Work",
    method: "How I work",
    experience: "Experience",
    experienceKicker: "Career",
    stack: "Stack",
    contact: "Contact",
  },
  footer: {
    source: "source code ↗",
    ci: "CI ↗",
  },
  /** Etiquetas del cuerpo de cada puesto en la trayectoria. */
  experience: {
    context: "Context",
    scope: "Scope",
    result: "Outcome",
    tech: "Tech",
  },
  evidenceAria: "Verifiable evidence",
  linksAria: "Main links",
  contact:
    "I'm looking for full stack or frontend roles, ideally remote. If you think I'd fit your team, get in touch — I always reply.",
  pipelineKicker: "pipeline · PR reviewer",
  meta: {
    // El título no se traduce: nombre, rol y tecnologías son los mismos.
    title: "George Puma — Full Stack Developer (React, Next.js, PostgreSQL)",
    description:
      "Full Stack Developer — React, Next.js, TypeScript. Five years building enterprise web products, with AI-assisted development workflows.",
    caseSuffix: " — case study",
    ogLocale: "en_US",
  },
};

export const hero = {
  // nbsp alrededor de "·" y guion U+2011 en GMT‑5: mismo motivo que en español.
  status: "Full stack · contract or full-time · remote · Arequipa, Peru · GMT‑5",
  headline: "I build web products that ship to production. And I can prove it.",
  lead: "Full Stack Developer — React, Next.js, TypeScript, PostgreSQL. Five years building enterprise products in EdTech, e-commerce, ERP and electronic invoicing, with remote teams in the US and Latin America. I design AI-assisted development workflows and treat them as what they are: engineering.",
  evidence: [
    { value: "500+ schools", source: "K‑12 LMS in production; primary contributor to the frontend and API" },
    { value: "2 businesses", source: "run daily on software I designed and built end to end" },
    { value: "WCAG 2.1 AA", source: "contractual requirement, met and covered by tests" },
  ] satisfies EvidenceItem[],
  ctas: {
    work: "See the work →",
    cv: "Résumé (PDF) ↓",
    cvUrl: "/cv-george-puma-en.pdf",
  },
};

export const anchorProject: Project = {
  slug: "notable-learning",
  name: "Notable Learning",
  level: "destacado",
  meta: "Primary contributor · Junto AI · Feb – Jun 2026",
  summary:
    "K‑12 LMS for 500+ schools in the US and 10 countries: content editor, video, 5-role RBAC and FERPA compliance over a 29-entity schema.",
  decision:
    "I designed the editor around its failure modes before writing code, and the file upload ended up as a three-step flow: a signed URL with the limits baked into the signature, server-side validation of the real bytes and an explicit finalize step.",
  proofs: [
    { value: "29 entities", context: "schema with 5-role RBAC and FERPA" },
    { value: "Jun 12, 2026", context: "delivered on the agreed date" },
    { value: "WCAG 2.1 AA", context: "contractual requirement, verified with jest-axe" },
  ],
  evidence: [],
  stack: ["TypeScript", "React 19", "Next.js 16", "Prisma", "PostgreSQL", "GCS", "Mux"],
  link: {
    href: "/proyectos/notable-learning",
    label: "Read the case study →",
    external: false,
  },
};

export const schemaFigure = {
  title: "Notable Learning system schema",
  desc: "Multi-institution LMS: 500+ schools in 10 countries over a 29-entity schema grouped by domain — courses, video, users, institutions and files — with 5-role RBAC and FERPA compliance.",
  labels: {
    kicker: "Schema",
    schema: "29 entities",
    rbac: "RBAC · 5 roles",
    compliance: "FERPA",
    domains: {
      courses: "courses",
      video: "video",
      users: "users",
      institutions: "institutions",
      files: "files",
    },
    details: {
      courses: "content editor",
      video: "Mux",
      institutions: ["multi-tenant", "500+ schools"] as [string, string],
      files: "GCS · PDF via streaming proxy",
    },
  },
  caption:
    "Five domains over 29 entities. The highlighted node, institutions, is the multi-tenant root of every query.",
};

export const cleoSpa: Project = {
  slug: "cleo-spa",
  name: "Cleo Spa",
  level: "destacado-secundario",
  badge: "IN PRODUCTION",
  meta: "Direct client · Arequipa",
  summary:
    "Inventory, public catalog and bookings for a beauty salon in Arequipa: immutable stock ledger with FEFO batches, default-deny RLS on 16 tables and a panel with three operational roles (owner, cashier, stylist). The tool the staff uses every day — not a showcase.",
  proofs: [
    { value: "16 tables", context: "with default-deny RLS: permissions live in the database" },
    { value: "insert-only ledger", context: "every correction is an adjustment, never an edit" },
  ],
  evidence: [
    { value: "insert-only ledger", source: "corrections = adjustments" },
    { value: "3 roles", source: "permissions in DB and app" },
  ],
  stack: ["Next.js 16", "React 19", "TypeScript", "Tailwind v4", "Supabase", "Zod", "Vitest"],
  link: {
    href: "/proyectos/cleo-spa",
    label: "Read the mini-case →",
    external: false,
  },
  image: {
    src: "/screenshots/cleo-spa-card.webp",
    avif: "/screenshots/cleo-spa-card.avif",
    width: 768,
    height: 384,
    alt: "Inventory movements panel: table of receipts, sales, consumption and shrinkage, each row with product, signed quantity, location, date and author.",
  },
};

export const ronatello: Project = {
  slug: "ronatello",
  name: "Ronatello",
  level: "menor",
  badge: "IN PRODUCTION",
  meta: "Direct client · Arequipa",
  summary:
    "Second client built on the same starter kit as Cleo Spa: promotions, bookings and an admin panel, from brief to deployment in 12 days, with CI that spins up a real Supabase stack.",
  proofs: [
    { value: "12 days", context: "from brief to production: 24 routes, 9 public, plus an admin panel" },
  ],
  evidence: [
    { value: "12 days", source: "brief → production" },
    { value: "24 routes", source: "9 public + admin panel" },
  ],
  stack: ["Next.js 16", "React 19", "TypeScript", "Tailwind v4", "Supabase", "Vitest", "GitHub Actions"],
  link: {
    href: "/proyectos/ronatello",
    label: "Read the mini-case →",
    external: false,
  },
  image: {
    src: "/screenshots/ronatello.webp",
    avif: "/screenshots/ronatello.avif",
    width: 768,
    height: 384,
    alt: "Promotions page: combo cards with price, availability status and a button to order via WhatsApp.",
  },
  crop: {
    src: "/screenshots/ronatello-16x10.webp",
    avif: "/screenshots/ronatello-16x10.avif",
    src2x: "/screenshots/ronatello-16x10@2x.webp",
    avif2x: "/screenshots/ronatello-16x10@2x.avif",
    width: 304,
    height: 190,
    alt: "Middle strip of the promotions page: header with logo, headline “Las promos de esta noche”, text and the first row of combo cards with price and WhatsApp button, cut off at the bottom.",
  },
};

export const studioEquilibrio: Project = {
  slug: "studio-equilibrio",
  name: "Studio Equilibrio",
  level: "menor",
  badge: "DEMO",
  meta: "Sales demo for Junto AI · solo · 2.5 weeks",
  summary:
    "Demo SaaS for fitness studios — bookings, memberships, billing with PDF receipts and analytics — built end to end for Junto AI from a business brief.",
  proofs: [
    { value: "LCP < 2 s", context: "on mobile over 4G; 30 E2E tests with Playwright" },
  ],
  evidence: [
    { value: "LCP < 2 s", source: "mobile, 4G" },
    { value: "30 E2E tests", source: "Playwright" },
  ],
  stack: ["Next.js 16", "React 19", "TypeScript", "Tailwind v4", "Supabase"],
  link: {
    href: "/proyectos/studio-equilibrio",
    label: "Read the mini-case →",
    external: false,
  },
  image: {
    src: "/screenshots/studio-equilibrio.webp",
    avif: "/screenshots/studio-equilibrio.avif",
    width: 768,
    height: 384,
    alt: "Studio home page: headline about booking classes, filters by discipline and a counter of disciplines and coaches.",
  },
  crop: {
    src: "/screenshots/studio-equilibrio-16x10.webp",
    avif: "/screenshots/studio-equilibrio-16x10.avif",
    src2x: "/screenshots/studio-equilibrio-16x10@2x.webp",
    avif2x: "/screenshots/studio-equilibrio-16x10@2x.avif",
    width: 304,
    height: 190,
    alt: "Live home page of Studio Equilibrio: top bar with the studio name, chat icon and hamburger menu; chip “Studio Equilibrio · Bienestar & Fitness”; headline “Tu energía, en equilibrio”; subtitle “Energía y calma, en balance”; text about booking classes; chips for Yoga, Pilates, Funcional, Cycling, Barre and Meditación; “Ver clases” button cut off at the bottom edge.",
  },
};

export const gridProjects: Project[] = [
  cleoSpa,
  ronatello,
  studioEquilibrio,
  {
    slug: "projsync",
    name: "projsync",
    level: "menor",
    badge: "OPEN SOURCE",
    meta: "Personal project · Go",
    summary:
      "A Go CLI that syncs AI agent configuration between machines with end-to-end encryption (age), content-addressed storage (BLAKE3) and a secret scanner that runs before every push.",
    proofs: [
      { value: "E2E encrypted", context: "age (X25519) · BLAKE3 · Cloudflare R2 · MIT" },
    ],
    evidence: [
      { value: "E2E encrypted", source: "age · X25519" },
      { value: "MIT", source: "open source" },
    ],
    stack: ["Go", "Cloudflare R2", "S3 API"],
    link: {
      href: "https://github.com/Mathi031/projsync",
      label: "View the repository ↗",
      external: true,
    },
  },
];

export const projects: Project[] = [anchorProject, ...gridProjects];

export const experience: ExperienceItem[] = [
  {
    company: "Junto AI",
    role: "Full Stack Developer",
    period: "Feb 2026 – Jun 2026",
    type: "Project-based contract",
    location: "Remote · US / Costa Rica",
    impact:
      "Primary contributor to a K‑12 LMS in production for 500+ schools, delivered on the agreed date.",
    context:
      "An institutional LMS for the US and 10 countries, handling data on minors, with FERPA compliance as a hard requirement. A fixed-scope contract that ended with the delivery.",
    scope: [
      "The full frontend and API layer: component library, content editor for teachers, student and teacher dashboards, and a multi-institution admin panel.",
      "Video (Mux) and storage (Google Cloud Storage) integrations, with a three-step direct upload and server-side validation of the content.",
      "An automated PR reviewer built on Claude Code: webhook, validation against the Linear ticket, subagents chosen based on the diff, and a single consolidated comment.",
    ],
    result:
      "Delivered on Jun 12, 2026, the agreed date, with weekly deliverables reviewed by the CTO and WCAG 2.1 AA verified with jest-axe on every component.",
    resultLink: { href: "/proyectos/notable-learning", label: "Read the case study →" },
    tech: [
      "TypeScript",
      "React 19",
      "Next.js 16",
      "Prisma",
      "PostgreSQL",
      "NextAuth",
      "GCS",
      "Mux",
      "Linear",
    ],
  },
  {
    company: "Global Resources",
    role: "Frontend Developer",
    period: "Feb 2025 – Jan 2026",
    type: "Contract",
    location: "Remote · Venezuela",
    impact:
      "A Next.js frontend for a telecom operator's network management system, built on top of existing services.",
    context:
      "The client ran the system from a Java frontend over the same services and wanted a modern interface. I started from a minimal template with their design system (Mistica) and worked alongside another frontend developer, each of us owning our own modules.",
    scope: [
      "Network query modules: components, sources, nodes and component types, on top of Java and Quarkus APIs with Kafka.",
      "A demo cycle with the client on every iteration: walkthrough, requested changes, implementation and another walkthrough.",
      "API changes worked out with the backend team whenever the frontend needed the data in a different shape, plus debugging Spring Boot microservices.",
      "Unit tests with Cypress over the delivered modules, at the close of the project.",
      "For a second client of the consultancy, interface changes on an Angular frontend with microfrontends and on a Flutter app.",
    ],
    result:
      "The modules shipped with the client's sign-off on every iteration, and their tests live in the team's repository.",
    tech: [
      "Next.js",
      "React",
      "TypeScript",
      "Mistica",
      "Cypress",
      "Angular",
      "Flutter",
      "Docker",
      "Java / Quarkus and Kafka (server side)",
      "Spring Boot (debugging)",
    ],
  },
  {
    company: "Desis",
    role: "Developer",
    period: "Oct 2024 – Jan 2025",
    type: "Employee",
    location: "Remote · Chile",
    impact:
      "End-to-end tickets on an electronic invoicing system in production, written in plain PHP and JavaScript.",
    context:
      "A system that had been in production for years, with no framework. Work arrived as tickets from the operations and sales teams, and every change went through QA before it shipped.",
    scope: [
      "Changes anywhere in the system: the quoting flow, issuing invoices and receipts, content rendering and keyboard navigation.",
      "PostgreSQL database objects — indexes, functions, procedures and types — to support the new features and cut query times.",
      "Fixes on the tickets QA sent back, with the feedback resolved on the ticket itself.",
    ],
    result: "Every change reached production once QA signed off on it.",
    tech: ["PostgreSQL", "PHP", "JavaScript", "HTML", "CSS"],
  },
  {
    company: "AccountTECH",
    role: "Frontend Developer",
    period: "Mar 2023 – Dec 2023",
    type: "Contract",
    location: "Remote · US",
    impact:
      "A module-by-module migration to React of property management software used by several clients in the US.",
    context:
      "The product existed as a Visual Basic desktop application, with one database per client and high data volume. The team took that code and migrated it to a web platform in pieces.",
    scope: [
      "Migration of the financial modules: Invoices, AR Payments, AP Payments, Notifications and Reports.",
      "A new notifications and campaigns module, built end to end, working out the business rules with the backend team.",
      "Scoping new modules with the team, based on what the product's clients were asking for.",
    ],
    result: "Every migrated module went live on the web platform the system's clients use.",
    tech: ["React", "TypeScript", "Kendo UI", "Tailwind CSS", "React Query"],
  },
  {
    company: "Footloose",
    role: "Programmer Analyst",
    period: "Feb 2022 – Jun 2023",
    type: "Employee",
    location: "Peru",
    impact:
      "Two systems at once: the customer-facing VTEX e-commerce and the internal SQL Server system the staff used.",
    context:
      "A footwear retailer with year-round commercial operations. The e-commerce site was already built and live; the job was to maintain it, extend it and support the seasonal campaigns.",
    scope: [
      "Commercial operations in VTEX: campaigns, coupons, catalogs, bulk price uploads and promotion forms.",
      "Storefront: design changes through JSONC, transactional email templates and React components in VTEX IO.",
      "An internal Scriptcase system: product lookup by SKU, payment schedules for staff and PDF generators for hiring.",
      "SQL Server database: tables, stored procedures and changes promoted from development to production.",
    ],
    result:
      "The e-commerce site stayed up through the seasonal campaigns, and the internal team used the modules I shipped every day.",
    tech: ["VTEX IO", "React", "TypeScript", "Scriptcase (PHP)", "SQL Server"],
  },
  {
    company: "BIZZPERU",
    role: "Web Developer",
    period: "Mar 2021 – Jul 2021",
    type: "Freelance",
    location: "Peru",
    impact: "Websites and web interfaces in Vue and Laravel over MySQL, before moving into product work.",
    compact: true,
    group: "Before 2022",
  },
];

export const stack = {
  primary: {
    label: "Core",
    items: ["TypeScript", "React", "Next.js", "Node.js", "Tailwind CSS", "PostgreSQL", "Prisma"],
  },
  solid: {
    label: "Strong",
    items: ["Playwright", "Jest", "NextAuth", "Supabase", "VTEX IO", "SQL Server", "Git / CI-CD"],
  },
  growing: {
    label: "Exploring",
    items: ["Go", "NestJS", "GCS", "Cloudflare R2"],
  },
};

export const aiWorkflow = {
  intro: {
    lead: "I don't use AI as autocomplete: I design systems with it.",
    rest: "My main workflow runs on Claude Code — specialized subagents, MCP servers and custom commands — and I treat agent configuration as what it is: engineering, with rules, edge cases and maintenance.",
  },
  highlight:
    "The best example: an automated PR reviewer for Notable Learning. It validated that each branch matched a real Linear ticket, loaded the project conventions from a context repo, invoked subagents depending on what the diff touched (security, tests, architecture) and reviewed in two stages: first it checked whether previous blocking comments were actually resolved, citing file and line; then it did its own review against project criteria — multi-tenant isolation, roles as enums, Zod validation, zero PII in logs. All in a single consolidated comment, with severities and suggested fixes.",
  honestyIntro:
    "I designed it and ran it on my own PRs; the team reported that human reviews now arrived with the obvious issues already flagged.",
  honestyQuote:
    "I learned more from its failures than its successes: a noisy automated reviewer is worse than none, so half the design is the conditions for staying silent.",
  pipeline: ["webhook", "validation", "context", "subagents", "two stages", "single comment"],
  pipelineNote:
    "Every analysis ends in one consolidated comment — a bot that comments five times is noise.",
  lead: "Quality and workflow are part of the product, not an afterthought.",
  kicker: "AI-assisted workflow",
  quality: {
    kicker: "Quality as practice",
    items: [
      "E2E tests with Playwright for the flows that can't fail.",
      "Accessibility verified automatically (axe, jest-axe) on every component and page.",
      "Business rules in the database (default-deny RLS), mirrored in the application.",
      "“What I'd improve” written at the close of every project.",
    ],
  },
};
