// src/pages/api/promo.ts
export const prerender = false

import type { APIRoute } from 'astro'
import { supabase } from '../../utils/supabase'

// PUT: Memperbarui data produk dengan harga diskon dan batas waktu promo
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

    // Update data promo di tabel items berdasarkan ID
    const { data, error } = await supabase
      .from('items')
      .update({
        discount_price: Number(discount_price),
        promo_ends_at: promo_ends_at
          ? new Date(promo_ends_at).toISOString()
          : null,
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
