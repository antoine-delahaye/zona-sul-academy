import {
  DateRule,
  defineField,
  defineType,
  StringRule,
  ValidationContext
} from 'sanity'

export default defineType({
  name: 'planningEvent',
  title: 'Planning event',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (Rule: StringRule) => Rule.required()
    }),
    defineField({
      name: 'date',
      title: 'Date',
      type: 'date',
      validation: (Rule: DateRule) =>
        Rule.custom((date: string | undefined, context: ValidationContext) => {
          const day = context.document?.day
          if (!date && !day) {
            return 'Either date or day must be filled'
          }
          return true
        })
    }),
    defineField({
      name: 'day',
      type: 'dayName',
      validation: (Rule) =>
        Rule.custom((day, context: ValidationContext) => {
          const date = context.document?.date
          if (!day && !date) {
            return 'Either day or date must be filled'
          }
          return true
        })
    }),
    defineField({
      name: 'duration',
      type: 'duration'
    }),
    defineField({
      name: 'location',
      title: 'Location',
      type: 'string'
    }),
    defineField({
      name: 'person',
      title: 'Person',
      type: 'string'
    })
  ],
  preview: {
    select: {
      title: 'title',
      date: 'startTime',
      duration: 'duration',
      location: 'location',
      person: 'person'
    },
    prepare(selection) {
      const {title, duration, location} = selection
      return {
        title: `${title}`,
        subtitle: `${duration.start} - ${duration.end} at ${location}`
      }
    }
  }
})
