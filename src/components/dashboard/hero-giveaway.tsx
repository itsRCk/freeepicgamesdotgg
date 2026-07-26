'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Clock, ExternalLink, ChevronRight, Gamepad2, Gift } from 'lucide-react';
import { GameData } from '@/types';
import { formatPrice, getTimeRemaining } from '@/lib/utils';
import { cn } from '@/lib/utils';
import { GameCoverImage } from '@/components/shared/game-cover-image';

interface CountdownDisplayProps {
  targetDate: string | Date;
  label: string;
  variant?: 'hero' | 'compact';
}

export function CountdownDisplay({ targetDate, label, variant = 'hero' }: CountdownDisplayProps) {
  const [time, setTime] = useState(getTimeRemaining(targetDate));
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const timer = setInterval(() => {
      setTime(getTimeRemaining(targetDate));
    }, 1000);
    return () => clearInterval(timer);
  }, [targetDate]);

  if (!mounted) {
    return (
      <div className="flex gap-3">
        {['D', 'H', 'M', 'S'].map((l) => (
          <div key={l} className="flex flex-col items-center">
            <div className={cn(
              "rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm flex items-center justify-center font-mono font-bold",
              variant === 'hero' ? 'w-20 h-20 text-3xl' : 'w-14 h-14 text-xl'
            )}>
              --
            </div>
            <span className="text-xs text-zinc-500 mt-1 uppercase tracking-wider">{l}</span>
          </div>
        ))}
      </div>
    );
  }

  const timeUnits = [
    { value: time.days, label: 'Days' },
    { value: time.hours, label: 'Hours' },
    { value: time.minutes, label: 'Mins' },
    { value: time.seconds, label: 'Secs' },
  ];

  return (
    <div>
      <p className={cn(
        "font-semibold mb-3 uppercase tracking-wider",
        variant === 'hero' ? 'text-sm text-zinc-400' : 'text-xs text-zinc-500'
      )}>
        {label}
      </p>
      <div className="flex gap-3">
        {timeUnits.map(({ value, label: unitLabel }) => (
          <motion.div
            key={unitLabel}
            className="flex flex-col items-center"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <div className={cn(
              "rounded-xl bg-white/5 border border-white/10 backdrop-blur-md flex items-center justify-center font-mono font-bold transition-all duration-300",
              variant === 'hero'
                ? 'w-[72px] h-[72px] text-2xl sm:w-20 sm:h-20 sm:text-3xl text-white'
                : 'w-14 h-14 text-xl text-zinc-300'
            )}>
              <motion.span
                key={value}
                initial={{ y: -10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.2 }}
              >
                {String(value).padStart(2, '0')}
              </motion.span>
            </div>
            <span className="text-[10px] text-zinc-500 mt-1.5 uppercase tracking-widest">{unitLabel}</span>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

interface HeroGiveawayProps {
  game: GameData;
  onClaim?: (id: string) => void;
  isClaimed?: boolean;
}

export function HeroGiveaway({ game, onClaim, isClaimed }: HeroGiveawayProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="relative overflow-hidden rounded-2xl border border-white/10"
    >
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-950/80 via-slate-900/90 to-purple-950/80" />
      <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-5" />

      {/* Animated glow */}
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl animate-pulse" />
      <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-blue-600/15 rounded-full blur-3xl animate-pulse" />

      <div className="relative p-6 sm:p-8 lg:p-10">
        <div className="flex flex-col lg:flex-row gap-8 items-center">
          {/* Game Art */}
          <motion.div
            className="relative w-full max-w-[280px] lg:max-w-[240px] flex-shrink-0"
            whileHover={{ scale: 1.03 }}
            transition={{ duration: 0.3 }}
          >
            <div className="aspect-[3/4] rounded-xl overflow-hidden border border-white/10 shadow-2xl shadow-purple-900/30">
              <GameCoverImage
                title={game.title}
                coverArt={game.coverArt}
                priority={true}
              />
            </div>
            {/* FREE badge */}
            <div className="absolute -top-2 -right-2 bg-gradient-to-r from-emerald-500 to-green-400 text-black text-xs font-extrabold px-3 py-1.5 rounded-full shadow-lg shadow-emerald-500/30 uppercase tracking-wider">
              FREE
            </div>
          </motion.div>

          {/* Game Info */}
          <div className="flex-1 text-center lg:text-left">
            <div className="flex items-center gap-2 justify-center lg:justify-start mb-3">
              <Gift className="w-4 h-4 text-purple-400" />
              <span className="text-xs font-semibold uppercase tracking-wider text-purple-400">
                Current Free Game
              </span>
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-3 leading-tight">
              {game.title}
            </h2>

            <p className="text-zinc-400 text-sm mb-2">
              {game.developer} • {game.publisher}
            </p>

            <div className="flex flex-wrap gap-2 justify-center lg:justify-start mb-4">
              {game.genres.slice(0, 3).map((genre) => (
                <span
                  key={genre}
                  className="text-xs px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-zinc-400"
                >
                  {genre}
                </span>
              ))}
            </div>

            <p className="text-zinc-500 text-sm line-clamp-2 mb-6 max-w-xl">
              {game.description}
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-4 mb-6">
              {/* Price */}
              <div className="flex items-center gap-3">
                <span className="text-zinc-500 line-through text-lg">
                  {formatPrice(game.originalPrice)}
                </span>
                <span className="text-3xl font-bold text-emerald-400">
                  FREE
                </span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-4">
              {/* Claim on Epic */}
              <a
                href={game.storeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-semibold px-6 py-3 rounded-xl transition-all duration-300 shadow-lg shadow-purple-600/25 hover:shadow-purple-600/40 hover:scale-[1.02]"
              >
                <Gamepad2 className="w-5 h-5" />
                Claim on Epic Games
                <ExternalLink className="w-4 h-4" />
              </a>

              {/* Mark as Claimed */}
              <button
                onClick={() => onClaim?.(game.id)}
                className={cn(
                  "inline-flex items-center gap-2 font-semibold px-5 py-3 rounded-xl border transition-all duration-300",
                  isClaimed
                    ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20"
                    : "bg-white/5 border-white/10 text-zinc-400 hover:text-white hover:border-white/20"
                )}
              >
                {isClaimed ? '✓ Claimed' : 'Mark as Claimed'}
              </button>
            </div>

            {/* Countdown */}
            <div className="mt-8">
              <CountdownDisplay
                targetDate={game.giveawayEndDate}
                label="⏰ Claim before it's gone"
                variant="hero"
              />
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

interface NextRefreshProps {
  refreshDate: Date;
}

export function NextRefreshBanner({ refreshDate }: NextRefreshProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.2 }}
      className="relative overflow-hidden rounded-xl border border-white/10 bg-gradient-to-r from-slate-900/80 via-indigo-950/50 to-slate-900/80 backdrop-blur-xl"
    >
      <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 via-purple-600/5 to-blue-600/5" />
      <div className="relative p-6 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
            <Clock className="w-5 h-5 text-blue-400" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-white">Next Free Games Refresh</h3>
            <p className="text-xs text-zinc-500">New free games drop every Thursday at 11 AM ET</p>
          </div>
        </div>
        <CountdownDisplay targetDate={refreshDate} label="" variant="compact" />
      </div>
    </motion.div>
  );
}
