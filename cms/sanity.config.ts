import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {visionTool} from '@sanity/vision'
import {schemaTypes} from './schemaTypes'

export default defineConfig({
  name: 'default',
  title: 'zona-sul-academy',

  projectId: 'a4vlamka',
  dataset: 'default',

  plugins: [structureTool(), visionTool()],

  schema: {
    types: schemaTypes,
  },
})
