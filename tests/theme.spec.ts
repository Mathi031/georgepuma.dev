import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

/**
 * Estados forzados del toggle: localStorage → script inline del layout →
 * data-theme en <html>. Al correr bajo los projects light y dark se cubren
 * las cuatro combinaciones SO × elección; la elección explícita debe ganar
 * siempre sobre prefers-color-scheme.
 */

const paper = {
  light: "rgb(247, 247, 245)",
  dark: "rgb(28, 24, 20)",
} as const;

for (const forced of ["light", "dark"] as const) {
  test.describe(`tema forzado: ${forced}`, () => {
    test.beforeEach(async ({ page }) => {
      // Se siembra localStorage (no el atributo) para ejercitar el camino
      // real de producción: script anti-FOUC → dataset.theme.
      await page.addInitScript((t) => localStorage.setItem("theme", t), forced);
    });

    for (const path of ["/", "/proyectos/notable-learning"]) {
      test(`paleta forzada y axe sin violaciones en ${path}`, async ({ page }) => {
        await page.goto(path);
        await expect(page.locator("html")).toHaveAttribute("data-theme", forced);
        expect(
          await page.evaluate(() => getComputedStyle(document.body).backgroundColor),
        ).toBe(paper[forced]);
        const results = await new AxeBuilder({ page })
          .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
          .analyze();
        expect(results.violations).toEqual([]);
      });
    }
  });
}

test("el toggle alterna con teclado y la elección persiste", async ({ page }) => {
  await page.goto("/");
  const button = page.getByRole("button", { name: "Cambiar tema" });
  await button.focus();
  await page.keyboard.press("Enter");
  const chosen = await page.getAttribute("html", "data-theme");
  expect(chosen === "light" || chosen === "dark").toBe(true);
  await page.reload();
  await expect(page.locator("html")).toHaveAttribute("data-theme", chosen as string);
});
