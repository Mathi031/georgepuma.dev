import { expect, test, type Locator, type Page } from "@playwright/test";

/**
 * Sección Trabajo. Los valores esperados van escritos aquí, no importados de
 * src/content: el test afirma lo que se aprobó, no lo que el contenido diga
 * hoy.
 *
 * Contrato de marcado que asume:
 *   - cada proyecto es un `article[data-level]` dentro de #trabajo, y el
 *     propio article es la raíz de la card (borde, regla y hover viven ahí);
 *   - cada métrica lleva `data-metric` en su raíz, con el numeral en el
 *     primer hijo y el contexto en el segundo;
 *   - SchemaFigure emite dos SVG (role=img), horizontal y vertical, y solo
 *     uno es visible en cada ancho (ver schema-figure.spec.ts).
 */

const SECTION = "#trabajo";
const CARDS = `${SECTION} article[data-level]`;
const MIN_TARGET = 44;

const ORDER = [
  { name: "Notable Learning", level: "destacado", metrics: 3 },
  { name: "Cleo Spa", level: "destacado-secundario", metrics: 2 },
  { name: "Ronatello", level: "menor", metrics: 1 },
  { name: "Studio Equilibrio", level: "menor", metrics: 1 },
  { name: "projsync", level: "menor", metrics: 1 },
];
const BADGES: [string, number][] = [
  ["EN PRODUCCIÓN", 2],
  ["DEMO", 1],
  ["OPEN SOURCE", 1],
];
const REMOVED = ["380+ commits", "100+ tickets"];
const REPO = "https://github.com/Mathi031/projsync";
const WIDTHS = [360, 390, 768, 1280, 1680];

const cards = (page: Page) => page.locator(CARDS);
const card = (page: Page, name: string) =>
  cards(page).filter({ has: page.locator("h3", { hasText: name }) });

async function box(el: Locator) {
  const b = await el.boundingBox();
  expect(b, "el elemento tiene caja").not.toBeNull();
  return b!;
}

async function overflow(page: Page) {
  return page.evaluate(
    () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
  );
}

/** Recorre la página para que las imágenes lazy de la sección se pidan. */
async function scrollThrough(page: Page) {
  await page.evaluate(async () => {
    for (let y = 0; y < document.body.scrollHeight; y += 600) {
      window.scrollTo(0, y);
      await new Promise((r) => setTimeout(r, 40));
    }
    window.scrollTo(0, 0);
  });
}

/** Columnas resueltas (px) del grid más cercano que contiene al elemento. */
async function gridTracks(el: Locator) {
  return el.evaluate((node) => {
    let grid: HTMLElement | null = node.parentElement;
    while (grid && getComputedStyle(grid).display !== "grid") grid = grid.parentElement;
    if (!grid) return null;
    return getComputedStyle(grid)
      .gridTemplateColumns.split(" ")
      .map((v) => parseFloat(v));
  });
}

test.describe("estructura", () => {
  test("cinco proyectos en orden y con su nivel", async ({ page }) => {
    await page.goto("/");
    await expect(cards(page)).toHaveCount(ORDER.length);
    await expect(cards(page).locator("h3")).toHaveText(ORDER.map((o) => o.name));
    for (const [i, o] of ORDER.entries()) {
      await expect(cards(page).nth(i), o.name).toHaveAttribute("data-level", o.level);
    }
  });

  test("los badges llevan el texto exacto", async ({ page }) => {
    await page.goto("/");
    for (const [text, count] of BADGES) {
      await expect(page.locator(SECTION).getByText(text, { exact: true }), text).toHaveCount(count);
    }
    await expect(card(page, "Notable Learning").getByText("EN PRODUCCIÓN")).toHaveCount(0);
  });

  test("cada proyecto lleva sus métricas y ningún numeral va sin contexto", async ({ page }) => {
    await page.goto("/");
    for (const o of ORDER) {
      const metrics = card(page, o.name).locator("[data-metric]");
      await expect(metrics, o.name).toHaveCount(o.metrics);
      for (let i = 0; i < o.metrics; i++) {
        const value = metrics.nth(i).locator(":scope > :nth-child(1)");
        const context = metrics.nth(i).locator(":scope > :nth-child(2)");
        expect((await value.textContent())?.trim(), `${o.name}: numeral ${i}`).not.toBe("");
        expect((await context.textContent())?.trim(), `${o.name}: contexto ${i}`).not.toBe("");
        // Numeral de fila del DS: 17 px. El 20 es solo del hero.
        expect(await value.evaluate((el) => getComputedStyle(el).fontSize), `${o.name}: numeral ${i}`).toBe("17px");
      }
    }
  });

  for (const path of ["/", "/en"]) {
    test(`la home en ${path} no menciona commits ni tickets`, async ({ page }) => {
      await page.goto(path);
      const body = (await page.locator("body").textContent()) ?? "";
      for (const s of REMOVED) expect(body, s).not.toContain(s);
    });
  }

  test("la home EN lista los mismos proyectos en el mismo orden", async ({ page }) => {
    await page.goto("/en");
    await expect(cards(page).locator("h3")).toHaveText(ORDER.map((o) => o.name));
  });
});

test.describe("enlaces", () => {
  test("cada card tiene exactamente un enlace principal con nombre distinto", async ({ page }) => {
    await page.goto("/");
    for (const o of ORDER) {
      await expect(card(page, o.name).locator("a"), o.name).toHaveCount(1);
    }
    const names = await cards(page)
      .locator("a")
      .evaluateAll((els) =>
        els.map((el) => (el.getAttribute("aria-label") ?? el.textContent ?? "").trim()),
      );
    expect(new Set(names).size, `nombres accesibles: ${names.join(" | ")}`).toBe(ORDER.length);
  });

  test("projsync sale al repositorio sin target=_blank", async ({ page }) => {
    await page.goto("/");
    const link = card(page, "projsync").locator("a");
    await expect(link).toHaveAttribute("href", REPO);
    expect(await link.getAttribute("target")).toBeNull();
    await expect(link).toContainText("↗");
  });

  test("en 390 todos los enlaces miden al menos 44 de alto", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 800 });
    await page.goto("/");
    const links = cards(page).locator("a");
    for (let i = 0; i < (await links.count()); i++) {
      const b = await box(links.nth(i));
      expect.soft(b.height, `enlace ${i}`).toBeGreaterThanOrEqual(MIN_TARGET);
    }
  });
});

test.describe("layout en 1280", () => {
  test.use({ viewport: { width: 1280, height: 900 } });

  test("la sección usa el contenedor de 1200 con 1120 útiles", async ({ page }) => {
    await page.goto("/");
    const inner = await page.locator(SECTION).evaluate((el) => {
      const s = getComputedStyle(el);
      return el.clientWidth - parseFloat(s.paddingLeft) - parseFloat(s.paddingRight);
    });
    expect(inner).toBe(1120);
  });

  test("Notable: columna de texto al 55–60 % del área de tracks y diagrama a la derecha", async ({ page }) => {
    await page.goto("/");
    const notable = card(page, "Notable Learning");
    const h3 = notable.locator("h3");
    const tracks = await gridTracks(h3);
    expect(tracks, "el título vive dentro de un grid").not.toBeNull();
    expect(tracks!.length).toBe(2);
    const ratio = tracks![0]! / (tracks![0]! + tracks![1]!);
    expect(ratio).toBeGreaterThanOrEqual(0.55);
    expect(ratio).toBeLessThanOrEqual(0.6);

    const figure = notable.locator("svg[role=img]:visible");
    await expect(figure).toBeVisible();
    const h3Box = await box(h3);
    const figBox = await box(figure);
    expect(figBox.x, "el diagrama va a la derecha del texto").toBeGreaterThanOrEqual(h3Box.x + h3Box.width);

    // Título h3-featured: 22 px en escritorio.
    expect(await h3.evaluate((el) => getComputedStyle(el).fontSize)).toBe("22px");

    // Tres métricas en una fila.
    const ys = await notable.locator("[data-metric]").evaluateAll((els) =>
      els.map((el) => Math.round(el.getBoundingClientRect().y)),
    );
    expect(new Set(ys).size, `y de las métricas: ${ys.join(", ")}`).toBe(1);
  });

  test("Cleo Spa: dos columnas iguales con la captura a la derecha", async ({ page }) => {
    await page.goto("/");
    const cleo = card(page, "Cleo Spa");
    const h3 = cleo.locator("h3");
    const tracks = await gridTracks(h3);
    expect(tracks).not.toBeNull();
    expect(tracks!.length).toBe(2);
    expect(Math.abs(tracks![0]! - tracks![1]!)).toBeLessThanOrEqual(1);
    const h3Box = await box(h3);
    const imgBox = await box(cleo.locator("img"));
    expect(imgBox.x).toBeGreaterThanOrEqual(h3Box.x + h3Box.width);
  });

  test("los tres menores van en una fila", async ({ page }) => {
    await page.goto("/");
    const ys = await page
      .locator(`${CARDS}[data-level="menor"]`)
      .evaluateAll((els) => els.map((el) => Math.round(el.getBoundingClientRect().y)));
    expect(ys.length).toBe(3);
    expect(new Set(ys).size, `y de los menores: ${ys.join(", ")}`).toBe(1);
  });
});

test.describe("layout en 768", () => {
  test.use({ viewport: { width: 768, height: 900 } });

  test("los menores van en dos columnas", async ({ page }) => {
    await page.goto("/");
    const boxes = await page
      .locator(`${CARDS}[data-level="menor"]`)
      .evaluateAll((els) => els.map((el) => {
        const r = el.getBoundingClientRect();
        return { x: Math.round(r.x), y: Math.round(r.y) };
      }));
    expect(boxes.length).toBe(3);
    expect(boxes[0]!.y).toBe(boxes[1]!.y);
    expect(boxes[1]!.x).toBeGreaterThan(boxes[0]!.x);
    expect(boxes[2]!.y).toBeGreaterThan(boxes[0]!.y);
  });
});

test.describe("layout en 390", () => {
  test.use({ viewport: { width: 390, height: 800 } });

  test("todo va en una columna y el diagrama se ve entero", async ({ page }) => {
    await page.goto("/");
    const boxes = await cards(page).evaluateAll((els) => els.map((el) => {
      const r = el.getBoundingClientRect();
      return { x: Math.round(r.x), y: Math.round(r.y) };
    }));
    for (let i = 1; i < boxes.length; i++) {
      expect(boxes[i]!.x, `x de la card ${i}`).toBe(boxes[0]!.x);
      expect(boxes[i]!.y, `y de la card ${i}`).toBeGreaterThan(boxes[i - 1]!.y);
    }

    const notable = card(page, "Notable Learning");
    const figure = notable.locator("svg[role=img]:visible");
    await expect(figure).toBeVisible();
    const b = await box(figure);
    expect(b.x).toBeGreaterThanOrEqual(0);
    expect(b.x + b.width).toBeLessThanOrEqual(390);
    expect(await overflow(page)).toBe(0);

    // Título h3-featured: 18 px en móvil; métricas apiladas.
    expect(await notable.locator("h3").evaluate((el) => getComputedStyle(el).fontSize)).toBe("18px");
    const ys = await notable.locator("[data-metric]").evaluateAll((els) =>
      els.map((el) => Math.round(el.getBoundingClientRect().y)),
    );
    expect(new Set(ys).size).toBe(3);
  });
});

test.describe("imágenes", () => {
  test("toda captura de la sección declara width y height", async ({ page }) => {
    await page.goto("/");
    const imgs = page.locator(`${SECTION} img`);
    expect(await imgs.count()).toBeGreaterThan(0);
    for (let i = 0; i < (await imgs.count()); i++) {
      await expect(imgs.nth(i)).toHaveAttribute("width", /^\d+$/);
      await expect(imgs.nth(i)).toHaveAttribute("height", /^\d+$/);
    }
  });

  test("los recortes de los menores se sirven a 16:10", async ({ page }) => {
    await page.goto("/");
    await scrollThrough(page);
    const imgs = page.locator(`${CARDS}[data-level="menor"] img`);
    await expect(imgs).toHaveCount(2);
    for (let i = 0; i < 2; i++) {
      const img = imgs.nth(i);
      await img.scrollIntoViewIfNeeded();
      await expect
        .poll(() => img.evaluate((el: HTMLImageElement) => el.complete && el.naturalWidth > 0))
        .toBe(true);
      const ratio = await img.evaluate((el: HTMLImageElement) => el.naturalWidth / el.naturalHeight);
      expect(Math.abs(ratio - 1.6), `ratio del recorte ${i}: ${ratio}`).toBeLessThanOrEqual(0.01);
      const declared = await img.evaluate((el: HTMLImageElement) => Number(el.getAttribute("width")) / Number(el.getAttribute("height")));
      expect(Math.abs(declared - 1.6), `ratio declarado ${i}`).toBeLessThanOrEqual(0.01);
    }
  });
});

test.describe("hover de la card con captura", () => {
  const withCapture = (page: Page) => page.locator(`${CARDS}[data-level="menor"]:has(img)`).first();
  const textColor = (page: Page) =>
    page.evaluate(() => getComputedStyle(document.body).color);

  test.describe("no-preference", () => {
    test.use({ contextOptions: { reducedMotion: "no-preference" }, viewport: { width: 1280, height: 900 } });

    test("el borde pasa al color text y consume el token de motion", async ({ page }) => {
      await page.goto("/");
      const el = withCapture(page);
      await el.scrollIntoViewIfNeeded();
      const before = await el.evaluate((n) => getComputedStyle(n).borderTopColor);
      const duration = await el.evaluate((n) => getComputedStyle(n).transitionDuration);
      expect(duration.split(",").some((v) => v.trim() !== "0s"), `transition-duration: ${duration}`).toBe(true);
      await el.hover();
      const expected = await textColor(page);
      await expect.poll(() => el.evaluate((n) => getComputedStyle(n).borderTopColor)).toBe(expected);
      expect(before).not.toBe(expected);
    });
  });

  test.describe("reduce", () => {
    test.use({ contextOptions: { reducedMotion: "reduce" }, viewport: { width: 1280, height: 900 } });

    test("sin transición bajo prefers-reduced-motion", async ({ page }) => {
      await page.goto("/");
      const el = withCapture(page);
      await el.scrollIntoViewIfNeeded();
      const duration = await el.evaluate((n) => getComputedStyle(n).transitionDuration);
      expect(duration.split(",").every((v) => v.trim() === "0s"), `transition-duration: ${duration}`).toBe(true);
      await el.hover();
      await expect(el).toHaveCSS("border-top-color", await textColor(page));
    });
  });
});

for (const width of WIDTHS) {
  test(`sin overflow horizontal en la home a ${width}`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/");
    await scrollThrough(page);
    expect(await overflow(page)).toBe(0);
    const section = await page.locator(SECTION).evaluate((el) => el.scrollWidth - el.clientWidth);
    expect(section, "overflow dentro de #trabajo").toBeLessThanOrEqual(0);
  });
}
