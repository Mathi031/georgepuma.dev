import { readFile } from "node:fs/promises";
import { join } from "node:path";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export function generateStaticParams() {
  return [{ locale: "es" }, { locale: "en" }];
}

/**
 * Sirve el PNG pregenerado por `pnpm og`, igual que el OG del layout: un
 * .png estático no puede variar por locale, pero este handler sí recibe
 * params.
 */
export default async function Image({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const file = locale === "en" ? "opengraph-image.en.png" : "opengraph-image.es.png";

  return new Response(
    new Uint8Array(
      await readFile(join(process.cwd(), "src/app/[locale]/proyectos/ronatello", file)),
    ),
    {
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    },
  );
}
