import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Page } from "@playwright/test";

/**
 * Diagrama de esquema de Notable Learning en la home. La figura lleva dos SVG
 * con la misma información: el horizontal (viewBox de 480) y el vertical
 * (viewBox de 360) para móvil, conmutados solo por CSS en 431 px. Los tests
 * afirman que en cada ancho se ve exactamente uno, que el texto del visible no
 * baja del mínimo de 11 px del design system, y que los dos SVG cuentan lo
 * mismo (comparación DOM contra DOM, sin valores copiados del contenido).
 */

const FIGURE = "#trabajo figure:has(svg[role=img])";
const VISIBLE = `${FIGURE} svg[role=img]:visible`;
const MIN_FONT = 11;
const VERTICAL = [360, 390];
const HORIZONTAL = [431, 1280];

async function overflow(page: Page) {
  return page.evaluate(
    () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
  );
}

/** Ancho del viewBox del único SVG visible de la figura. */
async function visibleViewBoxWidth(page: Page) {
  const svg = page.locator(VISIBLE);
  await expect(svg).toHaveCount(1);
  return svg.evaluate((el: SVGSVGElement) => el.viewBox.baseVal.width);
}

for (const width of VERTICAL) {
  test(`en ${width} se ve el vertical y no el horizontal`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/");
    expect(await visibleViewBoxWidth(page)).toBe(360);
    await expect(page.locator(`${FIGURE} svg[role=img]`)).toHaveCount(2);
  });
}

for (const width of HORIZONTAL) {
  test(`en ${width} se ve el horizontal y no el vertical`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/");
    expect(await visibleViewBoxWidth(page)).toBe(480);
    await expect(page.locator(`${FIGURE} svg[role=img]`)).toHaveCount(2);
  });
}

test("en 360 el texto más pequeño del diagrama visible renderiza a 11 px o más", async ({ page }) => {
  await page.setViewportSize({ width: 360, height: 900 });
  await page.goto("/");
  const smallest = await page.locator(VISIBLE).evaluate((svg: SVGSVGElement) => {
    const scale = svg.getBoundingClientRect().width / svg.viewBox.baseVal.width;
    return [...svg.querySelectorAll("text")]
      .map((t) => ({ text: t.textContent, px: parseFloat(getComputedStyle(t).fontSize) * scale }))
      .sort((a, b) => a.px - b.px)[0]!;
  });
  expect(smallest.px, `"${smallest.text}" renderiza a ${smallest.px.toFixed(2)} px`).toBeGreaterThanOrEqual(MIN_FONT);
});

test("el vertical lleva los mismos rótulos que el horizontal", async ({ page }) => {
  await page.goto("/");
  const texts = await page.locator(`${FIGURE} svg[role=img]`).evaluateAll((svgs) =>
    svgs.map((svg) =>
      [...svg.querySelectorAll("text")].map((t) => t.textContent?.trim()).sort(),
    ),
  );
  expect(texts).toHaveLength(2);
  expect(texts[0]!.length).toBeGreaterThan(0);
  expect(texts[1]).toEqual(texts[0]);
});

test("los dos SVG llevan title y desc propios, con ids distintos", async ({ page }) => {
  await page.goto("/");
  const ids = await page.locator(`${FIGURE} svg[role=img]`).evaluateAll((svgs) =>
    svgs.flatMap((svg) => [...svg.querySelectorAll("title, desc")].map((el) => el.id)),
  );
  expect(ids).toHaveLength(4);
  expect(ids.every(Boolean)).toBe(true);
  expect(new Set(ids).size, `ids: ${ids.join(", ")}`).toBe(4);
});

for (const width of [360, 1280]) {
  test(`en ${width} el diagrama visible tiene exactamente un nodo destacado`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/");
    await expect(page.locator(`${VISIBLE} rect[fill="var(--color-accent-muted)"]`)).toHaveCount(1);
  });

  test(`axe sin violaciones en la home a ${width}`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/");
    const results = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
      .analyze();
    expect(results.violations).toEqual([]);
  });
}

for (const width of [360, 390, 430]) {
  test(`sin overflow horizontal en la home a ${width}`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/");
    expect(await overflow(page)).toBe(0);
  });
}
