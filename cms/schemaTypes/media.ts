import {
  CustomValidator,
  defineField,
  defineType,
  ImageRule,
  StringRule
} from 'sanity'

import {stringSlugValidator} from '../validators/stringSlug'

export default defineType({
  name: 'media',
  title: 'Media',
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
      name: 'image',
      type: 'image',
      fields: [
        defineField({
          name: 'alt',
          type: 'string',
          title: 'Alternative text'
        })
      ],
      options: {hotspot: true},
      validation: (Rule: ImageRule) => Rule.required()
    })
  ],
  preview: {
    select: {
      title: 'title',
      media: 'image'
    },
    prepare(selection) {
      return {...selection}
    }
  }
})
