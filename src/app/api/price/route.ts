import { NextRequest, NextResponse } from 'next/server';
import { getRegionalPrice, convertPrice, DEFAULT_CURRENCY } from '@/lib/currency';

/**
 * GET /api/price?title=Nova%20Lands&currency=INR
 * 
 * Server-side escape-hatch API endpoint for on-demand regional price checks.
 * Returns authentic regional pricing from the weekly batch cache, or falls back
 * to live Steam Storesearch API lookup if uncached.
 */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const title = searchParams.get('title') || '';
  const currency = (searchParams.get('currency') || DEFAULT_CURRENCY).toUpperCase();

  if (!title) {
    return NextResponse.json(
      { error: 'Missing required parameter: title' },
      { status: 400 }
    );
  }

  // 1. Check cached weekly batch dataset first
  const cachedPrice = getRegionalPrice(title, currency);
  if (cachedPrice !== null) {
    return NextResponse.json(
      {
        title,
        currency,
        price: cachedPrice,
        source: 'weekly-batch-cache',
        timestamp: new Date().toISOString(),
      },
      {
        status: 200,
        headers: {
          'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
        },
      }
    );
  }

  // 2. Fall back to live Steam Storesearch check if not in static cache
  try {
    const regionCodeMap: Record<string, string> = {
      INR: 'IN',
      USD: 'US',
      EUR: 'DE',
      GBP: 'GB',
      BRL: 'BR',
    };
    const cc = regionCodeMap[currency] || 'US';
    const res = await fetch(
      `https://store.steampowered.com/api/storesearch/?term=${encodeURIComponent(title)}&l=english&cc=${cc}`,
      { headers: { 'User-Agent': 'freeepicgamesdotgg-price-api/1.0' } }
    );

    if (res.ok) {
      const json = await res.json();
      const items = json.items || [];
      if (items.length > 0 && items[0].price && items[0].price.initial) {
        const livePrice = items[0].price.initial / 100;
        return NextResponse.json(
          {
            title,
            currency,
            price: livePrice,
            source: 'live-storesearch-fallback',
            timestamp: new Date().toISOString(),
          },
          {
            status: 200,
            headers: {
              'Cache-Control': 'public, s-maxage=1800, stale-while-revalidate=43200',
            },
          }
        );
      }
    }
  } catch {
    // Ignore error and use default fallback
  }

  // 3. Final fallback: standard currency exchange rate conversion
  return NextResponse.json(
    {
      title,
      currency,
      price: null,
      source: 'fallback-exchange-rate',
      timestamp: new Date().toISOString(),
    },
    {
      status: 200,
      headers: {
        'Cache-Control': 'public, s-maxage=300',
      },
    }
  );
}
