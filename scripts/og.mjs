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
import { tokens } from "./tokens.mjs";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const outDir = join(root, "src/app/[locale]");

const font = (p) =>
  `data:font/woff2;base64,${readFileSync(join(root, "node_modules", p)).toString("base64")}`;

const archivo = font("@fontsource-variable/archivo/files/archivo-latin-wdth-normal.woff2");
const mono = font("@fontsource/ibm-plex-mono/files/ibm-plex-mono-latin-400-normal.woff2");

const { paper, ink, muted, copper } = tokens.light;

// es: espejo de hero.headline / hero.thesis / hero.evidence en src/content.
// en: solo vive aquí — el sitio aún se renderiza en español en /en.
const COPY = {
  es: {
    headline: "Construyo productos web que llegan a producción",
    thesis: "Y puedo demostrarlo.",
    chips: [
      { value: "500+ escuelas", source: "LMS en producción" },
      { value: "WCAG 2.1 AA", source: "requisito contractual" },
    ],
  },
  en: {
    headline: "I build web products that ship to production",
    thesis: "And I can prove it.",
    chips: [
      { value: "500+ schools", source: "LMS in production" },
      { value: "WCAG 2.1 AA", source: "contractual requirement" },
    ],
  },
};

const html = ({ headline, thesis, chips }) => `<!doctype html>
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
  /* Fichas de evidencia: los corchetes de calibración del sitio (.calibrated)
     entran a la tarjeta OG — la firma visual llega antes que la visita. */
  .chips { display: flex; gap: 22px; margin-top: 40px; }
  .chip {
    position: relative; display: inline-flex; align-items: baseline; gap: 10px;
    font-family: "IBM Plex Mono", monospace; font-size: 20px; line-height: 1;
    padding: 14px 19px;
  }
  .chip::before {
    content: ""; position: absolute; top: 0; left: 0; width: 12px; height: 12px;
    border-top: 1.5px solid ${copper}; border-left: 1.5px solid ${copper};
  }
  .chip::after {
    content: ""; position: absolute; bottom: 0; right: 0; width: 12px; height: 12px;
    border-bottom: 1.5px solid ${copper}; border-right: 1.5px solid ${copper};
  }
  .chip .src { color: ${muted}; }
</style></head>
<body>
  <p class="mono">George Puma</p>
  <div>
    <h1>${headline}<span class="dot">.</span><br><span class="thesis">${thesis}</span></h1>
    <div class="chips">${chips
      .map(
        (c) =>
          `<span class="chip">${c.value} <span class="dot">·</span> <span class="src">${c.source}</span></span>`,
      )
      .join("")}</div>
  </div>
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
