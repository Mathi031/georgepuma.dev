# CAMBIO #7 — Experiencia E1 con contenido por puesto

Estado: copy aprobado en lo esencial (tipos de vínculo y cliente sin nombrar confirmados el 2026-09-12). Sin commit ni push.
Incluye el reencuadre de Studio Equilibrio (sección 4.7), que salió de la misma conversación.

---

## 1. Objetivo

Convertir Experiencia de un CV comprimido (cinco puestos, una o dos líneas cada uno) en un accordion E1 con contexto, alcance, resultado y tecnologías por puesto, más una fila compacta para el periodo anterior a 2022. El resto de la sección — timeline, columna de Stack 8/4, numeración 03 — ya existe y no cambia.

## 2. Problema actual

Auditoría §10: Global Resources (11 meses) tiene dos líneas; Desis, una. Ningún puesto declara tecnologías, tipo de contrato ni resultado. Sin etiqueta de contrato, cinco empleadores en cuatro años se leen como rotación. El accordion E1 del design system (componente 15) no tiene consumidor desde el CAMBIO #1.

## 3. Decisiones de diseño

- Accordion E1 con `<details>/<summary>` nativo, primer ítem abierto, indicador mono `+` / `−`, transición de opacity 200 ms dentro de `prefers-reduced-motion: no-preference`. Sin JS.
- Cabecera (siempre visible): meta mono `PERIODO · TIPO · REMOTO · PAÍS`, título `Empresa — Rol` en h3, y línea de impacto. La línea de impacto conserva el tratamiento fijado en el CAMBIO #5 (body 17 peso 500); las líneas del cuerpo van en body-small.
- Cuerpo: retícula 3/9 con etiquetas mono a la izquierda (`CONTEXTO`, `ALCANCE`, `RESULTADO`, `TECNOLOGÍAS`) y contenido a la derecha; en móvil la etiqueta va encima con regla entre bloques. Alcance como `<ol>` con numerales mono en `primary`.
- BIZZPERU es un ítem compacto sin cuerpo expandible, precedido por una etiqueta de grupo `ANTES DE 2022`. No lleva `<details>`.
- Ubicación: solo país. Nada de ciudad, en ningún puesto.
- Tipo de vínculo con cuatro etiquetas fijas, legibles por un recruiter de fuera: `EMPLEO` (planilla), `CONTRATO` (recibo por honorarios), `FREELANCE`, `CONTRATO POR PROYECTO`. El cliente de Global Resources no se nombra: va como "un operador de telecomunicaciones".
- Nada de cifras que el autor no haya afirmado. Donde no hay resultado medible, el resultado describe el hecho verificable (entregado, validado por QA, en uso), no un adjetivo.

Fuera de alcance: hero, Trabajo, Método, Stack (se conserva tal cual), Contacto, casos y mini-casos.

## 4. Copy ES definitivo


### 4.1 Junto AI

- meta: `FEB 2026 – JUN 2026 · CONTRATO POR PROYECTO · REMOTO · EE.UU. / COSTA RICA`
- título: `Junto AI — Full Stack Developer`
- impacto: `Principal contribuidor de un LMS K‑12 en producción para 500+ escuelas, entregado en la fecha comprometida.`
- CONTEXTO: `LMS institucional para EE.UU. y 10 países, con datos de estudiantes menores de edad y cumplimiento FERPA como requisito. Contrato de alcance cerrado, concluido con la entrega.`
- ALCANCE:
  1. `Frontend completo y capa de API: librería de componentes, editor de contenido para docentes, dashboards de estudiante y docente, y panel de administración multi-institución.`
  2. `Integraciones de video (Mux) y almacenamiento (Google Cloud Storage), con subida directa en tres pasos y validación del contenido en servidor.`
  3. `Revisor automatizado de PRs con Claude Code: webhook, validación contra el ticket de Linear, subagentes según el diff y un único comentario consolidado.`
- RESULTADO: `Entregado el 12 jun 2026, la fecha comprometida, con entregas semanales revisadas por el CTO y WCAG 2.1 AA verificado con jest-axe en cada componente.` + enlace terciario `Leer el caso de estudio →` a `/proyectos/notable-learning`.
- TECNOLOGÍAS: `TypeScript · React 19 · Next.js 16 · Prisma · PostgreSQL · NextAuth · GCS · Mux · Linear`

### 4.2 Global Resources

- meta: `FEB 2025 – ENE 2026 · CONTRATO · REMOTO · VENEZUELA`
- título: `Global Resources — Frontend Developer`
- impacto: `Frontend en Next.js para el sistema de gestión de red de un operador de telecomunicaciones, construido sobre servicios existentes.`
- CONTEXTO: `El cliente operaba su sistema desde un frontend en Java sobre los mismos servicios y quería una interfaz moderna. Partí de una plantilla mínima con su design system (Mistica) y trabajé con otro frontend, cada uno a cargo de sus módulos.`
- ALCANCE:
  1. `Módulos de consulta de la red: componentes, fuentes, nodos y tipos de componente, sobre APIs en Java y Quarkus con Kafka.`
  2. `Ciclo de demo con el cliente en cada iteración: presentación, cambios pedidos, implementación y nueva presentación.`
  3. `Ajustes en la API junto al equipo backend cuando el frontend necesitaba otra forma de los datos, y diagnóstico de incidencias en microservicios Spring Boot.`
  4. `Pruebas unitarias con Cypress sobre los módulos entregados, al cierre del proyecto.`
  5. `Para un segundo cliente de la consultora, cambios de interfaz en un frontend Angular con microfrontends y en una app Flutter.`
- RESULTADO: `Los módulos se entregaron validados por el cliente en cada iteración, con sus pruebas en el repositorio del equipo.`
- TECNOLOGÍAS: `Next.js · React · TypeScript · Mistica · Cypress · Angular · Flutter · Docker · Java / Quarkus y Kafka (lado servidor) · Spring Boot (diagnóstico)`

### 4.3 Desis

- meta: `OCT 2024 – ENE 2025 · EMPLEO · REMOTO · CHILE`
- título: `Desis — Programador`
- impacto: `Tickets de extremo a extremo sobre un sistema de facturación electrónica en producción, en PHP y JavaScript nativos.`
- CONTEXTO: `Sistema en producción desde hacía años, sin framework. El trabajo llegaba por tickets del área operativa y comercial, y cada cambio pasaba por QA antes de subir a producción.`
- ALCANCE:
  1. `Cambios sobre cualquier parte del sistema: flujo de cotización, emisión de facturas y boletas, visualización de contenido y navegación por teclado.`
  2. `Objetos de base de datos en PostgreSQL — índices, funciones, procedimientos y tipos — para sostener las funciones nuevas y mejorar tiempos de consulta.`
  3. `Correcciones sobre los tickets devueltos por QA, con el feedback resuelto en el propio ticket.`
- RESULTADO: `Cada cambio llegó a producción tras la validación de QA.`
- TECNOLOGÍAS: `PostgreSQL · PHP · JavaScript · HTML · CSS`

### 4.4 AccountTECH

- meta: `MAR 2023 – DIC 2023 · CONTRATO · REMOTO · EE.UU.`
- título: `AccountTECH — Frontend Developer`
- impacto: `Migración a React de un software de gestión inmobiliaria usado por varios clientes en EE.UU., módulo a módulo.`
- CONTEXTO: `El producto existía como aplicación de escritorio en Visual Basic, con una base de datos por cliente y volumen alto. El equipo recibió ese código y lo migró por partes a una plataforma web.`
- ALCANCE:
  1. `Migración de módulos financieros: Invoices, AR Payments, AP Payments, Notifications y Reports.`
  2. `Módulo nuevo de notificaciones y campañas, desarrollado de principio a fin, coordinando las reglas de negocio con backend.`
  3. `Definición de módulos nuevos con el equipo a partir de lo que pedían los clientes del producto.`
- RESULTADO: `Cada módulo migrado pasó a la plataforma web que usan los clientes del sistema.`
- TECNOLOGÍAS: `React · TypeScript · Kendo UI · Tailwind CSS · React Query`

### 4.5 Footloose

- meta: `FEB 2022 – JUN 2023 · EMPLEO · PERÚ`
- título: `Footloose — Analista Programador`
- impacto: `Dos sistemas a la vez: el e-commerce VTEX de cara al cliente y el sistema interno sobre SQL Server que usaba el personal.`
- CONTEXTO: `Retail de calzado con operación comercial continua. El e-commerce estaba construido y en marcha; el trabajo era mantenerlo, extenderlo y sostener las campañas de temporada.`
- ALCANCE:
  1. `Operación comercial en VTEX: campañas, cupones, catálogos, carga masiva de precios y formularios de promociones.`
  2. `Storefront: cambios de diseño por JSONC, plantillas de correo transaccional y componentes React en VTEX IO.`
  3. `Sistema interno en Scriptcase: consulta de productos por SKU, cronogramas de pago de colaboradores y generadores de PDF para contratación.`
  4. `Base de datos SQL Server: tablas, procedimientos almacenados y cambios propagados de desarrollo a producción.`
- RESULTADO: `El e-commerce se mantuvo operativo durante las campañas de temporada y el equipo interno trabajó a diario sobre los módulos que entregué.`
- TECNOLOGÍAS: `VTEX IO · React · TypeScript · Scriptcase (PHP) · SQL Server`

### 4.6 Antes de 2022 (ítem compacto, sin cuerpo)

- etiqueta de grupo: `ANTES DE 2022`
- meta: `MAR 2021 – JUL 2021 · FREELANCE · PERÚ`
- título: `BIZZPERU — Desarrollador web`
- impacto: `Sitios e interfaces web en Vue y Laravel sobre MySQL, antes del salto a producto.`

### 4.7 Studio Equilibrio: reencuadre (mismo cambio, archivos de proyecto)

La demo se construyó por encargo de Junto AI como pieza comercial para captar clientes. El sitio dice hoy "sin cliente"; se corrige en los cuatro sitios donde aparece. Reemplazos exactos:

| Archivo | Antes | Después |
|---|---|---|
| `site.es.ts` | `meta: "Sin cliente · estándar de producción · 2,5 semanas"` | `meta: "Demo comercial para Junto AI · en solitario · 2,5 semanas"` |
| `site.es.ts` | `construido de extremo a extremo a partir de un brief comercial.` | `construida de extremo a extremo por encargo de Junto AI, a partir de un brief comercial.` |
| `site.en.ts` | `meta: "No client · production-grade · 2.5 weeks"` | `meta: "Sales demo for Junto AI · solo · 2.5 weeks"` |
| `site.en.ts` | `built end to end from a business brief.` | `built end to end for Junto AI from a business brief.` |
| `studio-equilibrio.es.ts` | `text: "Diseño a producción, en solitario: de un brief comercial a una demo de extremo a extremo en 2.5 semanas."` | `text: "Encargo de Junto AI como demo comercial para captar clientes. Diseño a producción, en solitario: del brief a una demo de extremo a extremo en 2,5 semanas."` |
| `studio-equilibrio.es.ts` | `El punto de la demo es ese: el estándar no baja porque no haya cliente.` | `El punto de la demo es ese: el estándar no baja porque el producto sea una pieza de venta.` |
| `studio-equilibrio.es.ts` | `La pieza del grid que muestra el rango completo sin un cliente de por medio:` | `La pieza del grid que muestra el rango completo en un encargo acotado:` |
| `studio-equilibrio.en.ts` | `text: "Design to production, solo: from a business brief to an end-to-end demo in 2.5 weeks."` | `text: "Commissioned by Junto AI as a sales demo to win clients. Design to production, solo: from brief to an end-to-end demo in 2.5 weeks."` |
| `studio-equilibrio.en.ts` | `the standard doesn't drop because there is no client.` | `the standard doesn't drop because the product is a sales piece.` |
| `studio-equilibrio.en.ts` | `The piece of the grid that shows full range without a client in the loop:` | `The piece of the grid that shows full range on a tightly scoped commission:` |

Si algún "antes" no coincide (por ejemplo, la forma exacta tras el CAMBIO #5), Claude Code reporta y no adivina. Las meta descriptions de los mini-casos no mencionan "sin cliente" y no cambian.

## 5. Glosario EN

`site.en.ts` ya no espeja al español, así que este contenido necesita versión inglesa. Se redacta siguiendo las reglas de voz del CAMBIO #5 (contracciones, sin calcos, comillas inglesas) y la revisa el autor antes de dar el cambio por cerrado.

| ES | EN |
|---|---|
| CONTEXTO / ALCANCE / RESULTADO / TECNOLOGÍAS | CONTEXT / SCOPE / OUTCOME / TECH |
| ANTES DE 2022 | BEFORE 2022 |
| CONTRATO POR PROYECTO | PROJECT-BASED CONTRACT |
| EMPLEO / CONTRATO / FREELANCE | EMPLOYEE / CONTRACT / FREELANCE |
| REMOTO | REMOTE |
| Principal contribuidor | Primary contributor |
| Analista Programador | Programmer Analyst |
| Programador | Developer |
| Leer el caso de estudio → | Read the case study → |

Meses en la meta EN: `FEB 2026 – JUN 2026` (los mismos códigos de tres letras funcionan en ambos idiomas).

## 6. Prompt para Claude Code

```
CAMBIO #7 — Experiencia: accordion E1 con contenido por puesto.

Contexto: georgepuma.dev, Next 16.2 + next-intl 4.13, rama feature/design-system-c2. La sección Experiencia existe con timeline, kicker "03 · Trayectoria" y columna de Stack en retícula 8/4 desde 1280. Este cambio sustituye el cuerpo de cada puesto por el accordion E1 del design system y añade el contenido por puesto. No toca hero, Trabajo, Método, Stack, Contacto, casos ni mini-casos.

Reglas: sin commit ni push. Sin emojis. Comentarios en español con tildes. Sin client components (accordion nativo). Sin animaciones de altura: solo opacity 200 ms dentro de prefers-reduced-motion: no-preference. Espaciado solo con la escala step-*. Nowrap solo en flecha+palabra y fechas. Ninguna cadena de copy fuera de src/content. Spec en rojo primero. Medir contra build de producción. Si algo no se puede verificar, dilo y detente.

ETAPA 0 — Inspección (solo lectura). Resume y espera confirmación.
1. git status limpio, rama correcta.
2. Cita: el bloque de Experiencia en page.tsx; el tipo ExperienceItem en site.ts y sus datos en site.es.ts y site.en.ts; todo consumidor de `experience` fuera de la home; las primitivas Divider, TagList, ProseLink/ButtonLink y el rol tipográfico `metadata`; cómo se dibuja hoy la línea de timeline y su marcador; y tests/experiencia.spec.ts, en particular la aserción de la línea de impacto del CAMBIO #5.
3. Comprueba si existe algún <details> en el repo y, si lo hay, qué patrón sigue.
4. Baseline con Playwright: capturas de Experiencia en 360, 390, 768, 1280 y 1680; overflow; targets < 44×44 dentro de la sección. En docs/qa/cambio-7-before/.
5. Plan y lista de archivos. Espera confirmación.

ETAPA 1 — Implementación. Delega al agente frontend-developer con este contrato y revisa su salida.
A. Datos. ExperienceItem pasa a: company, role, period, type, location, impact, context, scope: string[], result, resultLink? {href,label}, tech: string[], compact?: boolean. `lines` desaparece si ningún otro consumidor lo usa; si lo usa alguno, se conserva marcado @deprecated y se documenta quién. Añade el grupo "antes de 2022" como campo del contenido, no como cadena en el componente. Copy ES exacto del documento docs/cambio-7-experiencia.md, sección 4. El EN se redacta siguiendo la sección 5 del mismo documento y las reglas de voz del CAMBIO #5; márcalo en el informe como pendiente de revisión del autor.
B. Accordion E1. <details> nativo por puesto, primer ítem con `open`. <summary> con: meta mono (PERIODO · TIPO · REMOTO · PAÍS), h3 "Empresa — Rol", línea de impacto, e indicador mono + / − a la derecha que conmuta con :is([open]) sin JS. El summary completo es el área clicable, con target ≥44 px de alto y focus-visible de 2 px con offset 2. Retira el marcador nativo del summary en todos los navegadores objetivo.
C. Cuerpo. Retícula 3/9 desde 1024 (etiqueta mono a la izquierda, contenido a la derecha), apilada en móvil con la etiqueta encima y regla fina entre bloques. Alcance como <ol> con numerales mono en primary. Tecnologías con TagList. El resultado de Junto AI lleva el enlace terciario al caso.
D. BIZZPERU: ítem compacto sin <details>, precedido por la etiqueta de grupo. Mismo tratamiento de meta y título; sin indicador.
E. Timeline: se conserva; el marcador se alinea con la meta de cada ítem, incluido el compacto.
F. Transición: solo opacity 200 ms en el cuerpo, dentro de la media query de movimiento. Nada de grid-template-rows ni max-height.
G. Studio Equilibrio: aplica los reemplazos exactos de la sección 4.7 del documento en los cuatro archivos. Si alguno no coincide, repórtalo y no adivines.

ETAPA 2 — Tests, en tests/experiencia.spec.ts:
- Seis ítems en orden Junto AI, Global Resources, Desis, AccountTECH, Footloose, BIZZPERU; los cinco primeros son <details> y el último no.
- El primero está abierto por defecto y los demás cerrados; al abrir el segundo, el primero sigue abierto (no es exclusivo).
- Cada <details> abierto muestra las cuatro etiquetas CONTEXTO, ALCANCE, RESULTADO, TECNOLOGÍAS con contenido no vacío; el alcance es un <ol>.
- Cada meta contiene un tipo de vínculo no vacío.
- El indicador es + cerrado y − abierto.
- El summary mide ≥44 px de alto en 390 y es alcanzable y accionable con teclado (Enter y Espacio); el foco es visible.
- La línea de impacto conserva la aserción del CAMBIO #5 (17 px, peso 500) y el cuerpo va en 15 px.
- El resultado de Junto AI enlaza a /proyectos/notable-learning.
- En /en, las cuatro etiquetas están en inglés y ninguna cadena en español aparece en la sección.
- Con prefers-reduced-motion: reduce no hay transición.
- Overflow 0 px en 360, 390, 768, 1280, 1680.
- La home y el mini-caso de Studio Equilibrio no contienen "sin cliente" ni "no client" en ningún idioma.
- Los 126 tests existentes en verde; actualiza solo lo que afirme la estructura vieja, con justificación.

ETAPA 3 — Verificación. lint, typecheck, build; axe en las 11 rutas con el primer ítem abierto y con todos abiertos; /qa-responsive scope=public con capturas en docs/qa/cambio-7-after/; /qa-diff; code-reviewer con foco en copy fuera de src/content, client components, espaciado fuera de la escala y semántica del accordion. Informe: archivos, copy EN redactado para revisión, suposiciones, lo no verificable, y capturas antes/después. Sin commit.
```

## 7. Criterios de aceptación

1. Seis ítems con el copy aprobado; cinco expandibles y BIZZPERU compacto bajo "antes de 2022".
2. Cada puesto declara tipo de vínculo, contexto, alcance numerado, resultado y tecnologías.
3. Accordion nativo, sin JS, primer ítem abierto, indicador + / −, no exclusivo.
4. Retícula 3/9 en ≥1024 y apilada con etiquetas encima en móvil.
5. Teclado y foco correctos; summary ≥44 px en móvil; axe limpio con ítems abiertos y cerrados.
6. EN completo y marcado como pendiente de revisión del autor.
7. Studio Equilibrio reencuadrada como demo comercial para Junto AI en card, mini-caso y ambos idiomas.
8. Overflow 0 px; lint, typecheck, build, axe y toda la suite en verde; sin commits.
