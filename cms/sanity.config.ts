import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {visionTool} from '@sanity/vision'

import {schemaTypes} from './schemas'

export default defineConfig({
  name: 'default',
  title: 'Zona Sul Academy',

  projectId: 'a4vlamka',
  dataset: 'development',

  plugins: [structureTool(), visionTool()],

  schema: {
    types: schemaTypes,
  },
})
