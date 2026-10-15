import { matchesRoute } from './app.routes';

describe('matchesRoute', () => {
  it('matches every page of the site', () => {
    for (const pathname of [
      '/',
      '/actualites',
      '/actualites/ouverture-de-la-saison',
      '/planning',
      '/tarifs',
      '/contact',
      '/confidentialite',
    ]) {
      expect(matchesRoute(pathname), pathname).toBe(true);
    }
  });

  it('tolerates a trailing slash', () => {
    expect(matchesRoute('/planning/')).toBe(true);
  });

  it('rejects the URLs vulnerability scanners probe', () => {
    for (const pathname of [
      '/index.php',
      '/wp-login.php',
      '/.env',
      '/backup.sql.bak',
      '/login',
      '/.well-known/traffic-advice',
    ]) {
      expect(matchesRoute(pathname), pathname).toBe(false);
    }
  });

  it('rejects paths deeper than any route', () => {
    expect(matchesRoute('/actualites/un-article/commentaires')).toBe(false);
    expect(matchesRoute('/planning/2026')).toBe(false);
  });
});
