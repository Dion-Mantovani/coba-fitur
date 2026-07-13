---
title: 'Otomatisasi Penuh Menggunakan Supabase Webhook'
pubDate: 2026-07-16
description: 'Menghubungkan trigger database Supabase untuk memicu pembersihan cache Redis secara instan dalam hitungan milidetik.'
author: 'Lo Sendiri'
coverImage: 'https://images.unsplash.com/photo-1544383835-bda2bc66a55d?q=80&w=600'
draft: false
---

# Menutup Lingkaran Arsitektur Pintar

Ini adalah potongan teka-teki terakhir yang kita selesaikan kemarin. Bagaimana cara membuat Redis tahu kalau ada data di Supabase yang berubah? Jawabannya: **Database Webhook**.

## Alur kerja pipa otomatis lo:

1. Admin mengubah harga barang atau status promo di dashboard Supabase.
2. Supabase mendeteksi perubahan (`UPDATE/INSERT/DELETE`) dan langsung memicu _Webhook Event_.
3. Webhook menembak API Route Vercel kita (`/api/revalidate`).
4. API kita mengeksekusi `redis.del()` untuk menghancurkan cache lama.

Sekarang, lingkaran arsitekturnya sudah sempurna. Web super cepat karena cache Redis, tapi datanya dijamin $100\%$ selalu akurat karena dijaga oleh Webhook!
