/**
 * Genera el set de iconos a partir de una sola fuente: src/app/icon.svg.
 *
 *   src/app/icon.svg        monograma, viewBox 32 (Next lo emite como rel=icon)
 *   src/app/favicon.ico     16 + 32 + 48 (rel=icon, fallback sin SVG)
 *   src/app/apple-icon.png  180 (Next emite el rel=apple-touch-icon)
 *   public/icon-192.png     PWA / Android, referenciado en src/app/manifest.ts
 *   public/icon-512.png     idem
 *
 * El monograma es la "G" de Hanken Grotesk a peso 600, tinta sobre fondo, sin
 * marco ni radio. Dos colores y nada más: `text` y `bg` de globals.css.
 *
 * El path está congelado porque el navegador que pinta un favicon SVG no tiene
 * acceso a la fuente. Se extrajo con fontTools (python3) del woff2 que ya vive
 * en public/fonts: instanciar wght=600 y volcar el glifo con SVGPathPen. Si la
 * fuente o el peso cambian, repetir ese paso y pegar el path aquí.
 *
 * Uso: pnpm icons
 */
import { writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";
import pngToIco from "png-to-ico";
import { palette } from "./tokens.mjs";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const app = join(root, "src/app");
const pub = join(root, "public");

const { bg, text } = palette;

// "G" de Hanken Grotesk wght 600, unitsPerEm 1000, coordenadas y-up.
// bbox x 42.8..675, y -14.4..711.4 (con overshoot); cap height 697.
const G_PATH =
  "M365.4 -14.4Q270.6 -14.4 197.9 31Q125.2 76.4 84 158.3Q42.8 240.2 42.8 349Q42.8 457.8 84.3 539.2Q125.8 620.6 200.1 666Q274.4 711.4 372.4 711.4Q481.4 711.4 560.8 657.2Q640.2 603 675 507.4L566.6 467.6Q543 530.8 493.2 565.9Q443.4 601 372.4 601Q307.4 601 259 570.2Q210.6 539.4 184.5 483.3Q158.4 427.2 158.4 349Q158.4 270.8 184.5 214.2Q210.6 157.6 259 126.8Q307.4 96 372.4 96Q406 96 441.2 105.4Q476.4 114.8 506.2 138Q536 161.2 554.3 202.5Q572.6 243.8 572.6 307.2V351L598.6 271H399.8V374.4H675V0H573L557 120.8L576.8 105.4Q558.4 65 526.6 38.4Q494.8 11.8 453.5 -1.3Q412.2 -14.4 365.4 -14.4Z";
const BBOX = { minX: 42.8, maxX: 675 };
const CAP = 697;

// Lienzo de 32: la altura de caja (sin overshoot) ocupa el 66% del lado, que
// es lo máximo que a 16px sigue dejando aire al contorno. Centrado óptico:
// vertical sobre la altura de caja, no sobre el bbox con overshoot; horizontal
// sobre el bbox, que en una G ya es simétrico a ojo.
const CANVAS = 32;
const S = (CANVAS * 0.66) / CAP;
const gW = (BBOX.maxX - BBOX.minX) * S;
const tx = (CANVAS - gW) / 2 - BBOX.minX * S;
const baseline = (CANVAS + CAP * S) / 2;
const r2 = (n) => Math.round(n * 100) / 100;

const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">
  <rect width="32" height="32" fill="${bg}"/>
  <path transform="translate(${r2(tx)} ${r2(baseline)}) scale(${r2(S)} -${r2(S)})" fill="${text}" d="${G_PATH}"/>
</svg>
`;

writeFileSync(join(app, "icon.svg"), svg);
console.log("src/app/icon.svg");

const raster = (px, source = svg) =>
  sharp(Buffer.from(source), { density: (72 * px) / CANVAS }).resize(px, px).png().toBuffer();

// Array explícito: con un solo PNG, png-to-ico deriva hasta 256px en BMP sin
// comprimir (~285KB). Con 16+32+48 el .ico queda en ~15KB.
writeFileSync(join(app, "favicon.ico"), await pngToIco([await raster(16), await raster(32), await raster(48)]));
console.log("src/app/favicon.ico");

// iOS enmascara las esquinas y no añade padding: el monograma se encoge al 80%
// del lienzo para que la G no roce el radio del recorte.
const inset = (size, ratio) => {
  const inner = size * ratio;
  const off = (size - inner) / 2;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${size} ${size}">
  <rect width="${size}" height="${size}" fill="${bg}"/>
  <svg x="${off}" y="${off}" width="${inner}" height="${inner}" viewBox="0 0 32 32">${svg.replace(/<\/?svg[^>]*>/g, "")}</svg>
</svg>`;
};

const png = (size, ratio) =>
  sharp(Buffer.from(inset(size, ratio)), { density: 288 }).resize(size, size).png().toBuffer();

writeFileSync(join(app, "apple-icon.png"), await png(180, 0.8));
console.log("src/app/apple-icon.png");

for (const size of [192, 512]) {
  writeFileSync(join(pub, `icon-${size}.png`), await png(size, 1));
  console.log(`public/icon-${size}.png`);
}
