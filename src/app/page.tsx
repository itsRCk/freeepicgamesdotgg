'use client'

import React, { useMemo, useEffect, useState } from 'react';
import { GAMES_DATA } from '@/data/games';
import { useAllGames } from '@/hooks/use-all-games';
import { useLibraryStore } from '@/store/use-library-store';
import { useStats } from '@/hooks/use-stats';
import { GameCard } from '@/components/shared/game-card';
import { HeroGiveaway, NextRefreshBanner } from '@/components/dashboard/hero-giveaway';
import { EgsFreeGamesSection } from '@/components/dashboard/egs-free-games-section';
import { EgsFreeGamesSkeleton } from '@/components/shared/home-skeleton';
import { formatPrice, cn } from '@/lib/utils';
import { PriceDisplay } from '@/components/shared/price-display';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Trophy, DollarSign, Gamepad2, TrendingUp, Loader2 } from 'lucide-react';
import { GameData } from '@/types';

export default function Home() {
  const { claimedGameIds, wishlistGameIds, isGameClaimed, toggleClaim, toggleWishlist } = useLibraryStore();
  
  const { allGames, liveActive, liveUpcoming, isLoadingLive } = useAllGames();

  // Use live active games or static active fallback for current giveaways (supports 1, 2, 3+ free games)
  const activeGiveaways = useMemo(() => {
    const liveIds = new Set(liveActive.map(g => g.id));
    const now = new Date();
    const staticActive = GAMES_DATA.filter(g => {
      const start = new Date(g.giveawayStartDate);
      const end = new Date(g.giveawayEndDate);
      return start <= now && end >= now && !liveIds.has(g.id);
    });
    return [...liveActive, ...staticActive];
  }, [liveActive]);

  // Calculate the next refresh date from upcoming games, or default to next Thursday 11am ET.
  const nextRefreshDate = useMemo(() => {
    if (liveUpcoming.length > 0 && liveUpcoming[0].giveawayStartDate) {
      return new Date(liveUpcoming[0].giveawayStartDate);
    }
    const now = new Date();
    const nextThursday = new Date(now);
    nextThursday.setDate(now.getDate() + ((4 + 7 - now.getDay()) % 7));
    nextThursday.setHours(15, 0, 0, 0); // approx UTC for 11AM ET
    return nextThursday;
  }, [liveUpcoming]);

  const { userStats } = useStats(allGames, claimedGameIds);

  // Dynamic label for the upcoming section based on actual days until next refresh
  const upcomingLabel = useMemo(() => {
    if (liveUpcoming.length === 0) return 'Coming Up';
    const msUntil = new Date(nextRefreshDate).getTime() - Date.now();
    const days = Math.ceil(msUntil / (1000 * 60 * 60 * 24));
    if (days <= 0) return 'Coming Soon';
    if (days === 1) return 'Coming Tomorrow';
    if (days <= 7) return `Coming in ${days} Days`;
    return 'Coming Next Week';
  }, [liveUpcoming, nextRefreshDate]);

  // Get last 12 past giveaways from historical data
  const pastGiveaways = useMemo(() => {
    return allGames.filter(g => new Date(g.giveawayEndDate) < new Date()).sort((a, b) => new Date(b.giveawayEndDate).getTime() - new Date(a.giveawayEndDate).getTime()).slice(0, 12);
  }, [allGames]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  return (
    <motion.div 
      className="container mx-auto px-4 py-8 space-y-12"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      {/* Free Games Section (Official EGS Layout combining Active & Upcoming) */}
      <motion.section variants={itemVariants} className="space-y-6">
        <NextRefreshBanner refreshDate={nextRefreshDate} />
        
        {isLoadingLive ? (
          <EgsFreeGamesSkeleton />
        ) : (
          <EgsFreeGamesSection
            activeGames={activeGiveaways}
            upcomingGames={liveUpcoming}
            isGameClaimed={isGameClaimed}
            onToggleClaim={toggleClaim}
          />
        )}
      </motion.section>

      {/* Quick Stats */}
      <motion.section variants={itemVariants}>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="border-white/8 bg-[#111] hover:border-white/15 transition-colors">
            <CardContent className="p-6 flex items-center gap-4">
              <div className="p-3 rounded-md bg-white/5 border border-white/8 text-[#ededed]">
                <Gamepad2 className="h-5 w-5 text-[#888]" />
              </div>
              <div>
                <p className="text-xs font-medium text-[#555]">Total Given Away</p>
                <h3 className="text-2xl font-mono font-semibold text-white">{allGames.length}</h3>
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-white/8 bg-[#111] hover:border-white/15 transition-colors">
            <CardContent className="p-6 flex items-center gap-4">
              <div className="p-3 rounded-md bg-white/5 border border-white/8 text-[#ededed]">
                <DollarSign className="h-5 w-5 text-green-400" />
              </div>
              <div>
                <p className="text-xs font-medium text-[#555]">Total Value</p>
                <h3 className="text-2xl font-mono font-semibold text-white"><PriceDisplay amount={userStats.totalClaimedValue + userStats.totalMissedValue} /></h3>
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-white/8 bg-[#111] hover:border-white/15 transition-colors">
            <CardContent className="p-6 flex items-center gap-4">
              <div className="p-3 rounded-md bg-white/5 border border-white/8 text-[#ededed]">
                <Trophy className="h-5 w-5 text-[#888]" />
              </div>
              <div>
                <p className="text-xs font-medium text-[#555]">Your Claims</p>
                <h3 className="text-2xl font-mono font-semibold text-white">{claimedGameIds.length}</h3>
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-white/8 bg-[#111] hover:border-white/15 transition-colors">
            <CardContent className="p-6 flex items-center gap-4">
              <div className="p-3 rounded-md bg-white/5 border border-white/8 text-[#ededed]">
                <TrendingUp className="h-5 w-5 text-[#888]" />
              </div>
              <div>
                <p className="text-xs font-medium text-[#555]">Money Saved</p>
                <h3 className="text-2xl font-mono font-semibold text-white"><PriceDisplay amount={userStats.moneySaved} /></h3>
              </div>
            </CardContent>
          </Card>
        </div>
      </motion.section>

      {/* Recently Free */}
      <motion.section variants={itemVariants} className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold tracking-tight text-white">Recently Free</h2>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6 sm:gap-8">
          {pastGiveaways.map((game, index) => (
            <GameCard 
              key={game.id} 
              game={game} 
              size="sm"
              isClaimed={isGameClaimed(game.id, game)}
              isWishlisted={wishlistGameIds.includes(game.id)}
              onToggleClaim={() => toggleClaim(game.id, game)}
              onToggleWishlist={() => toggleWishlist(game.id)}
              index={index}
            />
          ))}
        </div>
      </motion.section>
    </motion.div>
  );
}
