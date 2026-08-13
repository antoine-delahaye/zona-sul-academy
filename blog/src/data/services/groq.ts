/**
 * GROQ sources used by the data services.
 *
 * Values are always bound through `$name` parameters (see `SanityService.query`);
 * nothing user-controlled is ever interpolated into these strings.
 */

/**
 * Image projection shared by every query.
 *
 * `alt` comes from the image field itself and is the one editors actually fill
 * in, while `asset->altText` is the asset-library fallback.
 */
const IMAGE_PROJECTION = `{
  alt,
  asset-> {
    path,
    altText,
    metadata {
      dimensions {
        width,
        height,
        aspectRatio
      }
    }
  }
}`;

export const MEDIA_QUERY = `
  *[_type == "media"] | order(slug asc) {
    _id,
    title,
    slug,
    image ${IMAGE_PROJECTION}
  }
`;

/** Newest posts first, sliced by `$from`/`$to` for pagination. */
export const POST_PREVIEWS_QUERY = `
  *[_type == "post"] | order(_createdAt desc) [$from...$to] {
    title,
    slug,
    excerpt,
    _createdAt,
    mainImage ${IMAGE_PROJECTION}
  }
`;

/** Resolves to the post, or `null` when the slug does not exist. */
export const POST_BY_SLUG_QUERY = `
  *[_type == "post" && slug == $slug][0] {
    title,
    slug,
    _createdAt,
    body,
    mainImage ${IMAGE_PROJECTION}
  }
`;

export const FEATURED_POSTS_QUERY = `
  *[_type == "post" && featured == true] | order(_createdAt desc) {
    title,
    slug,
    excerpt,
    featuredButtons[] {
      text,
      url,
      openInNewTab
    },
    mainImage ${IMAGE_PROJECTION}
  }
`;

/**
 * Page-builder sections are spread as-is so each variant keeps its own fields;
 * the conditional block only overrides `image` to dereference the asset.
 */
export const SITE_CONTENT_QUERY = `
  *[_type == "siteContent"] {
    _id,
    title,
    slug,
    subtitle,
    pageBuilder[] {
      ...,
      _type == "imageSection" => {
        image ${IMAGE_PROJECTION}
      }
    }
  }
`;
