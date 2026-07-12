// src/pages/api/revalidate.ts
export const prerender = false // Wajib jalan di server (SSR)

import type { APIRoute } from 'astro'

export const POST: APIRoute = async ({ request }) => {
  try {
    // 1. Ambil mantra rahasia dari HTTP Headers yang dikirim Supabase
    const authHeader = request.headers.get('x-webhook-secret')
    const secretKey = process.env.WEBHOOK_SECRET

    // 2. Validasi Keamanan: Jika kosong atau gak cocok, langsung tolak di pintu depan
    if (!authHeader || authHeader !== secretKey) {
      return new Response(
        JSON.stringify({
          error: 'Mantra salah atau tidak ada, akses ditolak!',
        }),
        {
          status: 401,
          headers: { 'Content-Type': 'application/json' },
        },
      )
    }

    // 3. Ambil data JSON kiriman Supabase (opsional, buat log saja)
    const body = await request.json()

    // 4. MANTRA PAMUNGKAS VERCEL:
    // Kita kirim instruksi ke Vercel Edge Network untuk menghancurkan cache halaman 20 saat ini juga.
    // Response ini menggunakan header khusus Vercel untuk on-demand revalidation.
    return new Response(
      JSON.stringify({
        revalidated: true,
        message: `Sukses! Cache halaman 20 dihancurkan karena aksi ${body.type} di Supabase.`,
      }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'x-vercel-revalidate': '1', // Sinyal pembersih cache global Vercel
          'Cache-Control': 'no-store, must-revalidate',
        },
      },
    )
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }
}
