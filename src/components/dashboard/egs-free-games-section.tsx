'use client';

import React from 'react';
import Link from 'next/link';
import { Gift } from 'lucide-react';
import { GameData } from '@/types';
import { GameCoverImage } from '@/components/shared/game-cover-image';

interface EgsFreeGamesSectionProps {
  activeGames: GameData[];
  upcomingGames: GameData[];
  isGameClaimed?: (id: string, game?: GameData) => boolean;
  onToggleClaim?: (id: string, game?: GameData) => void;
}

function formatEgsTimeframe(startStr: string, endStr: string, isUpcoming: boolean): string {
  try {
    const start = new Date(startStr);
    const end = new Date(endStr);

    const startMonthDay = start.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    const endMonthDay = end.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

    if (isUpcoming) {
      return `Free ${startMonthDay} - ${endMonthDay}`;
    } else {
      const timeStr = end.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
      return `Free Now - ${endMonthDay} at ${timeStr}`;
    }
  } catch {
    return isUpcoming ? 'Coming Soon' : 'Free Now';
  }
}

export function EgsFreeGamesSection({
  activeGames,
  upcomingGames,
  isGameClaimed,
  onToggleClaim,
}: EgsFreeGamesSectionProps) {
  const allFreeItems = [
    ...activeGames.map((g) => ({ game: g, isUpcoming: false })),
    ...upcomingGames.map((g) => ({ game: g, isUpcoming: true })),
  ];

  if (allFreeItems.length === 0) return null;

  return (
    <div className="bg-[#111111] border border-white/10 rounded-2xl p-6 sm:p-8 space-y-6">
      {/* Header Row (Gift Icon + Title + View More) */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Gift className="w-6 h-6 text-white" />
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
            Free Games
          </h2>
        </div>
        <Link
          href="/archive"
          className="px-4 py-1.5 rounded-md border border-white/15 hover:border-white/40 text-xs font-semibold text-white transition-colors bg-white/5"
        >
          View More
        </Link>
      </div>

      {/* Cards Grid (Matching Official Epic Games Store Layout) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {allFreeItems.map(({ game, isUpcoming }, idx) => {
          const claimed = isGameClaimed?.(game.id, game);
          const timeframeStr = formatEgsTimeframe(
            game.giveawayStartDate,
            game.giveawayEndDate,
            isUpcoming
          );

          return (
            <div key={game.id} className="group flex flex-col space-y-3">
              <Link href={`/game/${game.id}`} className="block">
                {/* 16:9 Aspect ratio cover image box with bottom status bar */}
                <div className="relative aspect-[16/9] w-full rounded-xl overflow-hidden bg-black border border-white/10 group-hover:border-white/30 transition-all duration-200 shadow-md">
                  <GameCoverImage
                    title={game.title}
                    coverArt={game.coverArt}
                    priority={idx === 0}
                    className="w-full h-full object-cover"
                  />

                  {/* EGS Bottom Status Bar */}
                  {!isUpcoming ? (
                    <div className="absolute bottom-0 inset-x-0 h-8 bg-[#0078f2] text-black font-extrabold text-xs font-mono flex items-center justify-center tracking-wider uppercase shadow-md">
                      FREE NOW
                    </div>
                  ) : (
                    <div className="absolute bottom-0 inset-x-0 h-8 bg-black/90 border-t border-white/10 text-white font-bold text-xs font-mono flex items-center justify-center tracking-wider uppercase">
                      COMING SOON
                    </div>
                  )}
                </div>
              </Link>

              {/* Text Metadata below image */}
              <div>
                <Link href={`/game/${game.id}`}>
                  <h3 className="text-base font-semibold text-white group-hover:text-[#ccc] transition-colors truncate">
                    {game.title}
                  </h3>
                </Link>

                <div className="flex items-center justify-between mt-1 text-xs font-mono text-[#888]">
                  <span>{timeframeStr}</span>
                  {onToggleClaim && !isUpcoming && (
                    <button
                      onClick={() => onToggleClaim(game.id, game)}
                      className={`ml-2 px-2 py-0.5 rounded border text-[10px] transition-colors ${
                        claimed
                          ? 'bg-green-500/10 text-green-400 border-green-500/20'
                          : 'bg-white/5 text-[#ededed] border-white/15 hover:bg-white/10'
                      }`}
                    >
                      {claimed ? '✓ Claimed' : 'Claim'}
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
