import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'membershipSection',
  title: 'Membership Section',
  type: 'object',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string'
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'blockContent'
    }),
    defineField({
      name: 'requirements',
      title: 'Requirements',
      type: 'array',
      of: [{type: 'string'}]
    }),
    defineField({
      name: 'priceInfo',
      title: 'Price Info',
      type: 'string'
    }),
    defineField({
      name: 'additionalInfo',
      title: 'Additional Info',
      type: 'string'
    }),
    defineField({
      name: 'price',
      title: 'Price',
      type: 'number'
    }),
    defineField({
      name: 'buttonUrl',
      title: 'Button URL',
      type: 'string'
    }),
    defineField({
      name: 'buttonText',
      title: 'Button Text',
      type: 'string'
    })
  ]
})
