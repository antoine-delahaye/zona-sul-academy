import {
  CustomValidator,
  defineArrayMember,
  defineField,
  defineType,
  StringRule
} from 'sanity'

import {stringSlugValidator} from '../validators/stringSlug'

export default defineType({
  name: 'siteContent',
  title: 'Site Content',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      type: 'string'
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'string',
      validation: (Rule: StringRule) =>
        Rule.required().custom(stringSlugValidator as CustomValidator)
    }),
    defineField({
      name: 'subtitle',
      title: 'Subtitle',
      type: 'blockContent'
    }),
    defineField({
      name: 'pageBuilder',
      title: 'Page builder',
      type: 'array',
      of: [
        defineArrayMember({
          name: 'imageSection',
          type: 'imageSection'
        }),
        defineArrayMember({
          name: 'videoSection',
          type: 'videoSection'
        }),
        defineArrayMember({
          name: 'membershipSection',
          type: 'membershipSection'
        })
      ]
    })
  ]
})
