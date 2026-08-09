import { expect, test } from "@playwright/test";

/**
 * Matriz de pares AA del sistema de color (la que promete el comentario de
 * globals.css). Los tokens se leen resueltos en runtime con una sonda —
 * getPropertyValue devolvería light-dark()/el polyfill del build sin
 * resolver — y el ratio WCAG se calcula aquí. Al correr bajo los projects
 * light y dark, cada par queda verificado en ambos temas.
 */

type Pair = {
  fg: string;
  bg: string;
  /** Selector del scope donde vive el par (por defecto, body). */
  scope?: string;
  min: number;
};

// El array es data a propósito: los pares nuevos del sistema se añaden aquí.
const pairs: Pair[] = [
  { fg: "--color-ink", bg: "--color-paper", min: 4.5 },
  { fg: "--color-muted", bg: "--color-paper", min: 4.5 },
  { fg: "--color-copper", bg: "--color-paper", min: 4.5 },
  { fg: "--color-ink", bg: "--color-copper-surface", min: 4.5 },
  { fg: "--color-muted", bg: "--color-copper-surface", min: 4.5 },
  { fg: "--color-copper", bg: "--color-copper-surface", min: 4.5 },
  // Hover del CTA y ::selection: papel sobre cobre.
  { fg: "--color-paper", bg: "--color-copper", min: 4.5 },
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
      ({ fg, bg, scope }) => {
        const host = document.querySelector(scope ?? "body");
        if (!host) throw new Error(`scope no encontrado: ${scope}`);
        const el = document.createElement("span");
        el.style.color = `var(${fg})`;
        el.style.backgroundColor = `var(${bg})`;
        host.appendChild(el);
        const s = getComputedStyle(el);
        const out = { color: s.color, background: s.backgroundColor };
        el.remove();
        return out;
      },
      { fg: pair.fg, bg: pair.bg, scope: pair.scope ?? null },
    );
    const ratio = contrastRatio(parseRgb(probe.color), parseRgb(probe.background));
    expect
      .soft(
        ratio,
        `${pair.fg} sobre ${pair.bg}${pair.scope ? ` en ${pair.scope}` : ""} → ${ratio.toFixed(2)}:1`,
      )
      .toBeGreaterThanOrEqual(pair.min);
  }
  // line/paper es decorativo (sin requisito de texto): solo informativo.
  const line = await page.evaluate(() => {
    const el = document.createElement("span");
    el.style.color = "var(--color-line)";
    el.style.backgroundColor = "var(--color-paper)";
    document.body.appendChild(el);
    const s = getComputedStyle(el);
    const out = { color: s.color, background: s.backgroundColor };
    el.remove();
    return out;
  });
  console.log(
    `line/paper (decorativo): ${contrastRatio(parseRgb(line.color), parseRgb(line.background)).toFixed(2)}:1`,
  );
});
