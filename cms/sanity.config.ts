import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {visionTool} from '@sanity/vision'

import {schemaTypes} from './index'

export default defineConfig({
  name: 'default',
  title: 'Zona Sul Academy',
  projectId: 'a4vlamka',

  dataset: process.env.SANITY_STUDIO_DATASET || 'development',

  plugins: [structureTool(), visionTool()],

  schema: {
    types: schemaTypes
  }
})
