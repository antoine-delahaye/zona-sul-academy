import type { CustomValidator } from 'sanity';

const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

/**
 * Validates the plain-string slugs used across the schema.
 *
 * These are `type: 'string'` rather than Sanity's `slug` type on purpose: the
 * blog queries compare `slug == $slug` directly, so switching to `slug` would
 * change the stored shape to `{_type, current}` and break every GROQ query.
 *
 * Emptiness is left to `Rule.required()`, so this only checks the format.
 */
export const stringSlugValidator: CustomValidator<string | undefined> = (slug) => {
  if (slug === undefined || slug === '') {
    return true;
  }

  return (
    SLUG_PATTERN.test(slug) ||
    'Slug must be a valid format (lowercase letters, numbers, and hyphens only)'
  );
};
