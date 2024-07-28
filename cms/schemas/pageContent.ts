import {CustomValidator, defineField, defineType, StringRule} from 'sanity'

import {stringSlugValidator} from '../validators/stringSlug'

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
      type: 'string',
      validation: (Rule: StringRule) =>
        Rule.required().custom(stringSlugValidator as CustomValidator)
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
