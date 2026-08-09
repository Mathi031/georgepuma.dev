type FootnoteRefProps = {
  n: number;
  /** aria-label completo, ya localizado ("Nota 1" / "Note 1"). */
  aria: string;
};

/** Referencia a nota al pie del caso de estudio. Los ids ref-N / nota-N no se traducen. */
export function FootnoteRef({ n, aria }: FootnoteRefProps) {
  return (
    <a
      href={`#nota-${n}`}
      id={`ref-${n}`}
      aria-label={aria}
      className="ml-0.5 align-super font-mono text-micro leading-none text-copper no-underline"
    >
      {n}
    </a>
  );
}
