import { TestBed } from '@angular/core/testing';

import { SANITY_QUERY_URL } from '../sanity.config';
import { SanityService } from './sanity.service';

function jsonResponse(body: unknown, init?: ResponseInit): Response {
  return new Response(JSON.stringify(body), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
    ...init,
  });
}

describe('SanityService', () => {
  let service: SanityService;
  let fetchMock: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    fetchMock = vi.fn();
    vi.stubGlobal('fetch', fetchMock);
    service = TestBed.inject(SanityService);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  /** The URL the service actually requested, as a parsed `URL`. */
  function requestedUrl(): URL {
    return new URL(String(fetchMock.mock.calls[0][0]));
  }

  it('unwraps the result of a successful query', async () => {
    fetchMock.mockResolvedValue(jsonResponse({ result: [{ title: 'Un post' }] }));

    await expect(service.query('*[_type == "post"]')).resolves.toEqual([{ title: 'Un post' }]);
    expect(requestedUrl().origin + requestedUrl().pathname).toBe(SANITY_QUERY_URL);
  });

  it('sends values as $-prefixed, JSON-encoded parameters', async () => {
    fetchMock.mockResolvedValue(jsonResponse({ result: null }));

    await service.query('*[_type == "post" && slug == $slug][0]', { slug: 'projet-dojo-2026' });

    const params = requestedUrl().searchParams;
    expect(params.get('query')).toBe('*[_type == "post" && slug == $slug][0]');
    expect(params.get('$slug')).toBe('"projet-dojo-2026"');
  });

  it('keeps a hostile slug inside its parameter instead of the query', async () => {
    fetchMock.mockResolvedValue(jsonResponse({ result: null }));

    const hostile = '" || _type == "media" || "';
    await service.query('*[_type == "post" && slug == $slug][0]', { slug: hostile });

    const params = requestedUrl().searchParams;
    // The GROQ source is untouched, so the injected operators are never parsed.
    expect(params.get('query')).toBe('*[_type == "post" && slug == $slug][0]');
    expect(params.get('$slug')).toBe(JSON.stringify(hostile));
  });

  it('encodes numeric slice bounds without quoting them', async () => {
    fetchMock.mockResolvedValue(jsonResponse({ result: [] }));

    await service.query('*[_type == "post"][$from...$to]', { from: 0, to: 3 });

    const params = requestedUrl().searchParams;
    expect(params.get('$from')).toBe('0');
    expect(params.get('$to')).toBe('3');
  });

  it('throws on a non-OK HTTP status', async () => {
    fetchMock.mockResolvedValue(new Response('nope', { status: 503, statusText: 'Unavailable' }));

    await expect(service.query('*')).rejects.toThrow(/503/);
  });

  it('throws with the description when Sanity reports an error', async () => {
    fetchMock.mockResolvedValue(jsonResponse({ error: { description: 'param $slug is missing' } }));

    await expect(service.query('*')).rejects.toThrow('param $slug is missing');
  });

  it('throws when the payload carries neither result nor error', async () => {
    fetchMock.mockResolvedValue(jsonResponse({}));

    await expect(service.query('*')).rejects.toThrow(/did not contain a result/);
  });

  it('forwards the abort signal so superseded requests are cancelled', async () => {
    fetchMock.mockResolvedValue(jsonResponse({ result: [] }));
    const controller = new AbortController();

    await service.query('*', {}, controller.signal);

    expect(fetchMock.mock.calls[0][1]).toMatchObject({ signal: controller.signal });
  });
});
