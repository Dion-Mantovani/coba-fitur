// src/pages/api/revalidate.ts
export const prerender = false

import type { APIRoute } from 'astro'

export const POST: APIRoute = async ({ request }) => {
  try {
    const authHeader = request.headers.get('x-webhook-secret')

    // LANGSUNG TEMBAK STRING PAS: Kita kunci langsung ke teks cadangan
    // agar tidak terdistraksi oleh kosongnya environment variable di dashboard Vercel
    const secretKey = 'MantraRahasiaClearCache123'

    if (authHeader !== secretKey) {
      // Biar kalau eror lagi, kita bisa tau di log Vercel isi header yang dikirim Supabase itu apa
      console.error(
        `Mantra salah! Supabase ngirim: "${authHeader}" tapi yang diminta: "${secretKey}"`,
      )
      return new Response(
        JSON.stringify({ error: 'Akses Ditolak, Mantra Salah!' }),
        { status: 401 },
      )
    }

    const requestUrl = new URL(request.url)
    const domainOrigin = requestUrl.origin
    const targetUrl = `${domainOrigin}/20-supabase-cache?bypass=${secretKey}`

    await fetch(targetUrl, {
      method: 'GET',
      headers: { 'x-vercel-revalidate': '1' },
    })

    return new Response(JSON.stringify({ success: true }), { status: 200 })
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
    })
  }
}
