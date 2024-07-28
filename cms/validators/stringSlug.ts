export const stringSlugValidator = (slug: string): boolean | string => {
  const regex: RegExp = /^[a-z0-9]+(?:-[a-z0-9]+)*$/
  return regex.test(slug)
    ? true
    : 'Slug must be a valid format (lowercase letters, numbers, and hyphens only)'
}
