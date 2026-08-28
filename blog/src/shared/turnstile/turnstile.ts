import {
  Component,
  DestroyRef,
  ElementRef,
  afterNextRender,
  inject,
  signal,
  viewChild,
} from '@angular/core';

import { TURNSTILE_SCRIPT_URL, TURNSTILE_SITE_KEY } from './turnstile.config';

/** The handful of `window.turnstile` members this component uses. */
interface TurnstileApi {
  render(element: HTMLElement, options: TurnstileOptions): string | undefined;
  reset(widgetId: string): void;
  remove(widgetId: string): void;
}

interface TurnstileOptions {
  sitekey: string;
  language: string;
  theme: 'auto' | 'light' | 'dark';
  callback: (token: string) => void;
  'expired-callback': () => void;
  'error-callback': () => void;
}

declare global {
  interface Window {
    turnstile?: TurnstileApi;
  }
}

/**
 * Loads the widget script once per document, however many widgets mount.
 *
 * A rejected promise is not cached: a visitor who was offline when the page
 * loaded gets another attempt the next time a widget mounts.
 */
let scriptLoad: Promise<TurnstileApi> | undefined;

function loadTurnstile(): Promise<TurnstileApi> {
  scriptLoad ??= new Promise<TurnstileApi>((resolve, reject) => {
    if (window.turnstile) {
      resolve(window.turnstile);
      return;
    }

    const script = document.createElement('script');
    script.src = TURNSTILE_SCRIPT_URL;
    script.async = true;
    script.defer = true;
    script.addEventListener('load', () => {
      if (window.turnstile) {
        resolve(window.turnstile);
      } else {
        reject(new Error('Turnstile loaded without exposing its API'));
      }
    });
    script.addEventListener('error', () => reject(new Error('Turnstile script failed to load')));

    document.head.appendChild(script);
  }).catch((error: unknown) => {
    scriptLoad = undefined;
    throw error;
  });

  return scriptLoad;
}

/**
 * Cloudflare Turnstile checkbox.
 *
 * The parent reads {@link token} to know whether the visitor has passed the
 * check, and calls {@link reset} after every submission: a token may only be
 * verified once.
 */
@Component({
  selector: 'app-turnstile',
  templateUrl: './turnstile.html',
  host: {
    class: 'block',
  },
})
export class Turnstile {
  private readonly destroyRef = inject(DestroyRef);

  private readonly widget = viewChild.required<ElementRef<HTMLElement>>('widget');

  private api: TurnstileApi | undefined;
  private widgetId: string | undefined;

  private readonly currentToken = signal<string | null>(null);

  /** The token to submit, or `null` while the check is unsolved or expired. */
  readonly token = this.currentToken.asReadonly();

  private readonly scriptFailed = signal(false);

  /**
   * Whether the widget could not be loaded at all — offline, or blocked by an
   * extension. The parent should then point the visitor at a way round the form.
   */
  readonly unavailable = this.scriptFailed.asReadonly();

  constructor() {
    // Browser-only by construction: the widget is an iframe, so there is nothing
    // to render server-side.
    afterNextRender(() => void this.mount());

    // Registered up front rather than after the await, so a component destroyed
    // mid-load still cleans up.
    this.destroyRef.onDestroy(() => {
      if (this.api && this.widgetId !== undefined) {
        this.api.remove(this.widgetId);
      }
    });
  }

  /** Clears the solved state and asks Cloudflare for a fresh token. */
  reset(): void {
    this.currentToken.set(null);

    if (this.api && this.widgetId !== undefined) {
      this.api.reset(this.widgetId);
    }
  }

  private async mount(): Promise<void> {
    try {
      this.api = await loadTurnstile();
    } catch {
      this.scriptFailed.set(true);
      return;
    }

    this.widgetId = this.api.render(this.widget().nativeElement, {
      sitekey: TURNSTILE_SITE_KEY,
      language: 'fr',
      // The site ships a single light theme, so `auto` would only ever be wrong.
      theme: 'light',
      callback: (token) => this.currentToken.set(token),
      'expired-callback': () => this.currentToken.set(null),
      'error-callback': () => this.currentToken.set(null),
    });
  }
}
