# georgepuma.dev

Mi presencia profesional en la web: [georgepuma.dev](https://georgepuma.dev).

Este repositorio es, deliberadamente, parte del portafolio. El sitio afirma
cosas sobre cómo trabajo; el código debe poder respaldarlas.

## Principios

- **Evidencia sobre adjetivos.** Cada métrica del sitio lleva su fuente de
  verificación al lado. El componente central se llama `Evidence` por algo.
- **Complejidad justa.** Sitio estático (SSG), contenido tipado en el repo,
  sin CMS, sin base de datos. El "CMS" es git.
- **La calidad como feature visible.** El CI corre lint, typecheck, build y
  tests de accesibilidad (axe, WCAG 2.1 AA) sobre cada página — el mismo
  estándar que fue requisito contractual en mi último proyecto.

## Stack

Next.js 16 (App Router, SSG) · React 19 · TypeScript strict ·
Tailwind CSS v4 · next-intl (es por defecto, en preparado) ·
Playwright + axe-core · Vercel.

## Desarrollo

```bash
npm install
npm run dev        # http://localhost:3000
npm run lint
npm run typecheck
npm run build
npm run test:a11y  # requiere build previo
```

## Estructura

```
src/
├── app/[locale]/          Rutas (es por defecto sin prefijo, /en preparado)
│   ├── page.tsx           Home de una página: hero → proyectos → IA →
│   │                      experiencia → stack → contacto
│   └── proyectos/         Casos de estudio con página propia
├── components/            Evidence, SectionHeading
├── content/site.ts        Todo el contenido, tipado
└── i18n/                  Configuración de next-intl
```

## Licencia

El código es MIT. El contenido (textos, casos de estudio) es © George Miguel
Puma Salcedo — puedes leerlo, no republicarlo.
