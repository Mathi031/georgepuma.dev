import { readdir, readFile } from "node:fs/promises";
import { join } from "node:path";
import { expect, test, type Locator, type Page } from "@playwright/test";

/**
 * Header, nav, hero y footer. Los valores esperados van escritos aquí y no
 * importados de src/content: el test afirma lo que se aprobó, no lo que el
 * contenido diga hoy.
 */

const MIN_TARGET = 44;

const NAV = {
  es: ["Trabajo", "Método", "Experiencia", "Contacto"],
  en: ["Work", "How I work", "Experience", "Contact"],
};
const NAV_HREFS = ["#trabajo", "#metodo", "#experiencia", "#contacto"];
const BRAND_ARIA = { es: "georgepuma.dev — inicio", en: "georgepuma.dev — home" };
const BADGE = { es: "DISPONIBLE AHORA", en: "AVAILABLE NOW" };
const HOME = { es: "/", en: "/en" };

/** H2 de la home en español; la ruta /en se cubre por locale más abajo. */
const HEADINGS: Record<string, string> = {
  trabajo: "Trabajo",
  metodo: "Cómo trabajo",
  experiencia: "Experiencia",
  contacto: "Contacto",
};

const H1 = "Construyo productos web que llegan a producción. Y puedo demostrarlo.";
const EVIDENCE = ["500+ escuelas", "2 negocios", "WCAG 2.1 AA"];
const REPO = "https://github.com/Mathi031/georgepuma.dev";
const CI = `${REPO}/actions/workflows/ci.yml`;

const header = (page: Page) => page.locator("body > header").first();
/** La nav de secciones es la que enlaza a anclas; la otra nav del header es ES/EN. */
const sectionNav = (page: Page) => header(page).locator('nav:has(a[href^="#"])');
const brand = (page: Page, locale: "es" | "en") =>
  header(page).getByRole("link", { name: BRAND_ARIA[locale], exact: true });

async function box(el: Locator) {
  const b = await el.boundingBox();
  expect(b, "el elemento tiene caja").not.toBeNull();
  return b!;
}

async function expectTarget(el: Locator, label: string) {
  const b = await box(el);
  expect.soft(b.width, `${label}: ancho`).toBeGreaterThanOrEqual(MIN_TARGET);
  expect.soft(b.height, `${label}: alto`).toBeGreaterThanOrEqual(MIN_TARGET);
}

async function overflow(page: Page) {
  return page.evaluate(
    () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
  );
}

for (const locale of ["es", "en"] as const) {
  test.describe(`header en ${HOME[locale]}`, () => {
    test("el brand es el dominio, enlaza a la home y lleva su aria-label", async ({ page }) => {
      await page.goto(HOME[locale]);
      const b = brand(page, locale);
      await expect(b).toHaveText("georgepuma.dev");
      await expect(b).toHaveAttribute("href", HOME[locale]);
    });

    test("la nav tiene exactamente cuatro anclas con sus etiquetas", async ({ page }) => {
      await page.goto(HOME[locale]);
      const links = sectionNav(page).getByRole("link");
      await expect(links).toHaveCount(4);
      await expect(links).toHaveText(NAV[locale]);
      for (const [i, href] of NAV_HREFS.entries()) {
        await expect(links.nth(i)).toHaveAttribute("href", href);
      }
    });
  });
}

test.describe("header en móvil", () => {
  for (const width of [390, 360]) {
    test(`en ${width} la nav va en una segunda fila y todo target mide 44x44`, async ({ page }) => {
      await page.setViewportSize({ width, height: 800 });
      await page.goto("/");

      const brandBox = await box(brand(page, "es"));
      const navBox = await box(sectionNav(page));
      expect(navBox.y, "la nav empieza por debajo del brand").toBeGreaterThanOrEqual(
        brandBox.y + brandBox.height - 1,
      );

      const links = sectionNav(page).getByRole("link");
      for (let i = 0; i < (await links.count()); i++) {
        await expectTarget(links.nth(i), `nav ${i}`);
      }
      // ES/EN: el activo es un span con aria-current, el otro un enlace con hrefLang.
      const sw = header(page).locator('a[hreflang], [aria-current="true"]');
      expect(await sw.count()).toBe(2);
      for (let i = 0; i < 2; i++) await expectTarget(sw.nth(i), `switch ${i}`);
    });
  }
});

test("en 1280 el header es una sola fila y no es sticky", async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 800 });
  await page.goto("/");
  const brandBox = await box(brand(page, "es"));
  const navBox = await box(sectionNav(page));
  // Misma fila: la nav no puede empezar por debajo del brand.
  expect(navBox.y).toBeLessThan(brandBox.y + brandBox.height);

  const position = await header(page).evaluate((el) => getComputedStyle(el).position);
  expect(["fixed", "sticky"]).not.toContain(position);
});

test("cada sección tiene su id y su aria-labelledby resuelve a su H2", async ({ page }) => {
  await page.goto("/");
  for (const [id, heading] of Object.entries(HEADINGS)) {
    const section = page.locator(`section#${id}`);
    await expect(section, `#${id}`).toHaveCount(1);
    const labelledBy = await section.getAttribute("aria-labelledby");
    expect(labelledBy, `aria-labelledby de #${id}`).toBeTruthy();
    const h2 = page.locator(`h2#${labelledBy}`);
    await expect(h2, `H2 de #${id}`).toHaveText(heading);
  }
});

test("no queda ninguna referencia a los anclajes viejos en src/", async () => {
  const root = join(process.cwd(), "src");
  const files = (await readdir(root, { recursive: true })).map(String).filter((f) => /\.(tsx?|css)$/.test(f));
  const offenders: string[] = [];
  for (const f of files) {
    const text = await readFile(join(root, f), "utf8");
    if (/#proyectos\b|#ia\b|sections\.(projects|ai)\b/.test(text)) offenders.push(f);
  }
  expect(offenders).toEqual([]);
});

test.describe("hero", () => {
  test("muestra el badge de disponibilidad y ya no dice cinco años", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("main").getByText(BADGE.es, { exact: true })).toBeVisible();
    await page.goto("/en");
    await expect(page.locator("main").getByText(BADGE.en, { exact: true })).toBeVisible();
    const body = (await page.locator("body").textContent()) ?? "";
    expect(body.toLowerCase()).not.toContain("cinco años");
  });

  test("el primer H1 es el texto exacto", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("h1").first()).toHaveText(H1);
  });

  test("hay exactamente tres pruebas, cada una con numeral y contexto", async ({ page }) => {
    await page.goto("/");
    const items = page.locator("main ul[aria-label] > li").filter({ has: page.locator("p") });
    await expect(items).toHaveCount(3);
    for (const [i, value] of EVIDENCE.entries()) {
      const ps = items.nth(i).locator("p");
      await expect(ps).toHaveCount(2);
      await expect(ps.nth(0)).toHaveText(value);
      expect((await ps.nth(1).textContent())?.trim()).not.toBe("");
    }
  });

  test("los CTAs apuntan al trabajo y al PDF", async ({ page }) => {
    await page.goto("/");
    const primary = page.locator('main a[href="#trabajo"]');
    await expect(primary).toHaveCount(1);
    await expect(primary).toHaveText("Ver el trabajo →");
    await expect(page.locator('main a[href="/cv-george-puma.pdf"]')).toHaveText("CV en PDF ↓");
  });

  test("los iconos de GitHub, LinkedIn y Email tienen nombre accesible y target 44x44", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 800 });
    await page.goto("/");
    for (const name of ["GitHub", "LinkedIn", "Email"]) {
      const link = page.locator("main").getByRole("link", { name, exact: true });
      await expect(link).toHaveCount(1);
      await expectTarget(link, name);
    }
  });
});

test.describe("estado activo de la nav", () => {
  test("al llegar a #experiencia solo ese enlace lleva aria-current", async ({ page }) => {
    await page.goto("/");
    await page.evaluate(() => document.getElementById("experiencia")?.scrollIntoView());
    const links = sectionNav(page).getByRole("link");
    await expect(links.nth(2)).toHaveAttribute("aria-current", "location");
    await expect(sectionNav(page).locator('[aria-current="location"]')).toHaveCount(1);
  });

  test.describe("sin JavaScript", () => {
    test.use({ javaScriptEnabled: false });

    test("la página renderiza sin aria-current y sin errores", async ({ page }) => {
      const errors: string[] = [];
      page.on("pageerror", (e) => errors.push(e.message));
      await page.goto("/");
      await expect(sectionNav(page).getByRole("link")).toHaveCount(4);
      await expect(sectionNav(page).locator('[aria-current="location"]')).toHaveCount(0);
      expect(errors).toEqual([]);
    });
  });
});

test("el footer enlaza al repositorio y al workflow de CI, sin lista de tecnologías", async ({ page }) => {
  await page.goto("/");
  const footer = page.locator("body > footer");
  await expect(footer.locator(`a[href="${REPO}"]`)).toHaveText("código fuente ↗");
  await expect(footer.locator(`a[href="${CI}"]`)).toHaveText("CI ↗");
  expect(await footer.textContent()).not.toContain("Next.js · TypeScript · Vercel");
});

for (const path of ["/", "/proyectos/cleo-spa"]) {
  for (const width of [360, 390, 768, 1280, 1680]) {
    test(`sin overflow horizontal en ${path} a ${width}`, async ({ page }) => {
      await page.setViewportSize({ width, height: 900 });
      await page.goto(path);
      expect(await overflow(page)).toBe(0);
    });
  }
}
