// src/pages/24-payment-gateway/api/webhook.ts
export const prerender = false // Wajib mode serverless dynamic

import type { APIRoute } from 'astro'
import { supabase } from '../../../utils/supabase'

export const POST: APIRoute = async ({ request }) => {
  try {
    // 1. Ambil data JSON kiriman dari server Xendit
    const body = await request.json()

    // 2. Tangkap status pembayaran dan ID invoice eksternal dari payload Xendit
    const { status, external_id } = body

    // 3. Validasi: Pastikan status yang dikirim Xendit benar-benar 'PAID' atau 'SETTLED'
    if (status === 'PAID' || status === 'SETTLED') {
      // Update status database Supabase kita menjadi 'PAID' secara instant berdasarkan external_id
      const { error } = await supabase
        .from('event_tickets')
        .update({ status: 'PAID' })
        .eq('external_id', external_id)

      if (error) {
        console.error('❌ Gagal update database via webhook:', error.message)
        return new Response(JSON.stringify({ message: 'DB Error' }), {
          status: 500,
        })
      }

      console.log(
        `✅ Webhook Sukses! Tiket dengan Invoice ${external_id} Resmi LUNAS.`,
      )

      // Berikan respon balik ke Xendit tanda kiriman data sukses diterima dengan selamat
      return new Response(JSON.stringify({ status: 'SUCCESS' }), {
        status: 200,
      })
    }

    return new Response(JSON.stringify({ message: 'Status is not paid' }), {
      status: 200,
    })
  } catch (error: any) {
    console.error('💥 Webhook crash error:', error.message)
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
    })
  }
}
