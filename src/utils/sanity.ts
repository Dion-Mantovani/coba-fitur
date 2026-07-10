// src/utils/sanity.ts
import { createClient } from '@sanity/client'

export const sanityClient = createClient({
  projectId: import.meta.env.PUBLIC_SANITY_PROJECT_ID,
  dataset: import.meta.env.PUBLIC_SANITY_DATASET,
  useCdn: true, // true untuk performa loading super cepat via cache edge server Sanity
  apiVersion: '2024-03-01', // Sesuaikan tanggal API version global
})
