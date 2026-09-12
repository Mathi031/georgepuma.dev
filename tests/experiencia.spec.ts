import { expect, test, type Locator, type Page } from "@playwright/test";

/**
 * Secciones Experiencia, Stack y Contacto, más el barrido de idioma de /en.
 * Los valores esperados van escritos aquí, no importados de src/content: el
 * test afirma lo que se aprobó, no lo que el contenido diga hoy.
 *
 * Contrato de marcado que asume:
 *   - #experiencia contiene un `ol` con un `li` por puesto, la línea del
 *     timeline es el borde izquierdo de ese `ol` y el punto es el `::before`
 *     del `p` de periodo;
 *   - el stack es `div#stack`, columna derecha de la misma retícula;
 *   - cada meta de sección es el primer `p.font-mono` de la sección.
 */

const EXPERIENCE = "#experiencia";
const STACK = "#stack";
const CONTACT = "#contacto";
const JOBS = ["Junto AI", "Global Resources", "Desis", "AccountTECH", "Footloose"];
const STACK_GROUPS = ["Dominio principal", "Sólido", "En crecimiento"];
const SECTION_METAS = ["01 · Trabajo", "02 · Método", "03 · Trayectoria", "04 · Contacto"];
const EN_HEADINGS = ["Work", "How I work", "Experience", "Contact"];
const WIDTHS = [360, 390, 768, 1280, 1680];
/** 8/4 de una retícula de 12: el track izquierdo se lleva dos tercios. */
const STACK_RATIO = 8 / 12;

const timeline = (page: Page) => page.locator(`${EXPERIENCE} ol`).first();
const jobs = (page: Page) => timeline(page).locator("> li");

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

async function token(page: Page, name: string) {
  return page.evaluate(
    (n) => getComputedStyle(document.documentElement).getPropertyValue(n).trim(),
    name,
  );
}

function toRgb(hex: string) {
  const h = hex.replace("#", "");
  const n = parseInt(h, 16);
  return `rgb(${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255})`;
}

test.describe("estructura de la trayectoria", () => {
  test("cinco puestos en orden, cada uno con periodo y titular", async ({ page }) => {
    await page.goto("/");
    await expect(jobs(page)).toHaveCount(JOBS.length);
    const titles = await jobs(page)
      .locator("h3")
      .evaluateAll((els) => els.map((el) => (el.textContent ?? "").trim()));
    for (const [i, company] of JOBS.entries()) {
      expect(titles[i], `puesto ${i}`).toContain(company);
    }
    for (let i = 0; i < JOBS.length; i++) {
      const meta = jobs(page).nth(i).locator("p").first();
      expect((await meta.textContent())?.trim(), `${JOBS[i]}: periodo`).not.toBe("");
    }
  });

  // La jerarquía de la línea de impacto se lleva por peso y color, no por
  // tamaño: a 390 un 18/17 no se distinguía (hallazgo medio del QA de la
  // ronda 2). Ahora es 17 en peso 500 frente a 15 en text-secondary, y eso
  // vale igual en móvil que en escritorio.
  for (const width of [390, 1280]) {
    test(`en ${width} la primera línea de cada puesto destaca por peso y color`, async ({
      page,
    }) => {
      await page.setViewportSize({ width, height: 900 });
      await page.goto("/");
      const secondary = toRgb(await token(page, "--color-text-secondary"));
      for (let i = 0; i < JOBS.length; i++) {
        // p[0] es el periodo; p[1] es la primera línea de contenido.
        const impact = jobs(page).nth(i).locator("p").nth(1);
        const got = await impact.evaluate((el) => {
          const s = getComputedStyle(el);
          return { size: s.fontSize, weight: s.fontWeight, color: s.color };
        });
        expect(got.size, `${JOBS[i]}: tamaño del impacto`).toBe("17px");
        expect(got.weight, `${JOBS[i]}: peso del impacto`).toBe("500");
        expect(got.color, `${JOBS[i]}: color del impacto`).not.toBe(secondary);

        // El resto de líneas, si las hay, quedan un escalón por debajo.
        const rest = jobs(page).nth(i).locator("p");
        for (let j = 2; j < (await rest.count()); j++) {
          const line = await rest.nth(j).evaluate((el) => {
            const s = getComputedStyle(el);
            return { size: s.fontSize, color: s.color };
          });
          expect(line.size, `${JOBS[i]}: línea ${j} tamaño`).toBe("15px");
          expect(line.color, `${JOBS[i]}: línea ${j} color`).toBe(secondary);
        }
      }
    });
  }
});

test.describe("timeline", () => {
  for (const width of [768, 1280]) {
    test(`en ${width} la lista lleva línea y cada puesto su punto`, async ({ page }) => {
      await page.setViewportSize({ width, height: 900 });
      await page.goto("/");
      const line = await timeline(page).evaluate((el) => {
        const s = getComputedStyle(el);
        return { w: s.borderLeftWidth, c: s.borderLeftColor };
      });
      expect(line.w, "ancho de la línea").toBe("1px");
      expect(line.c, "color de la línea").toBe(toRgb(await token(page, "--color-text")));

      for (let i = 0; i < JOBS.length; i++) {
        const dot = await jobs(page)
          .nth(i)
          .locator("p")
          .first()
          .evaluate((el) => {
            const s = getComputedStyle(el, "::before");
            return { content: s.content, w: s.width, h: s.height, display: s.display };
          });
        expect(dot.content, `${JOBS[i]}: el punto existe`).not.toBe("none");
        expect(dot.w, `${JOBS[i]}: ancho del punto`).toBe("7px");
        expect(dot.h, `${JOBS[i]}: alto del punto`).toBe("7px");
      }
    });
  }

  test("en 390 no hay línea ni puntos", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 800 });
    await page.goto("/");
    expect(
      await timeline(page).evaluate((el) => getComputedStyle(el).borderLeftWidth),
      "la línea no se pinta",
    ).toBe("0px");
    for (let i = 0; i < JOBS.length; i++) {
      const content = await jobs(page)
        .nth(i)
        .locator("p")
        .first()
        .evaluate((el) => getComputedStyle(el, "::before").content);
      expect(content, `${JOBS[i]}: el punto no se pinta`).toBe("none");
    }
  });
});

test.describe("stack", () => {
  test("en 1280 es la columna derecha de una retícula 8/4", async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.goto("/");
    const stack = page.locator(STACK);
    const tracks = await gridTracks(stack);
    expect(tracks, "el stack vive en un grid").not.toBeNull();
    expect(tracks!.length, "número de tracks").toBe(2);
    const ratio = tracks![0]! / (tracks![0]! + tracks![1]!);
    expect(Math.abs(ratio - STACK_RATIO), `ratio del track izquierdo: ${ratio}`).toBeLessThanOrEqual(
      0.01,
    );

    const listBox = await box(timeline(page));
    const stackBox = await box(stack);
    expect(stackBox.x, "el stack va a la derecha de la trayectoria").toBeGreaterThanOrEqual(
      listBox.x + listBox.width,
    );
  });

  for (const width of [390, 768]) {
    test(`en ${width} el stack baja debajo de la trayectoria`, async ({ page }) => {
      await page.setViewportSize({ width, height: 900 });
      await page.goto("/");
      const tracks = await gridTracks(page.locator(STACK));
      expect(tracks!.length, "una sola columna").toBe(1);
      const listBox = await box(timeline(page));
      const stackBox = await box(page.locator(STACK));
      expect(stackBox.y, "el stack va debajo").toBeGreaterThan(listBox.y);
      expect(Math.round(stackBox.x), "misma x que la trayectoria").toBe(Math.round(listBox.x));
    });
  }

  test("lleva su titular y los tres grupos", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator(`${STACK} h3`)).toHaveText("Stack");
    await expect(page.locator(`${STACK} dt`)).toHaveText(STACK_GROUPS);
    const values = await page
      .locator(`${STACK} dd`)
      .evaluateAll((els) => els.map((el) => (el.textContent ?? "").trim()));
    expect(values.length).toBe(STACK_GROUPS.length);
    for (const [i, v] of values.entries()) expect(v, `grupo ${STACK_GROUPS[i]}`).not.toBe("");
  });

  test("el ancla #stack existe una sola vez y queda a la vista al navegar a ella", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1280, height: 900 });
    await expect(page.locator(STACK)).toHaveCount(0); // aún sin cargar
    await page.goto("/#stack");
    await expect(page.locator(STACK)).toHaveCount(1);
    // El salto al ancla ocurre después del load: se espera a que pare, no se
    // mide de inmediato. scroll-mt-6 deja 24 px de aire sobre el bloque.
    await expect
      .poll(
        () => page.locator(STACK).evaluate((el) => Math.round(el.getBoundingClientRect().top)),
        { message: "top del ancla tras el salto" },
      )
      .toBeLessThanOrEqual(40);
    const top = await page.locator(STACK).evaluate((el) => el.getBoundingClientRect().top);
    expect(top, `top del ancla: ${top}`).toBeGreaterThanOrEqual(0);
  });
});

test.describe("contacto", () => {
  test("va numerado 04 y no queda ningún 05 en la home", async ({ page }) => {
    await page.goto("/");
    const meta = page.locator(`${CONTACT} p.font-mono`).first();
    expect(await meta.textContent()).toBe("04 · Contacto");
    await expect(page.locator(`${CONTACT} h2`)).toHaveText("Contacto");
    const metas = await page
      .locator("main section[id] > div > p.font-mono")
      .evaluateAll((els) =>
        els.map((el) => el.textContent ?? "").filter((t) => /^\d\d ·/.test(t)),
      );
    expect(metas, "las metas numeradas de la home").toEqual(SECTION_METAS);
  });
});

for (const width of WIDTHS) {
  test(`sin overflow en experiencia y contacto a ${width}`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/");
    expect(await overflow(page), "overflow del documento").toBe(0);
    for (const sel of [EXPERIENCE, CONTACT]) {
      const inner = await page.locator(sel).evaluate((el) => el.scrollWidth - el.clientWidth);
      expect(inner, `overflow dentro de ${sel}`).toBeLessThanOrEqual(0);
    }
  });
}

test.describe("la home en inglés no arrastra español", () => {
  test("los cuatro H2 están traducidos", async ({ page }) => {
    await page.goto("/en");
    await expect(page.locator("main h2")).toHaveText(EN_HEADINGS);
  });

  test("ni el texto visible ni los nombres accesibles llevan cadenas en español", async ({
    page,
  }) => {
    await page.goto("/en");
    const strings = await page.evaluate(() => {
      const out: string[] = [];
      const body = document.body as HTMLElement;
      out.push(body.innerText);
      for (const el of document.querySelectorAll("[aria-label]")) {
        out.push(el.getAttribute("aria-label") ?? "");
      }
      for (const el of document.querySelectorAll("svg[role=img] title, svg[role=img] desc")) {
        out.push(el.textContent ?? "");
      }
      return out;
    });
    const haystack = strings.join("\n");

    // Marcadores literales del copy español: si alguno sobrevive, /en está
    // sirviendo contenido sin traducir.
    const MARKERS = [
      "Trabajo",
      "Cómo trabajo",
      "Experiencia",
      "Contacto",
      "Trayectoria",
      "Método",
      "DISPONIBLE AHORA",
      "Ver el trabajo",
      "Leer el mini-caso",
      "EN PRODUCCIÓN",
      "Calidad como práctica",
      "Flujo asistido por IA",
      "código fuente",
      "Dominio principal",
      "En crecimiento",
      "Remoto ·",
      "webhook · validación",
      "validación",
      "subagentes",
      "dos etapas",
      "comentario único",
      "revisor de PRs",
    ];
    for (const m of MARKERS) {
      expect(haystack, `cadena en español: ${m}`).not.toContain(m);
    }
    // Red de seguridad ortográfica para lo que la lista no anticipe.
    const spanish = haystack.match(/[¿¡]|\b(cómo|qué|más|también|según|aún|desde|para|entre)\b/giu);
    expect(spanish, `palabras en español: ${spanish?.join(", ")}`).toBeNull();
  });
});
