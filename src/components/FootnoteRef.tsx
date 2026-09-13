type FootnoteRefProps = {
  n: number;
  aria: string;
};

/** Los ids ref-N / nota-N no se traducen. */
export function FootnoteRef({ n, aria }: FootnoteRefProps) {
  return (
    <a
      href={`#nota-${n}`}
      id={`ref-${n}`}
      aria-label={aria}
      // Superíndice (align-super) además del color, y caja de 44 de alto con
      // padding vertical: en un inline el padding no mueve la línea. El
      // horizontal se compensa con margen negativo para no abrir la prosa.
      className="-ml-2 -mr-2.5 px-2.5 py-4 align-super font-mono text-micro leading-none text-primary no-underline"
    >
      {n}
    </a>
  );
}
