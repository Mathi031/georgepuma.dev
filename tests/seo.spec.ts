import { readdir } from "node:fs/promises";
import { basename, dirname, join } from "node:path";
import { expect, test } from "@playwright/test";
import { enContentReady, routing } from "@/i18n/routing";
import { indexedRoutes, ROUTES_WITH_OWN_OG } from "@/content/site";
import type { InternalRoute, Locale } from "@/content/site";

/**
 * Contrato de metadatos del sitio. Las rutas salen del contenido, igual que el
 * sitemap, así que un caso nuevo queda cubierto sin tocar este archivo.
 */

const base = "https://georgepuma.dev";
const locales = routing.locales;

/**
 * Equivalente de getPathname para el runner: next-intl/navigation solo se
 * resuelve dentro de Next. Lee la misma tabla `pathnames` del routing.
 */
const path = (locale: Locale, href: InternalRoute) => {
  const entry = routing.pathnames[href];
  const localized = typeof entry === "string" ? entry : entry[locale];
  // Solo vale para "as-needed". Si el modo cambia, falla aquí en vez de en
  // cada aserción contra URLs que ya no existen.
  if (routing.localePrefix !== "as-needed") {
    throw new Error(`localePrefix "${routing.localePrefix}" no soportado por este spec`);
  }
  if (locale === routing.defaultLocale) return localized;
  return localized === "/" ? `/${locale}` : `/${locale}${localized}`;
};

/** El script de Vercel Analytics no existe fuera de Vercel: 404 esperado. */
const IGNORED_REQUEST = /_vercel\/insights/;

/** Next sirve la home sin barra final; es la misma URL, se comparan normalizadas. */
const sameUrl = (a: string | null | undefined, b: string) =>
  a?.replace(/\/$/, "") === b.replace(/\/$/, "");

type Captured = {
  lang: string;
  title: string;
  description: string | null;
  canonical: string | null;
  hreflang: Record<string, string>;
  og: Record<string, string>;
  twitter: Record<string, string>;
  robots: string | null;
  ldjson: string[];
};

async function capture(page: import("@playwright/test").Page): Promise<Captured> {
  return page.evaluate(() => {
    const all = (sel: string) => Array.from(document.querySelectorAll(sel));
    const attr = (el: Element, name: string) => el.getAttribute(name) ?? "";
    const pairs = (sel: string, key: string) =>
      Object.fromEntries(all(sel).map((el) => [attr(el, key), attr(el, "content")]));
    return {
      lang: document.documentElement.lang,
      title: document.title,
      description:
        document.querySelector('meta[name="description"]')?.getAttribute("content") ?? null,
      canonical: document.querySelector('link[rel="canonical"]')?.getAttribute("href") ?? null,
      hreflang: Object.fromEntries(
        all('link[rel="alternate"][hreflang]').map((el) => [
          attr(el, "hreflang"),
          attr(el, "href"),
        ]),
      ),
      og: pairs('meta[property^="og:"]', "property"),
      twitter: pairs('meta[name^="twitter:"]', "name"),
      robots: document.querySelector('meta[name="robots"]')?.getAttribute("content") ?? null,
      ldjson: all('script[type="application/ld+json"]').map((el) => el.textContent ?? ""),
    };
  });
}

const OG_LOCALE: Record<Locale, string> = { es: "es_PE", en: "en_US" };

for (const locale of locales) {
  for (const href of indexedRoutes) {
    const route = path(locale, href);
    const isHome = href === "/";

    test(`metadatos correctos en ${route}`, async ({ page }) => {
      const consoleErrors: string[] = [];
      await page.addInitScript(() => {
        (window as unknown as { __csp: string[] }).__csp = [];
        document.addEventListener("securitypolicyviolation", (e) => {
          (window as unknown as { __csp: string[] }).__csp.push(
            `${e.violatedDirective}: ${e.blockedURI}`,
          );
        });
      });
      // El mensaje de consola no incluye la URL del recurso, así que se
      // filtra la petición y se descuenta del total de errores.
      let ignoredFailures = 0;
      page.on("response", (r) => {
        if (r.status() >= 400 && IGNORED_REQUEST.test(r.url())) ignoredFailures += 1;
      });
      page.on("console", (m) => {
        if (m.type() === "error") consoleErrors.push(m.text());
      });

      await page.goto(route);
      const m = await capture(page);

      // lang es el idioma del texto, no el de la ruta: /en sirve español.
      expect(m.lang).toBe(enContentReady ? locale : "es");
      expect(m.title.trim()).not.toBe("");
      expect(m.description?.trim()).toBeTruthy();

      expect(sameUrl(m.canonical, base + route), `canonical de ${route}`).toBe(true);

      expect(sameUrl(m.hreflang.es, base + path("es", href)), "hreflang es").toBe(true);
      expect(sameUrl(m.hreflang["x-default"], base + path("es", href)), "x-default").toBe(true);
      if (enContentReady) {
        expect(sameUrl(m.hreflang.en, base + path("en", href)), "hreflang en").toBe(true);
      } else {
        expect(m.hreflang.en).toBeUndefined();
      }

      expect(m.og["og:locale"]).toBe(OG_LOCALE[locale]);
      expect(m.twitter["twitter:title"]).toBe(m.og["og:title"]);
      expect(m.twitter["twitter:description"]).toBe(m.og["og:description"]);

      // /en no se indexa mientras su contenido sea el español.
      if (locale === "en" && !enContentReady) {
        expect(m.robots).toMatch(/noindex/);
        expect(m.robots).toMatch(/(?<!no)follow/);
      } else {
        expect(m.robots ?? "").not.toMatch(/noindex/);
      }

      expect(m.ldjson).toHaveLength(1);
      const data = JSON.parse(m.ldjson[0]!) as { "@type": string; inLanguage: string };
      expect(data["@type"]).toBe(isHome ? "Person" : "TechArticle");
      expect(data.inLanguage).toBe(locale);

      const csp = await page.evaluate(() => (window as unknown as { __csp: string[] }).__csp);
      expect(csp, "violaciones de CSP").toEqual([]);
      expect(consoleErrors, "errores de consola").toHaveLength(ignoredFailures);
    });
  }
}

// Decisión del usuario en el cambio #5: la antigüedad se dice en años, no con
// el año de inicio. "Cinco años" / "five years" se conservan a propósito, así
// que el test fija esa forma en vez de prohibirla: si alguien vuelve a
// sustituirla por "Desde 2022" / "since 2022", esto falla.
test("la home declara la antigüedad en años, en la meta y en el hero", async ({ page }) => {
  const EXPECTED: Record<string, RegExp> = {
    es: /cinco años/i,
    en: /five years/i,
  };
  // El año de inicio obliga al lector a hacer la resta; el número se lee de
  // golpe. La forma es la misma en la meta y en el texto visible: un solo dato
  // no puede decirse de dos maneras en la misma página.
  const START_YEAR = /desde 2022|since 2022/i;

  for (const locale of locales) {
    await page.goto(path(locale, "/"));
    const { description } = await capture(page);
    const d = description ?? "";
    expect(d, `descripción de ${locale}`).toMatch(EXPECTED[locale]!);
    expect(d, `descripción de ${locale} no usa el año de inicio`).not.toMatch(START_YEAR);
    // Límite de corte de Google: por encima de 155 la descripción se trunca.
    expect(d.length, `largo de la descripción de ${locale}`).toBeLessThan(155);

    // El lead del hero es el primer párrafo tras el h1.
    const lead = (await page.locator("main h1 + p").first().innerText()).trim();
    expect(lead, `lead de ${locale}`).toMatch(EXPECTED[locale]!);
    expect(lead, `lead de ${locale} no usa el año de inicio`).not.toMatch(START_YEAR);
  }
});

test("cada ruta se describe distinto en cada idioma", async ({ page }) => {
  for (const href of indexedRoutes) {
    const captured: Captured[] = [];
    for (const locale of locales) {
      await page.goto(path(locale, href));
      captured.push(await capture(page));
    }
    const [es, en] = captured as [Captured, Captured];

    expect(en.description, `description de ${href}`).not.toBe(es.description);

    // El título de la home no se traduce (nombre, rol y tecnologías son los
    // mismos); en los casos sí cambia, porque el sufijo cambia.
    if (href !== "/") {
      expect(en.title, `title de ${href}`).not.toBe(es.title);
    }
  }
});

test("cada caso tiene un og:title propio, distinto del de la home", async ({ page }) => {
  await page.goto("/");
  const home = (await capture(page)).og["og:title"];
  for (const href of indexedRoutes.filter((r) => r !== "/")) {
    await page.goto(path("es", href));
    expect((await capture(page)).og["og:title"], `og:title de ${href}`).not.toBe(home);
  }
});

test("el sitemap lista todas las rutas ES y ninguna EN", async ({ request }) => {
  const xml = await (await request.get("/sitemap.xml")).text();
  const trim = (u: string) => u.replace(/\/$/, "");
  const locs = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => trim(m[1]!));

  const expected = indexedRoutes.map((href) => trim(base + path("es", href)));
  expect(new Set(locs)).toEqual(new Set(enContentReady
    ? [...expected, ...indexedRoutes.map((href) => trim(base + path("en", href)))]
    : expected));

  if (!enContentReady) {
    expect(xml).not.toContain('hreflang="en"');
  }
  expect(locs.some((l) => l.includes("/sistema"))).toBe(false);
});

test("la lista de rutas con OG propia coincide con los archivos", async () => {
  // Sin este test, un caso nuevo con su opengraph-image.tsx anunciaría en
  // silencio la imagen de la home.
  // Playwright corre desde la raíz del proyecto (testDir "./tests").
  const appDir = join(process.cwd(), "src/app/[locale]");
  const onDisk = (await readdir(appDir, { recursive: true }))
    .filter((f) => basename(String(f)) === "opengraph-image.tsx")
    .map((f) => {
      const dir = dirname(String(f)).replace(/\\/g, "/");
      return dir === "." ? "/" : `/${dir}`;
    });

  expect(new Set(onDisk)).toEqual(new Set(ROUTES_WITH_OWN_OG));
});

test("toda og:image anunciada existe", async ({ page, request }) => {
  for (const locale of locales) {
    for (const href of indexedRoutes) {
      await page.goto(path(locale, href));
      const url = (await capture(page)).og["og:image"];
      expect(url, `og:image de ${path(locale, href)}`).toBeTruthy();

      // Se pide la ruta relativa: la absoluta apunta al dominio de producción.
      const res = await request.get(new URL(url!).pathname);
      expect(res.status(), `og:image de ${path(locale, href)} (${url})`).toBe(200);
      expect(res.headers()["content-type"]).toContain("image/png");
    }
  }
});

test("ningún enlace interno saca al visitante de su idioma", async ({ page }) => {
  // Un href literal a "/" o "/#ancla" en una página /en manda a la home
  // española.
  for (const href of indexedRoutes.filter((r) => r !== "/")) {
    const route = path("en", href);
    await page.goto(route);

    const hrefs = await page.evaluate(() =>
      Array.from(document.querySelectorAll("a[href]"))
        // El selector de idioma apunta al otro locale a propósito y lo declara
        // con hrefLang; queda fuera. También los assets, que no tienen idioma.
        .filter((a) => !a.hasAttribute("hrefLang"))
        .map((a) => a.getAttribute("href") ?? "")
        .filter((h) => h.startsWith("/") && !h.startsWith("/_next/") && !/\.\w+(\?|$)/.test(h)),
    );

    expect(hrefs.length, `${route} no tiene enlaces internos`).toBeGreaterThan(0);
    for (const h of hrefs) {
      expect(h, `enlace de ${route} fuera del locale`).toMatch(/^\/en(\/|#|$)/);
    }
  }
});

test("la referencia del design system no se indexa ni se rastrea", async ({ page, request }) => {
  await page.goto("/sistema");
  expect((await capture(page)).robots).toMatch(/noindex/);

  const robotsTxt = await (await request.get("/robots.txt")).text();
  expect(robotsTxt).toMatch(/Disallow:\s*\/sistema/);
  expect(robotsTxt).toContain(`${base}/sitemap.xml`);
});
