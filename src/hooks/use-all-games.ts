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
    const map = new Map<string, GameData>();
    // 1. Static games from GAMES_DATA
    GAMES_DATA.forEach((g) => map.set(g.id, g));
    // 2. Custom games persisted in local store (including any previously claimed live games)
    if (customGames) {
      Object.values(customGames).forEach((g) => map.set(g.id, g));
    }
    // 3. Live active games
    liveActive.forEach((g) => map.set(g.id, g));
    // 4. Live upcoming games
    liveUpcoming.forEach((g) => map.set(g.id, g));

    return Array.from(map.values());
  }, [customGames, liveActive, liveUpcoming]);

  return {
    allGames,
    liveActive,
    liveUpcoming,
    isLoadingLive,
    refreshLive: () => fetchLive(true),
  };
}
