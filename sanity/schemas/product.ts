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
      type: 'reference',
      to: [{type: 'category'}],
      description:
        'Manage categories under the "Category" document type in Studio. Adding a new Category document makes it available here.',
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
      title: 'Dietary Options',
      description: 'Pick a dietary option and set its extra price for this product.',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'dietaryPrice',
          fields: [
            defineField({
              name: 'key',
              title: 'Dietary Option',
              type: 'string',
              options: {
                list: [
                  {title: 'Gluten-Free', value: 'gluten-free'},
                  {title: 'Vegan', value: 'vegan'},
                  {title: 'Dairy-Free', value: 'dairy-free'},
                ],
              },
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'price',
              title: 'Extra Price ($)',
              type: 'number',
              validation: (Rule) => Rule.required().min(0),
            }),
          ],
          preview: {
            select: {title: 'key', subtitle: 'price'},
            prepare({title, subtitle}) {
              const labels: Record<string, string> = {
                'gluten-free': 'Gluten-Free',
                'vegan': 'Vegan',
                'dairy-free': 'Dairy-Free',
              };
              return {
                title: title ? labels[title] ?? title : 'Pick an option',
                subtitle: subtitle != null ? `+$${subtitle}` : '',
              };
            },
          },
        }),
      ],
    }),
    defineField({
      name: 'fillingPrices',
      title: 'Filling Prices (Cakes only)',
      description: 'Optionally override the default filling prices for this cake. Leave empty to use defaults.',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'fillingPrice',
          fields: [
            defineField({
              name: 'key',
              title: 'Filling',
              type: 'string',
              options: {
                list: [
                  {title: 'Vanilla Buttercream', value: 'vanilla-buttercream'},
                  {title: 'Cream Cheese', value: 'cream-cheese'},
                  {title: 'Chocolate Ganache', value: 'chocolate-ganache'},
                  {title: 'Biscoff', value: 'biscoff'},
                ],
              },
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'price',
              title: 'Extra Price ($)',
              type: 'number',
              validation: (Rule) => Rule.required().min(0),
            }),
          ],
          preview: {
            select: {title: 'key', subtitle: 'price'},
            prepare({title, subtitle}) {
              const labels: Record<string, string> = {
                'vanilla-buttercream': 'Vanilla Buttercream',
                'cream-cheese': 'Cream Cheese',
                'chocolate-ganache': 'Chocolate Ganache',
                'biscoff': 'Biscoff',
              };
              return {
                title: title ? labels[title] ?? title : 'Pick a filling',
                subtitle: subtitle != null ? `+$${subtitle}` : '',
              };
            },
          },
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
    select: {
      title: 'name',
      subtitle: 'category.name',
      media: 'image',
    },
  },
})
