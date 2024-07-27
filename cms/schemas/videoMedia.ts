import {defineField, defineType, FileRule, SlugRule, StringRule} from 'sanity'

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
      type: 'slug',
      validation: (Rule: SlugRule) => Rule.required(),
      options: {
        source: 'title',
        maxLength: 96
      }
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
      return {
        title: selection.title,
        media: selection.media
      }
    }
  }
})
