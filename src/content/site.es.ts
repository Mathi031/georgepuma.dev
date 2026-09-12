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
  /** Etiquetas del cuerpo de cada puesto en la trayectoria. */
  experience: {
    context: "Contexto",
    scope: "Alcance",
    result: "Resultado",
    tech: "Tecnologías",
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
  lead: "Full Stack Developer — React, Next.js, TypeScript, PostgreSQL. Cinco años construyendo productos empresariales en EdTech, e-commerce, ERP y facturación electrónica, con equipos remotos de EE.UU. y Latinoamérica. Diseño flujos de desarrollo asistidos por IA y los trato como lo que son: ingeniería.",
  evidence: [
    { value: "500+ escuelas", source: "LMS K‑12 en producción; principal contribuidor de frontend y API" },
    { value: "2 negocios", source: "usan a diario software que diseñé y construí de extremo a extremo" },
    { value: "WCAG 2.1 AA", source: "requisito contractual, cumplido y cubierto por tests" },
  ] satisfies EvidenceItem[],
  // nbsp entre flecha y palabra: el token no se parte en dos líneas.
  ctas: {
    work: "Ver el trabajo →",
    cv: "CV en PDF ↓",
    cvUrl: "/cv-george-puma.pdf",
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
  meta: "Demo comercial para Junto AI · en solitario · 2,5 semanas",
  summary:
    "SaaS demo para estudios de fitness — reservas, membresías, facturación con recibos PDF y analítica — construida de extremo a extremo por encargo de Junto AI, a partir de un brief comercial.",
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
    role: "Full Stack Developer",
    period: "Feb 2026 – Jun 2026",
    type: "Contrato por proyecto",
    location: "Remoto · EE.UU. / Costa Rica",
    impact:
      "Principal contribuidor de un LMS K‑12 en producción para 500+ escuelas, entregado en la fecha comprometida.",
    context:
      "LMS institucional para EE.UU. y 10 países, con datos de estudiantes menores de edad y cumplimiento FERPA como requisito. Contrato de alcance cerrado, concluido con la entrega.",
    scope: [
      "Frontend completo y capa de API: librería de componentes, editor de contenido para docentes, dashboards de estudiante y docente, y panel de administración multi-institución.",
      "Integraciones de video (Mux) y almacenamiento (Google Cloud Storage), con subida directa en tres pasos y validación del contenido en servidor.",
      "Revisor automatizado de PRs con Claude Code: webhook, validación contra el ticket de Linear, subagentes según el diff y un único comentario consolidado.",
    ],
    result:
      "Entregado el 12 jun 2026, la fecha comprometida, con entregas semanales revisadas por el CTO y WCAG 2.1 AA verificado con jest-axe en cada componente.",
    resultLink: { href: "/proyectos/notable-learning", label: "Leer el caso de estudio →" },
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
    period: "Feb 2025 – Ene 2026",
    type: "Contrato",
    location: "Remoto · Venezuela",
    impact:
      "Frontend en Next.js para el sistema de gestión de red de un operador de telecomunicaciones, construido sobre servicios existentes.",
    context:
      "El cliente operaba su sistema desde un frontend en Java sobre los mismos servicios y quería una interfaz moderna. Partí de una plantilla mínima con su design system (Mistica) y trabajé con otro frontend, cada uno a cargo de sus módulos.",
    scope: [
      "Módulos de consulta de la red: componentes, fuentes, nodos y tipos de componente, sobre APIs en Java y Quarkus con Kafka.",
      "Ciclo de demo con el cliente en cada iteración: presentación, cambios pedidos, implementación y nueva presentación.",
      "Ajustes en la API junto al equipo backend cuando el frontend necesitaba otra forma de los datos, y diagnóstico de incidencias en microservicios Spring Boot.",
      "Pruebas unitarias con Cypress sobre los módulos entregados, al cierre del proyecto.",
      "Para un segundo cliente de la consultora, cambios de interfaz en un frontend Angular con microfrontends y en una app Flutter.",
    ],
    result:
      "Los módulos se entregaron validados por el cliente en cada iteración, con sus pruebas en el repositorio del equipo.",
    tech: [
      "Next.js",
      "React",
      "TypeScript",
      "Mistica",
      "Cypress",
      "Angular",
      "Flutter",
      "Docker",
      "Java / Quarkus y Kafka (lado servidor)",
      "Spring Boot (diagnóstico)",
    ],
  },
  {
    company: "Desis",
    role: "Programador",
    period: "Oct 2024 – Ene 2025",
    type: "Empleo",
    location: "Remoto · Chile",
    impact:
      "Tickets de extremo a extremo sobre un sistema de facturación electrónica en producción, en PHP y JavaScript nativos.",
    context:
      "Sistema en producción desde hacía años, sin framework. El trabajo llegaba por tickets del área operativa y comercial, y cada cambio pasaba por QA antes de subir a producción.",
    scope: [
      "Cambios sobre cualquier parte del sistema: flujo de cotización, emisión de facturas y boletas, visualización de contenido y navegación por teclado.",
      "Objetos de base de datos en PostgreSQL — índices, funciones, procedimientos y tipos — para sostener las funciones nuevas y mejorar tiempos de consulta.",
      "Correcciones sobre los tickets devueltos por QA, con el feedback resuelto en el propio ticket.",
    ],
    result: "Cada cambio llegó a producción tras la validación de QA.",
    tech: ["PostgreSQL", "PHP", "JavaScript", "HTML", "CSS"],
  },
  {
    company: "AccountTECH",
    role: "Frontend Developer",
    period: "Mar 2023 – Dic 2023",
    type: "Contrato",
    location: "Remoto · EE.UU.",
    impact:
      "Migración a React de un software de gestión inmobiliaria usado por varios clientes en EE.UU., módulo a módulo.",
    context:
      "El producto existía como aplicación de escritorio en Visual Basic, con una base de datos por cliente y volumen alto. El equipo recibió ese código y lo migró por partes a una plataforma web.",
    scope: [
      "Migración de módulos financieros: Invoices, AR Payments, AP Payments, Notifications y Reports.",
      "Módulo nuevo de notificaciones y campañas, desarrollado de principio a fin, coordinando las reglas de negocio con backend.",
      "Definición de módulos nuevos con el equipo a partir de lo que pedían los clientes del producto.",
    ],
    result: "Cada módulo migrado pasó a la plataforma web que usan los clientes del sistema.",
    tech: ["React", "TypeScript", "Kendo UI", "Tailwind CSS", "React Query"],
  },
  {
    company: "Footloose",
    role: "Analista Programador",
    period: "Feb 2022 – Jun 2023",
    type: "Empleo",
    location: "Perú",
    impact:
      "Dos sistemas a la vez: el e-commerce VTEX de cara al cliente y el sistema interno sobre SQL Server que usaba el personal.",
    context:
      "Retail de calzado con operación comercial continua. El e-commerce estaba construido y en marcha; el trabajo era mantenerlo, extenderlo y sostener las campañas de temporada.",
    scope: [
      "Operación comercial en VTEX: campañas, cupones, catálogos, carga masiva de precios y formularios de promociones.",
      "Storefront: cambios de diseño por JSONC, plantillas de correo transaccional y componentes React en VTEX IO.",
      "Sistema interno en Scriptcase: consulta de productos por SKU, cronogramas de pago de colaboradores y generadores de PDF para contratación.",
      "Base de datos SQL Server: tablas, procedimientos almacenados y cambios propagados de desarrollo a producción.",
    ],
    result:
      "El e-commerce se mantuvo operativo durante las campañas de temporada y el equipo interno trabajó a diario sobre los módulos que entregué.",
    tech: ["VTEX IO", "React", "TypeScript", "Scriptcase (PHP)", "SQL Server"],
  },
  {
    company: "BIZZPERU",
    role: "Desarrollador web",
    period: "Mar 2021 – Jul 2021",
    type: "Freelance",
    location: "Perú",
    impact: "Sitios e interfaces web en Vue y Laravel sobre MySQL, antes del salto a producto.",
    compact: true,
    group: "Antes de 2022",
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
    items: ["Go", "NestJS", "GCS", "Cloudflare R2"],
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
