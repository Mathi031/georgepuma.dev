import { defineConfig } from "@playwright/test";

// Parametrizado para poder testear en otro puerto si el 3000 está ocupado
// por otro proyecto (reuseExistingServer reutiliza lo que haya escuchando).
const port = process.env.PORT ?? "3000";

export default defineConfig({
  testDir: "./tests",
  fullyParallel: true,
  reporter: "list",
  use: {
    baseURL: `http://localhost:${port}`,
  },
  // El mismo spec corre en ambos esquemas: axe valida color-contrast contra
  // los colores computados reales de cada paleta.
  projects: [
    { name: "light", use: { colorScheme: "light" } },
    { name: "dark", use: { colorScheme: "dark" } },
  ],
  webServer: {
    command: "pnpm start",
    url: `http://localhost:${port}`,
    reuseExistingServer: !process.env.CI,
    env: { PORT: port },
  },
});
