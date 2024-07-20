import {defineField, defineType} from 'sanity'

export const duration = defineType({
  name: 'duration',
  title: 'Duration',
  description: 'A start and finish time',
  type: 'object',
  fields: [
    defineField({
      name: 'start',
      type: 'timeValue'
    }),
    defineField({
      name: 'end',
      type: 'timeValue'
    })
  ],
  // make the fields render next to each other
  options: {columns: 2}
})
