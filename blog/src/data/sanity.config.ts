/**
 * Single source of truth for the Sanity project the blog reads from.
 *
 * Keep `PROJECT_ID` and `DATASET` in sync with `cms/sanity.cli.ts`, and remember
 * that `connect-src` / `img-src` in `blog/public/_headers` must allow both the
 * query endpoint and the image CDN derived from these values.
 */
export const SANITY_PROJECT_ID = 'a4vlamka';

export const SANITY_DATASET = 'default';

/**
 * Sanity APIs are versioned by date and pinned on purpose: a newer version can
 * change query semantics. Bump this deliberately, then re-run the test suite.
 */
export const SANITY_API_VERSION = 'v2026-04-19';

/**
 * Query host.
 *
 * `apicdn` reads through Sanity's edge cache: faster and not billed per request,
 * at the cost of content taking a few seconds to propagate after publishing.
 * That is the intended endpoint for published, public content like this site.
 * Swap to `api` for uncached, always-immediate reads.
 */
export const SANITY_API_HOST = `${SANITY_PROJECT_ID}.apicdn.sanity.io`;

export const SANITY_QUERY_URL = `https://${SANITY_API_HOST}/${SANITY_API_VERSION}/data/query/${SANITY_DATASET}`;

/** Asset host. Image paths returned by GROQ are relative to this origin. */
export const SANITY_IMAGE_CDN_URL = 'https://cdn.sanity.io';

/** Width requested from the image CDN when a consumer does not specify one. */
export const SANITY_DEFAULT_IMAGE_WIDTH = 1000;
