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

    // 1. Dapatkan domain origin dinamis web lo (cth: https://coba-fitur.vercel.app)
    const requestUrl = new URL(request.url)
    const domainOrigin = requestUrl.origin

    // 2. JALUR PINTAS: API langsung nembak halaman 20 secara internal
    // dengan membawa parameter khusus untuk memaksa Vercel memperbarui cache-nya.
    const targetUrl = `${domainOrigin}/20-caching-webhook?bypass=true`

    await fetch(targetUrl, {
      method: 'GET',
      headers: {
        'x-vercel-revalidate': '1',
        'Cache-Control': 'no-cache',
      },
    })

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Sinyal Webhook sukses dikonversi menjadi hard purge! ⚡',
      }),
      { status: 200 },
    )
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
    })
  }
}
