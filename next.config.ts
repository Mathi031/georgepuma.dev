import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin();

const nextConfig: NextConfig = {
  reactStrictMode: true,
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
