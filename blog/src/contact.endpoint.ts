import {
  ContactErrors,
  ContactPayload,
  ContactResponse,
  normaliseContactMessage,
  validateContactMessage,
} from './shared/contact/contact.model';
import { TURNSTILE_VERIFY_URL } from './shared/turnstile/turnstile.config';

/**
 * Minimal shape of the `send_email` binding declared in `wrangler.jsonc`.
 *
 * Typed here rather than imported from the generated `worker-configuration.d.ts`:
 * that file redeclares the whole workerd global scope — `Request`, `Response`,
 * `Headers` — which would collide with the DOM types the browser components are
 * compiled against.
 *
 * The object form of `send` lets workerd build the MIME message, which is why
 * this Worker needs no mail library at all.
 */
interface SendEmailBinding {
  send(message: {
    from: string | { name: string; email: string };
    to: string | { name: string; email: string };
    replyTo?: string | { name: string; email: string };
    subject: string;
    text?: string;
  }): Promise<unknown>;
}

/** The bindings and secrets the contact endpoint needs, all optional. */
export interface ContactEnv {
  /** Absent under `ng serve`, which runs the SSR entry outside workerd. */
  readonly SEND_EMAIL?: SendEmailBinding;
  /** Set with `wrangler secret put TURNSTILE_SECRET_KEY`. */
  readonly TURNSTILE_SECRET_KEY?: string;
}

/**
 * Envelope sender. Needs no mailbox — it only has to sit on a zone of the account
 * with Email Routing enabled. Replies reach the visitor through `Reply-To`.
 */
const SENDER = { name: 'Formulaire zonasulacademy.fr', email: 'formulaire@zonasulacademy.fr' };

/**
 * Where the mail is actually delivered, and the value `destination_address` in
 * `wrangler.jsonc` has to repeat.
 *
 * Deliberately not `CONTACT_EMAIL`: the `send_email` binding only accepts a
 * *verified destination address* of the account, and `contact@zonasulacademy.fr`
 * is a custom address on the zone — a routing rule that forwards here. Sending to
 * it is rejected with "destination address is not a verified address", so the
 * Worker writes to the mailbox behind it, which is the same inbox.
 */
const RECIPIENT = { name: 'Zona Sul Academy', email: 'zonasulacademy@gmail.com' };

/**
 * Hard ceiling on the request body, comfortably above the sum of the field
 * limits. A sanity check rather than an accounting: the declared `Content-Length`
 * short-circuits the read, and the character count backs it up when no length was
 * declared.
 */
const MAX_BODY_BYTES = 16 * 1024;

function json(body: ContactResponse, status: number, headers: HeadersInit = {}): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'no-store',
      ...headers,
    },
  });
}

/** Every field of a submission has to be a string before anything else runs. */
function isContactPayload(value: unknown): value is ContactPayload {
  if (typeof value !== 'object' || value === null) {
    return false;
  }

  const candidate = value as Record<string, unknown>;

  return (['name', 'email', 'phone', 'subject', 'message', 'turnstileToken'] as const).every(
    (field) => typeof candidate[field] === 'string',
  );
}

/**
 * Asks Cloudflare whether the token the browser submitted is genuine.
 *
 * Fails closed: a network error or an unparseable answer counts as a failed
 * check, never as a pass.
 */
async function verifyTurnstile(
  token: string,
  secret: string,
  remoteIp: string | null,
): Promise<boolean> {
  const form = new FormData();
  form.append('secret', secret);
  form.append('response', token);

  if (remoteIp) {
    form.append('remoteip', remoteIp);
  }

  try {
    const response = await fetch(TURNSTILE_VERIFY_URL, { method: 'POST', body: form });

    if (!response.ok) {
      return false;
    }

    const outcome = (await response.json()) as { success?: boolean };

    return outcome.success === true;
  } catch {
    return false;
  }
}

/** Plain-text body of the mail, laid out so a phone preview shows the essentials. */
function formatMail(message: ContactPayload): string {
  return [
    `Nom       : ${message.name}`,
    `E-mail    : ${message.email}`,
    `Téléphone : ${message.phone || 'non renseigné'}`,
    `Objet     : ${message.subject}`,
    '',
    '--',
    '',
    message.message,
    '',
    '--',
    'Envoyé depuis le formulaire de contact de zonasulacademy.fr',
  ].join('\n');
}

/**
 * Handles a POST to `CONTACT_ENDPOINT`: validates the submission, checks it
 * against Turnstile, then mails it to the club.
 *
 * The order matters. Validation runs before the Turnstile check because a token
 * may only be verified once: a visitor who forgot a field would otherwise have to
 * solve the challenge again.
 *
 * @param env Absent when the SSR entry runs outside workerd, i.e. under
 *   `ng serve`. Use `npm run preview -w blog` to exercise this endpoint locally.
 */
export async function handleContactRequest(
  request: Request,
  env: ContactEnv | undefined,
): Promise<Response> {
  if (request.method !== 'POST') {
    return json({ ok: false, error: 'Méthode non autorisée.' }, 405, { Allow: 'POST' });
  }

  const sendEmail = env?.SEND_EMAIL;
  const turnstileSecret = env?.TURNSTILE_SECRET_KEY;

  if (!sendEmail || !turnstileSecret) {
    console.error(
      'Contact endpoint is not configured: expected the SEND_EMAIL binding and the ' +
        'TURNSTILE_SECRET_KEY secret. Under `ng serve` neither exists — run `wrangler dev`.',
    );

    return json({ ok: false, error: "L'envoi de messages est momentanément indisponible." }, 503);
  }

  const declaredLength = Number(request.headers.get('Content-Length') ?? '0');

  if (declaredLength > MAX_BODY_BYTES) {
    return json({ ok: false, error: 'Votre message est trop volumineux.' }, 413);
  }

  const raw = await request.text();

  if (raw.length > MAX_BODY_BYTES) {
    return json({ ok: false, error: 'Votre message est trop volumineux.' }, 413);
  }

  let parsed: unknown;

  try {
    parsed = JSON.parse(raw) as unknown;
  } catch {
    return json({ ok: false, error: 'Requête illisible.' }, 400);
  }

  if (!isContactPayload(parsed)) {
    return json({ ok: false, error: 'Requête incomplète.' }, 400);
  }

  const message = { ...normaliseContactMessage(parsed), turnstileToken: parsed.turnstileToken };
  const errors: ContactErrors = validateContactMessage(message);

  if (Object.keys(errors).length > 0) {
    return json({ ok: false, error: 'Certains champs sont invalides.', errors }, 422);
  }

  const passed = await verifyTurnstile(
    message.turnstileToken,
    turnstileSecret,
    request.headers.get('CF-Connecting-IP'),
  );

  if (!passed) {
    return json(
      {
        ok: false,
        error: 'La vérification anti-robot a échoué. Rechargez la page et réessayez.',
      },
      403,
    );
  }

  try {
    await sendEmail.send({
      from: SENDER,
      to: RECIPIENT,
      // So hitting Reply in the mailbox answers the visitor, not the Worker.
      replyTo: { name: message.name, email: message.email },
      subject: `[Site] ${message.subject}`,
      text: formatMail(message),
    });
  } catch (error: unknown) {
    console.error('Contact mail could not be sent', error);

    return json(
      { ok: false, error: "L'envoi a échoué de notre côté. Réessayez dans quelques minutes." },
      502,
    );
  }

  return json({ ok: true }, 200);
}
