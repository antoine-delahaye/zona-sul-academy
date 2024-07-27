import {defineField, defineType, ImageRule, SlugRule, StringRule} from 'sanity'

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
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 96
      },
      validation: (Rule: SlugRule) => Rule.required()
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
      return {
        title: selection.title,
        media: selection.media
      }
    }
  }
})
