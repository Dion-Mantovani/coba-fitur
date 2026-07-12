// src/pages/api/revalidate.ts
export const prerender = false

import type { APIRoute } from 'astro'

export const POST: APIRoute = async ({ request }) => {
  try {
    const authHeader = request.headers.get('x-webhook-secret')
    const secretKey = process.env.WEBHOOK_SECRET || 'MantraRahasiaClearCache123'

    if (authHeader !== secretKey) {
      return new Response(JSON.stringify({ error: 'Akses Ditolak!' }), {
        status: 401,
      })
    }

    // Dapatkan origin domain dinamis website lo (cth: https://proyek-lo.vercel.app)
    const requestUrl = new URL(request.url)
    const domainOrigin = requestUrl.origin

    // TRIK DEWA: Supabase menyuruh API ini ➡️ API ini langsung nembak halaman 20
    // dengan membawa token rahasia untuk memaksa Vercel membongkar dan memasak ulang cachenya saat itu juga!
    const targetUrl = `${domainOrigin}/20-supabase-cache?bypass=${secretKey}`

    await fetch(targetUrl, {
      method: 'GET',
      headers: { 'x-vercel-revalidate': '1' }, // Instruksi revalidasi paksa Vercel CDN
    })

    return new Response(
      JSON.stringify({
        success: true,
        message:
          'Mantra Webhook Berhasil! Gembok Cache Halaman 20 Sukses Dihancurkan Total! ⚡',
      }),
      { status: 200 },
    )
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
    })
  }
}
