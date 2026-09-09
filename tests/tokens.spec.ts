import { expect, test } from "@playwright/test";

/**
 * Guarda contra el modo de fallo más caro de este sistema: una referencia a un
 * token que ya no existe.
 *
 * Una clase de Tailwind que apunta a un token borrado desaparece en silencio
 * (Tailwind no la emite y el build sigue verde). Un `var(--color-x)` escrito a
 * mano en un atributo de presentación de SVG es peor: la propiedad queda
 * invalid-at-computed-value-time y cae al valor inicial, así que un
 * `stroke="var(--color-borrado)"` no se queda del color anterior — se vuelve
 * `stroke: none` y la forma deja de verse. Un `fill` cae a negro, un color que
 * no está en la paleta.
 *
 * Ninguna de las dos cosas la detecta lint, typecheck ni build. Este test sí.
 */

const PAGES = ["/", "/proyectos/notable-learning", "/sistema"];

for (const path of PAGES) {
  test(`todas las referencias a tokens resuelven en ${path}`, async ({ page }) => {
    await page.goto(path);

    const unresolved = await page.evaluate(() => {
      const root = getComputedStyle(document.documentElement);
      const bad: { token: string; where: string }[] = [];
      const seen = new Set<string>();

      // 1. Tokens citados en atributos de presentación de SVG (fill, stroke).
      for (const el of document.querySelectorAll("[fill], [stroke]")) {
        for (const attr of ["fill", "stroke"]) {
          const v = el.getAttribute(attr);
          const m = v?.match(/var\((--[\w-]+)\)/);
          const token = m?.[1];
          if (!token) continue;
          if (!root.getPropertyValue(token).trim()) {
            const key = `${token}|${attr}`;
            if (!seen.has(key)) {
              seen.add(key);
              bad.push({ token, where: `<${el.tagName.toLowerCase()} ${attr}>` });
            }
          }
        }
      }

      // 2. El síntoma, no solo la causa: una forma con stroke declarado en el
      //    atributo que el navegador termina pintando como `none`.
      for (const el of document.querySelectorAll("svg [stroke]")) {
        const attr = el.getAttribute("stroke");
        if (!attr || attr === "none") continue;
        if (getComputedStyle(el).stroke === "none") {
          const key = `computed|${attr}`;
          if (!seen.has(key)) {
            seen.add(key);
            bad.push({ token: attr, where: `<${el.tagName.toLowerCase()}> pinta stroke:none` });
          }
        }
      }

      return bad;
    });

    expect(
      unresolved,
      `referencias a tokens sin resolver:\n${unresolved
        .map((u) => `  ${u.token} en ${u.where}`)
        .join("\n")}`,
    ).toEqual([]);
  });
}

/**
 * El sistema es light-only: no debe quedar rastro del andamiaje de tema.
 * Si alguien reintroduce una utilidad dark: o el atributo data-theme, esto lo
 * dice antes de que llegue a producción.
 */
test("no queda andamiaje de tema oscuro", async ({ page }) => {
  await page.goto("/");
  expect(await page.getAttribute("html", "data-theme")).toBeNull();

  const scheme = await page.evaluate(() =>
    getComputedStyle(document.documentElement).colorScheme,
  );
  expect(scheme === "normal" || scheme === "light").toBe(true);
});
