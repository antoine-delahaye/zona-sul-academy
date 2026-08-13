export interface SanityImageDimensions {
  width: number;
  height: number;
  aspectRatio: number;
}

export interface SanityImageAsset {
  /** Path relative to the Sanity image CDN, e.g. `images/<project>/<dataset>/<id>-<w>x<h>.png`. */
  path: string;
  /** Alternative text stored on the asset itself. Frequently unset in the dataset. */
  altText: string | null;
  metadata: {
    dimensions: SanityImageDimensions;
  };
}

export interface SanityImage {
  /** Per-usage alternative text, from the `alt` field declared on the image type. */
  alt?: string | null;
  asset: SanityImageAsset;
}

/**
 * Resolves the best available alternative text for an image.
 *
 * Prefers the per-usage `alt` field, falls back to the asset-level `altText`,
 * then to a caller-supplied label. Returns `''` only when nothing is known,
 * which correctly marks the image as decorative rather than emitting `null`.
 */
export function sanityImageAlt(image: SanityImage | null | undefined, fallback = ''): string {
  return image?.alt?.trim() || image?.asset.altText?.trim() || fallback;
}
