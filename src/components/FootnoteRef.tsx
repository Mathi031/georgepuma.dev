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
      className="ml-0.5 align-super font-mono text-micro leading-none text-primary no-underline"
    >
      {n}
    </a>
  );
}
