// <script> nativo y no next/script: es datos, no código. El escapado de `<`
// impide que una cadena del contenido cierre la etiqueta.
export function JsonLd({ data }: { data: object }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data).replace(/</g, "\\u003c"),
      }}
    />
  );
}
