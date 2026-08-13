import { Service } from '@angular/core';

import { SANITY_QUERY_URL } from '../sanity.config';

/**
 * GROQ query parameters. Values are JSON-encoded before being sent, so user
 * input can never alter the shape of the query.
 */
export type GroqParams = Record<string, string | number | boolean>;

interface GroqResponse<T> {
  result?: T;
  error?: {
    description?: string;
    message?: string;
  };
}

@Service()
export class SanityService {
  /**
   * Runs a GROQ query against the public dataset.
   *
   * @param query GROQ source. Reference parameters as `$name`; never interpolate
   *   values into this string.
   * @param params Values bound to the `$name` placeholders used by `query`.
   * @param abortSignal Propagated from the calling `resource`, so a superseded
   *   request is cancelled instead of racing the one that replaced it.
   */
  async query<T>(query: string, params: GroqParams = {}, abortSignal?: AbortSignal): Promise<T> {
    const url = new URL(SANITY_QUERY_URL);
    url.searchParams.set('query', query);

    for (const [name, value] of Object.entries(params)) {
      url.searchParams.set(`$${name}`, JSON.stringify(value));
    }

    const response = await fetch(url, {
      headers: { Accept: 'application/json' },
      signal: abortSignal,
    });

    if (!response.ok) {
      throw new Error(`Sanity request failed: ${response.status} ${response.statusText}`);
    }

    const body = (await response.json()) as GroqResponse<T>;

    if (body.error) {
      throw new Error(body.error.description ?? body.error.message ?? 'Unknown Sanity error');
    }

    if (body.result === undefined) {
      throw new Error('Sanity response did not contain a result');
    }

    return body.result;
  }
}
