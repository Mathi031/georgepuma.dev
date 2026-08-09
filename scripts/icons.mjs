/**
 * Genera el set de favicons: src/app/icon.svg (fuente de verdad),
 * favicon.ico (32px) y apple-touch-icon.png (180px).
 *
 * El monograma es la "G" de Archivo en wdth 122 / wght 700 — el mismo eje que
 * los titulares del sitio — con el punto terminal cobre del headline
 * (src/app/[locale]/page.tsx). El contorno está congelado como path porque el
 * navegador que pinta un favicon SVG no tiene acceso a la fuente; se extrajo
 * una sola vez del woff2 de @fontsource-variable/archivo (wawoff2 + fontkit
 * getVariation, one-off fuera del repo — Chromium no exporta contornos).
 *
 * Uso: pnpm icons
 */
import { writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";
import pngToIco from "png-to-ico";
import { tokens } from "./tokens.mjs";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const app = join(root, "src/app");

const { paper, ink, copper } = tokens.light;

// "G" de Archivo, unitsPerEm 1000, coordenadas y-up (bbox x 60..905, y -12..699).
const G_PATH =
  "M468 -12Q265 -12 162.5 75.5Q60 163 60 343Q60 461 112.5 540Q165 619 264 659Q363 699 502 699Q589 699 662.5 683.5Q736 668 790 636Q844 604 874 556.5Q904 509 904 444L738 444Q738 477 719 500.5Q700 524 668 537Q636 550 594.5 557Q553 564 508 564Q447 564 396.5 551.5Q346 539 310.5 513.5Q275 488 255 448.5Q235 409 235 357L235 332Q235 258 265.5 212.5Q296 167 353.5 145Q411 123 490 123Q572 123 627 138.5Q682 154 710 183Q738 212 738 252L738 260L482 260L482 382L905 382L905 0L801 0L785 85Q749 51 700 30Q651 9 592.5 -1.5Q534 -12 468 -12Z";
const BBOX = { minX: 60, minY: -12, maxX: 905, maxY: 699 };

// Composición en un lienzo de 32: la G domina, el punto cobre cierra en la
// baseline. Márgenes ajustados a ojo contra el render real de 16px.
const CANVAS = 32;
const S = 0.025; // escala font-units -> lienzo (cap height 699 -> 17.5)
const DOT_R = 2.3;
const GAP = 1.5; // entre borde derecho de la G y el punto

const gW = (BBOX.maxX - BBOX.minX) * S;
const gH = (BBOX.maxY - BBOX.minY) * S;
const total = gW + GAP + 2 * DOT_R;
const left = (CANVAS - total) / 2;
const baseline = (CANVAS - gH) / 2 + BBOX.maxY * S;
const tx = left - BBOX.minX * S;
const r2 = (n) => Math.round(n * 100) / 100;

const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">
  <rect width="32" height="32" fill="${ink}"/>
  <path transform="translate(${r2(tx)} ${r2(baseline)}) scale(${S} -${S})" fill="${paper}" d="${G_PATH}"/>
  <circle cx="${r2(left + gW + GAP + DOT_R)}" cy="${r2(baseline - DOT_R)}" r="${DOT_R}" fill="${copper}"/>
</svg>
`;

writeFileSync(join(app, "icon.svg"), svg);
console.log("✓ src/app/icon.svg");

const raster = (px) =>
  sharp(Buffer.from(svg), { density: (72 * px) / CANVAS }).resize(px, px).png().toBuffer();

// iOS enmascara esquinas y no añade padding: el glifo va a ~62% del lienzo,
// el resto es fondo tinta (iOS además ignora la transparencia).
const appleSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 180 180">
  <rect width="180" height="180" fill="${ink}"/>
  <svg x="34" y="34" width="112" height="112" viewBox="0 0 32 32">${svg.replace(/<\/?svg[^>]*>/g, "")}</svg>
</svg>`;

const apple = await sharp(Buffer.from(appleSvg), { density: 288 }).resize(180, 180).png().toBuffer();
// "apple-icon.png" es el nombre de convención de Next; genera el
// <link rel="apple-touch-icon"> él solo.
writeFileSync(join(app, "apple-icon.png"), apple);
console.log("✓ src/app/apple-icon.png");

// Array explícito: con un solo PNG, png-to-ico deriva hasta 256px en BMP sin
// comprimir (~285KB). Con 16+32 el .ico queda en ~5KB.
writeFileSync(join(app, "favicon.ico"), await pngToIco([await raster(16), await raster(32)]));
console.log("✓ src/app/favicon.ico");
