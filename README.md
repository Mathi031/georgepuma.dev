# georgepuma.dev

Mi página personal: [georgepuma.dev](https://georgepuma.dev).

Este repo es público a propósito. El sitio afirma cosas sobre cómo trabajo,
así que el código tiene que poder respaldarlas.

## Cómo está hecho

Next.js 16 con App Router, todo prerenderizado como HTML estático. React 19,
TypeScript en modo strict, Tailwind CSS v4. i18n con next-intl: español por
defecto sin prefijo, `/en` preparado para cuando escriba la versión en inglés.
Desplegado en Vercel, dominio y correo en Cloudflare.

No hay CMS ni base de datos. El contenido vive tipado en `src/content/site.ts`
y se edita con un commit — para un sitio que cambia unas pocas veces al año,
cualquier cosa más es mantenimiento sin retorno.

Las fuentes (Archivo e IBM Plex Mono) van auto-hospedadas con Fontsource:
cero peticiones a terceros en runtime.

El CI corre lint, typecheck, build y tests de accesibilidad con axe
(WCAG 2.1 AA) sobre cada página. Ese estándar fue requisito contractual en mi
último proyecto; me pareció justo aplicármelo a mí mismo.

Y sí: este sitio se construyó con el mismo flujo de desarrollo asistido por IA
que describe su sección [/ia](https://georgepuma.dev/#ia). Sería raro que no.

## Desarrollo

```bash
pnpm install
pnpm dev        # http://localhost:3000
pnpm lint
pnpm typecheck
pnpm build
pnpm test:a11y  # requiere build previo
```

### Assets generados

Tres scripts producen assets que se commitean; ninguno corre en el build.

```bash
pnpm icons   # favicon.ico, icon.svg, apple-icon.png
pnpm og      # Open Graph images por locale
pnpm images  # capturas de proyecto: raw/*.png → public/screenshots/*.{avif,webp}
```

`pnpm images` lee las capturas sin comprimir de `raw/` (ignorada por git: pesan
MB y solo hacen falta para regenerar), las recorta a la proporción del render
—2:1 para las tarjetas del grid, que es la del pliegue real de las capturas y
mantiene las filas alineadas— y comprime bajando la calidad hasta entrar en un
presupuesto de 120 KB por archivo. Al terminar imprime el campo `image` con las dimensiones reales, listo
para pegar en `src/content/site.*.ts`; el `alt` se escribe a mano porque es
contenido, no metadato de build.

## Estructura

```
src/
├── app/[locale]/          Rutas (es sin prefijo, /en preparado)
│   ├── page.tsx           Home: hero → proyectos → ia → experiencia → stack → contacto
│   └── proyectos/         Casos de estudio con página propia
├── components/            Evidence, SectionHeading
├── content/site.ts        Todo el contenido, tipado
└── i18n/                  Configuración de next-intl
```

## Licencia

El código es [MIT](./LICENSE). Los textos y casos de estudio son míos
(© George Miguel Puma Salcedo): puedes leerlos, no republicarlos.