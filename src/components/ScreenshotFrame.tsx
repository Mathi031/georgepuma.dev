import type { ProjectImage } from "@/content/site";

type ScreenshotFrameProps = {
  image: ProjectImage;
  caption?: string;
};

/**
 * Marco de captura: extiende los corchetes de calibración — el dispositivo
 * que significa "material verificado" — a la evidencia visual: capturas
 * reales del producto.
 *
 * <img> nativa a propósito: las capturas son locales, estáticas y viven bajo
 * el pliegue; lazy + width/height explícitos evitan CLS sin traer el
 * optimizador runtime de next/image (se pre-optimizan a AVIF/WebP con sharp).
 * ponytail: si alguna imagen entra al pliegue inicial, reevaluar next/image.
 */
export function ScreenshotFrame({ image, caption }: ScreenshotFrameProps) {
  return (
    <figure className="calibrated p-2.5 [--corner-size:14px]">
      {/* eslint-disable-next-line @next/next/no-img-element -- captura local pre-optimizada, bajo el pliegue */}
      <img
        src={image.src}
        alt={image.alt}
        width={image.width}
        height={image.height}
        loading="lazy"
        decoding="async"
        className="block h-auto w-full"
      />
      {caption ? (
        <figcaption className="mt-2.5 font-mono text-micro text-muted">{caption}</figcaption>
      ) : null}
    </figure>
  );
}
