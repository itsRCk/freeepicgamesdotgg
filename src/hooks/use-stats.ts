'use client';

import { useMemo } from 'react';
import type { GameData } from '@/types';

export interface UserStats {
  totalGiveaways: number;
  totalGames: number;
  claimedCount: number;
  missedCount: number;
  claimedPercentage: number;
  missedPercentage: number;
  totalClaimedValue: number;
  totalMissedValue: number;
  averageClaimedValue: number;
  mostExpensiveClaim: GameData | null;
  cheapestClaim: GameData | null;
  biggestMissedOpportunity: GameData | null;
  currentStreak: number;
  longestStreak: number;
  moneySaved: number;
  mostValuableMonth: string | null;
  mostValuableYear: string | null;
  mysteryGamesClaimed: number;
  averageMonthlyClaimRate: number;
  completionPercentage: number;
}

export interface YearlyStats { year: string; totalGames: number; claimedGames: number; totalValue: number; claimedValue: number; }
export interface MonthlyStats { month: string; year: string; totalGames: number; claimedGames: number; totalValue: number; claimedValue: number; }
export interface GenreStats { genre: string; count: number; claimedCount: number; totalValue: number; }
export interface PublisherStats { publisher: string; count: number; claimedCount: number; totalValue: number; }

export function useStats(games: GameData[], claimedIds: string[]) {
  return useMemo(() => {
    const totalGiveaways = games.length;
    const totalGames = games.length;
    let claimedCount = 0;
    let missedCount = 0;
    let totalClaimedValue = 0;
    let totalMissedValue = 0;
    
    let mostExpensiveClaim: GameData | null = null;
    let cheapestClaim: GameData | null = null;
    let biggestMissedOpportunity: GameData | null = null;
    let mysteryGamesClaimed = 0;

    const yearlyData: Record<string, YearlyStats> = {};
    const monthlyData: Record<string, MonthlyStats> = {};
    const genreData: Record<string, GenreStats> = {};
    const publisherData: Record<string, PublisherStats> = {};

    games.forEach(game => {
      const isClaimed = claimedIds.includes(game.id);
      const date = new Date(game.giveawayStartDate);
      const year = date.getFullYear().toString();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const monthKey = `${year}-${month}`;

      if (!yearlyData[year]) {
        yearlyData[year] = { year, totalGames: 0, claimedGames: 0, totalValue: 0, claimedValue: 0 };
      }
      yearlyData[year].totalGames++;
      yearlyData[year].totalValue += game.originalPrice;

      if (!monthlyData[monthKey]) {
        monthlyData[monthKey] = { month, year, totalGames: 0, claimedGames: 0, totalValue: 0, claimedValue: 0 };
      }
      monthlyData[monthKey].totalGames++;
      monthlyData[monthKey].totalValue += game.originalPrice;

      if (game.genres) {
        game.genres.forEach(genre => {
          if (!genreData[genre]) {
            genreData[genre] = { genre, count: 0, claimedCount: 0, totalValue: 0 };
          }
          genreData[genre].count++;
          genreData[genre].totalValue += game.originalPrice;
        });
      }

      if (game.publisher) {
        if (!publisherData[game.publisher]) {
          publisherData[game.publisher] = { publisher: game.publisher, count: 0, claimedCount: 0, totalValue: 0 };
        }
        publisherData[game.publisher].count++;
        publisherData[game.publisher].totalValue += game.originalPrice;
      }

      if (isClaimed) {
        claimedCount++;
        totalClaimedValue += game.originalPrice;
        yearlyData[year].claimedGames++;
        yearlyData[year].claimedValue += game.originalPrice;
        monthlyData[monthKey].claimedGames++;
        monthlyData[monthKey].claimedValue += game.originalPrice;
        
        if (game.genres) {
          game.genres.forEach(genre => genreData[genre].claimedCount++);
        }
        if (game.publisher) publisherData[game.publisher].claimedCount++;
        if (game.isMystery) mysteryGamesClaimed++;

        if (!mostExpensiveClaim || game.originalPrice > mostExpensiveClaim.originalPrice) {
          mostExpensiveClaim = game;
        }
        if (!cheapestClaim || game.originalPrice < cheapestClaim.originalPrice) {
          cheapestClaim = game;
        }
      } else {
        missedCount++;
        totalMissedValue += game.originalPrice;
        if (!biggestMissedOpportunity || game.originalPrice > biggestMissedOpportunity.originalPrice) {
          biggestMissedOpportunity = game;
        }
      }
    });

    const claimedPercentage = totalGames > 0 ? (claimedCount / totalGames) * 100 : 0;
    const missedPercentage = totalGames > 0 ? (missedCount / totalGames) * 100 : 0;
    const averageClaimedValue = claimedCount > 0 ? totalClaimedValue / claimedCount : 0;

    const yearlyStats = Object.values(yearlyData);
    const monthlyStats = Object.values(monthlyData);
    const genreStats = Object.values(genreData);
    const publisherStats = Object.values(publisherData);

    let mostValuableYear = null;
    let maxYearValue = -1;
    yearlyStats.forEach(y => {
      if (y.claimedValue > maxYearValue) {
        maxYearValue = y.claimedValue;
        mostValuableYear = y.year;
      }
    });

    let mostValuableMonth = null;
    let maxMonthValue = -1;
    monthlyStats.forEach(m => {
      if (m.claimedValue > maxMonthValue) {
        maxMonthValue = m.claimedValue;
        mostValuableMonth = `${m.year}-${m.month}`;
      }
    });

    const uniqueMonths = new Set(monthlyStats.map(m => `${m.year}-${m.month}`)).size;
    const averageMonthlyClaimRate = uniqueMonths > 0 ? claimedCount / uniqueMonths : 0;

    // Streak calculation based on weeks where at least one game was claimed
    const sortedGames = [...games].sort((a, b) => new Date(a.giveawayStartDate).getTime() - new Date(b.giveawayStartDate).getTime());
    let currentStreak = 0;
    let longestStreak = 0;
    let currentStreakCount = 0;
    
    const weeksMap: Record<string, boolean> = {};
    const weekTimestamps: number[] = [];

    sortedGames.forEach(game => {
      const date = new Date(game.giveawayStartDate);
      const msPerWeek = 1000 * 60 * 60 * 24 * 7;
      // Use an offset to align weeks more appropriately (e.g., standardizing on a particular start day)
      // Epic Games typically updates on Thursdays, this groups them by 7-day windows
      const weekIndex = Math.floor(date.getTime() / msPerWeek);
      
      if (weeksMap[weekIndex] === undefined) {
        weeksMap[weekIndex] = false;
        if (!weekTimestamps.includes(weekIndex)) {
            weekTimestamps.push(weekIndex);
        }
      }
      
      if (claimedIds.includes(game.id)) {
        weeksMap[weekIndex] = true;
      }
    });

    weekTimestamps.sort((a, b) => a - b);
    
    for (let i = 0; i < weekTimestamps.length; i++) {
      const weekIndex = weekTimestamps[i];
      if (weeksMap[weekIndex]) {
        currentStreakCount++;
        longestStreak = Math.max(longestStreak, currentStreakCount);
      } else {
        currentStreakCount = 0;
      }
    }
    
    if (weekTimestamps.length > 0) {
      const lastWeek = weekTimestamps[weekTimestamps.length - 1];
      if (weeksMap[lastWeek]) {
        currentStreak = currentStreakCount;
      } else {
        currentStreak = 0;
      }
    }

    const userStats: UserStats = {
      totalGiveaways,
      totalGames,
      claimedCount,
      missedCount,
      claimedPercentage,
      missedPercentage,
      totalClaimedValue,
      totalMissedValue,
      averageClaimedValue,
      mostExpensiveClaim,
      cheapestClaim,
      biggestMissedOpportunity,
      currentStreak,
      longestStreak,
      moneySaved: totalClaimedValue,
      mostValuableMonth,
      mostValuableYear,
      mysteryGamesClaimed,
      averageMonthlyClaimRate,
      completionPercentage: claimedPercentage,
    };

    return {
      userStats,
      yearlyStats,
      monthlyStats,
      genreStats,
      publisherStats,
    };
  }, [games, claimedIds]);
}
