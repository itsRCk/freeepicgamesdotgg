'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { GameData } from '@/types';

interface LibraryState {
  claimedGameIds: string[];
  wishlistGameIds: string[];
  customGames: Record<string, GameData>;
  
  claimGame: (id: string, game?: GameData) => void;
  unclaimGame: (id: string) => void;
  toggleClaim: (id: string, game?: GameData) => void;
  claimMultiple: (ids: string[]) => void;
  unclaimMultiple: (ids: string[]) => void;
  isGameClaimed: (id: string) => boolean;
  
  addToWishlist: (id: string, game?: GameData) => void;
  removeFromWishlist: (id: string) => void;
  toggleWishlist: (id: string, game?: GameData) => void;
  isWishlisted: (id: string) => boolean;
  
  registerGames: (games: GameData[]) => void;
  importClaims: (ids: string[]) => void;
  exportClaims: () => string[];
  clearAll: () => void;
}

export const useLibraryStore = create<LibraryState>()(
  persist(
    (set, get) => ({
      claimedGameIds: [],
      wishlistGameIds: [],
      customGames: {},

      registerGames: (games) => set((state) => {
        const nextCustom = { ...(state.customGames || {}) };
        let hasNew = false;
        for (const g of games) {
          if (g && g.id && !nextCustom[g.id]) {
            nextCustom[g.id] = g;
            hasNew = true;
          }
        }
        return hasNew ? { customGames: nextCustom } : {};
      }),
      
      claimGame: (id, game) => set((state) => {
        const nextCustom = { ...(state.customGames || {}) };
        if (game && !nextCustom[id]) {
          nextCustom[id] = game;
        }
        return {
          claimedGameIds: Array.from(new Set([...state.claimedGameIds, id])),
          customGames: nextCustom,
        };
      }),
      
      unclaimGame: (id) => set((state) => ({
        claimedGameIds: state.claimedGameIds.filter((gameId) => gameId !== id)
      })),
      
      toggleClaim: (id, game) => set((state) => {
        const isClaimed = state.claimedGameIds.includes(id);
        const nextCustom = { ...(state.customGames || {}) };
        if (game && !nextCustom[id]) {
          nextCustom[id] = game;
        }
        if (isClaimed) {
          return { claimedGameIds: state.claimedGameIds.filter((gameId) => gameId !== id) };
        } else {
          return {
            claimedGameIds: [...state.claimedGameIds, id],
            customGames: nextCustom,
          };
        }
      }),
      
      claimMultiple: (ids) => set((state) => ({
        claimedGameIds: Array.from(new Set([...state.claimedGameIds, ...ids]))
      })),
      
      unclaimMultiple: (ids) => set((state) => ({
        claimedGameIds: state.claimedGameIds.filter((gameId) => !ids.includes(gameId))
      })),
      
      isGameClaimed: (id) => get().claimedGameIds.includes(id),
      
      addToWishlist: (id, game) => set((state) => {
        const nextCustom = { ...(state.customGames || {}) };
        if (game && !nextCustom[id]) {
          nextCustom[id] = game;
        }
        return {
          wishlistGameIds: Array.from(new Set([...state.wishlistGameIds, id])),
          customGames: nextCustom,
        };
      }),
      
      removeFromWishlist: (id) => set((state) => ({
        wishlistGameIds: state.wishlistGameIds.filter((gameId) => gameId !== id)
      })),
      
      toggleWishlist: (id, game) => set((state) => {
        const isWishlisted = state.wishlistGameIds.includes(id);
        const nextCustom = { ...(state.customGames || {}) };
        if (game && !nextCustom[id]) {
          nextCustom[id] = game;
        }
        if (isWishlisted) {
          return { wishlistGameIds: state.wishlistGameIds.filter((gameId) => gameId !== id) };
        } else {
          return {
            wishlistGameIds: [...state.wishlistGameIds, id],
            customGames: nextCustom,
          };
        }
      }),
      
      isWishlisted: (id) => get().wishlistGameIds.includes(id),
      
      importClaims: (ids) => set((state) => ({
        claimedGameIds: Array.from(new Set([...state.claimedGameIds, ...ids]))
      })),
      
      exportClaims: () => get().claimedGameIds,
      
      clearAll: () => set({ claimedGameIds: [], wishlistGameIds: [], customGames: {} }),
    }),
    {
      name: 'epic-games-library',
    }
  )
);
