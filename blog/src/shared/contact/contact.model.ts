/**
 * Contract shared by the contact form component and the Worker endpoint that
 * turns a submission into an e-mail.
 *
 * Validation lives here rather than on either side alone: the browser needs it to
 * show inline errors, and the endpoint needs it because nothing stops a client
 * from posting straight to it. Duplicating the rules would let the two drift
 * apart, so both import the same functions.
 */

/**
 * Worker route handling the submission. `src/server.ts` intercepts it before
 * handing the request to Angular, so no Angular route may use this path.
 */
export const CONTACT_ENDPOINT = '/api/contact';

/**
 * The club's mailbox: recipient of every submission, and the address the site
 * shows visitors who would rather write directly.
 *
 * It must stay in sync with `destination_address` of the `send_email` binding in
 * `wrangler.jsonc`, which is what actually allows the Worker to mail it.
 */
export const CONTACT_EMAIL = 'contact@zonasulacademy.fr';

/** The fields a visitor fills in. `phone` is the only optional one. */
export interface ContactMessage {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
}

export type ContactField = keyof ContactMessage;

/** Body of a POST to {@link CONTACT_ENDPOINT}. */
export interface ContactPayload extends ContactMessage {
  /** Single-use Turnstile token, verified server-side before the mail is sent. */
  turnstileToken: string;
}

/** JSON returned by {@link CONTACT_ENDPOINT}, on success and on failure alike. */
export interface ContactResponse {
  ok: boolean;
  /** Human-readable reason, ready to be shown as-is. */
  error?: string;
  /** Per-field reasons, when the submission failed validation. */
  errors?: ContactErrors;
}

/** Field-level error messages. Empty when the submission is valid. */
export type ContactErrors = Partial<Record<ContactField, string>>;

/**
 * Maximum accepted length per field, enforced on both sides. The `maxlength`
 * attributes in the template read from this object, so the two cannot diverge.
 */
export const CONTACT_MAX_LENGTHS: Readonly<Record<ContactField, number>> = {
  name: 80,
  email: 254,
  phone: 30,
  subject: 120,
  message: 2000,
};

/** Below this, a "message" is almost always a bot or a misfire. */
export const CONTACT_MIN_MESSAGE_LENGTH = 20;

/**
 * Deliberately permissive: the only address worth accepting is one the club can
 * reply to, and a stricter pattern rejects valid addresses far more often than it
 * catches typos.
 */
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/** Digits, spacing and the punctuation French numbers are usually written with. */
const PHONE_PATTERN = /^\+?[\d\s.()-]{8,}$/;

/**
 * Drops control characters, keeping newlines and tabs.
 *
 * Written as a code-point scan rather than a regexp class so the pattern itself
 * stays free of literal control characters.
 */
function stripControlCharacters(value: string): string {
  return [...value]
    .filter((character) => {
      if (character === '\n' || character === '\t') {
        return true;
      }

      const code = character.codePointAt(0) ?? 0;

      return code >= 0x20 && code !== 0x7f;
    })
    .join('');
}

/**
 * Normalises a single-line field: whitespace runs collapse to one space.
 *
 * These values end up in mail headers, where a stray CR or LF would let a visitor
 * append headers of their own.
 */
export function normaliseContactLine(value: string): string {
  return stripControlCharacters(value).replace(/\s+/g, ' ').trim();
}

/** Normalises the message body, where newlines are meaningful. */
export function normaliseContactBody(value: string): string {
  return stripControlCharacters(value.replace(/\r\n?/g, '\n')).trim();
}

/** Cleans every field of a submission, ready to be validated or mailed. */
export function normaliseContactMessage(message: ContactMessage): ContactMessage {
  return {
    name: normaliseContactLine(message.name),
    email: normaliseContactLine(message.email),
    phone: normaliseContactLine(message.phone),
    subject: normaliseContactLine(message.subject),
    message: normaliseContactBody(message.message),
  };
}

/**
 * Validates a submission, normalising it first so trailing whitespace never
 * counts towards a length.
 *
 * @returns One message per invalid field, in French: the browser shows them
 *   verbatim next to the input.
 */
export function validateContactMessage(message: ContactMessage): ContactErrors {
  const { name, email, phone, subject, message: body } = normaliseContactMessage(message);
  const errors: ContactErrors = {};

  if (!name) {
    errors.name = 'Indiquez votre nom.';
  } else if (name.length > CONTACT_MAX_LENGTHS.name) {
    errors.name = `Votre nom ne doit pas dépasser ${CONTACT_MAX_LENGTHS.name} caractères.`;
  }

  if (!email) {
    errors.email = 'Indiquez votre adresse e-mail, sans quoi nous ne pourrons pas vous répondre.';
  } else if (email.length > CONTACT_MAX_LENGTHS.email || !EMAIL_PATTERN.test(email)) {
    errors.email = 'Cette adresse e-mail semble incorrecte.';
  }

  // Optional: only checked when something was actually typed.
  if (phone && (phone.length > CONTACT_MAX_LENGTHS.phone || !PHONE_PATTERN.test(phone))) {
    errors.phone = 'Ce numéro de téléphone semble incorrect.';
  }

  if (!subject) {
    errors.subject = "Indiquez l'objet de votre message.";
  } else if (subject.length > CONTACT_MAX_LENGTHS.subject) {
    errors.subject = `L'objet ne doit pas dépasser ${CONTACT_MAX_LENGTHS.subject} caractères.`;
  }

  if (body.length < CONTACT_MIN_MESSAGE_LENGTH) {
    errors.message = `Votre message doit faire au moins ${CONTACT_MIN_MESSAGE_LENGTH} caractères.`;
  } else if (body.length > CONTACT_MAX_LENGTHS.message) {
    errors.message = `Votre message ne doit pas dépasser ${CONTACT_MAX_LENGTHS.message} caractères.`;
  }

  return errors;
}
