import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'planningEvent',
  title: 'Planning Event',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'date',
      title: 'Date',
      type: 'date',
      description: 'For a one-off event. Use "Day" instead for a weekly slot.',
      validation: (Rule) =>
        Rule.custom((date, context) =>
          date || context.document?.day ? true : 'Either date or day must be filled',
        ),
    }),
    defineField({
      name: 'day',
      title: 'Day',
      type: 'dayName',
      description: 'For a slot that repeats every week.',
      validation: (Rule) =>
        Rule.custom((day, context) =>
          day || context.document?.date ? true : 'Either day or date must be filled',
        ),
    }),
    defineField({
      name: 'duration',
      title: 'Duration',
      type: 'duration',
    }),
    defineField({
      name: 'location',
      title: 'Location',
      type: 'string',
    }),
    defineField({
      name: 'person',
      title: 'Person',
      type: 'string',
    }),
  ],
  preview: {
    select: {
      title: 'title',
      start: 'duration.start',
      end: 'duration.end',
      location: 'location',
    },
    // Every field here is optional, so the subtitle is assembled from whatever
    // is actually filled in rather than interpolated blindly.
    prepare({ title, start, end, location }) {
      const timeRange = start && end ? `${start} – ${end}` : (start ?? '');
      const subtitle = [timeRange, location].filter(Boolean).join(' · ');

      return {
        title: typeof title === 'string' ? title : 'Untitled event',
        subtitle: subtitle || undefined,
      };
    },
  },
});
