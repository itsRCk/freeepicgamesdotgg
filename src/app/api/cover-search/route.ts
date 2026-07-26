import { NextResponse } from 'next/server';

export const revalidate = 86400; // Cache cover search results for 24 hours

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const title = searchParams.get('title');

  if (!title) {
    return NextResponse.json({ error: 'Missing title parameter' }, { status: 400 });
  }

  try {
    const res = await fetch(
      `https://store.steampowered.com/api/storesearch/?term=${encodeURIComponent(title)}&l=english&cc=US`,
      { next: { revalidate: 86400 } }
    );

    if (!res.ok) {
      return NextResponse.json({ error: 'Steam search API failed' }, { status: 502 });
    }

    const data = await res.json();
    const items = data?.items || [];

    if (items.length > 0 && items[0].id) {
      const appId = items[0].id;
      const coverArt = `https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/${appId}/library_600x900_2x.jpg`;
      const heroArt = `https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/${appId}/header.jpg`;

      return NextResponse.json({
        appId,
        coverArt,
        heroArt,
        found: true,
      });
    }

    return NextResponse.json({ found: false }, { status: 404 });
  } catch (error) {
    console.error('Error searching Steam for fallback cover:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
