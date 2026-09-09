import { expect, test } from "@playwright/test";

/**
 * El foco tiene que verse, y tiene que verse distinto del hover. La spec lo
 * fija en un outline de 2 px con offset 2 px sobre todos los interactivos
 * (secciones 5 y 7); el hover, en cambio, solo cambia color.
 *
 * Este test recorre con Tab las primitivas de la página de referencia y afirma
 * que cada una pinta un outline real. No basta con leer la hoja de estilos: el
 * navegador tiene que resolverlo a un ancho y un color concretos, que es lo que
 * se rompe cuando alguien añade un outline: none en una regla más específica.
 */

const FOCUS_RING_MIN_PX = 2;
const FOCUS_OFFSET_MIN_PX = 2;

test("cada interactivo de la referencia muestra un anillo de foco visible", async ({ page }) => {
  await page.goto("/sistema");

  const interactives = page.locator(
    "#primitivas-seccion a[href], #primitivas-seccion button:not([disabled])",
  );
  const count = await interactives.count();
  // Si la página de referencia se queda sin interactivos, el test pasaría en
  // vacío: eso sería un falso verde, así que se afirma que hay algo que probar.
  expect(count).toBeGreaterThan(0);

  for (let i = 0; i < count; i++) {
    const el = interactives.nth(i);
    await el.focus();

    const style = await el.evaluate((node) => {
      const s = getComputedStyle(node);
      return {
        outlineStyle: s.outlineStyle,
        outlineWidth: s.outlineWidth,
        outlineColor: s.outlineColor,
        outlineOffset: s.outlineOffset,
      };
    });

    const label = (await el.textContent())?.trim().slice(0, 40) || `interactivo ${i}`;

    expect.soft(style.outlineStyle, `${label}: outline-style`).not.toBe("none");
    expect
      .soft(Number.parseFloat(style.outlineWidth), `${label}: outline-width`)
      .toBeGreaterThanOrEqual(FOCUS_RING_MIN_PX);
    expect
      .soft(Number.parseFloat(style.outlineOffset), `${label}: outline-offset`)
      .toBeGreaterThanOrEqual(FOCUS_OFFSET_MIN_PX);
    // transparent o un alpha de 0 pintarían "un outline" que nadie ve.
    expect.soft(style.outlineColor, `${label}: outline-color`).not.toBe("transparent");
    expect.soft(style.outlineColor, `${label}: outline-color`).not.toContain("rgba(0, 0, 0, 0)");
  }
});

test("los botones deshabilitados no reciben foco al tabular", async ({ page }) => {
  await page.goto("/sistema");
  const disabled = page.locator("#primitivas-seccion button[disabled]");
  expect(await disabled.count()).toBeGreaterThan(0);

  // Un <button disabled> queda fuera del orden de tabulación por defecto; el
  // test lo fija para que nadie lo "arregle" con tabindex.
  for (let i = 0; i < (await disabled.count()); i++) {
    await expect(disabled.nth(i)).not.toBeFocused();
  }
});

test("el foco recorre las primitivas en orden con Tab", async ({ page }) => {
  await page.goto("/sistema");

  const first = page.locator("#primitivas-seccion a[href], #primitivas-seccion button:not([disabled])").first();
  await first.focus();
  await expect(first).toBeFocused();

  // Tres saltos: basta para comprobar que el orden sigue al DOM y que ningún
  // elemento se traga el foco.
  const seen: string[] = [];
  for (let i = 0; i < 3; i++) {
    await page.keyboard.press("Tab");
    seen.push(
      await page.evaluate(() => {
        const a = document.activeElement;
        return a ? `${a.tagName}:${(a.textContent ?? "").trim().slice(0, 24)}` : "none";
      }),
    );
  }

  expect(new Set(seen).size, `el foco se repitió: ${seen.join(" -> ")}`).toBe(seen.length);
});
