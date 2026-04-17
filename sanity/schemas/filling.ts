import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'filling',
  title: 'Filling',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Name',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'available',
      title: 'Available',
      type: 'boolean',
      initialValue: true,
    }),
  ],
  preview: {
    select: {title: 'name'},
  },
})
