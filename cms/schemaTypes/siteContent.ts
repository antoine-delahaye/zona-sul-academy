import { defineArrayMember, defineField, defineType } from 'sanity';

import { stringSlugValidator } from '../validators/stringSlug';

export default defineType({
  name: 'siteContent',
  title: 'Site Content',
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
      description:
        'Identifier the site looks this page up by: `presentation`, `tarifs`, `planning` or `bouton-adhesion`.',
      validation: (Rule) => Rule.required().custom(stringSlugValidator),
    }),
    defineField({
      name: 'subtitle',
      title: 'Subtitle',
      type: 'blockContent',
      description: 'Intro paragraphs shown under the page title.',
    }),
    defineField({
      name: 'pageBuilder',
      title: 'Page builder',
      type: 'array',
      of: [
        defineArrayMember({ name: 'imageSection', type: 'imageSection' }),
        defineArrayMember({ name: 'videoSection', type: 'videoSection' }),
        defineArrayMember({ name: 'membershipSection', type: 'membershipSection' }),
      ],
    }),
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'slug',
    },
  },
});
