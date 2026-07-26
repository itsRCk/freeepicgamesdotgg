'use client';

import { useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X, ExternalLink, Calendar, Tag, Star, Gamepad2,
  Monitor, Heart, Check, Clock, Building2, Code2,
} from 'lucide-react';
import { GameData } from '@/types';
import { cn, formatPrice, formatDate, formatDateRange, getGiveawayTypeLabel, getGiveawayTypeColor } from '@/lib/utils';

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
            className="fixed inset-4 sm:inset-8 md:inset-x-auto md:inset-y-8 md:max-w-3xl md:mx-auto z-50 overflow-hidden rounded-2xl border border-white/10 bg-zinc-950/95 backdrop-blur-xl shadow-2xl"
          >
            {/* Hero Image */}
            <div className="relative h-48 sm:h-56 overflow-hidden">
              <img
                src={game.heroArt}
                alt={game.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/50 to-transparent" />

              {/* Close button */}
              <button
                onClick={onClose}
                className="absolute top-4 right-4 w-9 h-9 rounded-full bg-black/50 backdrop-blur-sm border border-white/10 flex items-center justify-center text-white hover:bg-black/70 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>

              {/* Status badges */}
              <div className="absolute top-4 left-4 flex gap-2">
                {isActive && (
                  <span className="bg-gradient-to-r from-emerald-500 to-green-400 text-black text-xs font-bold px-3 py-1 rounded-full">
                    FREE NOW
                  </span>
                )}
                {game.isMystery && (
                  <span className="bg-orange-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                    Mystery Game
                  </span>
                )}
              </div>

              {/* Title overlay */}
              <div className="absolute bottom-4 left-6 right-6">
                <h2 className="text-2xl sm:text-3xl font-bold text-white leading-tight">{game.title}</h2>
              </div>
            </div>

            {/* Content */}
            <div className="overflow-y-auto max-h-[calc(100%-12rem)] sm:max-h-[calc(100%-14rem)] p-6">
              {/* Quick info */}
              <div className="flex flex-wrap gap-4 mb-6">
                <div className="flex items-center gap-2 text-sm text-zinc-400">
                  <Code2 className="w-4 h-4 text-purple-400" />
                  <span>{game.developer}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-zinc-400">
                  <Building2 className="w-4 h-4 text-blue-400" />
                  <span>{game.publisher}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-zinc-400">
                  <Calendar className="w-4 h-4 text-emerald-400" />
                  <span>{formatDate(game.releaseDate)}</span>
                </div>
              </div>

              {/* Price & Actions */}
              <div className="flex flex-wrap items-center gap-4 mb-6 p-4 rounded-xl bg-white/[0.03] border border-white/5">
                <div className="flex items-center gap-3">
                  <span className="text-zinc-500 line-through">{formatPrice(game.originalPrice)}</span>
                  <span className="text-2xl font-bold text-emerald-400">FREE</span>
                </div>
                <div className="flex-1" />
                <div className="flex gap-2">
                  <a
                    href={game.storeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-all duration-300"
                  >
                    <Gamepad2 className="w-4 h-4" />
                    Epic Store
                    <ExternalLink className="w-3 h-3" />
                  </a>
                  <button
                    onClick={() => onToggleClaim?.(game.id)}
                    className={cn(
                      "inline-flex items-center gap-2 text-sm font-bold px-6 py-2 rounded-lg border-2 transition-all duration-300 shadow-lg hover:-translate-y-0.5",
                      isClaimed
                        ? "bg-emerald-500/20 border-emerald-500/50 text-emerald-400 shadow-emerald-500/20 hover:bg-emerald-500/30 hover:border-emerald-400"
                        : "bg-zinc-800 border-zinc-600 text-zinc-200 hover:bg-zinc-700 hover:border-zinc-400 hover:text-white shadow-black/50"
                    )}
                  >
                    {isClaimed ? <Check className="w-5 h-5" /> : <Gamepad2 className="w-5 h-5" />}
                    {isClaimed ? 'Marked as Claimed' : 'Mark as Claimed'}
                  </button>
                  <button
                    onClick={() => onToggleWishlist?.(game.id)}
                    className={cn(
                      "p-2 rounded-lg border transition-all",
                      isWishlisted
                        ? "bg-pink-500/10 border-pink-500/30 text-pink-400"
                        : "bg-white/5 border-white/10 text-zinc-400 hover:text-white"
                    )}
                  >
                    <Heart className={cn("w-4 h-4", isWishlisted && "fill-current")} />
                  </button>
                </div>
              </div>

              {/* Giveaway Info */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
                <InfoCard
                  icon={<Calendar className="w-4 h-4 text-blue-400" />}
                  label="Giveaway Period"
                  value={formatDateRange(game.giveawayStartDate, game.giveawayEndDate)}
                />
                <InfoCard
                  icon={<Tag className="w-4 h-4 text-purple-400" />}
                  label="Type"
                  value={getGiveawayTypeLabel(game.giveawayType)}
                />
                <InfoCard
                  icon={<Star className="w-4 h-4 text-amber-400" />}
                  label="Metacritic"
                  value={game.metacriticScore ? `${game.metacriticScore}/100` : 'N/A'}
                />
                <InfoCard
                  icon={<Monitor className="w-4 h-4 text-emerald-400" />}
                  label="Platforms"
                  value={game.platformSupport.join(', ')}
                />
              </div>

              {/* Description */}
              {game.description && (
                <div className="mb-6">
                  <h3 className="text-sm font-semibold text-zinc-300 uppercase tracking-wider mb-2">About</h3>
                  <p className="text-sm text-zinc-400 leading-relaxed">{game.description}</p>
                </div>
              )}

              {/* Genres & Tags */}
              <div className="flex flex-wrap gap-3">
                {game.genres.length > 0 && (
                  <div>
                    <h4 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-2">Genres</h4>
                    <div className="flex flex-wrap gap-1.5">
                      {game.genres.map((genre) => (
                        <span key={genre} className="text-xs px-2.5 py-1 rounded-full bg-purple-500/10 text-purple-400 border border-purple-500/20">
                          {genre}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                {game.tags.length > 0 && (
                  <div>
                    <h4 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-2">Tags</h4>
                    <div className="flex flex-wrap gap-1.5">
                      {game.tags.map((tag) => (
                        <span key={tag} className="text-xs px-2.5 py-1 rounded-full bg-white/5 text-zinc-400 border border-white/10">
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
    <div className="p-3 rounded-lg bg-white/[0.03] border border-white/5">
      <div className="flex items-center gap-1.5 mb-1">
        {icon}
        <span className="text-[10px] font-medium text-zinc-500 uppercase tracking-wider">{label}</span>
      </div>
      <p className="text-sm font-semibold text-zinc-300">{value}</p>
    </div>
  );
}
