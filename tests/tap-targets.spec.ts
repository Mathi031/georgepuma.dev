import { expect, test, type Locator, type Page } from "@playwright/test";

/**
 * Área táctil en móvil (WCAG 2.5.8 pide 24, el sitio se exige 44). Los
 * enlaces del hero, las cards y el header ya lo cubren sus propios specs;
 * este barre todo lo demás y nombra los enlaces que el QA final encontró
 * cortos.
 */

const MIN = 44;
const VIEWPORT = { width: 390, height: 800 };

const ROUTES = [
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
  "/sistema",
];

/**
 * Enlaces en prosa: WCAG 2.5.8 los exceptúa (el objetivo está en línea con
 * el texto). Solo los párrafos, definiciones y citas dentro de <main>: las
 * listas no entran (las cards y las notas son navegación) ni el footer, que
 * también va en <p> pero no es prosa.
 */
const INLINE_PROSE = "main p a, main dd a, main blockquote a";
/** El skip link es sr-only hasta recibir foco: mide 1x1 a propósito. */
const SKIP_LINK = 'a[href="#contenido"]';

const box = async (el: Locator) => {
  const b = await el.boundingBox();
  if (!b) throw new Error("elemento sin caja");
  return b;
};

const describe = (el: Locator) =>
  el.evaluate((a) => `${(a as HTMLAnchorElement).getAttribute("href")} "${a.textContent?.trim().slice(0, 30)}"`);

test.use({ viewport: VIEWPORT });

for (const route of ROUTES) {
  test(`ningún enlace mide menos de ${MIN} de alto en ${route}`, async ({ page }) => {
    await page.goto(route);
    const links = page.locator("a[href]:visible");
    const n = await links.count();
    let measured = 0;
    for (let i = 0; i < n; i++) {
      const link = links.nth(i);
      if (await link.evaluate((a, sel) => a.matches(sel), `${INLINE_PROSE}, ${SKIP_LINK}`)) continue;
      measured += 1;
      const b = await box(link);
      expect.soft(b.height, `${route} ${await describe(link)}`).toBeGreaterThanOrEqual(MIN);
    }
    // Si la exclusión se come el barrido, que se note: al menos la mitad de
    // los enlaces de cada ruta se mide.
    expect(measured, `${route}: ${measured} de ${n} enlaces medidos`).toBeGreaterThanOrEqual(Math.ceil(n / 2));
  });
}

const mini = (locale: "es" | "en") =>
  locale === "es"
    ? ["/proyectos/cleo-spa", "/proyectos/ronatello", "/proyectos/studio-equilibrio"]
    : ["/en/projects/cleo-spa", "/en/projects/ronatello", "/en/projects/studio-equilibrio"];

const BACK = { es: "Volver a proyectos", en: "Back to projects" };
const ALL = { es: "Ver todos los proyectos", en: "See all projects" };

for (const locale of ["es", "en"] as const) {
  test(`"${BACK[locale]}" es un enlace terciario de ${MIN} en los mini-casos ${locale}`, async ({ page }) => {
    for (const route of mini(locale)) {
      await page.goto(route);
      const link = page.getByRole("link", { name: BACK[locale] });
      const b = await box(link);
      expect(b.height, route).toBeGreaterThanOrEqual(MIN);
      expect(b.width, route).toBeGreaterThanOrEqual(MIN);
    }
  });

  test(`"${ALL[locale]}" y los retornos de nota miden ${MIN} en Notable ${locale}`, async ({ page }) => {
    await page.goto(locale === "es" ? "/proyectos/notable-learning" : "/en/projects/notable-learning");
    const all = await box(page.getByRole("link", { name: ALL[locale] }));
    expect(all.height).toBeGreaterThanOrEqual(MIN);
    expect(all.width).toBeGreaterThanOrEqual(MIN);

    const backs = page.locator('footer a[href^="#ref-"]');
    expect(await backs.count()).toBeGreaterThan(0);
    for (let i = 0; i < (await backs.count()); i++) {
      const b = await box(backs.nth(i));
      expect.soft(b.height, `retorno ${i + 1}`).toBeGreaterThanOrEqual(MIN);
      expect.soft(b.width, `retorno ${i + 1}`).toBeGreaterThanOrEqual(MIN);
    }

    // Referencias en prosa: WCAG 2.5.8 se conforma con 24, y aquí en móvil se
    // llega a 44 con padding. Además del color, superíndice como señal.
    const refs = page.locator('a[href^="#nota-"]');
    expect(await refs.count()).toBeGreaterThan(0);
    for (let i = 0; i < (await refs.count()); i++) {
      const ref = refs.nth(i);
      const b = await box(ref);
      expect.soft(b.height, `ref ${i + 1}`).toBeGreaterThanOrEqual(MIN);
      expect.soft(b.width, `ref ${i + 1}`).toBeGreaterThanOrEqual(24);
      expect.soft(await ref.evaluate((a) => getComputedStyle(a).verticalAlign), `ref ${i + 1}`).toBe("super");
    }
  });

  test(`footer y nav de la home ${locale}: código fuente, CI y el primer ítem miden ${MIN}`, async ({ page }) => {
    await page.goto(locale === "es" ? "/" : "/en");
    for (const a of await page.locator("body > footer a").all()) {
      const b = await box(a);
      expect.soft(b.height, await describe(a)).toBeGreaterThanOrEqual(MIN);
    }
    const first = page.locator("body > header nav[data-section-nav] a").first();
    const b = await box(first);
    expect(b.height).toBeGreaterThanOrEqual(MIN);
    expect(b.width).toBeGreaterThanOrEqual(MIN);
  });
}

// El texto de un enlace no se agranda para llegar a 44: la caja crece con
// padding y el tamaño de fuente se queda en el del sistema.
test("ningún enlace de los mini-casos supera el text-body-small salvo el CTA", async ({ page }) => {
  await page.goto("/proyectos/cleo-spa");
  const sizes = await page
    .locator("main a[href]")
    .evaluateAll((els) => els.map((a) => parseFloat(getComputedStyle(a).fontSize)));
  for (const s of sizes) expect.soft(s).toBeLessThanOrEqual(15.5);
});

export {};
export type _P = Page;
