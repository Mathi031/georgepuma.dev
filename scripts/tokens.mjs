/**
 * Tokens de color compartidos para scripts. La fuente de verdad es
 * src/app/globals.css (@theme inline): este módulo la parsea en vez de
 * duplicar hexes.
 *
 * Formato esperado: `--color-x: #hex`. El sistema es light-only, así que ya no
 * hay light-dark() ni paleta oscura. Si el CSS cambia de forma, esto falla
 * ruidosamente en vez de generar assets con colores viejos.
 *
 * Ojo: este módulo no pasa por lint ni typecheck (allowJs: false) y el CI no
 * ejecuta `pnpm og` ni `pnpm icons`. Si cambias globals.css, ejecuta esos dos
 * scripts a mano antes de dar por buena la tanda.
 */
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const css = readFileSync(
  join(dirname(fileURLToPath(import.meta.url)), "..", "src/app/globals.css"),
  "utf8",
);

// Solo hexes literales: los alias (--color-ink: var(--color-text)) no hacen
// falta aquí, los scripts usan los nombres canónicos.
const RE = /--color-([\w-]+):\s*(#[0-9a-fA-F]{6})\b/g;

export const palette = {};
for (const [, name, hex] of css.matchAll(RE)) {
  // La primera aparición gana: @theme va antes que cualquier redeclaración.
  if (name in palette) continue;
  palette[name] = hex;
}

for (const name of ["bg", "text", "text-secondary", "primary", "accent-muted"]) {
  if (!palette[name]) {
    throw new Error(`token --color-${name} no encontrado en globals.css`);
  }
}
