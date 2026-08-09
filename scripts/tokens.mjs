/**
 * Tokens de color compartidos para scripts. La fuente de verdad es
 * src/app/globals.css (@theme): este módulo la parsea en vez de duplicar
 * hexes — el "tercer consumidor" que pedían los ponytails de og.mjs e
 * icons.mjs ya existía.
 *
 * Formato esperado: `--color-x: light-dark(#hex, #hex)`. Si el CSS cambia
 * de forma, esto falla ruidosamente en vez de generar assets con colores
 * viejos.
 */
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const css = readFileSync(
  join(dirname(fileURLToPath(import.meta.url)), "..", "src/app/globals.css"),
  "utf8",
);

const RE = /--color-([\w-]+):\s*light-dark\((#[0-9a-fA-F]{6}),\s*(#[0-9a-fA-F]{6})\)/g;

const light = {};
const dark = {};
for (const [, name, l, d] of css.matchAll(RE)) {
  // La primera aparición gana: .inverted redeclara los mismos tokens
  // espejados y no debe pisar la paleta base de @theme.
  if (name in light) continue;
  light[name] = l;
  dark[name] = d;
}

for (const name of ["paper", "ink", "muted", "line", "copper", "copper-surface"]) {
  if (!light[name] || !dark[name]) {
    throw new Error(`token --color-${name} no encontrado en globals.css`);
  }
}

export const tokens = { light, dark };
