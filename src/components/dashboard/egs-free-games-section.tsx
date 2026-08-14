'use client';

import React from 'react';
import Link from 'next/link';
import { Gift, ChevronRight, Check } from 'lucide-react';
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
  const rawItems = [
    ...activeGames.map((g) => ({ game: g, isUpcoming: false })),
    ...upcomingGames.map((g) => ({ game: g, isUpcoming: true })),
  ];

  const seenTitles = new Set<string>();
  const allFreeItems = rawItems.filter((item) => {
    if (!item.game?.title) return false;
    const key = `${item.game.title.toLowerCase().trim()}-${item.isUpcoming}`;
    if (seenTitles.has(key)) return false;
    seenTitles.add(key);
    return true;
  });

  if (allFreeItems.length === 0) return null;

  return (
    <div className="bg-[#111111] border border-white/10 rounded-xl p-6 sm:p-8 space-y-6 shadow-sm">
      {/* Header Row (Vercel Geist System Tokens) */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-white/5 border border-white/10 text-white flex items-center justify-center">
            <Gift className="w-5 h-5" />
          </div>
          <div className="flex items-center gap-2.5">
            <h2 className="text-xl sm:text-2xl font-semibold tracking-tight text-white">
              Free Games
            </h2>
            <span className="px-2 py-0.5 rounded-full bg-green-500/10 border border-green-500/20 text-green-400 text-[10px] font-mono font-medium uppercase tracking-wider flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse" />
              Live Vault
            </span>
          </div>
        </div>
        <Link
          href="/archive"
          className="px-3.5 py-1.5 rounded-md border border-white/10 hover:border-white/25 bg-white/5 hover:bg-white/10 text-xs font-medium text-[#ededed] hover:text-white transition-all duration-150 flex items-center gap-1"
        >
          View More <ChevronRight className="w-3.5 h-3.5 text-[#888]" />
        </Link>
      </div>

      {/* Cards Grid (Official Layout + Geist Aesthetics) */}
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-8 lg:gap-10 xl:gap-12">
        {allFreeItems.map(({ game, isUpcoming }, idx) => {
          const claimed = isGameClaimed?.(game.id, game);
          const timeframeStr = formatEgsTimeframe(
            game.giveawayStartDate,
            game.giveawayEndDate,
            isUpcoming
          );

          return (
            <div
              key={game.id}
              className="group flex flex-col space-y-2 sm:space-y-3 rounded-xl p-1 sm:p-2 -m-1 sm:-m-2 hover:bg-white/[0.02] transition-colors duration-200"
            >
              <Link href={`/game/${game.id}`} className="block">
                {/* 16:9 Aspect ratio cover image box with subpixel border & Geist status bar */}
                <div className="relative aspect-[16/9] w-full rounded-lg overflow-hidden bg-black border border-white/10 group-hover:border-white/30 transition-all duration-200 shadow-sm">
                  <div className="w-full h-full group-hover:scale-[1.02] transition-transform duration-300 ease-out">
                    <GameCoverImage
                      title={game.title}
                      coverArt={game.coverArt}
                      heroArt={game.heroArt}
                      isLandscape={true}
                      priority={idx === 0}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Vercel Geist Status Bar */}
                  {!isUpcoming ? (
                    <div className="absolute bottom-0 inset-x-0 h-6 sm:h-7.5 bg-[#0070f3] text-white font-semibold text-[9px] sm:text-[11px] font-mono flex items-center justify-center tracking-wider uppercase shadow-sm">
                      FREE NOW
                    </div>
                  ) : (
                    <div className="absolute bottom-0 inset-x-0 h-6 sm:h-7.5 bg-[#161616]/95 border-t border-white/10 text-[#888] font-medium text-[9px] sm:text-[11px] font-mono flex items-center justify-center tracking-wider uppercase backdrop-blur-xs">
                      COMING SOON
                    </div>
                  )}
                </div>
              </Link>

              {/* Text Metadata below image */}
              <div className="space-y-1 sm:space-y-1.5 px-0.5">
                <Link href={`/game/${game.id}`}>
                  <h3 className="text-xs sm:text-sm font-semibold tracking-tight text-white group-hover:text-white/90 transition-colors truncate">
                    {game.title}
                  </h3>
                </Link>

                <div className="flex items-center justify-between text-[10px] sm:text-xs font-mono text-[#888]">
                  <span className="truncate">{timeframeStr}</span>
                  {onToggleClaim && !isUpcoming && (
                    <button
                      onClick={() => onToggleClaim(game.id, game)}
                      className={`ml-1.5 sm:ml-2 px-1.5 sm:px-2.5 py-0.5 rounded-md border text-[9px] sm:text-[10px] font-mono font-medium transition-all flex-shrink-0 ${
                        claimed
                          ? 'bg-green-500/10 text-green-400 border-green-500/20'
                          : 'bg-white text-black hover:bg-[#ccc] border-white font-semibold shadow-sm'
                      }`}
                    >
                      {claimed ? (
                        <span className="flex items-center gap-0.5 sm:gap-1">
                          <Check className="w-2.5 h-2.5 sm:w-3 sm:h-3" /> Claimed
                        </span>
                      ) : (
                        'Claim'
                      )}
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
