import { Component, computed, signal, viewChild } from '@angular/core';
import { RouterLink } from '@angular/router';

import {
  CONTACT_EMAIL,
  CONTACT_ENDPOINT,
  CONTACT_MAX_LENGTHS,
  ContactErrors,
  ContactMessage,
  ContactPayload,
  ContactResponse,
  validateContactMessage,
} from '../../shared/contact/contact.model';
import { Turnstile } from '../../shared/turnstile/turnstile';

/** Where the submission currently stands, driving the alerts above the form. */
type SubmitStatus = 'idle' | 'sending' | 'sent' | 'failed';

/**
 * Contact form.
 *
 * Built on plain signals and native inputs rather than `@angular/forms`: five
 * fields do not justify pulling the forms package into the bundle, and the
 * validation rules already live in `contact.model.ts`, because the Worker that
 * sends the mail has to apply the same ones.
 */
@Component({
  selector: 'app-contact',
  imports: [RouterLink, Turnstile],
  templateUrl: './contact.html',
  host: {
    class: 'grid gap-8 px-4 py-8 lg:grid-cols-12 lg:p-16',
  },
})
export class Contact {
  /**
   * Optional rather than required: the query is read from a template binding and
   * from the submit handler, and neither is guaranteed to run after the widget
   * has been mounted.
   */
  private readonly turnstile = viewChild(Turnstile);

  readonly name = signal('');
  readonly email = signal('');
  readonly phone = signal('');
  readonly subject = signal('');
  readonly body = signal('');

  /** Bound to the `maxlength` attributes, so form and endpoint cannot diverge. */
  readonly maxLengths = CONTACT_MAX_LENGTHS;

  readonly contactEmail = CONTACT_EMAIL;
  readonly mailtoContact = `mailto:${CONTACT_EMAIL}`;

  readonly status = signal<SubmitStatus>('idle');

  /** Reason shown in the error alert; `null` while nothing has gone wrong. */
  readonly failureReason = signal<string | null>(null);

  private readonly submitAttempted = signal(false);

  private readonly draft = computed<ContactMessage>(() => ({
    name: this.name(),
    email: this.email(),
    phone: this.phone(),
    subject: this.subject(),
    message: this.body(),
  }));

  private readonly errors = computed<ContactErrors>(() => validateContactMessage(this.draft()));

  /**
   * The errors the template renders. Withheld until the first attempt to send, so
   * an untouched form is not covered in red on arrival.
   */
  readonly visibleErrors = computed<ContactErrors>(() =>
    this.submitAttempted() ? this.errors() : {},
  );

  readonly sending = computed(() => this.status() === 'sending');

  /** True when the anti-robot widget could not load, so the form cannot be sent. */
  readonly checkUnavailable = computed(() => this.turnstile()?.unavailable() === true);

  async submit(event: Event): Promise<void> {
    // No `@angular/forms`, so the native submit has to be stopped by hand.
    event.preventDefault();

    this.submitAttempted.set(true);
    this.failureReason.set(null);

    if (Object.keys(this.errors()).length > 0) {
      this.status.set('idle');
      return;
    }

    const widget = this.turnstile();
    const turnstileToken = widget?.token();

    if (!widget || !turnstileToken) {
      this.status.set('failed');
      this.failureReason.set(
        this.checkUnavailable()
          ? "La vérification anti-robot n'a pas pu se charger, le formulaire ne peut donc pas être envoyé."
          : "Confirmez la vérification anti-robot avant d'envoyer votre message.",
      );
      return;
    }

    this.status.set('sending');

    const payload: ContactPayload = { ...this.draft(), turnstileToken };

    try {
      const response = await fetch(CONTACT_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const result = (await response.json().catch(() => null)) as ContactResponse | null;

      if (!response.ok || !result?.ok) {
        throw new Error(result?.error ?? "L'envoi a échoué pour une raison inconnue.");
      }

      this.status.set('sent');
      this.clear();
    } catch (error: unknown) {
      this.status.set('failed');
      this.failureReason.set(
        error instanceof Error && error.message
          ? error.message
          : "L'envoi a échoué. Réessayez dans un instant.",
      );
    } finally {
      // A token may only be verified once, whatever the outcome.
      widget.reset();
    }
  }

  private clear(): void {
    this.name.set('');
    this.email.set('');
    this.phone.set('');
    this.subject.set('');
    this.body.set('');
    this.submitAttempted.set(false);
  }
}
