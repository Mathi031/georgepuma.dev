import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

/**
 * El sitio afirma "WCAG 2.1 AA como requisito contractual" en mi último
 * proyecto. Este test aplica el mismo estándar al propio sitio.
 */
const pages = ["/", "/proyectos/notable-learning"];

for (const path of pages) {
  test(`accesibilidad sin violaciones en ${path}`, async ({ page }) => {
    await page.goto(path);
    const results = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
      .analyze();
    expect(results.violations).toEqual([]);
  });
}
