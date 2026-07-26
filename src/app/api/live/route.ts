import { NextResponse } from 'next/server';
import { fetchLiveEpicGames } from '@/lib/epic-api';

export async function GET() {
  try {
    const liveData = await fetchLiveEpicGames();
    return NextResponse.json(liveData);
  } catch (error) {
    console.error("Live API Error:", error);
    return NextResponse.json({ active: [], upcoming: [] }, { status: 500 });
  }
}
