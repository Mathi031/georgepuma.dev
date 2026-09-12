import type { ProjectImage } from "@/content/site";

type ScreenshotFrameProps = {
  image: ProjectImage;
  caption?: string;
  /**
   * Ancho de render por breakpoint (atributo `sizes`). Con descriptores `w`
   * el navegador elige entre 1x y 2x por el ancho real del slot, no por el
   * viewport; con un solo archivo (Cleo) queda un srcset de un candidato.
   */
  sizes?: string;
};

/** srcset con descriptores `w`: "src 304w, src2x 608w". Sin `sizes` se omite.
 * El 2x se asume exactamente el doble de `width`: es la convención que impone
 * `scripts/images.mjs --crops` (304×190 y 608×380). */
function srcSet(image: ProjectImage, src: string, src2x?: string, sizes?: string) {
  if (!sizes) return undefined;
  return src2x ? `${src} ${image.width}w, ${src2x} ${image.width * 2}w` : `${src} ${image.width}w`;
}

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
export function ScreenshotFrame({ image, caption, sizes }: ScreenshotFrameProps) {
  return (
    <figure className="grid-safe">
      <picture>
        {image.avif ? (
          <source srcSet={srcSet(image, image.avif, image.avif2x, sizes) ?? image.avif} sizes={sizes} type="image/avif" />
        ) : null}
        <img
          src={image.src}
          srcSet={srcSet(image, image.src, image.src2x, sizes)}
          sizes={sizes}
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
