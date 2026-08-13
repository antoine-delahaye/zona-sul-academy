import { defineField, defineType } from 'sanity';

import { stringSlugValidator } from '../validators/stringSlug';

export default defineType({
  name: 'media',
  title: 'Media',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      description: 'Used as the image label when no alternative text is provided.',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'string',
      description: 'Identifier the site uses to look this image up, e.g. `logo` or `planning`.',
      validation: (Rule) => Rule.required().custom(stringSlugValidator),
    }),
    defineField({
      name: 'image',
      title: 'Image',
      type: 'image',
      options: { hotspot: true },
      fields: [
        defineField({
          name: 'alt',
          title: 'Alternative text',
          type: 'string',
          description: 'Read aloud by screen readers. Leave empty only for decorative images.',
          validation: (Rule) => Rule.required().warning('Add alternative text for accessibility.'),
        }),
      ],
      validation: (Rule) => Rule.required(),
    }),
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'slug',
      media: 'image',
    },
  },
});
