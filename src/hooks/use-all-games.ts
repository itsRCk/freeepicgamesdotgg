'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import { GAMES_DATA } from '@/data/games';
import { useLibraryStore } from '@/store/use-library-store';
import { GameData } from '@/types';

// Global cache so multiple components using useAllGames don't re-fetch /api/live unnecessarily
let globalLiveActive: GameData[] = [];
let globalLiveUpcoming: GameData[] = [];
let globalFetchPromise: Promise<void> | null = null;
let globalLoaded = false;

export function useAllGames() {
  const { customGames, registerGames } = useLibraryStore();
  const [liveActive, setLiveActive] = useState<GameData[]>(globalLiveActive);
  const [liveUpcoming, setLiveUpcoming] = useState<GameData[]>(globalLiveUpcoming);
  const [isLoadingLive, setIsLoadingLive] = useState<boolean>(!globalLoaded);

  const fetchLive = useCallback(async (force = false) => {
    if (globalLoaded && !force) {
      setLiveActive(globalLiveActive);
      setLiveUpcoming(globalLiveUpcoming);
      setIsLoadingLive(false);
      return;
    }

    if (globalFetchPromise && !force) {
      setIsLoadingLive(true);
      await globalFetchPromise;
      setLiveActive(globalLiveActive);
      setLiveUpcoming(globalLiveUpcoming);
      setIsLoadingLive(false);
      return;
    }

    setIsLoadingLive(true);
    globalFetchPromise = (async () => {
      try {
        const res = await fetch('/api/live');
        if (res.ok) {
          const data = await res.json();
          globalLiveActive = data.active || [];
          globalLiveUpcoming = data.upcoming || [];
          globalLoaded = true;
          registerGames([...globalLiveActive, ...globalLiveUpcoming]);
        }
      } catch (err) {
        console.error('Failed to fetch live epic games:', err);
      }
    })();

    try {
      await globalFetchPromise;
      setLiveActive(globalLiveActive);
      setLiveUpcoming(globalLiveUpcoming);
    } finally {
      setIsLoadingLive(false);
    }
  }, [registerGames]);

  useEffect(() => {
    fetchLive();
  }, [fetchLive]);

  const allGames = useMemo(() => {
    const titleMap = new Map<string, GameData>();

    // 1. Live active games FIRST (overrides static duplicates with fresh live metadata & IDs)
    liveActive.forEach((g) => {
      if (g && g.title) {
        titleMap.set(g.title.toLowerCase().trim(), g);
      }
    });

    // 2. Live upcoming games SECOND
    liveUpcoming.forEach((g) => {
      if (g && g.title) {
        const key = g.title.toLowerCase().trim();
        if (!titleMap.has(key)) {
          titleMap.set(key, g);
        }
      }
    });

    // 3. Custom games persisted in local store THIRD
    if (customGames) {
      Object.values(customGames).forEach((g) => {
        if (g && g.title) {
          const key = g.title.toLowerCase().trim();
          if (!titleMap.has(key)) {
            titleMap.set(key, g);
          }
        }
      });
    }

    // 4. Static games from GAMES_DATA FOURTH
    GAMES_DATA.forEach((g) => {
      if (g && g.title) {
        const key = g.title.toLowerCase().trim();
        if (!titleMap.has(key)) {
          titleMap.set(key, g);
        }
      }
    });

    const list = Array.from(titleMap.values());
    // Sort all games chronologically by giveawayEndDate descending (newest / currently active freebies at the top)
    list.sort((a, b) => {
      const dateA = new Date(a.giveawayEndDate || a.releaseDate || 0).getTime();
      const dateB = new Date(b.giveawayEndDate || b.releaseDate || 0).getTime();
      if (dateB !== dateA) return dateB - dateA;
      return (a.title || '').localeCompare(b.title || '');
    });

    return list;
  }, [customGames, liveActive, liveUpcoming]);

  return {
    allGames,
    liveActive,
    liveUpcoming,
    isLoadingLive,
    refreshLive: () => fetchLive(true),
  };
}
