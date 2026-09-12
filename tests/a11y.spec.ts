import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

/**
 * El sitio afirma "WCAG 2.1 AA como requisito contractual" en mi último
 * proyecto. Este test aplica el mismo estándar al propio sitio.
 */
const pages = [
  "/",
  "/proyectos/notable-learning",
  "/proyectos/cleo-spa",
  "/proyectos/ronatello",
  "/proyectos/studio-equilibrio",
  "/en",
  "/en/projects/notable-learning",
  "/en/projects/cleo-spa",
  "/en/projects/ronatello",
  "/en/projects/studio-equilibrio",
  // Referencia visual del design system: no es una página pública, pero es
  // donde viven todas las primitivas juntas, así que es el sitio más barato
  // para detectar una regresión de contraste o de semántica.
  "/sistema",
];

for (const path of pages) {
  test(`accesibilidad sin violaciones en ${path}`, async ({ page }) => {
    await page.goto(path);
    const results = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
      .analyze();
    expect(results.violations).toEqual([]);
  });
}

/**
 * El accordion de la trayectoria arranca con un solo ítem abierto, así que el
 * barrido de arriba solo ve ese cuerpo. Este caso abre los cinco: el resto del
 * contenido no pasa por axe de ninguna otra forma.
 */
for (const path of ["/", "/en"]) {
  test(`accesibilidad con toda la trayectoria abierta en ${path}`, async ({ page }) => {
    await page.goto(path);
    await page
      .locator("#experiencia details")
      .evaluateAll((els) => els.forEach((el) => ((el as HTMLDetailsElement).open = true)));
    // El cuerpo entra con un fade de 200 ms: medir el contraste a mitad de la
    // transición da un color intermedio que no es el que ve nadie.
    await expect
      .poll(() => page.locator("#experiencia dl").first().evaluate((el) => getComputedStyle(el).opacity))
      .toBe("1");
    const results = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
      .analyze();
    expect(results.violations).toEqual([]);
  });
}
