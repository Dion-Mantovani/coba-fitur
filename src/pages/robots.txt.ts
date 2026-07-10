// src/pages/robots.txt.ts
import type { APIRoute } from 'astro'

export const GET: APIRoute = ({ site }) => {
  // 1. Cek apakah ini mode Production atau bukan
  const isProduction = import.meta.env.PROD

  // 2. Ambil URL sitemap otomatis dari astro.config.mjs
  const sitemapUrl = new URL('sitemap-index.xml', site).href

  // 3. Logika konten robots.txt
  const robotsTxt = isProduction
    ? `
User-agent: *
Allow: /

User-agent: Google-Extended
Allow: /

User-agent: GPTBot
Allow: /

User-agent: CCBot
Allow: /

Sitemap: ${sitemapUrl}
    `.trim()
    : `
User-agent: *
Disallow: /
    `.trim()

  return new Response(robotsTxt, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
    },
  })
}
