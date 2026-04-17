import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'size',
  title: 'Size',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Name',
      type: 'string',
      description: 'e.g. "7 Cupcakes", "19 Cupcakes", "44 Cupcakes", "86 Cupcakes"',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'price',
      title: 'Price',
      type: 'number',
      validation: (Rule) => Rule.required().min(0),
    }),
    defineField({
      name: 'servings',
      title: 'Servings',
      type: 'string',
      description: 'e.g. "Serves 3-4"',
    }),
    defineField({
      name: 'available',
      title: 'Available',
      type: 'boolean',
      initialValue: true,
    }),
  ],
  preview: {
    select: {title: 'name', subtitle: 'servings'},
  },
})
