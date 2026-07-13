---
title: 'Misteri Cache Vercel CDN yang Keras Kepala'
pubDate: 2026-07-14
description: 'Kisah di balik layar kenapa headers cache-control bawaan Vercel Edge Network sempat bikin pusing saat di-refresh.'
author: 'Lo Sendiri'
coverImage: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=600'
draft: false
---

# Menjinakkan Edge Network Cache

Kemarin kita sempat dibuat heran. Data di database Supabase sudah diubah, tapi pas halaman web di-refresh, datanya masih kekeh pakai yang lama. Ternyata itu ulah **Edge CDN Caching**-nya Vercel.

## Kenapa itu bisa terjadi?

Vercel Paket Gratisan (_Hobby Tier_) punya kebijakan cache yang cukup agresif di lapisan CDN-nya untuk menghemat bandwidth. Masalahnya, melakukan _cache invalidation_ secara pasif lewat konfigurasi header sering kali telat merespons perubahan real-time.

Dari sinilah kita sadar kalau kita butuh tameng cache independen yang bisa kita kontrol penuh dengan remote kontrol kita sendiri.
