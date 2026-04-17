import {defineArrayMember, defineField, defineType} from 'sanity'

export default defineType({
  name: 'product',
  title: 'Product',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Name',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {source: 'name', maxLength: 96},
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'category',
      title: 'Category',
      type: 'string',
      options: {
        list: [
          {title: 'Bouquets', value: 'bouquets'},
          {title: 'Boxed Cupcakes', value: 'boxed-cupcakes'},
          {title: 'Mini Cupcakes', value: 'mini-cupcakes'},
          {title: 'Cakes', value: 'cakes'},
          {title: 'Party Favours', value: 'party-favours'},
        ],
        layout: 'radio',
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
    }),
    defineField({
      name: 'image',
      title: 'Image',
      type: 'image',
      options: {hotspot: true},
      fields: [
        defineField({name: 'alt', title: 'Alt text', type: 'string'}),
      ],
    }),
    defineField({
      name: 'secondaryImage',
      title: 'Secondary Image',
      type: 'image',
      options: {hotspot: true},
      fields: [
        defineField({name: 'alt', title: 'Alt text', type: 'string'}),
      ],
    }),
    defineField({
      name: 'basePrice',
      title: 'Base Price',
      type: 'number',
      validation: (Rule) => Rule.required().min(0),
    }),
    defineField({
      name: 'flavors',
      title: 'Flavors',
      description: 'Pick from the flavors in the Flavor list.',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'reference',
          to: [{type: 'flavor'}],
        }),
      ],
    }),
    defineField({
      name: 'maxFlavors',
      title: 'Max Flavors',
      type: 'number',
    }),
    defineField({
      name: 'minOrder',
      title: 'Minimum Order',
      type: 'number',
    }),
    defineField({
      name: 'sizes',
      title: 'Sizes',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'productSize',
          fields: [
            defineField({name: 'name', title: 'Name', type: 'string'}),
            defineField({name: 'pieces', title: 'Pieces', type: 'number'}),
            defineField({name: 'price', title: 'Price', type: 'number'}),
            defineField({name: 'serves', title: 'Serves', type: 'string'}),
          ],
          preview: {select: {title: 'name', subtitle: 'serves'}},
        }),
      ],
    }),
    defineField({
      name: 'dietaryPrices',
      title: 'Dietary Prices',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'dietaryPrice',
          fields: [
            defineField({name: 'key', title: 'Key', type: 'string'}),
            defineField({name: 'price', title: 'Price', type: 'number'}),
          ],
          preview: {select: {title: 'key', subtitle: 'price'}},
        }),
      ],
    }),
    defineField({
      name: 'available',
      title: 'Visible in Shop',
      description: 'Turn off to hide this product from your shop without deleting it.',
      type: 'boolean',
      initialValue: true,
    }),
  ],
  preview: {
    select: {title: 'name', subtitle: 'category', media: 'image'},
  },
})
