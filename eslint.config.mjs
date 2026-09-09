import { defineConfig } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";

export default defineConfig([
  // docs/design/reference/ es la exportación de Claude Design (vendor, fuera de
  // git): no es código del proyecto y no debe pasar por las reglas del sitio.
  {
    ignores: [
      ".next/**",
      "node_modules/**",
      "playwright-report/**",
      "test-results/**",
      "docs/design/reference/**",
    ],
  },
  ...nextVitals,
]);
