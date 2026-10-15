import { RenderMode, ServerRoute } from '@angular/ssr';

import { NOT_FOUND_PATH } from './app.routes';

export const serverRoutes: ServerRoute[] = [
  {
    // Served as a static asset by `src/server.ts` for unknown URLs.
    path: NOT_FOUND_PATH,
    renderMode: RenderMode.Prerender,
  },
  {
    path: '**',
    renderMode: RenderMode.Server,
  },
];
