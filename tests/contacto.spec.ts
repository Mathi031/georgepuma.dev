import { expect, test, type Page } from "@playwright/test";

/**
 * Sección Contacto y la línea "Pendiente" de los mini-casos (CAMBIO #8).
 * Los valores esperados van escritos aquí, no importados de src/content: el
 * test afirma lo que se aprobó, no lo que el contenido diga hoy.
 *
 * Contrato de marcado que asume:
 *   - #contacto lleva, en orden: la meta numerada del SectionHeading, el h2,
 *     el párrafo de cuerpo, la línea de disponibilidad (un p.font-mono con el
 *     badge y la meta), el correo como enlace mailto y la fila de enlaces
 *     secundarios;
 *   - la meta de disponibilidad repite literalmente la del hero, que es el
 *     primer p.font-mono de la primera sección de main;
 *   - el cierre de un mini-caso es section[aria-labelledby=cierre|closing]; si
 *     el proyecto declara `pending`, ahí aparece un bloque con regla superior,
 *     la etiqueta en mono y el texto en body-small.
 */

const CONTACT = "#contacto";
const EMAIL = "george@georgepuma.dev";
const WIDTHS = [360, 390, 768, 1280, 1680];
const MIN_TARGET = 44;
/** nbsp a ambos lados del separador y U+2011 en GMT‑5, como el resto del sitio. */
const NB = " ";
const STATUS = {
  es: `Full stack${NB}·${NB}contrato o indefinido${NB}·${NB}remoto${NB}·${NB}Perú${NB}·${NB}GMT‑5`,
  en: `Full stack${NB}·${NB}contract or full-time${NB}·${NB}remote${NB}·${NB}Peru${NB}·${NB}GMT‑5`,
};
const BADGE = { es: "DISPONIBLE AHORA", en: "AVAILABLE NOW" };
const BODY = {
  es:
    "Busco roles full stack o frontend, remotos, por contrato o indefinidos, en equipos " +
    "que traten la calidad como parte del producto. Inglés B2 (EF SET). GMT‑5: horario " +
    "completo con EE.UU. y dos o tres horas de solapamiento con Europa. Si crees que " +
    "encajo en tu equipo, escríbeme — respondo siempre.",
  en:
    "I'm looking for full stack or frontend roles, remote, contract or full-time, on teams " +
    "that treat quality as part of the product. English B2 (EF SET). GMT‑5: full overlap " +
    "with the US and two to three hours with Europe. If you think I'd fit your team, get " +
    "in touch — I always reply.",
};
const SECONDARY = {
  es: [
    ["https://www.linkedin.com/in/mathi031/", `LinkedIn${NB}↗`],
    ["https://github.com/Mathi031", `GitHub${NB}↗`],
    ["/cv-george-puma.pdf", `CV en PDF${NB}↓`],
  ],
  en: [
    ["https://www.linkedin.com/in/mathi031/", `LinkedIn${NB}↗`],
    ["https://github.com/Mathi031", `GitHub${NB}↗`],
    ["/cv-george-puma-en.pdf", `Résumé (PDF)${NB}↓`],
  ],
} as const;

const home = { es: "/", en: "/en" } as const;
const locales = ["es", "en"] as const;
type Locale = (typeof locales)[number];

/** Meta del hero: el primer p.font-mono de la primera sección de main. */
const heroMeta = (page: Page) => page.locator("main section p.font-mono").first();
/** Línea de disponibilidad: el segundo p.font-mono de Contacto (el primero es "04 · …"). */
const availability = (page: Page) => page.locator(`${CONTACT} p.font-mono`).nth(1);
const emailLink = (page: Page) => page.locator(`${CONTACT} a[href="mailto:${EMAIL}"]`);

async function overflow(page: Page) {
  return page.evaluate(
    () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
  );
}

test.describe("contacto", () => {
  for (const locale of locales) {
    test(`el párrafo dice el texto exacto en ${locale}`, async ({ page }) => {
      await page.goto(home[locale]);
      const p = page.locator(`${CONTACT} p.text-body`).first();
      expect((await p.innerText()).replace(/\s+/g, " ").trim()).toBe(
        BODY[locale].replace(/\s+/g, " ").trim(),
      );
    });

    test(`el badge de disponibilidad está en contacto en ${locale}`, async ({ page }) => {
      await page.goto(home[locale]);
      await expect(
        page.locator(CONTACT).getByText(BADGE[locale], { exact: true }),
      ).toBeVisible();
    });

    // La meta se lee del DOM en los dos sitios: si alguien duplica la cadena
    // en vez de reutilizar hero.status, las dos dejan de coincidir.
    test(`la meta de contacto es idéntica a la del hero en ${locale}`, async ({ page }) => {
      await page.goto(home[locale]);
      // innerText devuelve el texto ya transformado por `uppercase`, así que
      // la comparación va en mayúsculas en los dos lados.
      const hero = (await heroMeta(page).innerText()).trim();
      expect(hero, "status del hero").toBe(STATUS[locale].toUpperCase());
      const line = (await availability(page).innerText()).trim();
      expect(line, "la línea de contacto contiene la meta del hero").toContain(hero);
      expect(line, "la línea de contacto abre con el badge").toContain(BADGE[locale]);
    });

    test(`los tres enlaces secundarios apuntan a su destino en ${locale}`, async ({ page }) => {
      await page.goto(home[locale]);
      for (const [href, label] of SECONDARY[locale]) {
        const link = page.locator(`${CONTACT} a[href="${href}"]`);
        await expect(link, `enlace ${href}`).toHaveCount(1);
        expect((await link.innerText()).trim(), `texto de ${href}`).toBe(label);
      }
      const cv = page.locator(`${CONTACT} a[href^="/cv-"]`);
      await expect(cv).toHaveAttribute("download", "");
    });

    test(`ni el hero ni contacto nombran la ciudad en ${locale}`, async ({ page }) => {
      await page.goto(home[locale]);
      const hero = await page.locator("main section").first().innerText();
      const contact = await page.locator(CONTACT).innerText();
      expect(hero, "hero sin ciudad").not.toContain("Arequipa");
      expect(contact, "contacto sin ciudad").not.toContain("Arequipa");
    });
  }

  // El hero y Contacto enlazan al mismo PDF: si los dos anuncian el mismo
  // nombre, quien navegue por lista de enlaces ve la entrada repetida.
  for (const locale of locales) {
    test(`ningún enlace de la home repite nombre accesible en ${locale}`, async ({ page }) => {
      await page.goto(home[locale]);
      const names = await page
        .locator("main a")
        .evaluateAll((els) =>
          els.map((el) =>
            ((el.getAttribute("aria-label") ?? el.textContent) ?? "").trim().replace(/\s+/g, " "),
          ),
        );
      const dup = [...new Set(names.filter((n, i) => names.indexOf(n) !== i))];
      expect(dup, `nombres repetidos: ${dup.join(", ")}`).toEqual([]);
    });
  }

  test("los enlaces secundarios van agrupados en un nav etiquetado", async ({ page }) => {
    await page.goto("/");
    const nav = page.locator(`${CONTACT} nav[aria-label]`);
    await expect(nav).toHaveCount(1);
    await expect(nav.locator("a")).toHaveCount(3);
  });

  test("el correo es un mailto con el tamaño y el target del contrato", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 900 });
    await page.goto("/");
    const link = emailLink(page);
    await expect(link).toHaveCount(1);
    await expect(link).toHaveText(EMAIL);

    const b = await link.boundingBox();
    expect(b, "el correo tiene caja").not.toBeNull();
    expect(b!.height, `alto del correo a 390: ${b!.height}`).toBeGreaterThanOrEqual(MIN_TARGET);

    const mobile = await link.evaluate((el) => getComputedStyle(el).fontSize);
    expect(mobile, "tamaño del correo a 390").toBe("24px");

    await page.setViewportSize({ width: 1280, height: 900 });
    const desktop = await link.evaluate((el) => ({
      size: getComputedStyle(el).fontSize,
      weight: getComputedStyle(el).fontWeight,
      family: getComputedStyle(el).fontFamily,
    }));
    expect(desktop.size, "tamaño del correo a 1280").toBe("32px");
    expect(desktop.weight, "peso del correo").toBe("600");
    expect(desktop.family, "familia del correo").toContain("Hanken");
  });
});

test.describe("línea pendiente de los mini-casos", () => {
  const PENDING = {
    "/proyectos/cleo-spa": {
      label: "Pendiente",
      text:
        "Las migraciones están versionadas y son idempotentes, pero todavía se aplican con " +
        "una herramienta externa al repositorio: un entorno limpio no se levanta desde cero. " +
        "Es lo primero que cerraría antes de que el proyecto cambie de manos.",
    },
    "/en/projects/cleo-spa": {
      label: "Still pending",
      text:
        "The migrations are versioned and idempotent, but they're still applied with a tool " +
        "outside the repository: a clean environment can't be spun up from scratch. It's the " +
        "first thing I'd close before the project changes hands.",
    },
    "/proyectos/ronatello": {
      label: "Pendiente",
      text:
        "La regla más delicada del sistema — que una reserva vencida devuelva su cupo — tiene " +
        "un test en pgTAP que la cubre entera, y el CI todavía no lo ejecuta: un verde que no " +
        "comprueba lo que más importa. Es un paso de workflow, y es el siguiente.",
    },
    "/en/projects/ronatello": {
      label: "Still pending",
      text:
        "The system's most delicate rule — an expired booking giving its capacity back — has a " +
        "pgTAP test that covers it end to end, and CI doesn't run it yet: a green build that " +
        "doesn't check what matters most. It's one workflow step, and it's next.",
    },
  };

  for (const [path, expected] of Object.entries(PENDING)) {
    test(`${path} muestra la etiqueta y el texto`, async ({ page }) => {
      await page.goto(path);
      const close = page.locator("section[aria-labelledby=cierre], section[aria-labelledby=closing]");
      const text = (await close.innerText()).replace(/\s+/g, " ");
      expect(text, "etiqueta").toContain(expected.label.toUpperCase());
      expect(text, "texto pendiente").toContain(expected.text.replace(/\s+/g, " "));
    });
  }

  for (const path of ["/proyectos/studio-equilibrio", "/en/projects/studio-equilibrio"]) {
    test(`${path} no muestra ni etiqueta ni regla`, async ({ page }) => {
      await page.goto(path);
      const close = page.locator("section[aria-labelledby=cierre], section[aria-labelledby=closing]");
      const text = await close.innerText();
      expect(text, "sin etiqueta es").not.toContain("PENDIENTE");
      expect(text, "sin etiqueta en").not.toContain("STILL PENDING");
      await expect(close.locator("div.border-t"), "sin la regla del bloque").toHaveCount(0);
    });
  }
});

for (const width of WIDTHS) {
  for (const path of [
    "/",
    "/proyectos/cleo-spa",
    "/proyectos/ronatello",
    "/proyectos/studio-equilibrio",
  ]) {
    test(`sin overflow en ${path} a ${width}`, async ({ page }) => {
      await page.setViewportSize({ width, height: 900 });
      await page.goto(path);
      expect(await overflow(page), `overflow del documento en ${path}`).toBe(0);
    });
  }
}
