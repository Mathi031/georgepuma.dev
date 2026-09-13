import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/seo";

/** Todo abierto salvo /sistema, que es una herramienta interna. */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/", disallow: "/sistema" },
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
