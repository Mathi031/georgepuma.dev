/**
 * Pipeline de capturas: toma los PNG sin comprimir de `raw/` y emite los
 * derivados AVIF + WebP que sirve `ScreenshotFrame`.
 *
 * Por qué un script y no next/image: las capturas son estáticas y cambian
 * una vez al año. Pre-optimizarlas aquí evita el optimizador en runtime y
 * deja el peso de cada archivo fijado en el repo, donde se revisa en el diff.
 *
 * `raw/` está fuera del repo (.gitignore): las fuentes pesan MB y solo hacen
 * falta para regenerar. Los derivados de public/screenshots/ sí se commitean.
 *
 * Uso: pnpm images
 */
import { existsSync, mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const rawDir = join(root, "raw");
const outDir = join(root, "public/screenshots");

/** Presupuesto por archivo servido. */
const MAX_BYTES = 120 * 1024;

/**
 * Anchos de render, derivados del layout real (container max-w 880 con
 * px-9 → 808 de contenido; ScreenshotFrame añade p-2.5 → 20):
 *
 *   card   → grid sm:grid-cols-2 con gap-x-10 → columna 384, imagen 364 → 2x
 *   frame  → ancho completo del contenedor del home → imagen 788 → 2x
 *   screen → artículo de caso (max-w-720 con px-9) → imagen 628 → 2x
 *
 * `card` recorta a 2:1: las cuatro tarjetas del grid deben compartir
 * proporción o las filas se desalinean, y 2:1 es la proporción del pliegue
 * real de estas capturas (1920×~950), así que el recorte cae en el borde de
 * sección en vez de partir un titular por la mitad. El recorte va aquí y no
 * en CSS — con object-fit el navegador descarga píxeles que nunca pinta.
 */
const TARGETS = {
  card: { width: 768, aspect: 2 },
  frame: { width: 1600, aspect: null },
  screen: { width: 1280, aspect: null },
};

/**
 * Fuente → derivado. Explícito a propósito: el nombre del archivo en `raw/`
 * es el contrato con quien captura, y un typo debe fallar, no inventar.
 *
 * `region` acota la franja del origen antes de encuadrar, en píxeles del
 * PNG. Solo hace falta donde el pliegue no cae en la proporción de destino;
 * sin ella se toma desde arriba.
 */
const SOURCES = [
  // El héroe termina en y=945: sin acotar, la tarjeta se lleva una banda
  // blanca de la sección siguiente.
  { in: "cleo-spa.png", out: "cleo-spa", target: "card", region: { top: 0, height: 945 } },
  { in: "ronatello.png", out: "ronatello", target: "card" },
  { in: "studio-equilibrio.png", out: "studio-equilibrio", target: "card" },
  { in: "projsync.png", out: "projsync", target: "card" },

  // Pantallas del panel, para los mini-casos. A ancho completo y sin recorte:
  // aquí la evidencia es la densidad de la tabla, no el encuadre.
  { in: "cleo-spa-movimientos.png", out: "cleo-spa-movimientos", target: "screen" },
  { in: "cleo-spa-usuarios.png", out: "cleo-spa-usuarios", target: "screen" },
  { in: "cleo-spa-catalogo.png", out: "cleo-spa-catalogo", target: "screen" },
];

const CODECS = [
  { format: "avif", start: 62, floor: 30 },
  { format: "webp", start: 82, floor: 45 },
];

/**
 * Baja la calidad hasta entrar en presupuesto. Descender desde un techo es
 * más honesto que fijar una calidad a ojo: el presupuesto es la garantía,
 * la calidad es la variable que cede.
 */
async function encode(pipeline, { format, start, floor }) {
  let last;
  for (let quality = start; quality >= floor; quality -= 4) {
    last = { buffer: await pipeline.clone()[format]({ quality, effort: 6 }).toBuffer(), quality };
    if (last.buffer.length <= MAX_BYTES) return last;
  }
  return { ...last, overBudget: true };
}

const kb = (bytes) => `${(bytes / 1024).toFixed(1)} KB`;

if (!existsSync(rawDir)) {
  console.error(`No existe ${rawDir}. Coloca ahí las capturas sin comprimir y vuelve a correr.`);
  process.exit(1);
}

mkdirSync(outDir, { recursive: true });

const missing = [];
const results = [];
let failed = false;

for (const source of SOURCES) {
  const inputPath = join(rawDir, source.in);
  if (!existsSync(inputPath)) {
    missing.push(source.in);
    continue;
  }

  const target = TARGETS[source.target];
  if (!target) throw new Error(`target desconocido "${source.target}" en ${source.in}`);

  const full = sharp(inputPath);
  const meta = await full.metadata();

  if (source.region) {
    const { top, height } = source.region;
    if (top + height > meta.height) {
      throw new Error(`region de ${source.in} se sale del origen (${meta.height}px de alto)`);
    }
  }

  const input = source.region
    ? full.extract({ left: 0, top: source.region.top, width: meta.width, height: source.region.height })
    : full;

  if (meta.width < target.width) {
    failed = true;
    console.error(
      `✗ ${source.in}: origen ${meta.width}px < render ${target.width}px — recapturar a 2x`,
    );
    continue;
  }

  // `cover` + `position: top` sobre una captura full-page se queda con el
  // pliegue superior, que es justo lo que la tarjeta necesita contar.
  const height = target.aspect ? Math.round(target.width / target.aspect) : null;
  const resized = height
    ? input.resize(target.width, height, { fit: "cover", position: "top" })
    : input.resize(target.width, null, { fit: "inside" });

  const srcHeight = source.region?.height ?? meta.height;
  const outHeight = height ?? Math.round((srcHeight * target.width) / meta.width);
  if (!target.aspect && outHeight / target.width > 3) {
    console.warn(`⚠ ${source.in}: ${target.width}×${outHeight} es muy alto para un frame de página`);
  }

  for (const codec of CODECS) {
    const { buffer, quality, overBudget } = await encode(resized, codec);
    writeFileSync(join(outDir, `${source.out}.${codec.format}`), buffer);
    if (overBudget) {
      failed = true;
      console.error(
        `✗ ${source.out}.${codec.format}: ${kb(buffer.length)} > ${kb(MAX_BYTES)} incluso a q${quality}`,
      );
    } else {
      console.log(
        `✓ public/screenshots/${source.out}.${codec.format} — ${kb(buffer.length)} (q${quality})`,
      );
    }
  }

  results.push({ out: source.out, width: target.width, height: outHeight });
}

if (missing.length) {
  console.log(`\nFaltan en raw/: ${missing.join(", ")}`);
}

if (results.length) {
  // El campo `image` se edita a mano en site.es.ts / site.en.ts — el alt es
  // contenido, no metadato de build. Imprimirlo con las dimensiones reales
  // evita el único error que el typecheck no atrapa: un width/height a ojo.
  console.log("\nPara pegar en src/content/site.*.ts (el alt lo escribes tú):\n");
  for (const r of results) {
    console.log(
      `  // ${r.out}\n` +
        `  image: {\n` +
        `    src: "/screenshots/${r.out}.webp",\n` +
        `    avif: "/screenshots/${r.out}.avif",\n` +
        `    width: ${r.width},\n` +
        `    height: ${r.height},\n` +
        `    alt: "",\n` +
        `  },`,
    );
  }
}

process.exit(failed ? 1 : 0);
