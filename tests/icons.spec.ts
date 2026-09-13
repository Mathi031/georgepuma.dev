import { expect, test } from "@playwright/test";

/**
 * Contrato del set de iconos: todo lo que el <head> y el manifest referencian
 * existe y se sirve con su content-type, y el .ico lleva 16, 32 y 48. Si
 * scripts/icons.mjs deja de generar un tamaño, falla aquí y no en un
 * navegador viejo.
 */

const ICO_SIZES = ["16x16", "32x32", "48x48"];

/** Lee el directorio del .ico: cabecera de 6 bytes, entradas de 16, 0 = 256. */
const icoSizes = (buf: Buffer) => {
  const n = buf.readUInt16LE(4);
  return Array.from({ length: n }, (_, i) => {
    const w = buf[6 + i * 16] || 256;
    const h = buf[7 + i * 16] || 256;
    return `${w}x${h}`;
  });
};

test("iconos referenciados en el head y en el manifest", async ({ page, request }) => {
  await page.goto("/");
  const links = await page
    .locator('link[rel="icon"], link[rel="apple-touch-icon"], link[rel="manifest"]')
    .evaluateAll((els) => els.map((el) => (el as HTMLLinkElement).href));
  expect(links, "faltan iconos en el head").toHaveLength(4);

  const manifestHref = links.find((h) => h.includes("manifest"));
  expect(manifestHref).toBeDefined();
  const manifest = await request.get(manifestHref!);
  expect(manifest.headers()["content-type"]).toContain("application/manifest+json");
  const icons = ((await manifest.json()) as { icons: { src: string; sizes: string }[] }).icons;
  expect(icons.map((i) => i.sizes)).toEqual(["192x192", "512x512"]);

  const expected: Record<string, string> = {
    ".ico": "image/x-icon",
    ".svg": "image/svg+xml",
    ".png": "image/png",
  };
  for (const href of [...links.filter((h) => h !== manifestHref), ...icons.map((i) => i.src)]) {
    const res = await request.get(href);
    expect(res.status(), href).toBe(200);
    const ext = new URL(href, "http://localhost").pathname.match(/\.\w+$/)![0];
    expect(res.headers()["content-type"], href).toContain(expected[ext]);
    if (ext === ".ico") expect(icoSizes(await res.body())).toEqual(ICO_SIZES);
  }
});
