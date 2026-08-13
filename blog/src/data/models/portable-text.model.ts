/** A single run of text inside a Portable Text block. */
export interface PortableTextSpan {
  _key: string;
  _type: string;
  text: string;
  marks?: string[] | null;
}

/**
 * A Portable Text block as returned by GROQ.
 *
 * Only the subset the blog actually renders is modelled: the site displays
 * plain paragraphs, so marks and annotations are carried but not interpreted.
 */
export interface PortableTextBlock {
  _key: string;
  _type: string;
  style?: string | null;
  children?: PortableTextSpan[] | null;
}

/**
 * Flattens a block to plain text.
 *
 * Blocks are split into one span per formatting run, so reading only the first
 * child silently truncates any paragraph containing bold or italic text.
 */
export function portableTextBlockToPlainText(block: PortableTextBlock | null | undefined): string {
  return (block?.children ?? []).map((span) => span.text).join('');
}
