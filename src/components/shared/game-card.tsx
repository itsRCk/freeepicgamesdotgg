'use client';

import { motion } from 'framer-motion';
import { Calendar, Tag, ExternalLink, Heart, Check, X, Star, Gamepad2 } from 'lucide-react';
import Link from 'next/link';
import { GameData } from '@/types';
import { cn, formatPrice, formatDateRange, getGiveawayTypeLabel, getGiveawayTypeColor } from '@/lib/utils';
import { GameCoverImage } from '@/components/shared/game-cover-image';

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

  if (variant === 'list') {
    return (
      <Link href={`/game/${game.id}`}>
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, delay: index * 0.03 }}
          className={cn(
            "group flex items-center gap-4 p-3 rounded-xl border transition-all duration-300 cursor-pointer",
            selected
              ? "bg-purple-500/10 border-purple-500/30"
              : "bg-white/[0.02] border-white/5 hover:bg-white/[0.05] hover:border-white/10"
          )}
        >
          {selectable && (
            <button
              onClick={(e) => { e.preventDefault(); e.stopPropagation(); onToggleSelect?.(game.id); }}
              className={cn(
                "w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 transition-all",
                selected
                  ? "bg-purple-500 border-purple-500"
                  : "border-zinc-600 hover:border-zinc-400"
              )}
            >
              {selected && <Check className="w-3 h-3 text-white" />}
            </button>
          )}

          <div className="w-12 h-16 rounded-lg overflow-hidden flex-shrink-0 border border-white/5 bg-[#2a2a2a]">
            <GameCoverImage title={game.title} coverArt={game.coverArt} />
          </div>

          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-semibold text-white truncate group-hover:text-purple-300 transition-colors">
              {game.title}
            </h3>
            <p className="text-xs text-zinc-500">{game.publisher} • {formatDateRange(game.giveawayStartDate, game.giveawayEndDate)}</p>
          </div>

          <div className="flex items-center gap-3 flex-shrink-0">
            <span className={cn("text-xs px-2 py-0.5 rounded-full border", getGiveawayTypeColor(game.giveawayType))}>
              {getGiveawayTypeLabel(game.giveawayType)}
            </span>
            <span className="text-sm font-semibold text-zinc-400">{formatPrice(game.originalPrice)}</span>
            {isClaimed !== undefined && (
              <span className={cn(
                "text-xs font-medium px-2 py-0.5 rounded-full",
                isClaimed
                  ? "bg-emerald-500/10 text-emerald-400"
                  : isPast ? "bg-red-500/10 text-red-400" : "bg-zinc-500/10 text-zinc-400"
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
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: index * 0.05 }}
        whileHover={{ y: -4 }}
        className={cn(
          "group relative rounded-xl border overflow-hidden transition-all duration-300 cursor-pointer h-full",
          selected
            ? "border-purple-500/50 ring-2 ring-purple-500/20"
            : "border-white/5 hover:border-white/15",
          "bg-white/[0.02] hover:bg-white/[0.04]"
        )}
      >
        {/* Selection checkbox */}
        {selectable && (
          <button
            onClick={(e) => { e.preventDefault(); e.stopPropagation(); onToggleSelect?.(game.id); }}
            className={cn(
              "absolute top-3 left-3 z-20 w-6 h-6 rounded-md border-2 flex items-center justify-center transition-all",
              selected
                ? "bg-purple-500 border-purple-500 scale-100"
                : "border-white/20 bg-black/40 backdrop-blur-sm opacity-0 group-hover:opacity-100 scale-90 group-hover:scale-100"
            )}
          >
            {selected && <Check className="w-3.5 h-3.5 text-white" />}
          </button>
        )}

        {/* Cover Art */}
        <div className="relative aspect-[2/3] overflow-hidden bg-[#2a2a2a]">
          <GameCoverImage
            title={game.title}
            coverArt={game.coverArt}
            className="transition-transform duration-500 group-hover:scale-105"
          />

          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />

          {/* Status badges */}
          <div className="absolute top-3 right-3 flex flex-col gap-1.5 items-end">
            {isActive && (
              <motion.div
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="bg-gradient-to-r from-emerald-500 to-green-400 text-black text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider shadow-lg shadow-emerald-500/30"
              >
                FREE NOW
              </motion.div>
            )}
            {game.isMystery && (
              <span className="bg-orange-500/90 text-white text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">
                Mystery
              </span>
            )}
            <span className={cn("text-[10px] font-semibold px-2.5 py-1 rounded-full border backdrop-blur-sm", getGiveawayTypeColor(game.giveawayType))}>
              {getGiveawayTypeLabel(game.giveawayType)}
            </span>
          </div>

          {/* Bottom info overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-3">
            <h3 className="text-sm font-bold text-white mb-1 line-clamp-2 leading-snug group-hover:text-purple-200 transition-colors">
              {game.title}
            </h3>
            <p className="text-[10px] text-zinc-400 mb-1.5">{game.developer}</p>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <span className="text-zinc-500 line-through text-[10px]">{formatPrice(game.originalPrice)}</span>
                <span className="text-emerald-400 font-bold text-xs">FREE</span>
              </div>
              {game.metacriticScore && (
                <div className={cn(
                  "flex items-center gap-1 text-[10px] font-semibold px-1 py-0.5 rounded",
                  game.metacriticScore >= 75
                    ? "bg-emerald-500/20 text-emerald-400"
                    : game.metacriticScore >= 50
                      ? "bg-amber-500/20 text-amber-400"
                      : "bg-red-500/20 text-red-400"
                )}>
                  <Star className="w-2.5 h-2.5" />
                  {game.metacriticScore}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Card Footer */}
        <div className="p-2.5 border-t border-white/5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-zinc-500 text-[10px]">
              <Calendar className="w-3 h-3" />
              <span>{formatDateRange(game.giveawayStartDate, game.giveawayEndDate)}</span>
            </div>

            <div className="flex items-center gap-1">
              {onToggleWishlist && (
                <button
                  onClick={(e) => { e.preventDefault(); e.stopPropagation(); onToggleWishlist(game.id); }}
                  className={cn(
                    "p-1.5 rounded-lg transition-all",
                    isWishlisted
                      ? "text-pink-400 hover:text-pink-300"
                      : "text-zinc-600 hover:text-zinc-400 opacity-0 group-hover:opacity-100"
                  )}
                >
                  <Heart className={cn("w-4 h-4", isWishlisted && "fill-current")} />
                </button>
              )}
              {onToggleClaim && (
                <button
                  onClick={(e) => { e.preventDefault(); e.stopPropagation(); onToggleClaim(game.id); }}
                  className={cn(
                    "p-1.5 rounded-lg transition-all",
                    isClaimed
                      ? "text-emerald-400 hover:text-emerald-300"
                      : "text-zinc-600 hover:text-zinc-400 opacity-0 group-hover:opacity-100"
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
              className="p-1.5 rounded-lg text-zinc-600 hover:text-zinc-400 opacity-0 group-hover:opacity-100 transition-all"
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
