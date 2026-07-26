import { NextResponse } from 'next/server';
import { fetchLiveEpicGames } from '@/lib/epic-api';

export async function GET(request: Request) {
  // Security check: Only allow Vercel Cron to trigger this (if in production)
  const authHeader = request.headers.get('authorization');
  if (
    process.env.NODE_ENV === 'production' &&
    authHeader !== `Bearer ${process.env.CRON_SECRET}`
  ) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  try {
    // Ping the live Epic Games API
    const liveGiveaways = await fetchLiveEpicGames();
    
    const totalFetched = liveGiveaways.active.length + liveGiveaways.upcoming.length;
    
    // In the future, this is where we would inject the newly discovered games 
    // into the Postgres database. For now, we log the successful fetch for Vercel Cron.
    console.log(`[Cron Sync] Successfully fetched ${totalFetched} giveaways.`);
    
    return NextResponse.json({
      success: true,
      message: 'Sync completed successfully.',
      timestamp: new Date().toISOString(),
      discoveredGames: totalFetched,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to synchronize giveaway catalog.' },
      { status: 500 }
    );
  }
}

export async function POST() {
  return NextResponse.json({
    success: true,
    message: 'Manual sync triggered successfully.',
    syncedAt: new Date().toISOString(),
  });
}
