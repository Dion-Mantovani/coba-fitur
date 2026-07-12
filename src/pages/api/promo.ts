// src/pages/api/promo.ts
export const prerender = false

import type { APIRoute } from 'astro'
import { supabase } from '../../utils/supabase'

export const PUT: APIRoute = async ({ request }) => {
  try {
    const body = await request.json()
    const { id, discount_price, promo_ends_at } = body

    if (!id) {
      return new Response(
        JSON.stringify({ error: 'ID produk wajib ada, bro!' }),
        { status: 400 },
      )
    }

    // FIX SELISIH 7 JAM VERCEL:
    // Input dari HTML datetime-local menghasilkan format "YYYY-MM-DDTHH:mm" (tanpa info zona waktu).
    // Kita paksa tambahkan karakter "+07:00" di buntutnya agar Vercel tahu ini jam WIB (GMT+7)
    // sebelum diubah menjadi ISO String global untuk disimpan ke Supabase.
    let formattedDate = null
    if (promo_ends_at) {
      const wibDateString = promo_ends_at.includes('+')
        ? promo_ends_at
        : `${promo_ends_at}:00+07:00`
      formattedDate = new Date(wibDateString).toISOString()
    }

    // Update data promo di tabel items berdasarkan ID
    const { data, error } = await supabase
      .from('items')
      .update({
        discount_price: Number(discount_price),
        promo_ends_at: formattedDate,
      })
      .eq('id', Number(id))
      .select()

    if (error) throw error

    return new Response(JSON.stringify({ success: true, data }), {
      status: 200,
    })
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
    })
  }
}
