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
            className="fixed inset-4 sm:inset-8 md:inset-x-auto md:inset-y-8 md:max-w-3xl md:mx-auto z-50 overflow-hidden rounded-xl border border-white/8 bg-[#111] shadow-xl"
          >
            {/* Hero Image */}
            <div className="relative h-48 sm:h-56 overflow-hidden">
              <img
                src={game.heroArt}
                alt={game.title}
                className="w-full h-full object-cover"
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
                  <span className="text-[#555] line-through font-mono text-sm">{formatPrice(game.originalPrice)}</span>
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
