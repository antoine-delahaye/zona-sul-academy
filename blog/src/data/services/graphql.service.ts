import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class GraphqlService {
  private readonly apiUrl = `https://a4vlamka.api.sanity.io/v2023-08-01/graphql/production/default`;

  public async fetchGraphQL<T>(query: string): Promise<T> {
    const response = await fetch(this.apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query }),
    });

    if (!response.ok) {
      throw new Error(`GraphQL Error: ${response.statusText}`);
    }

    const { data, errors } = await response.json();

    if (errors) {
      throw new Error(errors.map((e: any) => e.message).join(', '));
    }

    return data;
  }
}
