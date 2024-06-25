import {defineType} from 'sanity'

export const dayName = defineType({
  name: 'dayName',
  title: 'Day Name',
  type: 'string',
  options: {
    list: [
      {title: 'Monday', value: '1'},
      {title: 'Tuesday', value: '2'},
      {title: 'Wednesday', value: '3'},
      {title: 'Thursday', value: '4'},
      {title: 'Friday', value: '5'},
      {title: 'Saturday', value: '6'},
      {title: 'Sunday', value: '7'},
    ],
  },
})