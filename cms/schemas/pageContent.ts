import {defineField, defineType, SlugRule, StringRule} from 'sanity'

export default defineType({
  name: 'pageContent',
  title: 'Page Content',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (Rule: StringRule) => Rule.required()
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 96
      },
      validation: (Rule: SlugRule) => Rule.required()
    }),
    defineField({
      name: 'body',
      title: 'Body',
      type: 'blockContent'
    })
  ],
  preview: {
    select: {
      title: 'title'
    },
    prepare(selection) {
      return {...selection}
    }
  }
})
