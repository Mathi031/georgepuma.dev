import createMiddleware from "next-intl/middleware";
import type { NextRequest } from "next/server";
import { routing } from "./i18n/routing";

const handleI18nRouting = createMiddleware(routing);

export default function middleware(request: NextRequest) {
  const nonce = btoa(crypto.randomUUID());
  const csp = [
    "default-src 'self'",
    // 'self' y va.vercel-scripts.com son fallback para navegadores sin
    // strict-dynamic; va.* sirve el script debug de Analytics en dev.
    // unsafe-eval solo en dev (lo requiere el HMR de Next).
    `script-src 'nonce-${nonce}' 'strict-dynamic' 'self' https://va.vercel-scripts.com${
      process.env.NODE_ENV === "production" ? "" : " 'unsafe-eval'"
    }`,
    // Next/React inyectan <style> inline sin soporte de nonce en App Router.
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data:",
    "font-src 'self'",
    // El beacon de Analytics en producción es same-origin (/_vercel/insights/*).
    "connect-src 'self' https://va.vercel-scripts.com",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "frame-ancestors 'none'",
    // Solo en Vercel: en localhost (http) upgradea los prefetch a https y fallan.
    ...(process.env.VERCEL ? ["upgrade-insecure-requests"] : []),
  ].join("; ");

  // En el request header para que Next aplique el nonce a sus scripts inline.
  request.headers.set("x-nonce", nonce);
  request.headers.set("content-security-policy", csp);

  const response = handleI18nRouting(request);
  response.headers.set("content-security-policy", csp);
  return response;
}

export const config = {
  matcher: "/((?!api|_next|_vercel|.*\\..*).*)",
};
