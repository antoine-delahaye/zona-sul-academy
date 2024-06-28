import {renderApplication} from '@angular/platform-server'

import bootstrap from '@src/main.server'

interface Env {
  ASSETS: {fetch: typeof fetch}
}

async function workerFetchHandler(
  request: Request,
  env: Env
): Promise<Response> {
  const url: URL = new URL(request.url)

  const indexUrl: URL = new URL('/', url)
  const indexResponse = await env.ASSETS.fetch(new Request(indexUrl))
  const document = await indexResponse.text()

  const content: string = await renderApplication(bootstrap, {
    document,
    url: url.pathname
  })

  return new Response(content, indexResponse)
}

export default {
  fetch: (request: Request, env: Env) =>
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (globalThis as any)['__zone_symbol__Promise'].resolve(
      workerFetchHandler(request, env)
    )
}
