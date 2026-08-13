import { SanityImage, sanityImageAlt } from './sanity-image.model';

function image(alt: string | null, altText: string | null): SanityImage {
  return {
    alt,
    asset: {
      path: 'images/project/dataset/abc-100x100.png',
      altText,
      metadata: { dimensions: { width: 100, height: 100, aspectRatio: 1 } },
    },
  };
}

describe('sanityImageAlt', () => {
  it('prefers the alt filled in on the image field', () => {
    expect(sanityImageAlt(image('Randori pendant les cours', 'asset level'))).toBe(
      'Randori pendant les cours',
    );
  });

  it('falls back to the asset altText when the image alt is unset', () => {
    // The dataset has `asset->altText` empty and `image.alt` filled, which is
    // why reading only the asset level left every image unlabelled.
    expect(sanityImageAlt(image(null, 'Photo du club'))).toBe('Photo du club');
  });

  it('falls back to the supplied label when Sanity has neither', () => {
    expect(sanityImageAlt(image(null, null), 'Zona Sul Academy')).toBe('Zona Sul Academy');
  });

  it('treats blank strings as missing and trims what it returns', () => {
    expect(sanityImageAlt(image('   ', 'Photo du club'))).toBe('Photo du club');
    expect(sanityImageAlt(image('  Team  ', null))).toBe('Team');
  });

  it('returns an empty string for a decorative image with no fallback', () => {
    expect(sanityImageAlt(image(null, null))).toBe('');
    expect(sanityImageAlt(undefined)).toBe('');
  });
});
