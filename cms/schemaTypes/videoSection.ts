import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'videoSection',
  title: 'Video Section',
  type: 'object',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'body',
      title: 'Body',
      type: 'blockContent',
    }),
    defineField({
      name: 'videoId',
      title: 'YouTube video ID',
      type: 'string',
      description:
        'The id only, not the full URL: for https://www.youtube.com/watch?v=SPep4Aj3up8 enter SPep4Aj3up8.',
      validation: (Rule) => Rule.required().regex(/^[\w-]{11}$/, { name: 'YouTube video id' }),
    }),
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'videoId',
    },
  },
});
