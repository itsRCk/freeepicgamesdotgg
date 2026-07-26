'use client';

import { useMemo } from 'react';
import Fuse from 'fuse.js';

// Assuming you import these types from your main types file in reality
import type { GameData, FilterOptions } from '@/types';

export function useGameFilters(games: GameData[], filterOptions: FilterOptions, claimedIds: string[]) {
  return useMemo(() => {
    let result = [...games];

    // 1. Fuzzy Search
    if (filterOptions.search && filterOptions.search.trim() !== '') {
      const fuse = new Fuse(result, {
        keys: ['title', 'publisher', 'developer', 'genres', 'tags'],
        threshold: 0.3,
      });
      result = fuse.search(filterOptions.search).map(r => r.item);
    }

    // 2. Filters
    result = result.filter(game => {
      // Year Filter
      if (filterOptions.year) {
        const gameYear = new Date(game.giveawayStartDate).getFullYear();
        if (gameYear !== filterOptions.year) return false;
      }
      
      // Month Filter
      if (filterOptions.month) {
        const gameMonth = new Date(game.giveawayStartDate).getMonth() + 1;
        if (gameMonth !== filterOptions.month) return false;
      }

      // Genre Filter
      if (filterOptions.genre && !game.genres?.includes(filterOptions.genre)) {
        return false;
      }

      // Publisher Filter
      if (filterOptions.publisher && game.publisher !== filterOptions.publisher) {
        return false;
      }

      // Giveaway Type Filter
      if (filterOptions.giveawayType && game.giveawayType !== filterOptions.giveawayType) {
        return false;
      }

      // Price Range Filter [min, max]
      if (filterOptions.priceRange) {
        const [min, max] = filterOptions.priceRange;
        if (game.originalPrice < min || game.originalPrice > max) return false;
      }

      // Is Mystery Filter
      if (filterOptions.isMystery !== null && filterOptions.isMystery !== undefined) {
        if (game.isMystery !== filterOptions.isMystery) return false;
      }

      // Giveaway Status Filter (Present, Upcoming, Past)
      if (filterOptions.giveawayStatus && filterOptions.giveawayStatus !== 'all') {
        const now = new Date();
        const start = new Date(game.giveawayStartDate);
        const end = new Date(game.giveawayEndDate);
        if (filterOptions.giveawayStatus === 'present' && !(start <= now && end >= now)) return false;
        if (filterOptions.giveawayStatus === 'upcoming' && !(start > now)) return false;
        if (filterOptions.giveawayStatus === 'past' && !(end < now)) return false;
      }

      // Claim Status Filter
      if (filterOptions.claimStatus) {
        const isClaimed = claimedIds.includes(game.id);
        if (filterOptions.claimStatus === 'claimed' && !isClaimed) return false;
        if (filterOptions.claimStatus === 'missed' && isClaimed) return false;
      }

      return true;
    });

    // 3. Sorting
    if (filterOptions.sortBy) {
      result.sort((a, b) => {
        switch (filterOptions.sortBy) {
          case 'date_desc':
            return new Date(b.giveawayStartDate).getTime() - new Date(a.giveawayStartDate).getTime();
          case 'date_asc':
            return new Date(a.giveawayStartDate).getTime() - new Date(b.giveawayStartDate).getTime();
          case 'price_desc':
            return b.originalPrice - a.originalPrice;
          case 'price_asc':
            return a.originalPrice - b.originalPrice;
          case 'title_asc':
            return a.title.localeCompare(b.title);
          case 'title_desc':
            return b.title.localeCompare(a.title);

          default:
            return 0;
        }
      });
    }

    return result;
  }, [games, filterOptions, claimedIds]);
}
