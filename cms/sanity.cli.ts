import {defineCliConfig} from 'sanity/cli'

export default defineCliConfig({
  api: {
    projectId: 'a4vlamka',
    dataset: process.env.SANITY_STUDIO_DATASET || 'development'
  }
})
