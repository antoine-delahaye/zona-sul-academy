/**
 * Staged files are formatted individually, but linting runs per workspace:
 * `ng lint` and the Studio's type-aware ESLint config both expect to resolve
 * their own project root, so passing them arbitrary file paths is unreliable.
 * Returning a plain string from the matcher drops the file list on purpose.
 */
export default {
  '*.{ts,html,css,js,mjs,json,jsonc,md,yml,yaml}': 'prettier --write',
  'blog/**/*.{ts,html}': () => 'npm run lint -w blog',
  'cms/**/*.ts': () => 'npm run lint -w cms',
};
