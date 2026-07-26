'use client';

import { motion } from 'framer-motion';
import { Calendar, Tag, ExternalLink, Heart, Check, X, Star, Gamepad2 } from 'lucide-react';
import Link from 'next/link';
import { GameData } from '@/types';
import { cn, formatPrice, formatDateRange, getGiveawayTypeLabel, getGiveawayTypeColor } from '@/lib/utils';
import { GameCoverImage } from '@/components/shared/game-cover-image';
import { PriceDisplay } from '@/components/shared/price-display';

interface GameCardProps {
  game: GameData;
  isClaimed?: boolean;
  isWishlisted?: boolean;
  onToggleClaim?: (id: string) => void;
  onToggleWishlist?: (id: string) => void;
  onSelect?: (id: string) => void;
  index?: number;
  variant?: 'grid' | 'list';
  selectable?: boolean;
  selected?: boolean;
  onToggleSelect?: (id: string) => void;
}

export function GameCard({
  game,
  isClaimed,
  isWishlisted,
  onToggleClaim,
  onToggleWishlist,
  onSelect,
  index = 0,
  variant = 'grid',
  selectable,
  selected,
  onToggleSelect,
}: GameCardProps) {
  const isActive = new Date(game.giveawayEndDate) > new Date() && new Date(game.giveawayStartDate) <= new Date();
  const isPast = new Date(game.giveawayEndDate) <= new Date();
  const isUpcoming = new Date(game.giveawayStartDate) > new Date();

  if (variant === 'list') {
    return (
      <Link href={`/game/${game.id}`}>
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, delay: index * 0.03 }}
          className={cn(
            "group flex items-center gap-4 p-3 rounded-xl border transition-colors duration-200 cursor-pointer",
            selected
              ? "bg-white/[0.04] border-white/30"
              : "bg-[#111] border-white/8 hover:border-white/15 hover:bg-[#161616]"
          )}
        >
          {selectable && (
            <button
              onClick={(e) => { e.preventDefault(); e.stopPropagation(); onToggleSelect?.(game.id); }}
              className={cn(
                "w-5 h-5 rounded border flex items-center justify-center flex-shrink-0 transition-colors",
                selected
                  ? "bg-[#ededed] border-[#ededed]"
                  : "border-white/20 hover:border-white/40"
              )}
            >
              {selected && <Check className="w-3 h-3 text-black" />}
            </button>
          )}

          <div className="w-12 h-16 rounded-lg overflow-hidden flex-shrink-0 border border-white/8 bg-[#111]">
            <GameCoverImage title={game.title} coverArt={game.coverArt} />
          </div>

          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-semibold text-[#ededed] truncate group-hover:text-white transition-colors">
              {game.title}
            </h3>
            <p className="text-xs text-[#555]">{game.publisher} • {formatDateRange(game.giveawayStartDate, game.giveawayEndDate)}</p>
          </div>

          <div className="flex items-center gap-3 flex-shrink-0">
            <span className="bg-white/5 border border-white/10 text-[#888] text-xs font-mono px-2 py-0.5 rounded-md">
              {getGiveawayTypeLabel(game.giveawayType)}
            </span>
            <span className="text-sm font-mono tabular-nums text-[#888]"><PriceDisplay amount={game.originalPrice} /></span>
            {isClaimed !== undefined && (
              <span className={cn(
                "text-xs font-medium px-2 py-0.5 rounded-md border",
                isClaimed
                  ? "bg-green-500/10 border-green-500/20 text-green-400"
                  : isPast ? "bg-red-500/10 border-red-500/20 text-red-400" : "bg-white/5 border-white/10 text-[#888]"
              )}>
                {isClaimed ? '✓ Claimed' : isPast ? 'Missed' : 'Available'}
              </span>
            )}
          </div>
        </motion.div>
      </Link>
    );
  }

  return (
    <Link href={`/game/${game.id}`} className="block h-full">
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: index * 0.04 }}
        className={cn(
          "group relative rounded-xl border overflow-hidden transition-colors duration-200 cursor-pointer h-full bg-[#111]",
          selected
            ? "border-white/30 bg-white/[0.04]"
            : "border-white/8 hover:border-white/15"
        )}
      >
        {/* Selection checkbox */}
        {selectable && (
          <button
            onClick={(e) => { e.preventDefault(); e.stopPropagation(); onToggleSelect?.(game.id); }}
            className={cn(
              "absolute top-3 left-3 z-20 w-6 h-6 rounded-md border flex items-center justify-center transition-all",
              selected
                ? "bg-[#ededed] border-[#ededed] scale-100"
                : "border-white/20 bg-[#0a0a0a]/80 opacity-0 group-hover:opacity-100 scale-90 group-hover:scale-100"
            )}
          >
            {selected && <Check className="w-3.5 h-3.5 text-black" />}
          </button>
        )}

        {/* Cover Art */}
        <div className="relative aspect-[2/3] overflow-hidden bg-[#111]">
          <GameCoverImage
            title={game.title}
            coverArt={game.coverArt}
            className="transition-transform duration-300 group-hover:scale-105"
          />

          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />

          {/* Status badges */}
          <div className="absolute top-3 right-3 flex flex-col gap-1.5 items-end">
            {isActive && (
              <span className="bg-green-500/10 border border-green-500/20 text-green-400 text-[10px] font-mono font-medium px-2 py-0.5 rounded-md">
                FREE NOW
              </span>
            )}
            {game.isMystery && (
              <span className="bg-amber-500/10 border border-amber-500/20 text-amber-400 text-[10px] font-mono px-2 py-0.5 rounded-md">
                Mystery
              </span>
            )}
            <span className="bg-white/5 border border-white/10 text-[#888] text-[10px] font-mono px-2 py-0.5 rounded-md">
              {getGiveawayTypeLabel(game.giveawayType)}
            </span>
          </div>

          {/* Bottom info overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-3">
            <h3 className="text-sm font-semibold text-[#ededed] mb-1 line-clamp-2 leading-snug group-hover:text-white transition-colors">
              {game.title}
            </h3>
            <p className="text-[10px] text-[#555] mb-1.5">{game.developer}</p>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                {isActive ? (
                  <>
                    <span className="text-[#555] line-through text-[10px] font-mono"><PriceDisplay amount={game.originalPrice} /></span>
                    <span className="text-green-400 font-mono font-semibold text-xs">FREE</span>
                  </>
                ) : isUpcoming ? (
                  <>
                    <span className="text-[#888] font-mono font-medium text-xs"><PriceDisplay amount={game.originalPrice} /></span>
                    <span className="text-blue-400 font-mono font-medium text-[10px]">Free Soon</span>
                  </>
                ) : (
                  <>
                    <span className="text-[#888] font-mono font-medium text-xs"><PriceDisplay amount={game.originalPrice} /></span>
                    <span className="text-[#555] font-mono text-[10px]">(Was Free)</span>
                  </>
                )}
              </div>
              {game.metacriticScore && (
                <div className="flex items-center gap-1 text-[10px] font-mono font-semibold px-1.5 py-0.5 rounded-md bg-white/5 border border-white/8 text-[#ededed]">
                  <Star className="w-2.5 h-2.5 text-[#888]" />
                  {game.metacriticScore}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Card Footer */}
        <div className="p-2.5 border-t border-white/8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-[#555] text-[10px]">
              <Calendar className="w-3 h-3" />
              <span>{formatDateRange(game.giveawayStartDate, game.giveawayEndDate)}</span>
            </div>

            <div className="flex items-center gap-1">
              {onToggleWishlist && (
                <button
                  onClick={(e) => { e.preventDefault(); e.stopPropagation(); onToggleWishlist(game.id); }}
                  className={cn(
                    "p-1.5 rounded-md transition-all",
                    isWishlisted
                      ? "text-[#ededed]"
                      : "text-[#555] hover:text-[#888] opacity-0 group-hover:opacity-100"
                  )}
                >
                  <Heart className={cn("w-4 h-4", isWishlisted && "fill-current")} />
                </button>
              )}
              {onToggleClaim && (
                <button
                  onClick={(e) => { e.preventDefault(); e.stopPropagation(); onToggleClaim(game.id); }}
                  className={cn(
                    "p-1.5 rounded-md transition-all",
                    isClaimed
                      ? "text-green-400"
                      : "text-[#555] hover:text-[#888] opacity-0 group-hover:opacity-100"
                  )}
                >
                  {isClaimed ? <Check className="w-4 h-4" /> : <Gamepad2 className="w-4 h-4" />}
                </button>
              )}
              <button
                onClick={(e) => { 
                  e.preventDefault(); 
                  e.stopPropagation(); 
                  window.open(game.storeUrl, '_blank', 'noopener,noreferrer');
                }}
                className="p-1.5 rounded-md text-[#555] hover:text-[#888] opacity-0 group-hover:opacity-100 transition-all"
              >
                <ExternalLink className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </Link>
  );
}
