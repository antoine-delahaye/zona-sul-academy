import fs from 'node:fs'
import {EOL} from 'node:os'
import {join} from 'node:path'

import {worker} from './paths.mjs'

const serverPolyfillsFile = join(worker, 'polyfills.server.mjs')
const serverPolyfillsData = fs
  .readFileSync(serverPolyfillsFile, 'utf8')
  .split(/\r?\n/)

for (let index = 0; index < 2; index++) {
  if (serverPolyfillsData[index].includes('createRequire')) {
    serverPolyfillsData[index] = '// ' + serverPolyfillsData[index]
  }
}

// Add needed polyfills
serverPolyfillsData.unshift(`globalThis['process'] = {env: {NODE_ENV: 'production'}};`)

fs.writeFileSync(serverPolyfillsFile, serverPolyfillsData.join(EOL))
