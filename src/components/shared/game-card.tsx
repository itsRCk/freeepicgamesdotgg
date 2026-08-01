'use client';

import { motion } from 'framer-motion';
import { ExternalLink, Heart, Check, Star, Gamepad2 } from 'lucide-react';
import Link from 'next/link';
import { GameData } from '@/types';
import { cn, formatDateRange, getGiveawayTypeLabel } from '@/lib/utils';
import { GameCoverImage } from '@/components/shared/game-cover-image';
import { PriceDisplay } from '@/components/shared/price-display';

export type GameCardSize = 'sm' | 'md' | 'lg' | 'xl';

const cardSizeConfig: Record<GameCardSize, {
  titleClass: string;
  subtitleClass: string;
  badgeClass: string;
  actionBtnClass: string;
  actionIconClass: string;
  spacingClass: string;
  footerClass: string;
  listContainerClass: string;
  listImageClass: string;
}> = {
  sm: {
    titleClass: 'text-xs font-semibold',
    subtitleClass: 'text-[10px]',
    badgeClass: 'text-[9px] px-1.5 py-0.5',
    actionBtnClass: 'w-6 h-6 rounded-md',
    actionIconClass: 'w-3 h-3',
    spacingClass: 'mt-2',
    footerClass: 'mt-1.5 pt-1.5 text-[10px]',
    listContainerClass: 'gap-2.5 p-2',
    listImageClass: 'w-9 h-12',
  },
  md: {
    titleClass: 'text-xs sm:text-sm font-semibold',
    subtitleClass: 'text-xs',
    badgeClass: 'text-[10px] px-2 py-0.5',
    actionBtnClass: 'w-7 h-7 rounded-md',
    actionIconClass: 'w-3.5 h-3.5',
    spacingClass: 'mt-2.5',
    footerClass: 'mt-2 pt-2 text-xs',
    listContainerClass: 'gap-3 p-2.5',
    listImageClass: 'w-10 h-14',
  },
  lg: {
    // Present default L size
    titleClass: 'text-sm font-semibold',
    subtitleClass: 'text-xs',
    badgeClass: 'text-[10px] px-2 py-0.5',
    actionBtnClass: 'w-8 h-8 rounded-lg',
    actionIconClass: 'w-4 h-4',
    spacingClass: 'mt-3',
    footerClass: 'mt-2.5 pt-2 text-xs',
    listContainerClass: 'gap-4 p-3',
    listImageClass: 'w-12 h-16',
  },
  xl: {
    titleClass: 'text-base font-bold tracking-tight',
    subtitleClass: 'text-sm',
    badgeClass: 'text-xs px-2.5 py-0.5',
    actionBtnClass: 'w-9 h-9 rounded-lg',
    actionIconClass: 'w-4.5 h-4.5',
    spacingClass: 'mt-4',
    footerClass: 'mt-3 pt-3 text-sm',
    listContainerClass: 'gap-5 p-4',
    listImageClass: 'w-14 h-20',
  },
};

interface GameCardProps {
  game: GameData;
  isClaimed?: boolean;
  isWishlisted?: boolean;
  onToggleClaim?: (id: string) => void;
  onToggleWishlist?: (id: string) => void;
  onSelect?: (id: string) => void;
  index?: number;
  variant?: 'grid' | 'list';
  size?: GameCardSize;
  selectable?: boolean;
  selected?: boolean;
  onToggleSelect?: (id: string) => void;
  showPriceAndDate?: boolean;
  hideClaimBadge?: boolean;
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
  size = 'lg',
  selectable,
  selected,
  onToggleSelect,
  showPriceAndDate,
  hideClaimBadge,
}: GameCardProps) {
  const isActive = new Date(game.giveawayEndDate) > new Date() && new Date(game.giveawayStartDate) <= new Date();
  const isPast = new Date(game.giveawayEndDate) <= new Date();
  const isUpcoming = new Date(game.giveawayStartDate) > new Date();
  const sizeStyles = cardSizeConfig[size] || cardSizeConfig.lg;

  if (variant === 'list') {
    return (
      <Link href={`/game/${game.id}`}>
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, delay: index * 0.03 }}
          className={cn(
            "group flex items-center rounded-xl border transition-colors duration-200 cursor-pointer",
            sizeStyles.listContainerClass,
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

          <div className={cn("rounded-lg overflow-hidden flex-shrink-0 border border-white/8 bg-[#111]", sizeStyles.listImageClass)}>
            <GameCoverImage title={game.title} coverArt={game.coverArt} />
          </div>

          <div className="flex-1 min-w-0">
            <h3 className={cn("text-[#ededed] truncate group-hover:text-white transition-colors", sizeStyles.titleClass)}>
              {game.title}
            </h3>
            <p className={cn("text-[#555]", sizeStyles.subtitleClass)}>
              {(() => {
                const dev = game.developer && game.developer !== 'Unknown' ? game.developer : null;
                const pub = game.publisher && game.publisher !== 'Unknown' ? game.publisher : null;
                const genre = game.genres?.find(g => g && g !== 'Unknown');
                return dev || pub || genre || 'Epic Games Store';
              })()} • {formatDateRange(game.giveawayStartDate, game.giveawayEndDate)}
            </p>
          </div>

          <div className="flex items-center gap-3 flex-shrink-0">
            <span className={cn("bg-white/5 border border-white/10 text-[#888] font-mono rounded-md", sizeStyles.badgeClass)}>
              {getGiveawayTypeLabel(game.giveawayType)}
            </span>
            <span className="text-sm font-mono tabular-nums text-[#888]"><PriceDisplay amount={game.originalPrice} /></span>
            {isClaimed !== undefined && (
              <span className={cn(
                "font-medium rounded-md border",
                sizeStyles.badgeClass,
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
    <Link href={`/game/${game.id}`} className="block h-full group">
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: index * 0.04 }}
        className="flex flex-col h-full"
      >
        {/* Cover Art Container - Clean portrait box without text overlay */}
        <div
          className={cn(
            "relative aspect-[3/4] w-full rounded-xl overflow-hidden bg-[#111] border transition-all duration-200",
            selected
              ? "border-white/40 ring-2 ring-white/20 bg-white/[0.04]"
              : "border-white/8 group-hover:border-white/20"
          )}
        >
          {/* Selection checkbox */}
          {selectable && (
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onToggleSelect?.(game.id);
              }}
              className={cn(
                "absolute top-2.5 left-2.5 z-20 w-6 h-6 rounded-md border flex items-center justify-center transition-all",
                selected
                  ? "bg-[#ededed] border-[#ededed] scale-100"
                  : "border-white/20 bg-[#0a0a0a]/80 opacity-0 group-hover:opacity-100 scale-90 group-hover:scale-100"
              )}
            >
              {selected && <Check className="w-3.5 h-3.5 text-black" />}
            </button>
          )}

          {/* Cover Art */}
          <GameCoverImage
            title={game.title}
            coverArt={game.coverArt}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />

          {/* Minimal top-right status badges (No text overlay gradient!) */}
          <div className="absolute top-2.5 right-2.5 z-10 flex flex-col gap-1.5 items-end">
            {isActive && (
              <span className="bg-green-500/90 backdrop-blur-sm text-black text-[10px] font-mono font-bold px-2 py-0.5 rounded shadow-sm">
                FREE NOW
              </span>
            )}
            {game.isMystery && (
              <span className="bg-amber-500/90 backdrop-blur-sm text-black text-[10px] font-mono font-bold px-2 py-0.5 rounded shadow-sm">
                Mystery
              </span>
            )}
          </div>

          {/* Hover quick action buttons on bottom-right of image container */}
          <div className="absolute bottom-2.5 right-2.5 z-10 flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            {onToggleWishlist && (
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onToggleWishlist(game.id);
                }}
                className={cn(
                  sizeStyles.actionBtnClass,
                  "backdrop-blur-md border flex items-center justify-center transition-colors shadow-lg",
                  isWishlisted
                    ? "bg-white/20 border-white/40 text-white"
                    : "bg-[#0a0a0a]/80 border-white/15 text-[#888] hover:text-white hover:bg-[#111]"
                )}
                title={isWishlisted ? "Remove from Wishlist" : "Add to Wishlist"}
              >
                <Heart className={cn(sizeStyles.actionIconClass, isWishlisted && "fill-current text-white")} />
              </button>
            )}
            {onToggleClaim && (
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onToggleClaim(game.id);
                }}
                className={cn(
                  sizeStyles.actionBtnClass,
                  "backdrop-blur-md border flex items-center justify-center transition-colors shadow-lg",
                  isClaimed
                    ? "bg-green-500/20 border-green-500/40 text-green-400"
                    : "bg-[#0a0a0a]/80 border-white/15 text-[#888] hover:text-green-400 hover:bg-[#111]"
                )}
                title={isClaimed ? "Marked as Claimed" : "Mark as Claimed"}
              >
                {isClaimed ? <Check className={sizeStyles.actionIconClass} /> : <Gamepad2 className={sizeStyles.actionIconClass} />}
              </button>
            )}
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                window.open(game.storeUrl, '_blank', 'noopener,noreferrer');
              }}
              className={cn(
                sizeStyles.actionBtnClass,
                "backdrop-blur-md bg-[#0a0a0a]/80 border border-white/15 text-[#888] hover:text-white hover:bg-[#111] flex items-center justify-center transition-colors shadow-lg"
              )}
              title="Open in Epic Games Store"
            >
              <ExternalLink className={sizeStyles.actionIconClass} />
            </button>
          </div>
        </div>

        {/* Card Details Section - Below the Image (Epic Games Store Library Style) */}
        <div className={cn("flex flex-col flex-1 justify-between", sizeStyles.spacingClass)}>
          <div>
            {/* Title & Score row */}
            <div className="flex items-start justify-between gap-2">
              <h3 className={cn("text-[#ededed] group-hover:text-white transition-colors line-clamp-1 leading-snug", sizeStyles.titleClass)}>
                {game.title}
              </h3>
              {game.metacriticScore && (
                <div className="flex items-center gap-1 text-[10px] font-mono font-semibold px-1.5 py-0.5 rounded bg-white/5 border border-white/8 text-[#ededed] flex-shrink-0">
                  <Star className="w-2.5 h-2.5 text-[#888]" />
                  {game.metacriticScore}
                </div>
              )}
            </div>

            {/* Developer / Subtitle row */}
            <p className={cn("text-[#888] truncate mt-0.5", sizeStyles.subtitleClass)}>
              {(() => {
                const dev = game.developer && game.developer !== 'Unknown' ? game.developer : null;
                const pub = game.publisher && game.publisher !== 'Unknown' ? game.publisher : null;
                const genre = game.genres?.find(g => g && g !== 'Unknown');
                return dev || pub || genre || 'Epic Games Store';
              })()}
            </p>
          </div>

          {/* Pricing & Status Row - Clean, Uncongested Vercel Geist + Epic Games Store Library style */}
          <div className={cn("border-t border-white/5 flex items-center justify-between gap-2 font-mono", sizeStyles.footerClass)}>
            {showPriceAndDate ? (
              <>
                <span className="text-green-400 font-semibold text-xs tabular-nums">
                  <PriceDisplay amount={game.originalPrice} />
                </span>
                <span className="text-[11px] text-[#888] truncate" title={formatDateRange(game.giveawayStartDate, game.giveawayEndDate)}>
                  {formatDateRange(game.giveawayStartDate, game.giveawayEndDate)}
                </span>
              </>
            ) : isClaimed !== undefined && !hideClaimBadge ? (
              <>
                <div className="flex items-center gap-1.5">
                  <span
                    className={cn(
                      "inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-md border",
                      isClaimed
                        ? "bg-green-500/10 border-green-500/20 text-green-400"
                        : isPast
                        ? "bg-white/5 border-white/10 text-[#555]"
                        : "bg-white/5 border-white/10 text-[#888]"
                    )}
                  >
                    {isClaimed ? (
                      <>
                        <Check className="w-3 h-3" />
                        <span>In Library</span>
                      </>
                    ) : isPast ? (
                      'Missed'
                    ) : (
                      'Unclaimed'
                    )}
                  </span>
                </div>
                <span className="text-[11px] text-[#555] truncate">
                  {new Date(game.giveawayStartDate).getFullYear() || getGiveawayTypeLabel(game.giveawayType)}
                </span>
              </>
            ) : (
              <>
                {isActive ? (
                  <>
                    <div className="flex items-center gap-1.5">
                      <span className="bg-green-500/10 border border-green-500/20 text-green-400 text-[10px] font-medium px-1.5 py-0.5 rounded">
                        -100%
                      </span>
                      <span className="text-[#888] line-through text-xs tabular-nums">
                        <PriceDisplay amount={game.originalPrice} />
                      </span>
                    </div>
                    <span className="text-green-400 font-semibold text-xs tabular-nums">
                      FREE
                    </span>
                  </>
                ) : isUpcoming ? (
                  <>
                    <span className="text-[#888] text-xs tabular-nums">
                      <PriceDisplay amount={game.originalPrice} />
                    </span>
                    <span className="text-blue-400 font-medium text-xs">Free Soon</span>
                  </>
                ) : (
                  <>
                    <span className="text-[#888] text-xs tabular-nums">
                      <PriceDisplay amount={game.originalPrice} />
                    </span>
                    <span className="text-[#555] text-[11px]">
                      {game.originalPrice === 0 ? 'Free to Play' : '(Was Free)'}
                    </span>
                  </>
                )}
              </>
            )}
          </div>
        </div>
      </motion.div>
    </Link>
  );
}
