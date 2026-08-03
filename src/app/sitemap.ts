import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://georgepuma.dev";
  return [
    { url: base, changeFrequency: "monthly", priority: 1 },
    { url: `${base}/proyectos/notable-learning`, changeFrequency: "monthly", priority: 0.8 },
  ];
}
