import { defineArrayMember, defineField, defineType } from 'sanity';

import { stringSlugValidator } from '../validators/stringSlug';

export default defineType({
  name: 'post',
  title: 'Post',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'string',
      description: 'Used in the article URL: /actualites/<slug>.',
      validation: (Rule) => Rule.required().custom(stringSlugValidator),
    }),
    defineField({
      name: 'excerpt',
      title: 'Excerpt',
      type: 'text',
      rows: 4,
      description: 'Shown on the news listing and in the home page hero.',
    }),
    defineField({
      name: 'mainImage',
      title: 'Main image',
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
    defineField({
      name: 'body',
      title: 'Body',
      type: 'blockContent',
    }),
    defineField({
      name: 'featured',
      title: 'Featured',
      type: 'boolean',
      description: 'Featured posts are promoted to the home page hero.',
      initialValue: false,
    }),
    defineField({
      name: 'featuredButtons',
      title: 'Featured Buttons',
      type: 'array',
      description: 'Extra call-to-action buttons, shown in the home page hero only.',
      of: [defineArrayMember({ type: 'featuredButton' })],
    }),
  ],
  orderings: [
    {
      name: 'createdAtDesc',
      title: 'Newest first',
      by: [{ field: '_createdAt', direction: 'desc' }],
    },
  ],
  preview: {
    select: {
      title: 'title',
      excerpt: 'excerpt',
      featured: 'featured',
      media: 'mainImage',
    },
    prepare({ title, excerpt, featured }) {
      return {
        title: featured ? `★ ${title}` : title,
        subtitle: excerpt,
      };
    },
  },
});
