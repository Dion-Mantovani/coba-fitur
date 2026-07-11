// src/pages/api/reviews.ts
export const prerender = false

import type { APIRoute } from 'astro'
import { supabase } from '../../utils/supabase'

// 1. GET: Ambil semua data
export const GET: APIRoute = async () => {
  try {
    const { data, error } = await supabase
      .from('reviews')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) throw error
    return new Response(JSON.stringify(data), { status: 200 })
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
    })
  }
}

// 2. POST: Buat data baru
export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json()
    const { username, rating, comment } = body

    if (!username || !rating || !comment) {
      return new Response(
        JSON.stringify({ error: 'Form wajib diisi semua, bro!' }),
        { status: 400 },
      )
    }

    const { data, error } = await supabase
      .from('reviews')
      .insert([{ username, rating: Number(rating), comment }])
      .select()

    if (error) throw error
    return new Response(JSON.stringify({ success: true, data }), {
      status: 201,
    })
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
    })
  }
}

// 3. PUT: Update data ulasan berdasarkan ID
export const PUT: APIRoute = async ({ request }) => {
  try {
    const body = await request.json()
    const { id, rating, comment } = body

    if (!id || !rating || !comment) {
      return new Response(
        JSON.stringify({
          error: 'ID, Rating, dan Komen wajib ada untuk update!',
        }),
        { status: 400 },
      )
    }

    const { data, error } = await supabase
      .from('reviews')
      .update({ rating: Number(rating), comment })
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

// 4. DELETE: Hapus ulasan berdasarkan ID
export const DELETE: APIRoute = async ({ request }) => {
  try {
    const url = new URL(request.url)
    const id = url.searchParams.get('id')

    if (!id) {
      return new Response(
        JSON.stringify({ error: 'Parameter ID tidak ditemukan!' }),
        { status: 400 },
      )
    }

    const { error } = await supabase
      .from('reviews')
      .delete()
      .eq('id', Number(id))

    if (error) throw error
    return new Response(JSON.stringify({ success: true }), { status: 200 })
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
    })
  }
}
