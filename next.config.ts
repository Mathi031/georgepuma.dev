import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin();

const nextConfig: NextConfig = {
  reactStrictMode: true,
  /**
   * El sitio no usa next/image (las capturas van en <img> con AVIF/WebP ya
   * generados por scripts/images.mjs). El optimizador es superficie de ataque
   * sin uso: dos RCE en el advisory de 16.x salieron por ahí.
   */
  images: { unoptimized: true },
  /**
   * /es es un prefijo superfluo: el español es el locale por defecto y se
   * sirve sin prefijo. next-intl ya redirige, pero con 307; para un buscador,
   * la forma canónica merece un permanente. `redirects` corre antes del
   * middleware, así que este 301 gana.
   */
  async redirects() {
    return [
      { source: "/es", destination: "/", statusCode: 301 },
      { source: "/es/:path*", destination: "/:path*", statusCode: 301 },
    ];
  },
};

export default withNextIntl(nextConfig);
