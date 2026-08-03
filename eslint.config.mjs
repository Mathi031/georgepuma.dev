import { defineConfig } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";

export default defineConfig([
  { ignores: [".next/**", "node_modules/**", "playwright-report/**", "test-results/**"] },
  ...nextVitals,
]);
