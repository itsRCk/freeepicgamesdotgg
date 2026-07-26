'use client'

import React, { useMemo, useEffect, useState } from 'react';
import { GAMES_DATA } from '@/data/games';
import { useLibraryStore } from '@/store/use-library-store';
import { useStats } from '@/hooks/use-stats';
import { GameCard } from '@/components/shared/game-card';
import { HeroGiveaway, NextRefreshBanner } from '@/components/dashboard/hero-giveaway';
import { formatPrice } from '@/lib/utils';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Trophy, DollarSign, Gamepad2, TrendingUp, Loader2 } from 'lucide-react';
import { GameData } from '@/types';

export default function Home() {
  const { claimedGameIds, wishlistGameIds, toggleClaim, toggleWishlist } = useLibraryStore();
  
  const [liveActive, setLiveActive] = useState<GameData[]>([]);
  const [liveUpcoming, setLiveUpcoming] = useState<GameData[]>([]);
  const [isLoadingLive, setIsLoadingLive] = useState(true);

  useEffect(() => {
    async function fetchLive() {
      try {
        const res = await fetch('/api/live');
        if (res.ok) {
          const data = await res.json();
          setLiveActive(data.active || []);
          setLiveUpcoming(data.upcoming || []);
        }
      } catch (err) {
        console.error("Failed to fetch live epic games:", err);
      } finally {
        setIsLoadingLive(false);
      }
    }
    fetchLive();
  }, []);

  // Use the live active games for current giveaways. 
  // If none (because API failed or no games right now), it stays empty.
  const mainGiveaway = liveActive[0];
  const secondaryGiveaways = liveActive.slice(1);

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

  // Merge live games into the GAMES_DATA pool for accurate stats
  const allGames = useMemo(() => {
    const liveIds = new Set([...liveActive, ...liveUpcoming].map(g => g.id));
    const historicalFiltered = GAMES_DATA.filter(g => !liveIds.has(g.id));
    return [...liveActive, ...liveUpcoming, ...historicalFiltered];
  }, [liveActive, liveUpcoming]);

  const { userStats } = useStats(allGames, claimedGameIds);

  // Get last 8 past giveaways from historical data only
  const pastGiveaways = useMemo(() => {
    return GAMES_DATA.filter(g => new Date(g.giveawayEndDate) < new Date()).sort((a, b) => new Date(b.giveawayEndDate).getTime() - new Date(a.giveawayEndDate).getTime()).slice(0, 8);
  }, []);

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
      {/* Hero Section */}
      <motion.section variants={itemVariants} className="space-y-6">
        <NextRefreshBanner refreshDate={nextRefreshDate} />
        
        {isLoadingLive ? (
          <Card className="bg-muted/50 border-dashed backdrop-blur-md">
            <CardContent className="flex flex-col items-center justify-center h-64 text-center">
              <Loader2 className="h-12 w-12 text-muted-foreground animate-spin mb-4" />
              <h2 className="text-2xl font-bold tracking-tight">Checking Epic Games...</h2>
              <p className="text-muted-foreground mt-2">Fetching live current and upcoming giveaways.</p>
            </CardContent>
          </Card>
        ) : mainGiveaway ? (
          <HeroGiveaway game={mainGiveaway} />
        ) : (
          <Card className="bg-muted/50 border-dashed backdrop-blur-md">
            <CardContent className="flex flex-col items-center justify-center h-64 text-center">
              <Gamepad2 className="h-12 w-12 text-muted-foreground mb-4" />
              <h2 className="text-2xl font-bold tracking-tight">No Active Giveaways</h2>
              <p className="text-muted-foreground mt-2">Check back later for new free games!</p>
            </CardContent>
          </Card>
        )}
      </motion.section>

      {/* Secondary Giveaways */}
      {!isLoadingLive && secondaryGiveaways.length > 0 && (
        <motion.section variants={itemVariants} className="space-y-6">
          <h2 className="text-2xl font-bold tracking-tight flex items-center gap-2">
            <span className="bg-gradient-to-r from-primary to-blue-500 bg-clip-text text-transparent">Also Free</span> This Week
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {secondaryGiveaways.map((game, index) => (
              <GameCard 
                key={game.id} 
                game={game} 
                isClaimed={claimedGameIds.includes(game.id)}
                isWishlisted={wishlistGameIds.includes(game.id)}
                onToggleClaim={() => toggleClaim(game.id)}
                onToggleWishlist={() => toggleWishlist(game.id)}
                index={index}
              />
            ))}
          </div>
        </motion.section>
      )}

      {/* Quick Stats */}
      <motion.section variants={itemVariants}>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="bg-card/40 backdrop-blur-md border-primary/20 hover:border-primary/50 transition-colors">
            <CardContent className="p-6 flex items-center gap-4">
              <div className="p-3 rounded-xl bg-primary/10 text-primary">
                <Gamepad2 className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Given Away</p>
                <h3 className="text-2xl font-bold">{allGames.length}</h3>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-card/40 backdrop-blur-md border-green-500/20 hover:border-green-500/50 transition-colors">
            <CardContent className="p-6 flex items-center gap-4">
              <div className="p-3 rounded-xl bg-green-500/10 text-green-500">
                <DollarSign className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Value</p>
                <h3 className="text-2xl font-bold">{formatPrice(userStats.totalClaimedValue + userStats.totalMissedValue)}</h3>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-card/40 backdrop-blur-md border-blue-500/20 hover:border-blue-500/50 transition-colors">
            <CardContent className="p-6 flex items-center gap-4">
              <div className="p-3 rounded-xl bg-blue-500/10 text-blue-500">
                <Trophy className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Your Claims</p>
                <h3 className="text-2xl font-bold">{claimedGameIds.length}</h3>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-card/40 backdrop-blur-md border-purple-500/20 hover:border-purple-500/50 transition-colors">
            <CardContent className="p-6 flex items-center gap-4">
              <div className="p-3 rounded-xl bg-purple-500/10 text-purple-500">
                <TrendingUp className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Money Saved</p>
                <h3 className="text-2xl font-bold">{formatPrice(userStats.moneySaved)}</h3>
              </div>
            </CardContent>
          </Card>
        </div>
      </motion.section>

      {/* Recently Free */}
      <motion.section variants={itemVariants} className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold tracking-tight">Recently Free</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {pastGiveaways.map((game, index) => (
            <GameCard 
              key={game.id} 
              game={game} 
              isClaimed={claimedGameIds.includes(game.id)}
              isWishlisted={wishlistGameIds.includes(game.id)}
              onToggleClaim={() => toggleClaim(game.id)}
              onToggleWishlist={() => toggleWishlist(game.id)}
              index={index}
            />
          ))}
        </div>
      </motion.section>
    </motion.div>
  );
}
