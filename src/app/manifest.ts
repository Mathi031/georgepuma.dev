import type { MetadataRoute } from "next";
import { identity } from "@/content/site";

// Solo existe para referenciar los iconos 192/512, que Next no emite por
// convención de archivo. Los dos colores son los del monograma (globals.css).
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: identity.siteName,
    short_name: identity.siteName,
    display: "browser",
    background_color: "#f6f6f4",
    theme_color: "#17181c",
    icons: [
      { src: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
  };
}
