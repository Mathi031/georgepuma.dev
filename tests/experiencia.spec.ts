import { expect, test, type Locator, type Page } from "@playwright/test";

/**
 * Secciones Experiencia, Stack y Contacto, más el barrido de idioma de /en.
 * Los valores esperados van escritos aquí, no importados de src/content: el
 * test afirma lo que se aprobó, no lo que el contenido diga hoy.
 *
 * Contrato de marcado que asume (CAMBIO #7):
 *   - #experiencia contiene un `ol` con un `li` por puesto; los cinco
 *     primeros llevan un `details` con `summary`, y el sexto (BIZZPERU) es
 *     compacto: su cabecera va en un `div`, sin `details`;
 *   - la cabecera lleva la meta mono, el `h3` "Empresa — Rol" y la línea de
 *     impacto, todos como `span` (el modelo de contenido de `summary` es
 *     phrasing, así que no admite `p`);
 *   - la línea del timeline es el borde izquierdo del `ol` y el punto es el
 *     `::before` de la meta de cada ítem;
 *   - el cuerpo abierto es un `dl` con cuatro pares `dt`/`dd`;
 *   - el stack es `div#stack`, columna derecha de la misma retícula;
 *   - cada meta de sección es el primer `p.font-mono` de la sección.
 */

const EXPERIENCE = "#experiencia";
const STACK = "#stack";
const CONTACT = "#contacto";
const JOBS = ["Junto AI", "Global Resources", "Desis", "AccountTECH", "Footloose", "BIZZPERU"];
/** Los cinco primeros son expandibles; BIZZPERU no. */
const EXPANDABLE = 5;
const BODY_LABELS = ["CONTEXTO", "ALCANCE", "RESULTADO", "TECNOLOGÍAS"];
const BODY_LABELS_EN = ["CONTEXT", "SCOPE", "OUTCOME", "TECH"];
const STACK_GROUPS = ["Dominio principal", "Sólido", "En crecimiento"];
const SECTION_METAS = ["01 · Trabajo", "02 · Método", "03 · Trayectoria", "04 · Contacto"];
const EN_HEADINGS = ["Work", "How I work", "Experience", "Contact"];
const WIDTHS = [360, 390, 768, 1280, 1680];
/** 8/4 de una retícula de 12: el track izquierdo se lleva dos tercios. */
const STACK_RATIO = 8 / 12;

/**
 * La trayectoria son dos listas: la de los puestos con cuerpo y la del grupo
 * "antes de 2022", que abre la suya para que su etiqueta no quede dentro de
 * un <li>. `jobs` recorre las dos en orden; `timeline` es la primera, que es
 * donde se miden la línea y la retícula.
 */
const lists = (page: Page) => page.locator(`${EXPERIENCE} ol:not(dd ol)`);
const timeline = (page: Page) => lists(page).first();
const jobs = (page: Page) => lists(page).locator("> li");
const details = (page: Page, i: number) => jobs(page).nth(i).locator("details");
/**
 * Cabecera del ítem: el `summary` en los expandibles, el `div` de cabecera en
 * el compacto. La meta y el impacto se leen de aquí en ambos casos.
 */
const header = (page: Page, i: number) =>
  jobs(page)
    .nth(i)
    .locator(":scope > details > summary, :scope > div")
    .first();
const meta = (page: Page, i: number) => header(page, i).locator(".font-mono").first();

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
  test("seis puestos en orden; cinco expandibles y el último compacto", async ({ page }) => {
    await page.goto("/");
    await expect(jobs(page)).toHaveCount(JOBS.length);
    const titles = await jobs(page)
      .locator("h3")
      .evaluateAll((els) => els.map((el) => (el.textContent ?? "").trim()));
    for (const [i, company] of JOBS.entries()) {
      expect(titles[i], `puesto ${i}`).toContain(company);
    }
    for (let i = 0; i < EXPANDABLE; i++) {
      await expect(details(page, i), `${JOBS[i]}: es expandible`).toHaveCount(1);
    }
    await expect(details(page, EXPANDABLE), "BIZZPERU no lleva details").toHaveCount(0);
  });

  test("cada meta declara periodo y tipo de vínculo", async ({ page }) => {
    await page.goto("/");
    for (const [i, company] of JOBS.entries()) {
      const text = (await meta(page, i).textContent())?.trim() ?? "";
      expect(text, `${company}: meta no vacía`).not.toBe("");
      // La meta es PERIODO · TIPO · UBICACIÓN: al menos tres segmentos, y el
      // del medio es el tipo de vínculo, que no puede venir vacío.
      const parts = text.split("·").map((p) => p.trim());
      expect(parts.length, `${company}: segmentos de la meta (${text})`).toBeGreaterThanOrEqual(3);
      expect(parts[1], `${company}: tipo de vínculo`).not.toBe("");
    }
  });

  test("la etiqueta de grupo va fuera de la lista y precede a su puesto", async ({ page }) => {
    await page.goto("/");
    const label = page.locator(`${EXPERIENCE} p`, { hasText: /antes de 2022/i }).first();
    await expect(label, "el grupo antes de 2022 está declarado").toHaveCount(1);
    // Dentro de un <li> el lector de pantalla lo anunciaría como parte del
    // puesto, y la etiqueta divide la trayectoria, no describe a BIZZPERU.
    expect(
      await label.evaluate((el) => !!el.closest("li")),
      "la etiqueta no puede vivir dentro de un li",
    ).toBe(false);
    expect(
      await label.evaluate((el) => el.nextElementSibling?.tagName),
      "la etiqueta precede a la lista de su grupo",
    ).toBe("OL");
  });

  // La jerarquía de la línea de impacto se lleva por peso y color, no por
  // tamaño: a 390 un 18/17 no se distinguía (hallazgo medio del QA de la
  // ronda 2). Ahora es 17 en peso 500 frente a 15 en text-secondary, y eso
  // vale igual en móvil que en escritorio. El CAMBIO #7 mueve el impacto de
  // un `p` a un `span` dentro del `summary`, pero el tratamiento no cambia.
  for (const width of [390, 1280]) {
    test(`en ${width} la línea de impacto de cada puesto destaca por peso y color`, async ({
      page,
    }) => {
      await page.setViewportSize({ width, height: 900 });
      await page.goto("/");
      const secondary = toRgb(await token(page, "--color-text-secondary"));
      for (const [i, company] of JOBS.entries()) {
        const impact = header(page, i).locator("h3 ~ *").first();
        const got = await impact.evaluate((el) => {
          const s = getComputedStyle(el);
          return { size: s.fontSize, weight: s.fontWeight, color: s.color };
        });
        expect(got.size, `${company}: tamaño del impacto`).toBe("17px");
        expect(got.weight, `${company}: peso del impacto`).toBe("500");
        expect(got.color, `${company}: color del impacto`).not.toBe(secondary);
      }
    });
  }

  test("el cuerpo abierto va un escalón por debajo, en 15 px", async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.goto("/");
    // El TagList de TECNOLOGÍAS es metadata (12.5) por diseño: la prosa del
    // cuerpo es la que va en 15.
    const sizes = await details(page, 0)
      .locator("dd p:not(.font-mono), dd li")
      .evaluateAll((els) => els.map((el) => getComputedStyle(el).fontSize));
    expect(sizes.length, "el cuerpo tiene prosa").toBeGreaterThan(0);
    for (const s of sizes) expect(s, "tamaño de la prosa del cuerpo").toBe("15px");
  });
});

test.describe("accordion", () => {
  test("el primero abre por defecto, el resto cerrados, y no es exclusivo", async ({ page }) => {
    await page.goto("/");
    expect(await details(page, 0).evaluate((el: HTMLDetailsElement) => el.open)).toBe(true);
    for (let i = 1; i < EXPANDABLE; i++) {
      expect(
        await details(page, i).evaluate((el: HTMLDetailsElement) => el.open),
        `${JOBS[i]}: cerrado de inicio`,
      ).toBe(false);
    }
    await header(page, 1).click();
    expect(
      await details(page, 1).evaluate((el: HTMLDetailsElement) => el.open),
      "el segundo abre",
    ).toBe(true);
    expect(
      await details(page, 0).evaluate((el: HTMLDetailsElement) => el.open),
      "el primero sigue abierto: el accordion no es exclusivo",
    ).toBe(true);
  });

  test("cada puesto expandible declara las cuatro etiquetas con contenido", async ({ page }) => {
    await page.goto("/");
    for (let i = 0; i < EXPANDABLE; i++) {
      await details(page, i).evaluate((el: HTMLDetailsElement) => (el.open = true));
      const labels = await details(page, i)
        .locator("dt")
        .evaluateAll((els) => els.map((el) => (el.textContent ?? "").trim().toUpperCase()));
      expect(labels, `${JOBS[i]}: etiquetas del cuerpo`).toEqual(BODY_LABELS);
      const values = await details(page, i)
        .locator("dd")
        .evaluateAll((els) => els.map((el) => (el.textContent ?? "").trim()));
      for (const [j, v] of values.entries()) {
        expect(v, `${JOBS[i]}: ${BODY_LABELS[j]} no vacío`).not.toBe("");
      }
      await expect(
        details(page, i).locator("dd ol"),
        `${JOBS[i]}: el alcance es una lista ordenada`,
      ).toHaveCount(1);
    }
  });

  test("el indicador es + cerrado y − abierto", async ({ page }) => {
    await page.goto("/");
    const visible = (i: number) =>
      header(page, i).evaluate((el) =>
        // El indicador conmuta ocultando uno de los dos signos con
        // group-open: se lee el que sigue renderizado, no el DOM entero.
        [...el.querySelectorAll("span")]
          .filter((n) => getComputedStyle(n).display !== "none")
          .map((n) => (n.textContent ?? "").trim())
          .filter((t) => t === "+" || t === "−")
          .join(""),
      );
    expect(await visible(0), "el abierto muestra −").toBe("−");
    expect(await visible(1), "el cerrado muestra +").toBe("+");
    await header(page, 1).click();
    expect(await visible(1), "tras abrir, muestra −").toBe("−");
  });

  test("en 390 el summary mide al menos 44 px de alto", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 800 });
    await page.goto("/");
    for (let i = 0; i < EXPANDABLE; i++) {
      const b = await box(header(page, i));
      expect(b.height, `${JOBS[i]}: alto del summary`).toBeGreaterThanOrEqual(44);
    }
  });

  test("se alcanza y se acciona con teclado, y el foco es visible", async ({ page }) => {
    await page.goto("/");
    const second = details(page, 1).locator("summary");
    await second.focus();
    await expect(second, "el summary recibe foco").toBeFocused();
    const outline = await second.evaluate((el) => {
      const s = getComputedStyle(el);
      return { width: s.outlineWidth, style: s.outlineStyle };
    });
    expect(outline.style, "estilo del foco").not.toBe("none");
    expect(parseFloat(outline.width), "grosor del foco").toBeGreaterThanOrEqual(2);

    await page.keyboard.press("Enter");
    expect(
      await details(page, 1).evaluate((el: HTMLDetailsElement) => el.open),
      "Enter abre",
    ).toBe(true);
    await page.keyboard.press("Enter");
    expect(
      await details(page, 1).evaluate((el: HTMLDetailsElement) => el.open),
      "Enter cierra",
    ).toBe(false);
    await page.keyboard.press("Space");
    expect(
      await details(page, 1).evaluate((el: HTMLDetailsElement) => el.open),
      "Espacio abre",
    ).toBe(true);
  });

  test("el resultado de Junto AI enlaza al caso de estudio", async ({ page }) => {
    await page.goto("/");
    const link = details(page, 0).locator('a[href="/proyectos/notable-learning"]');
    await expect(link, "enlace al caso").toHaveCount(1);
  });

  test.describe("bajo reduce el cuerpo no anima", () => {
    test.use({ contextOptions: { reducedMotion: "reduce" } });
    test("la transición del cuerpo dura 0s", async ({ page }) => {
      await page.goto("/");
      const durations = await details(page, 0)
        .locator("dl")
        .evaluate((el) => getComputedStyle(el).transitionDuration);
      const animating = durations.split(",").filter((d) => d.trim() !== "0s");
      expect(animating, `duraciones distintas de 0s: ${animating.join(" | ")}`).toEqual([]);
    });
  });
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

      for (const [i, company] of JOBS.entries()) {
        const dot = await meta(page, i).evaluate((el) => {
          const s = getComputedStyle(el, "::before");
          return { content: s.content, w: s.width, h: s.height };
        });
        expect(dot.content, `${company}: el punto existe`).not.toBe("none");
        expect(dot.w, `${company}: ancho del punto`).toBe("7px");
        expect(dot.h, `${company}: alto del punto`).toBe("7px");
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
    for (const [i, company] of JOBS.entries()) {
      const content = await meta(page, i).evaluate(
        (el) => getComputedStyle(el, "::before").content,
      );
      expect(content, `${company}: el punto no se pinta`).toBe("none");
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
    // Con todos los ítems abiertos: es el estado más ancho posible.
    await page.locator(`${EXPERIENCE} details`).evaluateAll((els) =>
      els.forEach((el) => ((el as HTMLDetailsElement).open = true)),
    );
    expect(await overflow(page), "overflow del documento").toBe(0);
    for (const sel of [EXPERIENCE, CONTACT]) {
      const inner = await page.locator(sel).evaluate((el) => el.scrollWidth - el.clientWidth);
      expect(inner, `overflow dentro de ${sel}`).toBeLessThanOrEqual(0);
    }
  });
}

test.describe("Studio Equilibrio ya no se presenta como demo sin cliente", () => {
  for (const path of ["/", "/proyectos/studio-equilibrio"]) {
    test(`ni "sin cliente" ni "no client" en ${path}`, async ({ page }) => {
      await page.goto(path);
      const text = await page.evaluate(() => document.body.innerText.toLowerCase());
      expect(text, "sin cliente").not.toContain("sin cliente");
      expect(text, "no client").not.toContain("no client");
    });
  }
  for (const path of ["/en", "/en/projects/studio-equilibrio"]) {
    test(`ni "sin cliente" ni "no client" en ${path}`, async ({ page }) => {
      await page.goto(path);
      const text = await page.evaluate(() => document.body.innerText.toLowerCase());
      expect(text, "sin cliente").not.toContain("sin cliente");
      expect(text, "no client").not.toContain("no client");
    });
  }
});

test.describe("la home en inglés no arrastra español", () => {
  test("los cuatro H2 están traducidos", async ({ page }) => {
    await page.goto("/en");
    await expect(page.locator("main h2")).toHaveText(EN_HEADINGS);
  });

  test("las etiquetas del cuerpo están en inglés", async ({ page }) => {
    await page.goto("/en");
    for (let i = 0; i < EXPANDABLE; i++) {
      await details(page, i).evaluate((el: HTMLDetailsElement) => (el.open = true));
      const labels = await details(page, i)
        .locator("dt")
        .evaluateAll((els) => els.map((el) => (el.textContent ?? "").trim().toUpperCase()));
      expect(labels, `puesto ${i}: etiquetas en inglés`).toEqual(BODY_LABELS_EN);
    }
  });

  test("ni el texto visible ni los nombres accesibles llevan cadenas en español", async ({
    page,
  }) => {
    await page.goto("/en");
    // Con todo abierto: el cuerpo cerrado no aparece en innerText.
    await page.locator(`${EXPERIENCE} details`).evaluateAll((els) =>
      els.forEach((el) => ((el as HTMLDetailsElement).open = true)),
    );
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
      "Leer el caso de estudio",
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
      "CONTEXTO",
      "ALCANCE",
      "RESULTADO",
      "TECNOLOGÍAS",
      "Antes de 2022",
      "Contrato por proyecto",
      "Empleo",
    ];
    for (const m of MARKERS) {
      expect(haystack, `cadena en español: ${m}`).not.toContain(m);
    }
    // Red de seguridad ortográfica para lo que la lista no anticipe.
    const spanish = haystack.match(/[¿¡]|\b(cómo|qué|más|también|según|aún|desde|para|entre)\b/giu);
    expect(spanish, `palabras en español: ${spanish?.join(", ")}`).toBeNull();
  });
});
