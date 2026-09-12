import { expect, test, type Locator, type Page } from "@playwright/test";

/**
 * Sección "Cómo trabajo". Los valores esperados van escritos aquí, no
 * importados de src/content: el test afirma lo que se aprobó, no lo que el
 * contenido diga hoy.
 *
 * Contrato de marcado que asume:
 *   - la sección es #metodo y contiene dos bloques `div` de retícula, cada uno
 *     con su kicker `p.font-mono` como primer hijo;
 *   - el pipeline es `figure ol[aria-label]` con seis `li`, y la caja de cada
 *     paso es el último `span` del `li`;
 *   - la cita es un `blockquote` con regla izquierda y sin fondo;
 *   - la lista de calidad es el `ol` del segundo bloque, con el numeral en un
 *     `span[aria-hidden]`.
 */

const SECTION = "#metodo";
const PIPELINE = `${SECTION} figure ol`;
const PIPELINE_ARIA = "pipeline · revisor de PRs";
const STEPS = ["webhook", "validación", "contexto", "subagentes", "dos etapas", "comentario único"];
const QUALITY_KICKER = "Calidad como práctica";
const FLOW_KICKER = "Flujo asistido por IA";
const QUALITY_ITEMS = 4;
/** Track de la columna de margen en la retícula 3/9. */
const MARGIN_TRACK = 288;

const boxes = (page: Page) => page.locator(`${PIPELINE} li > span:last-child`);
/** Los dos bloques de retícula de la sección, en orden: flujo y calidad. */
const blocks = (page: Page) => page.locator(`${SECTION} > div`);
const quote = (page: Page) => page.locator(`${SECTION} blockquote`);

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

/** Valor resuelto de un token del sistema, para no hardcodear el rgb. */
async function token(page: Page, name: string) {
  return page.evaluate(
    (n) => getComputedStyle(document.documentElement).getPropertyValue(n).trim(),
    name,
  );
}

/** Convierte #rrggbb al rgb() que devuelve getComputedStyle. */
function toRgb(hex: string) {
  const h = hex.replace("#", "");
  const n = parseInt(h, 16);
  return `rgb(${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255})`;
}

async function rects(loc: Locator) {
  return loc.evaluateAll((els) =>
    els.map((el) => {
      const r = el.getBoundingClientRect();
      return {
        x: Math.round(r.x),
        y: Math.round(r.y),
        w: Math.round(r.width),
        h: Math.round(r.height),
      };
    }),
  );
}

test.describe("cabecera", () => {
  test("el H2 es «Cómo trabajo», la meta va numerada 02 y hay lead", async ({ page }) => {
    await page.goto("/");
    const section = page.locator(SECTION);
    await expect(section.locator("h2")).toHaveText("Cómo trabajo");
    // nbsp alrededor del separador, igual que el resto de metas del sistema.
    expect(await section.locator("p.font-mono").first().textContent()).toBe("02 · Método");
    await expect(section.locator("p.text-lead")).toHaveCount(1);
  });
});

test.describe("retícula 3/9", () => {
  for (const width of [1024, 1280]) {
    test(`en ${width} los dos bloques dejan la meta en la columna de ${MARGIN_TRACK}`, async ({
      page,
    }) => {
      await page.setViewportSize({ width, height: 900 });
      await page.goto("/");
      for (const kicker of [FLOW_KICKER, QUALITY_KICKER]) {
        const el = page.locator(SECTION).getByText(kicker, { exact: true });
        const tracks = await gridTracks(el);
        expect(tracks, `${kicker}: vive en un grid`).not.toBeNull();
        expect(tracks!.length, `${kicker}: número de tracks`).toBe(2);
        expect(tracks![0], `${kicker}: track de margen`).toBe(MARGIN_TRACK);
        // 3/9 de 1120 sería 280/840; el sistema fija 288 y el resto es el 9.
        expect(tracks![1]!, `${kicker}: track de contenido`).toBeGreaterThan(tracks![0]! * 2);
      }
    });
  }

  for (const width of [390, 768]) {
    test(`en ${width} los bloques se apilan y la meta queda encima`, async ({ page }) => {
      await page.setViewportSize({ width, height: 900 });
      await page.goto("/");
      for (const kicker of [FLOW_KICKER, QUALITY_KICKER]) {
        const el = page.locator(SECTION).getByText(kicker, { exact: true });
        const tracks = await gridTracks(el);
        expect(tracks!.length, `${kicker}: una sola columna`).toBe(1);
        const kickerBox = await box(el);
        const sibling = await box(
          page.locator(SECTION).getByText(kicker, { exact: true }).locator("xpath=following-sibling::*[1]"),
        );
        expect(kickerBox.y, `${kicker}: va encima del contenido`).toBeLessThan(sibling.y);
        expect(Math.round(kickerBox.x), `${kicker}: misma x que el contenido`).toBe(
          Math.round(sibling.x),
        );
      }
    });
  }
});

test.describe("pipeline", () => {
  test("es una lista ordenada de seis pasos con su nombre accesible", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator(PIPELINE)).toHaveAttribute("aria-label", PIPELINE_ARIA);
    await expect(boxes(page)).toHaveText(STEPS);
  });

  for (const width of [768, 1280]) {
    test(`en ${width} las seis cajas van en una fila con altura uniforme`, async ({ page }) => {
      await page.setViewportSize({ width, height: 900 });
      await page.goto("/");
      const r = await rects(boxes(page));
      expect(r.length).toBe(6);
      expect(new Set(r.map((b) => b.y)).size, `y de las cajas: ${r.map((b) => b.y).join(", ")}`).toBe(1);
      expect(new Set(r.map((b) => b.h)).size, `alto de las cajas: ${r.map((b) => b.h).join(", ")}`).toBe(1);
      for (let i = 1; i < r.length; i++) {
        expect(r[i]!.x, `la caja ${i} va a la derecha de la anterior`).toBeGreaterThan(r[i - 1]!.x);
      }
      // Las flechas apuntan a la derecha: sin rotación.
      const rotations = await page
        .locator(`${PIPELINE} svg`)
        .evaluateAll((els) => els.map((el) => getComputedStyle(el).rotate));
      expect(rotations.length).toBe(5);
      expect(new Set(rotations), `rotate de las flechas: ${rotations.join(", ")}`).toEqual(
        new Set(["none"]),
      );
    });
  }

  test("en 390 las cajas se apilan en columna con altura uniforme", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 800 });
    await page.goto("/");
    const r = await rects(boxes(page));
    expect(r.length).toBe(6);
    expect(new Set(r.map((b) => b.x)).size, `x de las cajas: ${r.map((b) => b.x).join(", ")}`).toBe(1);
    expect(new Set(r.map((b) => b.w)).size, `ancho de las cajas: ${r.map((b) => b.w).join(", ")}`).toBe(1);
    expect(new Set(r.map((b) => b.h)).size, `alto de las cajas: ${r.map((b) => b.h).join(", ")}`).toBe(1);
    for (let i = 1; i < r.length; i++) {
      expect(r[i]!.y, `la caja ${i} va debajo de la anterior`).toBeGreaterThan(r[i - 1]!.y);
    }
    // Las flechas giran a vertical cuando la lista es columna.
    const rotations = await page
      .locator(`${PIPELINE} svg`)
      .evaluateAll((els) => els.map((el) => getComputedStyle(el).rotate));
    expect(new Set(rotations), `rotate de las flechas: ${rotations.join(", ")}`).toEqual(
      new Set(["90deg"]),
    );
    expect(await overflow(page), "overflow del documento").toBe(0);
    const inner = await page
      .locator(SECTION)
      .evaluate((el) => el.scrollWidth - el.clientWidth);
    expect(inner, "overflow dentro de #metodo").toBeLessThanOrEqual(0);
  });

  test("solo el último paso va destacado con el color primario", async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.goto("/");
    const primary = toRgb(await token(page, "--color-primary"));
    const accentMuted = toRgb(await token(page, "--color-accent-muted"));
    const styles = await boxes(page).evaluateAll((els) =>
      els.map((el) => {
        const s = getComputedStyle(el);
        return { border: s.borderTopColor, bg: s.backgroundColor };
      }),
    );
    const last = styles[styles.length - 1]!;
    expect(last.border, "borde del último paso").toBe(primary);
    expect(last.bg, "fondo del último paso").toBe(accentMuted);
    for (const [i, s] of styles.slice(0, -1).entries()) {
      expect(s.border, `borde del paso ${i}`).not.toBe(primary);
      expect(s.bg, `fondo del paso ${i}`).not.toBe(accentMuted);
    }
  });

  test("la figura lleva pie de foto", async ({ page }) => {
    await page.goto("/");
    const caption = page.locator(`${SECTION} figure figcaption`);
    await expect(caption).toHaveCount(1);
    expect((await caption.textContent())?.trim()).not.toBe("");
  });
});

test.describe("cita", () => {
  test("no lleva caja ni fondo: solo regla izquierda", async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.goto("/");
    const s = await quote(page).evaluate((el) => {
      const c = getComputedStyle(el);
      return {
        bg: c.backgroundColor,
        top: c.borderTopWidth,
        right: c.borderRightWidth,
        bottom: c.borderBottomWidth,
        left: c.borderLeftWidth,
        leftColor: c.borderLeftColor,
      };
    });
    expect(s.bg, "fondo").toBe("rgba(0, 0, 0, 0)");
    expect(s.top, "borde superior").toBe("0px");
    expect(s.right, "borde derecho").toBe("0px");
    expect(s.bottom, "borde inferior").toBe("0px");
    expect(s.left, "regla izquierda").toBe("1px");
    expect(s.leftColor, "color de la regla").toBe(toRgb(await token(page, "--color-text")));
  });

  for (const [width, size] of [
    [1280, "22px"],
    [390, "18px"],
  ] as const) {
    test(`el texto de la cita mide ${size} en ${width}`, async ({ page }) => {
      await page.setViewportSize({ width, height: 900 });
      await page.goto("/");
      expect(
        await quote(page).locator("p").evaluate((el) => getComputedStyle(el).fontSize),
      ).toBe(size);
    });
  }
});

test.describe("calidad como práctica", () => {
  test("cuatro ítems numerados 01–04 sin viñeta del navegador", async ({ page }) => {
    await page.goto("/");
    const block = blocks(page).last();
    await expect(block.locator("p.font-mono").first()).toHaveText(QUALITY_KICKER);
    const items = block.locator("ol > li");
    await expect(items).toHaveCount(QUALITY_ITEMS);
    const numerals = await items
      .locator("span[aria-hidden]")
      .evaluateAll((els) => els.map((el) => (el.textContent ?? "").trim()));
    expect(numerals).toEqual(["01", "02", "03", "04"]);
    const markers = await items.evaluateAll((els) =>
      els.map((el) => getComputedStyle(el).listStyleType),
    );
    expect(new Set(markers), `list-style-type: ${markers.join(", ")}`).toEqual(new Set(["none"]));
    for (let i = 0; i < QUALITY_ITEMS; i++) {
      expect((await items.nth(i).textContent())?.trim(), `texto del ítem ${i}`).not.toBe("");
    }
  });
});
