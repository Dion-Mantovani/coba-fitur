// src/pages/api/revalidate.ts
export const prerender = false

import type { APIRoute } from 'astro'
import { Redis } from '@upstash/redis'

// Inisialisasi Redis menggunakan Env Vercel
const redis = new Redis({
  url:
    import.meta.env.UPSTASH_REDIS_REST_URL ||
    process.env.UPSTASH_REDIS_REST_URL ||
    '',
  token:
    import.meta.env.UPSTASH_REDIS_REST_TOKEN ||
    process.env.UPSTASH_REDIS_REST_TOKEN ||
    '',
})

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

    // KONSEP WEBHOOK MURNI:
    // Hapus total data ber-key 'supabase_items_cache' di memori Redis detik ini juga!
    await redis.del('supabase_items_cache')

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Webhook Sukses! Memori Redis Berhasil Dibersihkan Instan! ⚡',
      }),
      { status: 200 },
    )
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
    })
  }
}
