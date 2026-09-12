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

// El 2x se asume exactamente el doble de `width`: es la convención que impone
// `scripts/images.mjs --crops`.
function srcSet(image: ProjectImage, src: string, src2x?: string, sizes?: string) {
  if (!sizes) return undefined;
  return src2x ? `${src} ${image.width}w, ${src2x} ${image.width * 2}w` : `${src} ${image.width}w`;
}

/**
 * <picture> nativo en vez de next/image: las capturas son locales, estáticas y
 * viven bajo el pliegue; lazy + width/height explícitos evitan CLS sin traer el
 * optimizador en runtime. Los derivados AVIF/WebP los emite `pnpm images`.
 * Si alguna imagen entra al pliegue inicial, reevaluar next/image.
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
