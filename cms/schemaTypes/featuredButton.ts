import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'featuredButton',
  title: 'Featured Button',
  type: 'object',
  fields: [
    defineField({
      name: 'text',
      title: 'Text',
      type: 'string'
    }),
    defineField({
      name: 'url',
      title: 'URL',
      type: 'url'
    }),
    defineField({
      title: 'Open in new tab',
      name: 'openInNewTab',
      type: 'boolean',
      initialValue: false
    })
  ]
})
