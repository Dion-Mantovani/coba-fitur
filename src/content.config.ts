// src/content.config.ts
import { defineCollection, z } from 'astro:content'
import { glob } from 'astro/loaders'

const postsCollection = defineCollection({
  // Kita kunci di format .md yang aman sentosa
  loader: glob({ pattern: '**/[^_]*.md', base: './src/blog' }),
  schema: z.object({
    title: z.string(),
    pubDate: z.coerce.date(),
    description: z.string(),
    author: z.string(),
    coverImage: z.string().url(),
    draft: z.boolean().default(false),
  }),
})

export const collections = {
  posts: postsCollection,
}
