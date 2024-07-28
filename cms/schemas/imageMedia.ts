import {
  CustomValidator,
  defineField,
  defineType,
  ImageRule,
  StringRule
} from 'sanity'

import {stringSlugValidator} from '../validators/stringSlug'

export default defineType({
  name: 'imageMedia',
  title: 'Image',
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
      title: 'Image',
      type: 'image',
      fields: [
        {
          name: 'alt',
          title: 'Alt Text',
          type: 'string',
          options: {
            isHighlighted: true
          }
        }
      ],
      options: {
        hotspot: true
      },
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
