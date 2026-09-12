/**
 * Contenido del sitio en español (locale por defecto).
 * `site.en.ts` debe exportar la misma forma; `site.ts` cruza los tipos.
 */

import type { EvidenceItem, ExperienceItem, Project } from "./site";

export const ui = {
  skipLink: "Saltar al contenido",
  sectionsAria: "Secciones",
  langAria: "Idioma",
  brandAria: "georgepuma.dev — inicio",
  availability: "DISPONIBLE AHORA",
  nav: {
    work: "Trabajo",
    method: "Método",
    experience: "Experiencia",
    contact: "Contacto",
  },
  headings: {
    work: "Trabajo",
    method: "Cómo trabajo",
    experience: "Experiencia",
    experienceKicker: "Trayectoria",
    stack: "Stack",
    contact: "Contacto",
  },
  footer: {
    source: "código fuente ↗",
    ci: "CI ↗",
  },
  evidenceAria: "Evidencia verificable",
  linksAria: "Enlaces principales",
  contact:
    "Busco roles full stack o frontend, de preferencia remotos. Si crees que encajo en tu equipo, escríbeme — respondo siempre.",
  pipelineKicker: "pipeline · revisor de PRs",
  meta: {
    /** Título de la home. Las subpáginas lo componen con `caseSuffix`. */
    title: "George Puma — Full Stack Developer (React, Next.js, PostgreSQL)",
    description:
      "Full Stack Developer — React, Next.js, TypeScript. Cinco años construyendo productos web empresariales, con flujos de desarrollo asistidos por IA.",
    /** Se añade al nombre del proyecto para formar el título de su página. */
    caseSuffix: " — caso de estudio",
    ogLocale: "es_PE",
  },
};

export const hero = {
  // nbsp alrededor de "·" para que el separador no quede huérfano al partir
  // línea; GMT‑5 lleva guion U+2011 (no ruptura) en vez de un "-" normal.
  status: "Full stack · contrato o indefinido · remoto · Arequipa, Perú · GMT‑5",
  headline: "Construyo productos web que llegan a producción. Y puedo demostrarlo.",
  lead: "Full Stack Developer — React, Next.js, TypeScript, PostgreSQL. Desde 2022 construyendo productos empresariales en EdTech, e-commerce, ERP y facturación electrónica, con equipos remotos de EE.UU. y Latinoamérica. Diseño flujos de desarrollo asistidos por IA y los trato como lo que son: ingeniería.",
  evidence: [
    { value: "500+ escuelas", source: "LMS K‑12 en producción; principal contribuidor de frontend y API" },
    { value: "2 negocios", source: "usan a diario software que diseñé y construí de extremo a extremo" },
    { value: "WCAG 2.1 AA", source: "requisito contractual, cumplido y cubierto por tests" },
  ] satisfies EvidenceItem[],
  // nbsp entre flecha y palabra: el token no se parte en dos líneas.
  ctas: {
    work: "Ver el trabajo →",
    cv: "CV en PDF ↓",
  },
};

/**
 * Proyecto ancla: Notable Learning ordena la lectura de /proyectos y se
 * renderiza aparte (bloque a ancho completo). Export separado para no
 * indexar con noUncheckedIndexedAccess. Su ficha suma las evidencias del
 * caso de estudio — nada que no esté ya publicado.
 */
export const anchorProject: Project = {
  slug: "notable-learning",
  name: "Notable Learning",
  level: "destacado",
  meta: "Principal contribuidor · Junto AI · feb – jun 2026",
  summary:
    "LMS K‑12 para 500+ escuelas en EE.UU. y 10 países: editor de contenido, video, RBAC de 5 roles y cumplimiento FERPA sobre un esquema de 29 entidades.",
  decision:
    "Diseñé el editor contra sus modos de fallo antes de escribir código, y la subida de archivos acabó como un flujo de tres pasos: URL firmada con los límites en la firma, validación en servidor sobre los bytes reales y finalización explícita.",
  proofs: [
    { value: "29 entidades", context: "esquema con RBAC de 5 roles y FERPA" },
    // nbsp entre día, mes y año: la fecha no se parte en dos líneas.
    { value: "12 jun 2026", context: "entregado en la fecha comprometida" },
    { value: "WCAG 2.1 AA", context: "requisito contractual, verificado con jest-axe" },
  ],
  // Vacía: la home usa `proofs` y el caso sus propias chips; el tipo la exige.
  evidence: [],
  stack: ["TypeScript", "React 19", "Next.js 16", "Prisma", "PostgreSQL", "GCS", "Mux"],
  link: {
    href: "/proyectos/notable-learning",
    label: "Leer el caso de estudio →",
    external: false,
  },
};

/**
 * Copy de la figura del esquema (SchemaFigure). Solo datos ya publicados en
 * el resumen y el caso de estudio; los roles no se nombran (NDA). Los
 * dominios del grid salen del alcance descrito en el caso: editor de cursos,
 * video (Mux), dashboards de docente y estudiante, panel multi-institución y
 * pipeline de archivos.
 */
export const schemaFigure = {
  title: "Esquema del sistema de Notable Learning",
  desc: "LMS multi-institución: 500+ escuelas en 10 países sobre un esquema de 29 entidades agrupadas por dominio — cursos, video, usuarios, instituciones y archivos — con RBAC de 5 roles y cumplimiento FERPA.",
  labels: {
    kicker: "Esquema",
    schema: "29 entidades",
    rbac: "RBAC · 5 roles",
    compliance: "FERPA",
    domains: {
      courses: "cursos",
      video: "video",
      users: "usuarios",
      institutions: "instituciones",
      files: "archivos",
    },
    // Solo hechos ya publicados en el resumen, el stack y el caso de estudio.
    details: {
      courses: "editor de contenido",
      video: "Mux",
      institutions: ["multi-tenant", "500+ escuelas"] as [string, string],
      files: "GCS · PDF por proxy de streaming",
    },
  },
  caption:
    "Cinco dominios sobre 29 entidades. El nodo destacado, instituciones, es la raíz multi-tenant de cada query.",
};

/**
 * Los proyectos con mini-caso propio se exportan sueltos: su página los
 * necesita completos (fichas, stack, enlace en vivo) y buscarlos por slug
 * en el array devolvería `Project | undefined` bajo noUncheckedIndexedAccess.
 * Mismo motivo que `anchorProject`.
 */
export const cleoSpa: Project = {
  slug: "cleo-spa",
  name: "Cleo Spa",
  level: "destacado-secundario",
  badge: "EN PRODUCCIÓN",
  meta: "Cliente directo · Arequipa",
  summary:
    "Inventario, catálogo público y reservas para un salón de belleza en Arequipa: ledger de stock inmutable con lotes FEFO, RLS default-deny en 16 tablas y panel con tres roles operativos (dueña, cajera, estilista). La herramienta que el personal usa a diario — no una vitrina.",
  proofs: [
    { value: "16 tablas", context: "con RLS default-deny: los permisos viven en la base de datos" },
    { value: "ledger insert-only", context: "cada corrección es un ajuste, nunca una edición" },
  ],
  evidence: [
    { value: "ledger insert-only", source: "correcciones = ajustes" },
    { value: "3 roles", source: "permisos en BD y app" },
  ],
  stack: ["Next.js 16", "React 19", "TypeScript", "Tailwind v4", "Supabase", "Zod", "Vitest"],
  // La tarjeta lleva al mini-caso; el enlace al sitio en vivo vive dentro.
  link: {
    href: "/proyectos/cleo-spa",
    label: "Leer el mini-caso →",
    external: false,
  },
  image: {
    src: "/screenshots/cleo-spa-card.webp",
    avif: "/screenshots/cleo-spa-card.avif",
    width: 768,
    height: 384,
    alt: "Panel de movimientos de inventario: tabla de entradas, ventas, consumos y mermas, cada fila con producto, cantidad firmada, ubicación, fecha y autor.",
  },
};

export const ronatello: Project = {
  slug: "ronatello",
  name: "Ronatello",
  level: "menor",
  badge: "EN PRODUCCIÓN",
  meta: "Cliente directo · Arequipa",
  summary:
    "Segundo cliente sobre el mismo starter kit que Cleo Spa: promociones, reservas y panel de administración, del brief al despliegue en 12 días, con un CI que levanta un stack Supabase real.",
  proofs: [
    { value: "12 días", context: "de brief a producción: 24 rutas, 9 públicas y panel admin" },
  ],
  evidence: [
    { value: "12 días", source: "brief → producción" },
    { value: "24 rutas", source: "9 públicas + panel admin" },
  ],
  stack: ["Next.js 16", "React 19", "TypeScript", "Tailwind v4", "Supabase", "Vitest", "GitHub Actions"],
  // La tarjeta lleva al mini-caso; el enlace al sitio en vivo vive dentro.
  link: {
    href: "/proyectos/ronatello",
    label: "Leer el mini-caso →",
    external: false,
  },
  image: {
    src: "/screenshots/ronatello.webp",
    avif: "/screenshots/ronatello.avif",
    width: 768,
    height: 384,
    alt: "Página de promociones: tarjetas de combos con precio, estado de disponibilidad y botón para pedir por WhatsApp.",
  },
  // `image` sigue siendo la captura completa que consume el mini-caso.
  crop: {
    src: "/screenshots/ronatello-16x10.webp",
    avif: "/screenshots/ronatello-16x10.avif",
    src2x: "/screenshots/ronatello-16x10@2x.webp",
    avif2x: "/screenshots/ronatello-16x10@2x.avif",
    width: 304,
    height: 190,
    alt: "Franja central de la página de promociones: cabecera con logo, titular «Las promos de esta noche», texto y la primera fila de tarjetas de combos con precio y botón de WhatsApp, cortadas por abajo.",
  },
};


export const studioEquilibrio: Project = {
  slug: "studio-equilibrio",
  name: "Studio Equilibrio",
  level: "menor",
  badge: "DEMO",
  meta: "Sin cliente · estándar de producción · 2,5 semanas",
  summary:
    "SaaS demo para estudios de fitness — reservas, membresías, facturación con recibos PDF y analítica — construido de extremo a extremo a partir de un brief comercial.",
  proofs: [
    { value: "LCP < 2 s", context: "en móvil sobre 4G; 30 pruebas E2E con Playwright" },
  ],
  evidence: [
    { value: "LCP < 2 s", source: "móvil, 4G" },
    { value: "30 pruebas E2E", source: "Playwright" },
  ],
  stack: ["Next.js 16", "React 19", "TypeScript", "Tailwind v4", "Supabase"],
  // La tarjeta lleva al mini-caso; el enlace al demo en vivo vive dentro.
  link: {
    href: "/proyectos/studio-equilibrio",
    label: "Leer el mini-caso →",
    external: false,
  },
  image: {
    src: "/screenshots/studio-equilibrio.webp",
    avif: "/screenshots/studio-equilibrio.avif",
    width: 768,
    height: 384,
    alt: "Portada del estudio: titular sobre la reserva de clases, filtros por disciplina y contador de disciplinas y coaches.",
  },
  // `image` sigue siendo la captura completa que consume el mini-caso.
  crop: {
    src: "/screenshots/studio-equilibrio-16x10.webp",
    avif: "/screenshots/studio-equilibrio-16x10.avif",
    src2x: "/screenshots/studio-equilibrio-16x10@2x.webp",
    avif2x: "/screenshots/studio-equilibrio-16x10@2x.avif",
    width: 304,
    height: 190,
    alt: "Portada en vivo de Studio Equilibrio: barra superior con el nombre del estudio, icono de chat y menú hamburguesa; chip «Studio Equilibrio · Bienestar & Fitness»; titular «Tu energía, en equilibrio»; subtítulo «Energía y calma, en balance»; texto sobre reservar clases; chips de Yoga, Pilates, Funcional, Cycling, Barre y Meditación; botón «Ver clases» cortado en el borde inferior.",
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
    meta: "Proyecto propio · Go",
    summary:
      "CLI en Go que sincroniza la configuración de agentes de IA entre máquinas con cifrado de extremo a extremo (age), almacenamiento content-addressed (BLAKE3) y scanner de secretos previo a cada push.",
    proofs: [
      { value: "E2E cifrado", context: "age (X25519) · BLAKE3 · Cloudflare R2 · MIT" },
    ],
    evidence: [
      { value: "E2E cifrado", source: "age · X25519" },
      { value: "MIT", source: "código abierto" },
    ],
    stack: ["Go", "Cloudflare R2", "S3 API"],
    link: {
      // nbsp entre la última palabra y la flecha, como en hero.ctas.
      href: "https://github.com/Mathi031/projsync",
      label: "Ver el repositorio ↗",
      external: true,
    },
  },
];

export const projects: Project[] = [anchorProject, ...gridProjects];

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
  lead: "La calidad y el flujo de trabajo son parte del producto, no un paso posterior.",
  kicker: "Flujo asistido por IA",
  quality: {
    kicker: "Calidad como práctica",
    items: [
      "Tests E2E con Playwright para los flujos que no pueden fallar.",
      "Accesibilidad verificada automáticamente (axe, jest-axe) en cada componente y página.",
      "Reglas de negocio en la base de datos (RLS default-deny), repetidas en la aplicación.",
      "“Lo que dejaría mejor” escrito al cierre de cada proyecto.",
    ],
  },
};
