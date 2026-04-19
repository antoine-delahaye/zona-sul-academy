import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class SanityService {
  private readonly apiUrl = 'https://a4vlamka.api.sanity.io/v2026-04-19/data/query/default';

  public async fetchGROQ<T>(query: string): Promise<T> {
    const url = new URL(this.apiUrl);
    url.searchParams.append('query', query);

    const response = await fetch(url.toString(), {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Sanity Error: ${response.statusText}`);
    }

    const { result, error } = await response.json();

    if (error) {
      throw new Error(error.description || error.message || 'Unknown Sanity Error');
    }

    return result;
  }
}
