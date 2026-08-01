'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { GameData } from '@/types';
import { cn, formatDateRange } from '@/lib/utils';
import { GameCoverImage } from '@/components/shared/game-cover-image';
import { PriceDisplay } from '@/components/shared/price-display';

interface ValuableGameCardProps {
  game: GameData;
  rank: number;
  index?: number;
}

export function ValuableGameCard({
  game,
  rank,
  index = 0,
}: ValuableGameCardProps) {
  const dev = game.developer && game.developer !== 'Unknown' ? game.developer : null;
  const pub = game.publisher && game.publisher !== 'Unknown' ? game.publisher : null;
  const genre = game.genres?.find(g => g && g !== 'Unknown');

  return (
    <Link href={`/game/${game.id}`} className="block group">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25, delay: index * 0.05 }}
        className="flex items-center gap-4 p-3.5 rounded-xl bg-[#111111] border border-white/10 hover:border-white/20 hover:bg-[#161616] transition-all duration-200 shadow-sm hover:shadow-md"
      >
        {/* Compact Cover Thumbnail */}
        <div className="relative w-16 h-20 rounded-lg overflow-hidden flex-shrink-0 border border-white/10 bg-[#0a0a0a]">
          <GameCoverImage
            title={game.title}
            coverArt={game.coverArt}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
          {/* Rank Badge */}
          <div className="absolute top-1 left-1 z-10 bg-black/85 backdrop-blur-md text-amber-400 border border-amber-500/30 text-[10px] font-mono font-bold px-1.5 py-0.5 rounded shadow">
            #{rank}
          </div>
        </div>

        {/* Info & Value Footer */}
        <div className="flex-1 min-w-0 flex flex-col justify-between h-20 py-0.5">
          <div>
            <h3 className="text-sm font-semibold text-white truncate group-hover:text-amber-400 transition-colors leading-snug">
              {game.title}
            </h3>
            <p className="text-xs text-[#888] truncate mt-0.5">
              {dev || pub || genre || 'Epic Games Store'}
            </p>
          </div>

          <div className="mt-auto pt-2 border-t border-white/5 flex items-center justify-between gap-2 font-mono">
            <span className="inline-flex items-center gap-1 bg-green-500/10 border border-green-500/20 text-green-400 text-xs font-semibold px-2 py-0.5 rounded-md tabular-nums">
              <PriceDisplay amount={game.originalPrice} />
            </span>
            <span
              className="text-[11px] text-[#888] truncate"
              title={formatDateRange(game.giveawayStartDate, game.giveawayEndDate)}
            >
              {formatDateRange(game.giveawayStartDate, game.giveawayEndDate)}
            </span>
          </div>
        </div>
      </motion.div>
    </Link>
  );
}
