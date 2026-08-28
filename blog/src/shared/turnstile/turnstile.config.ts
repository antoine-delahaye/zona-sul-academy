/**
 * Cloudflare Turnstile — the anti-robot check on the contact form.
 *
 * Only the site key is public and belongs here; the matching secret key is read
 * from the Worker environment (`TURNSTILE_SECRET_KEY`) and never reaches the
 * browser.
 */

/** Needed in `script-src`, `frame-src` and `connect-src`; see `src/server.ts`. */
export const TURNSTILE_ORIGIN = 'https://challenges.cloudflare.com';

/** `render=explicit`: the widget is mounted by `Turnstile`, not by the script. */
export const TURNSTILE_SCRIPT_URL = `${TURNSTILE_ORIGIN}/turnstile/v0/api.js?render=explicit`;

/** Endpoint the Worker posts the submitted token to. */
export const TURNSTILE_VERIFY_URL = `${TURNSTILE_ORIGIN}/turnstile/v0/siteverify`;

/**
 * Public site key of the widget, created under Turnstile in the Cloudflare
 * dashboard for the `zonasulacademy.fr` hostname.
 *
 * The value below is Cloudflare's "always passes, visible" **test** key. It is
 * fine for local development, but with it in place any bot clears the check, so
 * it must be swapped for the real site key before deploying — together with
 * `wrangler secret put TURNSTILE_SECRET_KEY`.
 */
export const TURNSTILE_SITE_KEY = '0x4AAAAAAEfPH7e4JG2pgDr8';
