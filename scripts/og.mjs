/**
 * Genera las Open Graph images (1200x630) con Playwright + Chromium.
 *
 * Por qué Playwright y no next/og (satori): Archivo solo existe en node_modules
 * como .woff2 variable, y satori no lee woff2 ni ejes variables. Chromium sí,
 * así que la imagen sale con el mismo eje wdth 122 que los titulares del sitio.
 *
 * Uso: pnpm og   (regenerar cuando cambie el copy del hero)
 */
import { chromium } from "@playwright/test"; // NO "playwright": no resuelve con pnpm
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const outDir = join(root, "src/app/[locale]");

const font = (p) =>
  `data:font/woff2;base64,${readFileSync(join(root, "node_modules", p)).toString("base64")}`;

const archivo = font("@fontsource-variable/archivo/files/archivo-latin-wdth-normal.woff2");
const mono = font("@fontsource/ibm-plex-mono/files/ibm-plex-mono-latin-400-normal.woff2");

// ponytail: tokens duplicados de src/app/globals.css @theme. Si aparece un tercer
// consumidor, extraer a un módulo TS compartido.
const paper = "#f7f7f5";
const ink = "#16181d";
const muted = "#575c63";
const copper = "#9c4a21";

// es: espejo de hero.headline / hero.thesis en src/content/site.ts
// en: solo vive aquí — el hero del sitio aún se renderiza en español en /en
const COPY = {
  es: { headline: "Construyo productos web que llegan a producción", thesis: "Y puedo demostrarlo." },
  en: { headline: "I build web products that ship to production", thesis: "And I can prove it." },
};

const html = ({ headline, thesis }) => `<!doctype html>
<html><head><meta charset="utf-8"><style>
  @font-face {
    font-family: "Archivo Variable";
    src: url("${archivo}") format("woff2-variations");
    font-weight: 100 900;
    font-stretch: 62% 125%;
  }
  @font-face {
    font-family: "IBM Plex Mono";
    src: url("${mono}") format("woff2");
    font-weight: 400;
  }
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body {
    width: 1200px; height: 630px; padding: 72px;
    background: ${paper}; color: ${ink};
    font-family: "Archivo Variable", sans-serif;
    display: flex; flex-direction: column; justify-content: space-between;
    -webkit-font-smoothing: antialiased;
  }
  .mono {
    font-family: "IBM Plex Mono", monospace;
    font-size: 22px; letter-spacing: 0.03em; color: ${muted};
  }
  h1 {
    font-size: 54px; font-weight: 700; line-height: 1.08;
    letter-spacing: -0.02em; font-variation-settings: "wdth" 122;
    max-width: 24ch; text-wrap: balance;
  }
  .dot { color: ${copper}; }
  .thesis {
    /* inline-block + línea propia: la tesis y su subrayado cobre nunca se parten */
    display: inline-block;
    margin-top: 0.32em;
    text-decoration: underline;
    text-decoration-color: ${copper};
    text-decoration-thickness: 2px;
    text-underline-offset: 8px;
  }
</style></head>
<body>
  <p class="mono">George Puma</p>
  <h1>${headline}<span class="dot">.</span><br><span class="thesis">${thesis}</span></h1>
  <p class="mono">georgepuma.dev</p>
</body></html>`;

const browser = await chromium.launch();
const page = await browser.newPage({
  viewport: { width: 1200, height: 630 },
  deviceScaleFactor: 1,
});

for (const [locale, copy] of Object.entries(COPY)) {
  await page.setContent(html(copy), { waitUntil: "load" });
  await page.evaluate(() => document.fonts.ready);
  const path = join(outDir, `opengraph-image.${locale}.png`);
  await page.screenshot({ path });
  console.log(`✓ ${path}`);
}

await browser.close();
