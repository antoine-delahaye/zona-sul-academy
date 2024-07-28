import {
  CustomValidator,
  defineField,
  defineType,
  FileRule,
  StringRule
} from 'sanity'

import {stringSlugValidator} from '../validators/stringSlug'

export default defineType({
  name: 'videoMedia',
  title: 'Video',
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
      name: 'video',
      title: 'Video',
      type: 'file',
      validation: (Rule: FileRule) => Rule.required()
    })
  ],
  preview: {
    select: {
      title: 'title',
      media: 'video'
    },
    prepare(selection) {
      return {...selection}
    }
  }
})
