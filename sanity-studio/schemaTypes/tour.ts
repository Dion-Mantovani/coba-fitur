// sanity-studio/schemaTypes/tour.ts
import {defineType, defineField} from 'sanity'

export const tourType = defineType({
  name: 'tour',
  title: 'Paket Wisata',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Nama Paket Wisata',
      type: 'string',
      validation: (Rule) => Rule.required().error('Nama paket wajib diisi, bro!'),
    }),
    defineField({
      name: 'slug',
      title: 'Slug URL',
      type: 'slug',
      options: {
        source: 'name', // Otomatis nge-generate slug dari nama paket
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'price',
      title: 'Harga Paket (Rp)',
      type: 'number',
      validation: (Rule) => Rule.required().min(0),
    }),
    defineField({
      name: 'description',
      title: 'Deskripsi Paket',
      type: 'text', // Text biasa untuk deskripsi ringkas
    }),
    defineField({
      name: 'content',
      title: 'Konten Detail / Itinerary',
      type: 'array',
      of: [{type: 'block'}], // Ini namanya Portable Text (Rich Text Editor untuk bold, list, dll)
    }),
  ],
})
