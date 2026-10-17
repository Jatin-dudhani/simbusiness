import { NextResponse } from 'next/server';

/**
 * Server-Side Supplier Integration Route
 * Shields the PRINTFUL_API_KEY from browser inspection
 */
export async function GET() {
  const apiKey = process.env.PRINTFUL_API_KEY;

  if (apiKey) {
    try {
      const res = await fetch('https://api.printful.com/products', {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        },
        next: { revalidate: 3600 }
      });

      if (res.ok) {
        const data = await res.json();
        return NextResponse.json({
          status: 'connected',
          provider: 'Printful Global POD Catalog',
          totalCatalogItems: Array.isArray(data.result) ? data.result.length : 0,
          result: data.result || [],
        });
      }
    } catch (e) {
      console.warn('Printful live sync error, falling back to directory:', e);
    }
  }

  return NextResponse.json({
    status: 'simulated',
    provider: 'Global Supplier Network',
    message: 'Operating in high-fidelity simulated supplier sandbox.'
  });
}
