'use client';

import { useEffect, useCallback } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X, ExternalLink, Calendar, Tag, Star, Gamepad2,
  Monitor, Heart, Check, Clock, Building2, Code2, ArrowUpRight,
} from 'lucide-react';
import { GameData } from '@/types';
import { cn, formatPrice, formatDate, formatDateRange, getGiveawayTypeLabel, getGiveawayTypeColor } from '@/lib/utils';
import { PriceDisplay } from '@/components/shared/price-display';

function getLandscapeUrl(url: string): string {
  if (!url) return '';
  if (url.includes('library_600x900_2x.jpg')) {
    return url.replace('library_600x900_2x.jpg', 'header.jpg');
  }
  if (url.includes('library_600x900.jpg')) {
    return url.replace('library_600x900.jpg', 'header.jpg');
  }
  return url;
}

interface GameDetailModalProps {
  game: GameData | null;
  isOpen: boolean;
  onClose: () => void;
  isClaimed?: boolean;
  isWishlisted?: boolean;
  onToggleClaim?: (id: string) => void;
  onToggleWishlist?: (id: string) => void;
}

export function GameDetailModal({
  game,
  isOpen,
  onClose,
  isClaimed,
  isWishlisted,
  onToggleClaim,
  onToggleWishlist,
}: GameDetailModalProps) {
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape') onClose();
  }, [onClose]);

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpen, handleKeyDown]);

  if (!game) return null;

  const isActive = new Date(game.giveawayEndDate) > new Date() && new Date(game.giveawayStartDate) <= new Date();
  const isPast = new Date(game.giveawayEndDate) <= new Date();

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[calc(100%-2rem)] max-w-3xl max-h-[90vh] z-50 overflow-hidden rounded-xl border border-white/8 bg-[#111] shadow-xl"
          >
            {/* Hero Image */}
            <div className="relative h-56 sm:h-64 overflow-hidden bg-[#1a1a1a]">
              <img
                src={getLandscapeUrl(game.heroArt || game.coverArt)}
                alt={game.title}
                onError={(e) => { e.currentTarget.src = game.heroArt || game.coverArt; }}
                className="w-full h-full object-cover object-center"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#111] via-[#111]/60 to-transparent" />

              {/* Close button */}
              <button
                onClick={onClose}
                className="absolute top-4 right-4 w-8 h-8 rounded-md bg-[#0a0a0a]/80 border border-white/15 flex items-center justify-center text-[#ededed] hover:bg-white/10 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>

              {/* Status badges */}
              <div className="absolute top-4 left-4 flex gap-2">
                {isActive && (
                  <span className="bg-green-500/10 border border-green-500/20 text-green-400 text-xs font-mono font-medium px-2.5 py-0.5 rounded-md">
                    FREE NOW
                  </span>
                )}
                {game.isMystery && (
                  <span className="bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-mono px-2.5 py-0.5 rounded-md">
                    Mystery Game
                  </span>
                )}
              </div>

              {/* Title overlay */}
              <div className="absolute bottom-4 left-6 right-6">
                <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight text-white leading-tight">{game.title}</h2>
              </div>
            </div>

            {/* Content */}
            <div className="overflow-y-auto max-h-[calc(100%-12rem)] sm:max-h-[calc(100%-14rem)] p-6 bg-[#111]">
              {/* Quick info */}
              <div className="flex flex-wrap gap-4 mb-6">
                <div className="flex items-center gap-2 text-xs text-[#888]">
                  <Code2 className="w-3.5 h-3.5 text-[#555]" />
                  <span>{game.developer}</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-[#888]">
                  <Building2 className="w-3.5 h-3.5 text-[#555]" />
                  <span>{game.publisher}</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-[#888]">
                  <Calendar className="w-3.5 h-3.5 text-[#555]" />
                  <span>{formatDate(game.releaseDate)}</span>
                </div>
              </div>

              {/* Price & Actions */}
              <div className="flex flex-wrap items-center gap-4 mb-6 p-4 rounded-md bg-white/[0.02] border border-white/8">
                <div className="flex items-center gap-3">
                  <span className="text-[#555] line-through font-mono text-sm"><PriceDisplay amount={game.originalPrice} /></span>
                  <span className="text-2xl font-mono font-semibold text-green-400">FREE</span>
                </div>
                <div className="flex-1" />
                <div className="flex gap-2">
                  <a
                    href={game.storeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 bg-white hover:bg-[#ebebeb] text-black text-sm font-medium px-4 py-2 rounded-md transition-colors"
                  >
                    <Gamepad2 className="w-4 h-4" />
                    Epic Store
                    <ExternalLink className="w-3 h-3" />
                  </a>
                  <Link
                    href={`/game/${game.id}`}
                    onClick={onClose}
                    className="inline-flex items-center gap-2 bg-[#1a1a1a] hover:bg-white/10 text-[#ededed] border border-white/15 text-sm font-medium px-4 py-2 rounded-md transition-colors"
                  >
                    <ArrowUpRight className="w-4 h-4 text-blue-400" />
                    Game Page
                  </Link>
                  <button
                    onClick={() => onToggleClaim?.(game.id)}
                    className={cn(
                      "inline-flex items-center gap-2 text-sm font-medium px-5 py-2 rounded-md border transition-colors",
                      isClaimed
                        ? "bg-green-500/10 border-green-500/20 text-green-400 hover:bg-green-500/15"
                        : "bg-[#111] border-white/15 text-[#ededed] hover:bg-white/5"
                    )}
                  >
                    {isClaimed ? <Check className="w-4 h-4" /> : <Gamepad2 className="w-4 h-4" />}
                    {isClaimed ? 'Claimed' : 'Mark as Claimed'}
                  </button>
                  <button
                    onClick={() => onToggleWishlist?.(game.id)}
                    className={cn(
                      "p-2 rounded-md border transition-colors",
                      isWishlisted
                        ? "bg-white/10 border-white/20 text-[#ededed]"
                        : "bg-white/5 border-white/8 text-[#555] hover:text-[#888]"
                    )}
                  >
                    <Heart className={cn("w-4 h-4", isWishlisted && "fill-current")} />
                  </button>
                </div>
              </div>

              {/* Giveaway Info */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
                <InfoCard
                  icon={<Calendar className="w-3.5 h-3.5 text-[#888]" />}
                  label="Giveaway Period"
                  value={formatDateRange(game.giveawayStartDate, game.giveawayEndDate)}
                />
                <InfoCard
                  icon={<Tag className="w-3.5 h-3.5 text-[#888]" />}
                  label="Type"
                  value={getGiveawayTypeLabel(game.giveawayType)}
                />
                <InfoCard
                  icon={<Star className="w-3.5 h-3.5 text-[#888]" />}
                  label="Metacritic"
                  value={game.metacriticScore ? `${game.metacriticScore}/100` : 'N/A'}
                />
                <InfoCard
                  icon={<Monitor className="w-3.5 h-3.5 text-[#888]" />}
                  label="Platforms"
                  value={game.platformSupport.join(', ')}
                />
              </div>

              {/* Description */}
              {game.description && (
                <div className="mb-6">
                  <h3 className="text-xs font-medium text-[#888] uppercase tracking-wider mb-2">About</h3>
                  <p className="text-sm text-[#888] leading-relaxed">{game.description}</p>
                </div>
              )}

              {/* Genres & Tags */}
              <div className="flex flex-wrap gap-4">
                {game.genres.length > 0 && (
                  <div>
                    <h4 className="text-xs font-medium text-[#555] uppercase tracking-wider mb-2">Genres</h4>
                    <div className="flex flex-wrap gap-1.5">
                      {game.genres.map((genre) => (
                        <span key={genre} className="text-xs font-mono px-2.5 py-0.5 rounded-md bg-white/5 text-[#888] border border-white/8">
                          {genre}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                {game.tags.length > 0 && (
                  <div>
                    <h4 className="text-xs font-medium text-[#555] uppercase tracking-wider mb-2">Tags</h4>
                    <div className="flex flex-wrap gap-1.5">
                      {game.tags.map((tag) => (
                        <span key={tag} className="text-xs font-mono px-2.5 py-0.5 rounded-md bg-white/5 text-[#888] border border-white/8">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

function InfoCard({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="p-3 rounded-md bg-white/[0.02] border border-white/8">
      <div className="flex items-center gap-1.5 mb-1">
        {icon}
        <span className="text-[10px] font-mono font-medium text-[#555] uppercase tracking-wider">{label}</span>
      </div>
      <p className="text-xs font-mono font-semibold text-[#ededed]">{value}</p>
    </div>
  );
}
