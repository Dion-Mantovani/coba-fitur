// src/pages/api/revalidate.ts
export const prerender = false

import type { APIRoute } from 'astro'

export const POST: APIRoute = async ({ request }) => {
  try {
    const authHeader = request.headers.get('x-webhook-secret')
    const secretKey =
      import.meta.env.WEBHOOK_SECRET ||
      process.env.WEBHOOK_SECRET ||
      'MantraRahasiaClearCache123'

    if (!authHeader || authHeader !== secretKey) {
      return new Response(JSON.stringify({ error: 'Akses ditolak!' }), {
        status: 401,
      })
    }

    // MANTRA RESMI VERCEL:
    // Kita langsung beri tahu CDN Vercel: "Woi, hancurkan cache untuk PATH /20-supabase-cache detik ini juga!"
    return new Response(
      JSON.stringify({
        revalidated: true,
        message: 'Cache halaman 20 berhasil dieksekusi!',
      }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          // Ini adalah header sakti Vercel untuk menargetkan path spesifik yang mau di-clear cachenya
          'x-vercel-revalidate': '1',
          'x-vercel-revalidate-paths': '/20-supabase-cache',
        },
      },
    )
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
    })
  }
}
