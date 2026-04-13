import {
  CustomValidator,
  defineField,
  defineType,
  ImageRule,
  StringRule
} from 'sanity'

import {stringSlugValidator} from '../validators/stringSlug'

export default defineType({
  name: 'post',
  title: 'Post',
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
      name: 'excerpt',
      title: 'Excerpt',
      type: 'text',
      rows: 4
    }),
    defineField({
      name: 'mainImage',
      title: 'Main image',
      type: 'image',
      fields: [
        defineField({
          name: 'alt',
          type: 'string',
          title: 'Alternative text'
        })
      ],
      options: {
        hotspot: true
      },
      validation: (Rule: ImageRule) => Rule.required()
    }),
    defineField({
      name: 'body',
      title: 'Body',
      type: 'blockContent'
    }),
    defineField({
      name: 'featured',
      title: 'Featured',
      type: 'boolean',
      initialValue: false
    }),
    defineField({
      name: 'featuredButtons',
      title: 'Featured Buttons',
      type: 'array',
      of: [
        {
          type: 'featuredButton'
        }
      ]
    })
  ],
  preview: {
    select: {
      title: 'title',
      author: 'author.name',
      media: 'mainImage'
    },
    prepare(selection) {
      const {author} = selection
      return {...selection, subtitle: author && `by ${author}`}
    }
  }
})
