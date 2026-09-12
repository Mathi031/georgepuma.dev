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
  evidenceAria: "Verifiable evidence",
  linksAria: "Main links",
  contact:
    "I am looking for full stack or frontend roles, preferably remote. If you think I fit your team, write to me — I always reply.",
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
  status: "Full stack · contract or permanent · remote · Arequipa, Peru · GMT‑5",
  headline: "I build web products that ship to production. And I can prove it.",
  lead: "Full Stack Developer — React, Next.js, TypeScript, PostgreSQL. Building enterprise products since 2022 in EdTech, e-commerce, ERP and electronic invoicing, with remote teams in the US and Latin America. I design AI-assisted development workflows and treat them as what they are: engineering.",
  evidence: [
    { value: "500+ schools", source: "K‑12 LMS in production; main frontend and API contributor" },
    { value: "2 businesses", source: "use software I designed and built end to end, every day" },
    { value: "WCAG 2.1 AA", source: "contract requirement, met and covered by tests" },
  ] satisfies EvidenceItem[],
  ctas: {
    work: "See the work →",
    cv: "CV (PDF) ↓",
  },
};

export const anchorProject: Project = {
  slug: "notable-learning",
  name: "Notable Learning",
  level: "destacado",
  meta: "Main contributor · Junto AI · Feb – Jun 2026",
  summary:
    "K‑12 LMS for 500+ schools in the US and 10 countries: content editor, video, 5-role RBAC and FERPA compliance over a 29-entity schema.",
  decision:
    "I designed the editor around its failure modes before writing code, and the file upload ended up as a three-step flow: a signed URL with the limits in the signature, server-side validation of the real bytes and an explicit finalize step.",
  proofs: [
    { value: "29 entities", context: "schema with 5-role RBAC and FERPA" },
    { value: "Jun 12, 2026", context: "delivered on the committed date" },
    { value: "WCAG 2.1 AA", context: "contract requirement, verified with jest-axe" },
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
    "Second client on the same starter kit as Cleo Spa: promotions, bookings and admin panel, from brief to deployment in 12 days, with a CI that spins up a real Supabase stack.",
  proofs: [
    { value: "12 days", context: "from brief to production: 24 routes, 9 public plus admin panel" },
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
    alt: "Middle strip of the promotions page: header with logo, headline «Tonight's promos», text and the first row of combo cards with price and WhatsApp button, cut off at the bottom.",
  },
};

export const studioEquilibrio: Project = {
  slug: "studio-equilibrio",
  name: "Studio Equilibrio",
  level: "menor",
  badge: "DEMO",
  meta: "No client · production standard · 2.5 weeks",
  summary:
    "Demo SaaS for fitness studios — bookings, memberships, billing with PDF receipts and analytics — built end to end from a business brief.",
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
    alt: "Live home page of Studio Equilibrio: top bar with the studio name, chat icon and hamburger menu; chip «Studio Equilibrio · Bienestar & Fitness»; headline «Tu energía, en equilibrio»; subtitle «Energía y calma, en balance»; text about booking classes; chips for Yoga, Pilates, Funcional, Cycling, Barre and Meditación; «Ver clases» button cut off at the bottom edge.",
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
      label: "See the repository ↗",
      external: true,
    },
  },
];

export const projects: Project[] = [anchorProject, ...gridProjects];

export const experience: ExperienceItem[] = [
  {
    company: "Junto AI",
    role: "Full Stack Developer (per-project contract)",
    period: "Feb 2026 – Jun 2026",
    location: "Remote · US / Costa Rica",
    lines: [
      "Main contributor to Notable Learning, a K-12 LMS in production for 500+ schools.",
      "Weekly deliveries reviewed by the CTO; project delivered on time.",
    ],
  },
  {
    company: "Global Resources",
    role: "Full Stack Developer",
    period: "Feb 2025 – Jan 2026",
    location: "Remote · Venezuela",
    lines: [
      "Management module built from scratch for a Next.js ERP, consistent with the existing architecture.",
      "Worked with the backend team on diagnosing Spring Boot microservices.",
    ],
  },
  {
    company: "Desis",
    role: "Software Developer",
    period: "Oct 2024 – Jan 2025",
    location: "Remote · Chile",
    lines: [
      "Enterprise electronic invoicing: PostgreSQL optimization and high-volume data processing.",
    ],
  },
  {
    company: "AccountTECH",
    role: "Frontend Developer",
    period: "Mar 2023 – Dec 2023",
    location: "Remote · US",
    lines: [
      "Migration of a desktop financial system to the web in React + TypeScript (AR/AP, Invoices).",
      "Responsible for the new notifications and campaigns module.",
    ],
  },
  {
    company: "Footloose",
    role: "Analyst Programmer",
    period: "Feb 2022 – Jun 2023",
    location: "Remote · Peru",
    lines: [
      "VTEX e-commerce ecosystem: catalog, promotions, storefront and React components in VTEX IO.",
    ],
  },
];

export const stack = {
  primary: {
    label: "Primary",
    items: ["TypeScript", "React", "Next.js", "Node.js", "Tailwind CSS", "PostgreSQL", "Prisma"],
  },
  solid: {
    label: "Solid",
    items: ["Playwright", "Jest", "NextAuth", "Supabase", "VTEX IO", "SQL Server", "Git / CI-CD"],
  },
  growing: {
    label: "Growing",
    items: ["Go", "Kotlin / Compose", "NestJS", "GCS", "Cloudflare R2"],
  },
};

export const aiWorkflow = {
  intro: {
    lead: "I do not use AI as autocomplete: I design systems with it.",
    rest: "My main workflow is Claude Code — specialized subagents, MCP servers and custom commands — and I treat agent configuration as what it is: engineering, with its rules, its edge cases and its maintenance.",
  },
  highlight:
    "The example that shows it best: an automated PR reviewer for Notable Learning. It validated that each branch matched a real Linear ticket, loaded the project conventions from a context repo, invoked subagents depending on what the diff touched (security, tests, architecture) and reviewed in two stages: first it checked whether previous blocking comments were actually resolved, citing file and line; then it did its own review with project criteria — multi-tenant isolation, roles as enums, Zod validation, zero PII in logs. All in a single consolidated comment, with severities and suggested fixes.",
  honestyIntro:
    "I designed it and operated it on my own PRs; the team reported that human reviews arrived with the obvious work already flagged.",
  honestyQuote:
    "I learned more from its failures than from its successes: a noisy automated reviewer is worse than none, so half of the design is conditions for staying silent.",
  pipeline: ["webhook", "validation", "context", "subagents", "two stages", "single comment"],
  pipelineNote:
    "All the analysis ends in one consolidated comment — a bot that comments five times is noise.",
  lead: "Quality and workflow are part of the product, not a later step.",
  kicker: "AI-assisted workflow",
  quality: {
    kicker: "Quality as practice",
    items: [
      "E2E tests with Playwright for the flows that cannot fail.",
      "Accessibility verified automatically (axe, jest-axe) on every component and page.",
      "Business rules in the database (default-deny RLS), repeated in the application.",
      "“What I would leave better” written at the close of every project.",
    ],
  },
};
