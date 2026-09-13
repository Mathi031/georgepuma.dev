import { expect, test } from "@playwright/test";

/**
 * Cabeceras y superficies de ataque que el sitio cierra a propósito. La CSP
 * se compara contra un texto fijo: si la migración del middleware a proxy, o
 * cualquier otro cambio, la altera en una sola directiva, falla aquí.
 */

/** btoa(crypto.randomUUID()): 36 bytes de UUID dan siempre 48 caracteres. */
const NONCE = /^[A-Za-z0-9+/]{48}$/;

/**
 * La CSP servida en producción. El proxy añade upgrade-insecure-requests solo
 * con VERCEL definido; el servidor de pruebas hereda el entorno del runner,
 * así que se decide con la misma variable.
 */
const CSP = [
  "default-src 'self'",
  "script-src 'nonce-{NONCE}' 'strict-dynamic' 'self' https://va.vercel-scripts.com",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data:",
  "font-src 'self'",
  "connect-src 'self' https://va.vercel-scripts.com",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
  ...(process.env.VERCEL ? ["upgrade-insecure-requests"] : []),
].join("; ");

const ROUTES = ["/", "/en", "/proyectos/cleo-spa", "/en/projects/ronatello"];

for (const route of ROUTES) {
  test(`CSP exacta y nonce fresco en ${route}`, async ({ request }) => {
    const first = (await request.get(route)).headers()["content-security-policy"] ?? "";
    const second = (await request.get(route)).headers()["content-security-policy"] ?? "";

    const nonce = first.match(/'nonce-([^']+)'/)?.[1];
    expect(nonce, "nonce presente").toBeTruthy();
    expect(nonce).toMatch(NONCE);
    expect(first.replace(nonce!, "{NONCE}")).toBe(CSP);

    // Un nonce por petición: si se repite, alguien cacheó la respuesta.
    expect(second.match(/'nonce-([^']+)'/)?.[1]).not.toBe(nonce);
  });

  test(`el HTML de ${route} lleva el nonce de su propia CSP`, async ({ request }) => {
    const res = await request.get(route);
    const nonce = res.headers()["content-security-policy"]?.match(/'nonce-([^']+)'/)?.[1];
    const html = await res.text();
    expect(html).toContain(`nonce="${nonce}"`);
  });
}

// Decisión documentada en el matcher del proxy: /sistema queda fuera del
// routing de next-intl y, con él, de la CSP. Sin scripts propios y noindex.
test("/sistema se sirve sin CSP, a propósito", async ({ request }) => {
  const res = await request.get("/sistema");
  expect(res.status()).toBe(200);
  expect(res.headers()["content-security-policy"]).toBeUndefined();
});

test("/es redirige con 301 a la forma canónica sin prefijo", async ({ request }) => {
  for (const [from, to] of [
    ["/es", "/"],
    ["/es/proyectos/cleo-spa", "/proyectos/cleo-spa"],
  ]) {
    const res = await request.get(from!, { maxRedirects: 0 });
    expect(res.status(), from).toBe(301);
    expect(res.headers()["location"], from).toBe(to);
  }
});

// El sitio no usa next/image: el optimizador es superficie de ataque sin uso
// (dos RCE en el advisory de 16.x). Con images.unoptimized el endpoint no sirve.
test("el optimizador de imágenes está apagado", async ({ request }) => {
  const res = await request.get("/_next/image?url=/screenshots/cleo-spa-card.avif&w=640&q=75");
  expect(res.status()).not.toBe(200);
});
