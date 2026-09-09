import type { ProjectImage } from "@/content/site";

type ScreenshotFrameProps = {
  image: ProjectImage;
  caption?: string;
};

/**
 * Bloque de captura con pie (sección 5.18 de la spec): fondo `surface`, borde
 * 1 px, radio 2. Sin mockup de dispositivo y sin sombra: la captura se presenta
 * como material, no como producto renderizado.
 *
 * <picture> nativo a propósito: las capturas son locales, estáticas y viven
 * bajo el pliegue; lazy + width/height explícitos evitan CLS sin traer el
 * optimizador runtime de next/image. Los derivados AVIF/WebP los emite
 * `pnpm images` (scripts/images.mjs), con presupuesto de peso por archivo.
 * ponytail: si alguna imagen entra al pliegue inicial, reevaluar next/image.
 */
export function ScreenshotFrame({ image, caption }: ScreenshotFrameProps) {
  return (
    <figure className="grid-safe">
      <picture>
        {image.avif ? <source srcSet={image.avif} type="image/avif" /> : null}
        <img
          src={image.src}
          alt={image.alt}
          width={image.width}
          height={image.height}
          loading="lazy"
          decoding="async"
          className="block h-auto w-full rounded-sm border border-rule bg-surface"
        />
      </picture>
      {caption ? (
        <figcaption className="mt-step-12 text-caption text-muted">{caption}</figcaption>
      ) : null}
    </figure>
  );
}
