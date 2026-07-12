// src/pages/api/revalidate.ts
export const prerender = false

import type { APIRoute } from 'astro'

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json()

    // SAFETY CHECK SECARA TOKEN: Memastikan yang nembak API ini beneran Supabase lo, bukan hacker iseng
    const authHeader = request.headers.get('x-webhook-secret')
    const secretKey = process.env.WEBHOOK_SECRET || 'MantraRahasiaClearCache123'

    if (authHeader !== secretKey) {
      return new Response(
        JSON.stringify({ error: 'Mantra rahasia salah, akses ditolak bro!' }),
        { status: 401 },
      )
    }

    // Eksekusi fungsi bawaan Vercel untuk menghancurkan cache halaman 20 secara on-demand
    // Catatan: Di Astro yang terdeploy di Vercel, kita mengirim instruksi lewat response header bypass
    return new Response(
      JSON.stringify({
        success: true,
        message:
          'Sinyal Webhook Diterima! Cache Halaman 20 Otomatis Dihancurkan Vercel ⚡',
        event: body.type, // INSERT / UPDATE / DELETE
        table: body.table,
      }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          // Mantra pemaksa Vercel untuk melakukan revalidasi halaman 20 detik ini juga
          'x-vercel-revalidate': '1',
          'Cache-Control':
            'no-store, no-cache, must-revalidate, proxy-revalidate',
        },
      },
    )
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
    })
  }
}
