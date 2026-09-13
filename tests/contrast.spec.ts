import { expect, test } from "@playwright/test";

/**
 * Matriz de pares del sistema de color. Los tokens se leen resueltos en
 * runtime con una sonda y el ratio WCAG se calcula aquí, así que el test
 * verifica el color que el navegador pinta de verdad, no el hex escrito en el
 * CSS.
 *
 * El mínimo de cada par es el ratio documentado en /sistema, con un margen de
 * una centésima: si alguien retoca un hex "un poco", el par deja de cumplir
 * su promesa documentada y no solo el umbral genérico de AA.
 *
 * El margen existe porque los ratios documentados van a dos decimales y el
 * cálculo real no:
 * success/bg da 6.0078 y la tabla dice 6.01, blanco/primary da 11.6256 y la
 * tabla dice 11.63. Comparar contra el valor impreso fallaría por redondeo, no
 * por contraste.
 */
const TOLERANCE = 0.01;

type Pair = {
  fg: string;
  bg: string;
  min: number;
};

// El array es data a propósito: los pares nuevos del sistema se añaden aquí.
const pairs: Pair[] = [
  // Pares documentados con su ratio declarado.
  { fg: "--color-text", bg: "--color-bg", min: 16.39 },
  { fg: "--color-text-secondary", bg: "--color-bg", min: 6.25 },
  { fg: "--color-primary", bg: "--color-bg", min: 10.74 },
  { fg: "--color-primary-hover", bg: "--color-bg", min: 6.59 },
  { fg: "--color-primary", bg: "--color-accent-muted", min: 9.67 },
  { fg: "--color-success", bg: "--color-bg", min: 6.01 },
  { fg: "--color-warning", bg: "--color-bg", min: 6.18 },
  { fg: "--color-error", bg: "--color-bg", min: 6.04 },
  // Blanco sobre primary y primary-hover: el texto del botón primario.
  { fg: "--color-surface", bg: "--color-primary", min: 11.63 },
  { fg: "--color-surface", bg: "--color-primary-hover", min: 7.13 },
  // Pares sin ratio documentado que las primitivas necesitan: texto sobre
  // las dos superficies (cards y bloques de código).
  { fg: "--color-text", bg: "--color-surface", min: 4.5 },
  { fg: "--color-text", bg: "--color-surface-muted", min: 4.5 },
  { fg: "--color-text-secondary", bg: "--color-surface", min: 4.5 },
  { fg: "--color-text-secondary", bg: "--color-surface-muted", min: 4.5 },
];

function luminance(rgb: readonly [number, number, number]): number {
  const [r, g, b] = rgb.map((v) => {
    const s = v / 255;
    return s <= 0.04045 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
  }) as [number, number, number];
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function contrastRatio(
  a: readonly [number, number, number],
  b: readonly [number, number, number],
): number {
  const [hi, lo] =
    luminance(a) >= luminance(b)
      ? [luminance(a), luminance(b)]
      : [luminance(b), luminance(a)];
  return (hi + 0.05) / (lo + 0.05);
}

function parseRgb(value: string): [number, number, number] {
  const m = value.match(/\d+(?:\.\d+)?/g);
  if (!m || m.length < 3) throw new Error(`color no parseable: ${value}`);
  return [Number(m[0]), Number(m[1]), Number(m[2])];
}

test("todos los pares de tokens cumplen AA en el tema activo", async ({ page }) => {
  await page.goto("/");
  for (const pair of pairs) {
    const probe = await page.evaluate(
      ({ fg, bg }) => {
        const el = document.createElement("span");
        el.style.color = `var(${fg})`;
        el.style.backgroundColor = `var(${bg})`;
        document.body.appendChild(el);
        const s = getComputedStyle(el);
        const out = { color: s.color, background: s.backgroundColor };
        el.remove();
        return out;
      },
      { fg: pair.fg, bg: pair.bg },
    );
    const ratio = contrastRatio(parseRgb(probe.color), parseRgb(probe.background));
    expect
      .soft(ratio, `${pair.fg} sobre ${pair.bg} → ${ratio.toFixed(2)}:1`)
      .toBeGreaterThanOrEqual(pair.min - TOLERANCE);
  }
  // border/bg es decorativo (sin requisito de texto): solo informativo.
  const line = await page.evaluate(() => {
    const el = document.createElement("span");
    el.style.color = "var(--color-border)";
    el.style.backgroundColor = "var(--color-bg)";
    document.body.appendChild(el);
    const s = getComputedStyle(el);
    const out = { color: s.color, background: s.backgroundColor };
    el.remove();
    return out;
  });
  console.log(
    `border/bg (decorativo): ${contrastRatio(parseRgb(line.color), parseRgb(line.background)).toFixed(2)}:1`,
  );
});
