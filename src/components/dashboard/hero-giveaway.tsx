'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { ExternalLink, Gamepad2, Gift, Info } from 'lucide-react';
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
      <div className="flex gap-2 sm:gap-3">
        {['D', 'H', 'M', 'S'].map((l) => (
          <div key={l} className="flex flex-col items-center">
            <div className={cn(
              "rounded-lg bg-white/5 border border-white/10 backdrop-blur-sm flex items-center justify-center font-mono font-bold relative overflow-hidden",
              variant === 'hero' ? 'w-20 h-20 text-3xl text-white' : 'w-14 h-14 sm:w-16 sm:h-16 bg-[#141414] text-xl sm:text-2xl text-white'
            )}>
              <div className="absolute top-0 inset-x-0 h-[1px] bg-white/15 rounded-t-lg pointer-events-none" />
              --
            </div>
            <span className="text-[10px] font-mono font-medium text-[#888] mt-1.5 uppercase tracking-widest">{l}</span>
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
      {label && (
        <p className={cn(
          "font-semibold mb-3 uppercase tracking-wider font-mono",
          variant === 'hero' ? 'text-xs text-[#888]' : 'text-[10px] text-[#555]'
        )}>
          {label}
        </p>
      )}
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
              "rounded-lg bg-white/5 border border-white/10 flex items-center justify-center font-mono font-bold transition-all duration-300 relative overflow-hidden group-hover:border-white/25",
              variant === 'hero'
                ? 'w-[72px] h-[72px] text-2xl sm:w-20 sm:h-20 sm:text-3xl text-white'
                : 'w-14 h-14 sm:w-16 sm:h-16 bg-[#141414] text-xl sm:text-2xl text-white shadow-[0_4px_12px_rgba(0,0,0,0.5)]'
            )}>
              <div className="absolute top-0 inset-x-0 h-[1px] bg-white/15 rounded-t-lg pointer-events-none" />
              <motion.span
                key={value}
                initial={{ y: -10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.2 }}
              >
                {String(value).padStart(2, '0')}
              </motion.span>
            </div>
            <span className="text-[10px] font-mono font-medium text-[#888] mt-1.5 uppercase tracking-widest">{unitLabel}</span>
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
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="relative overflow-hidden rounded-md border border-white/8 bg-[#111]"
    >
      <div className="relative p-6 sm:p-8">
        <div className="flex flex-col md:flex-row gap-6 sm:gap-8 items-center md:items-start">
          {/* Game Art */}
          <motion.div
            className="relative w-full max-w-[200px] sm:max-w-[220px] flex-shrink-0 mx-auto md:mx-0 cursor-pointer"
            whileHover={{ scale: 1.03 }}
            transition={{ duration: 0.2 }}
          >
            <Link href={`/game/${game.id}`}>
              <div className="aspect-[3/4] rounded-lg overflow-hidden border border-white/10 bg-[#111] hover:border-white/30 transition-colors">
                <GameCoverImage
                  title={game.title}
                  coverArt={game.coverArt}
                  priority={true}
                />
              </div>
              {/* FREE badge */}
              <div className="absolute -top-2 -right-2 bg-green-500/10 border border-green-500/20 text-green-400 text-xs font-mono font-medium px-2.5 py-1 rounded-md uppercase tracking-wider">
                FREE
              </div>
            </Link>
          </motion.div>

          {/* Game Info */}
          <div className="flex-1 text-center md:text-left min-w-0">
            <div className="flex items-center gap-2 justify-center md:justify-start mb-3">
              <Gift className="w-4 h-4 text-[#888]" />
              <span className="text-xs font-medium uppercase tracking-wider text-[#888]">
                Current Free Game
              </span>
            </div>

            <Link href={`/game/${game.id}`}>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-semibold tracking-tight text-white mb-3 leading-tight truncate hover:text-[#ccc] transition-colors cursor-pointer">
                {game.title}
              </h2>
            </Link>

            <p className="text-sm text-[#888] font-mono mb-4">
              Published by <span className="text-[#ededed]">{game.publisher}</span>
            </p>

            <p className="text-sm text-[#888] max-w-2xl mb-6 line-clamp-3 leading-relaxed">
              {game.description}
            </p>

            {/* Value comparison */}
            <div className="flex items-center justify-center md:justify-start gap-3 mb-6">
              <div className="flex items-center gap-2 bg-white/5 border border-white/10 px-3 py-1.5 rounded-md">
                <span className="text-xs font-mono text-[#888]">Regular Value:</span>
                <span className="text-sm font-mono line-through text-[#888]">
                  {formatPrice(game.originalPrice)}
                </span>
                <span className="text-sm font-mono font-semibold text-green-400 ml-1">
                  FREE
                </span>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-center md:justify-start gap-3">
              {/* View Details Page */}
              <Link
                href={`/game/${game.id}`}
                className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/15 text-white font-medium text-sm px-5 py-2.5 rounded-md border border-white/15 transition-colors"
              >
                <Info className="w-4 h-4 text-[#888]" />
                View Details
              </Link>

              {/* Claim on Epic */}
              <a
                href={game.storeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-white hover:bg-[#ebebeb] text-black font-medium text-sm px-6 py-2.5 rounded-md transition-colors"
              >
                <Gamepad2 className="w-4 h-4" />
                Claim on Epic Games
                <ExternalLink className="w-3.5 h-3.5" />
              </a>

              {/* Mark as Claimed */}
              <button
                onClick={() => onClaim?.(game.id)}
                className={cn(
                  "inline-flex items-center gap-2 font-medium text-sm px-5 py-2.5 rounded-md border transition-colors",
                  isClaimed
                    ? "bg-green-500/10 border-green-500/20 text-green-400 hover:bg-green-500/15"
                    : "border-white/15 text-[#ededed] hover:bg-white/5"
                )}
              >
                {isClaimed ? '✓ Claimed' : 'Mark as Claimed'}
              </button>
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
  const [formattedDateStr, setFormattedDateStr] = useState<string>('');

  useEffect(() => {
    try {
      const dayName = new Intl.DateTimeFormat(undefined, { weekday: 'long' }).format(refreshDate);
      const timeStr = new Intl.DateTimeFormat(undefined, {
        hour: 'numeric',
        minute: '2-digit',
        timeZoneName: 'short',
      }).format(refreshDate);
      const dateStr = new Intl.DateTimeFormat(undefined, {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      }).format(refreshDate);
      setFormattedDateStr(`${dayName}, ${timeStr} • ${dateStr}`);
    } catch {
      setFormattedDateStr(refreshDate.toLocaleDateString());
    }
  }, [refreshDate]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="relative overflow-hidden rounded-xl border border-white/10 bg-[#111111] grid grid-cols-1 lg:grid-cols-[1fr_auto] divide-y lg:divide-y-0 lg:divide-x divide-white/10"
    >
      <div className="p-6 sm:p-8 flex flex-col justify-center space-y-3">
        <div className="flex flex-wrap items-center gap-2.5">
          <span className="px-2.5 py-0.5 rounded bg-blue-500/10 border border-blue-500/20 text-[10px] font-mono font-semibold text-blue-400">
            Status: Active tracking
          </span>
          <span className="text-xs font-mono text-[#777]">// source: epic_store_vault</span>
        </div>
        <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-white font-sans">
          Upcoming Giveaway Drop
        </h3>
        <div className="text-sm font-mono font-medium text-[#ededed]">
          {formattedDateStr || 'Thursday, 11:00 AM EDT'}
        </div>
        <p className="text-xs text-[#888] font-mono leading-relaxed">
          Note: This is also the time left to claim the current free games.
        </p>
      </div>
      <div className="p-6 sm:p-8 bg-[#0a0a0a] flex items-center justify-center">
        <CountdownDisplay targetDate={refreshDate} label="TIME UNTIL UNLOCK" variant="compact" />
      </div>
    </motion.div>
  );
}
