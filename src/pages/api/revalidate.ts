// src/pages/api/revalidate.ts
export const prerender = false

import type { APIRoute } from 'astro'

export const POST: APIRoute = async ({ request }) => {
  try {
    const authHeader = request.headers.get('x-webhook-secret')

    // GUNAKAN TRIK DUAL-READING:
    // Kita cek lewat import.meta.env, KALO KOSONG, paksa ambil dari runtime process.env Vercel.
    // Kalo dua-duanya kosong (karena belum sinkron), kita kunci ke String Cadangan.
    const secretKey =
      import.meta.env.WEBHOOK_SECRET ||
      process.env.WEBHOOK_SECRET ||
      'MantraRahasiaClearCache123'

    if (!authHeader || authHeader !== secretKey) {
      console.error(
        `Gagal Validasi! Supabase mengirim: "${authHeader}", Kunci Vercel: "${secretKey}"`,
      )
      return new Response(
        JSON.stringify({
          error: 'Mantra salah, akses ditolak!',
          debug: { dikirim: authHeader, dikenali: secretKey },
        }),
        {
          status: 401,
          headers: { 'Content-Type': 'application/json' },
        },
      )
    }

    const body = await request.json()

    return new Response(
      JSON.stringify({
        revalidated: true,
        message: 'Sukses menghancurkan cache halaman 20!',
      }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'x-vercel-revalidate': '1',
          'Cache-Control': 'no-store, must-revalidate',
        },
      },
    )
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
    })
  }
}
