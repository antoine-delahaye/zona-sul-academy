import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'planningEvent',
  title: 'Planning event',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
    }),
    defineField({
      name: 'date',
      title: 'Date',
      type: 'date',
    }),
    defineField({
      name: 'day',
      type: 'dayName',
    }),
    defineField({
      name: 'duration',
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
      date: 'startTime',
      duration: 'duration',
      location: 'location',
      person: 'person',
    },
    prepare(selection) {
      const {title, duration, location} = selection
      return {
        title: `${title}`,
        subtitle: `${duration.start} - ${duration.end} at ${location}`,
      }
    },
  },
})
