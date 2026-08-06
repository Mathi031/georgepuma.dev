/**
 * Contenido del sitio, tipado. El "CMS" es git: editar contenido = commit.
 * Regla editorial: cada afirmación debe ser defendible en una entrevista.
 */

export type Locale = "es" | "en";

export type EvidenceItem = { value: string; source: string };

export type Project = {
  slug: string;
  name: string;
  role: string;
  summary: string;
  evidence: EvidenceItem[];
  stack: string[];
  link: { href: string; label: string; external: boolean };
};

export type ExperienceItem = {
  company: string;
  role: string;
  period: string;
  location: string;
  lines: string[];
};

export const identity = {
  name: "George Puma",
  fullName: "George Miguel Puma Salcedo",
  title: "Full Stack Developer",
  location: "Arequipa, Perú · GMT-5 · remoto",
  email: "george@georgepuma.dev",
  github: "https://github.com/Mathi031",
  repo: "https://github.com/Mathi031/georgepuma.dev",
  linkedin: "https://www.linkedin.com/in/mathi031/",
  cvUrl: "/cv-george-puma.pdf", // TODO: subir el PDF a /public
};

export const hero = {
  headline: "Construyo productos web que llegan a producción.",
  thesis: "Y puedo demostrarlo.",
  positioning: {
    lead: "Full Stack Developer — React, Next.js, TypeScript.",
    rest: "Cinco años construyendo productos empresariales: EdTech, e-commerce, ERP y facturación electrónica. Diseño flujos de desarrollo asistidos por IA y los trato como lo que son: ingeniería.",
  },
  evidence: [
    { value: "500+ escuelas", source: "LMS en producción" },
    { value: "LCP < 2 s", source: "medido en 4G" },
    { value: "WCAG 2.1 AA", source: "requisito contractual" },
  ] satisfies EvidenceItem[],
};

export const projects: Project[] = [
  {
    slug: "notable-learning",
    name: "Notable Learning",
    role: "Principal contribuidor · Feb – Jun 2026",
    summary:
      "LMS institucional K-12 para 500+ escuelas en EE.UU. y 10 países. Frontend completo y capa de API: editor de contenido, video, RBAC de 5 roles y cumplimiento FERPA sobre un esquema de 29 entidades.",
    evidence: [
      { value: "entregado en fecha", source: "jun 2026" },
      { value: "FERPA", source: "datos de menores" },
    ],
    stack: ["TypeScript", "React 19", "Next.js 16", "Prisma", "PostgreSQL", "GCS", "Mux"],
    link: {
      href: "/proyectos/notable-learning",
      label: "Leer el caso de estudio",
      external: false,
    },
  },
  {
    slug: "cleo-spa",
    name: "Cleo Spa",
    role: "Cliente directo · en producción",
    summary:
      "Inventario, catálogo público y reservas para un salón de belleza en Arequipa: ledger de stock inmutable con lotes FEFO, RLS default-deny en 16 tablas y panel con tres roles operativos (dueña, cajera, estilista). La herramienta que el personal usa a diario — no una vitrina.",
    evidence: [
      { value: "ledger insert-only", source: "correcciones = ajustes" },
      { value: "3 roles", source: "permisos en BD y app" },
    ],
    stack: ["Next.js 16", "React 19", "TypeScript", "Tailwind v4", "Supabase", "Zod", "Vitest"],
    link: {
      href: "https://cleospa.pe",
      label: "Ver el sitio en vivo",
      external: true,
    },
  },
  {
    slug: "ronatello",
    name: "Ronatello",
    role: "Cliente directo · 12 días a producción",
    summary:
      "Sitio de producción para una licorería de barrio recién abierta en Arequipa: promociones con vigencia, reservas con cupo y panel de administración propio. Las reglas de negocio viven en Postgres (RLS), el CI levanta un stack Supabase real, y fue del brief al despliegue en 12 días reutilizando un starter kit extraído de Cleo Spa.",
    evidence: [
      { value: "12 días", source: "brief → producción" },
      { value: "24 rutas", source: "9 públicas + panel admin" },
    ],
    stack: ["Next.js 16", "React 19", "TypeScript", "Tailwind v4", "Supabase", "Vitest", "GitHub Actions"],
    link: {
      href: "https://ronatello.pe",
      label: "Ver el sitio en vivo",
      external: true,
    },
  },
  {
    slug: "studio-equilibrio",
    name: "Studio Equilibrio",
    role: "Diseño a producción, en solitario · 2.5 semanas",
    summary:
      "SaaS demo para estudios de fitness — reservas, membresías, facturación con recibos PDF y analítica — construido de extremo a extremo a partir de un brief comercial.",
    evidence: [
      { value: "LCP < 2 s", source: "móvil, 4G" },
      { value: "30 pruebas E2E", source: "Playwright" },
    ],
    stack: ["Next.js 16", "React 19", "TypeScript", "Tailwind v4", "Supabase"],
    link: {
      href: "https://studio-equilibrio-demo.vercel.app",
      label: "Ver el demo en vivo",
      external: true,
    },
  },
  {
    slug: "projsync",
    name: "projsync",
    role: "Proyecto propio · open source",
    summary:
      "CLI en Go que sincroniza la configuración de agentes de IA entre máquinas con cifrado de extremo a extremo (age), almacenamiento content-addressed (BLAKE3) y scanner de secretos previo a cada push.",
    evidence: [
      { value: "E2E cifrado", source: "age · X25519" },
      { value: "MIT", source: "código abierto" },
    ],
    stack: ["Go", "Cloudflare R2", "S3 API"],
    link: {
      href: "https://github.com/Mathi031/projsync",
      label: "Ver el repositorio",
      external: true,
    },
  },
];

export const experience: ExperienceItem[] = [
  {
    company: "Junto AI",
    role: "Full Stack Developer (contrato por proyecto)",
    period: "Feb 2026 – Jun 2026",
    location: "Remoto · EE.UU. / Costa Rica",
    lines: [
      "Principal contribuidor de Notable Learning, LMS K-12 en producción para 500+ escuelas.",
      "Entregas semanales revisadas por el CTO; proyecto entregado en fecha.",
    ],
  },
  {
    company: "Global Resources",
    role: "Full Stack Developer",
    period: "Feb 2025 – Ene 2026",
    location: "Remoto · Venezuela",
    lines: [
      "Módulo de gestión desde cero para un ERP en Next.js, coherente con la arquitectura existente.",
      "Colaboración con backend en diagnóstico de microservicios Spring Boot.",
    ],
  },
  {
    company: "Desis",
    role: "Software Developer",
    period: "Oct 2024 – Ene 2025",
    location: "Remoto · Chile",
    lines: [
      "Facturación electrónica empresarial: optimización de PostgreSQL y procesamiento de grandes volúmenes.",
    ],
  },
  {
    company: "AccountTECH",
    role: "Frontend Developer",
    period: "Mar 2023 – Dic 2023",
    location: "Remoto · EE.UU.",
    lines: [
      "Migración de un sistema financiero de escritorio a web en React + TypeScript (AR/AP, Invoices).",
      "Responsable del módulo nuevo de notificaciones y campañas.",
    ],
  },
  {
    company: "Footloose",
    role: "Analista Programador",
    period: "Feb 2022 – Jun 2023",
    location: "Remoto · Perú",
    lines: [
      "Ecosistema e-commerce VTEX: catálogo, promociones, storefront y componentes React en VTEX IO.",
    ],
  },
];

export const stack = {
  primary: {
    label: "Dominio principal",
    items: ["TypeScript", "React", "Next.js", "Node.js", "Tailwind CSS", "PostgreSQL", "Prisma"],
  },
  solid: {
    label: "Sólido",
    items: ["Playwright", "Jest", "NextAuth", "Supabase", "VTEX IO", "SQL Server", "Git / CI-CD"],
  },
  growing: {
    label: "En crecimiento",
    items: ["Go", "Kotlin / Compose", "NestJS", "GCS", "Cloudflare R2"],
  },
};

export const aiWorkflow = {
  intro: {
    lead: "No uso IA como autocompletado: diseño sistemas con ella.",
    rest: "Mi flujo principal es Claude Code — subagentes especializados, servidores MCP y comandos propios — y trato la configuración de agentes como lo que es: ingeniería, con sus reglas, sus casos borde y su mantenimiento.",
  },
  highlight:
    "El ejemplo que mejor lo muestra: un revisor automatizado de PRs para Notable Learning. Validaba que cada rama correspondiera a un ticket real de Linear, cargaba las convenciones del proyecto desde un repo de contexto, invocaba subagentes según lo que tocaba el diff (seguridad, tests, arquitectura) y revisaba en dos etapas: primero verificaba si los comentarios bloqueantes anteriores estaban realmente resueltos, citando archivo y línea; después hacía su propia revisión con criterios del proyecto — aislamiento multi-tenant, roles con enums, validación Zod, cero PII en logs. Todo en un único comentario consolidado, con severidades y fixes sugeridos.",
  honestyIntro:
    "Lo diseñé y operé sobre mis propios PRs; el equipo reportó que las revisiones humanas llegaban con el trabajo obvio ya señalado.",
  honestyQuote:
    "Aprendí más de sus fallos que de sus aciertos: un revisor automático ruidoso es peor que ninguno, así que la mitad del diseño son condiciones para callarse.",
  pipeline: ["webhook", "validación", "contexto", "subagentes", "dos etapas", "comentario único"],
  pipelineNote:
    "Todo el análisis termina en un solo comentario consolidado — un bot que comenta cinco veces es ruido.",
};
