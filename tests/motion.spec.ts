import { expect, test } from "@playwright/test";

/**
 * Toda transición del sistema vive dentro de prefers-reduced-motion:
 * no-preference. Los tokens --motion-* valen 0s bajo
 * reduce, y las primitivas los consumen vía las utilidades motion-*.
 *
 * Se afirma en las dos direcciones. Bajo reduce, ningún interactivo de la
 * referencia puede tener duración distinta de 0s: eso detecta a quien meta un
 * transition-colors de Tailwind sin gate. Bajo no-preference, al menos uno
 * debe animar: eso detecta que el token dejó de consumirse y el gate se
 * cumple en vacío.
 */

const SELECTOR = "#primitivas-seccion a[href], #primitivas-seccion button:not([disabled])";

async function durations(page: import("@playwright/test").Page): Promise<string[]> {
  await page.goto("/sistema");
  return page.evaluate((sel) => {
    return [...document.querySelectorAll(sel)].map(
      (el) => getComputedStyle(el).transitionDuration,
    );
  }, SELECTOR);
}

test.describe("reduced-motion", () => {
  test.use({ contextOptions: { reducedMotion: "reduce" } });

  test("ningún interactivo de la referencia anima bajo reduce", async ({ page }) => {
    const found = await durations(page);
    expect(found.length).toBeGreaterThan(0);
    // transition-duration puede ser una lista ("0s, 0s") si hay varias
    // propiedades; cada entrada tiene que ser 0s.
    const animating = found.filter((d) => d.split(",").some((v) => v.trim() !== "0s"));
    expect(animating, `duraciones distintas de 0s: ${animating.join(" | ")}`).toEqual([]);
  });
});

test.describe("no-preference", () => {
  test.use({ contextOptions: { reducedMotion: "no-preference" } });

  test("al menos un interactivo consume un token de motion", async ({ page }) => {
    const found = await durations(page);
    const animating = found.filter((d) => d.split(",").some((v) => v.trim() !== "0s"));
    expect(animating.length, "ningún interactivo anima: los tokens --motion-* no se consumen").toBeGreaterThan(0);
  });
});
