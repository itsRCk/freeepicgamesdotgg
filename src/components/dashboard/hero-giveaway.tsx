'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Clock, ExternalLink, ChevronRight, Gamepad2, Gift, Info } from 'lucide-react';
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

            {/* Countdown */}
            <div className="mt-8 flex justify-center md:justify-start">
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
      transition={{ duration: 0.3, delay: 0.1 }}
      className="relative overflow-hidden rounded-xl border border-white/10 bg-[#0d0d0d] shadow-[0_4px_24px_rgba(0,0,0,0.6)] group hover:border-white/20 transition-all duration-300"
    >
      {/* Subtle top edge vibrant glow line (Geist accent line) */}
      <div className="absolute top-0 inset-x-0 h-[1.5px] bg-gradient-to-r from-transparent via-green-500/70 to-transparent z-10" />

      {/* Ambient radial glows (vibrant Geist emerald and cyan accents) */}
      <div className="absolute -top-32 left-1/4 -translate-x-1/2 w-96 h-64 bg-green-500/10 rounded-full blur-3xl pointer-events-none group-hover:bg-green-500/15 transition-all duration-500" />
      <div className="absolute -bottom-32 right-1/4 translate-x-1/2 w-96 h-64 bg-blue-500/10 rounded-full blur-3xl pointer-events-none group-hover:bg-blue-500/15 transition-all duration-500" />

      {/* Geist subtle grid overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />

      <div className="relative p-6 sm:p-8 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 z-10">
        <div className="flex flex-col items-start">
          {/* Eyebrow badge */}
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full border border-green-500/20 bg-green-500/10 text-[11px] font-mono font-medium text-green-400 mb-3 shadow-[0_0_12px_rgba(16,185,129,0.15)]">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
            </span>
            EPIC VAULT DROP COUNTDOWN
          </div>

          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-b from-white/10 to-white/5 border border-white/15 flex items-center justify-center flex-shrink-0 group-hover:border-green-500/30 transition-colors shadow-inner">
              <Clock className="w-6 h-6 text-green-400 group-hover:scale-110 transition-transform duration-300" />
            </div>
            <div>
              <h3 className="text-lg sm:text-xl font-semibold tracking-tight text-white">
                Next Free Games Refresh
              </h3>
              <p className="text-sm text-[#888] mt-1 leading-relaxed">
                New games unlock automatically every <span className="text-[#ededed] font-medium underline underline-offset-4 decoration-green-500/40">Thursday at 11:00 AM ET</span>.
              </p>
            </div>
          </div>
        </div>

        <div className="w-full lg:w-auto flex justify-start lg:justify-end">
          <CountdownDisplay targetDate={refreshDate} label="" variant="compact" />
        </div>
      </div>
    </motion.div>
  );
}
