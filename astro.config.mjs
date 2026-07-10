// @ts-check
import { defineConfig } from 'astro/config'

import tailwindcss from '@tailwindcss/vite'
import alpinejs from '@astrojs/alpinejs'
import sitemap from '@astrojs/sitemap'
import vercel from '@astrojs/vercel'

// https://astro.build/config
export default defineConfig({
  // Tambahkan ini untuk menambahkan trailing slash pada URL
  // trailingSlash: 'always',
  // Tambahkan ini untuk menambahkan format directory pada build
  // build: {
  //   format: 'directory',
  // },

  output: 'hybrid',

  adapter: vercel(),

  site: 'https://coba-fitur.vercel.app', // Pastikan atribut site ini ada

  vite: {
    plugins: [tailwindcss()],
  },

  // Tambahkan ini untuk menambahkan plugin alpinejs dan sitemap
  integrations: [alpinejs(), sitemap()],

  image: {
    service: {
      entrypoint: 'astro/assets/services/sharp',
    },
  },
})
