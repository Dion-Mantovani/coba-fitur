// src/pages/15-astro-api/data.json.ts
import type { APIRoute } from 'astro'

// Method GET: Membawa data tiruan paket travel saat URL ditembak
export const GET: APIRoute = async ({ request }) => {
  const mockTravelData = [
    {
      id: 1,
      destination: 'K Kyoto, Jepang',
      price: 15500000,
      status: 'Tersedia',
    },
    {
      id: 2,
      destination: 'Raja Ampat, Indonesia',
      price: 8900000,
      status: 'Promo',
    },
    {
      id: 3,
      destination: 'Lombok, Turki',
      price: 12000000,
      status: 'Penuh',
    },
  ]

  return new Response(
    JSON.stringify({
      success: true,
      message: 'Data API berhasil ditarik langsung dari server Astro!',
      timestamp: new Date().toISOString(),
      data: mockTravelData,
    }),
    {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        // 'Cache-Control': 'public, max-age=3600',
        'Cache-Control': 'no-store, no-cache, must-revalidate',
      },
    },
  )
}
