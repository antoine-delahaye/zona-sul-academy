import {APP_BASE_HREF} from '@angular/common'
import {CommonEngine} from '@angular/ssr'
import express from 'express'
import {fileURLToPath} from 'node:url'
import {dirname, join, resolve} from 'node:path'

import bootstrap from '@src/main.server'

export function app(): express.Express {
  const server: express.Express = express()
  const serverDistFolder: string = dirname(fileURLToPath(import.meta.url))
  const browserDistFolder: string = resolve(serverDistFolder, '../browser')
  const indexHtml: string = join(serverDistFolder, 'index.server.html')

  const commonEngine: CommonEngine = new CommonEngine()

  server.set('view engine', 'html')
  server.set('views', browserDistFolder)

  server.get(
    '*.*',
    express.static(browserDistFolder, {
      maxAge: '1y'
    })
  )

  server.get('*', (req, res, next): void => {
    const {protocol, originalUrl, baseUrl, headers} = req

    commonEngine
      .render({
        bootstrap,
        documentFilePath: indexHtml,
        url: `${protocol}://${headers.host}${originalUrl}`,
        publicPath: browserDistFolder,
        providers: [{provide: APP_BASE_HREF, useValue: baseUrl}]
      })
      .then((html: string) => res.send(html))
      .catch((err) => next(err))
  })

  return server
}

function run(): void {
  const port: string | 4000 = process.env['PORT'] || 4000

  const server: express.Express = app()
  server.listen(port, (): void => {
    console.log(`Node Express server listening on http://localhost:${port}`)
  })
}

run()
