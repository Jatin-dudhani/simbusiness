import { NextResponse } from 'next/server';

/**
 * Server-Side Currency Exchange Rate Route
 * Shields the EXCHANGE_RATE_API_KEY from browser inspection
 */
export async function GET() {
  const apiKey = process.env.EXCHANGE_RATE_API_KEY;

  if (apiKey) {
    try {
      const res = await fetch(`https://v6.exchangerate-api.com/v6/${apiKey}/latest/USD`, {
        next: { revalidate: 3600 } // Cache for 1 hour
      });
      if (res.ok) {
        const data = await res.json();
        if (data.conversion_rates) {
          return NextResponse.json({
            base: 'USD',
            rates: data.conversion_rates,
            source: 'live_exchange_rate_api'
          });
        }
      }
    } catch (e) {
      console.warn('Live exchange rate fetch failed, using fallback:', e);
    }
  }

  // Fallback realistic currency benchmark rates
  return NextResponse.json({
    base: 'USD',
    rates: {
      USD: 1.0,
      EUR: 0.92,
      GBP: 0.79,
      CAD: 1.36,
      AUD: 1.52,
      JPY: 154.5,
    },
    source: 'simulated_benchmark'
  });
}
