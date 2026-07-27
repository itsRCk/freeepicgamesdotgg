'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { GameData } from '@/types';
import { GAMES_DATA } from '@/data/games';

interface LibraryState {
  claimedGameIds: string[];
  wishlistGameIds: string[];
  customGames: Record<string, GameData>;
  
  claimGame: (id: string, game?: GameData) => void;
  unclaimGame: (id: string) => void;
  toggleClaim: (id: string, game?: GameData) => void;
  claimMultiple: (ids: string[]) => void;
  unclaimMultiple: (ids: string[]) => void;
  isGameClaimed: (id: string, gameOrTitle?: GameData | string) => boolean;
  
  addToWishlist: (id: string, game?: GameData) => void;
  removeFromWishlist: (id: string) => void;
  toggleWishlist: (id: string, game?: GameData) => void;
  isWishlisted: (id: string, gameOrTitle?: GameData | string) => boolean;
  
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
        const targetGame = game || nextCustom[id] || GAMES_DATA.find(g => g.id === id);
        if (targetGame && !nextCustom[id]) {
          nextCustom[id] = targetGame;
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
        const nextCustom = { ...(state.customGames || {}) };
        const targetGame = game || nextCustom[id] || GAMES_DATA.find(g => g.id === id);
        if (targetGame && !nextCustom[id]) {
          nextCustom[id] = targetGame;
        }

        const titleToCheck = targetGame?.title;
        const normalizedTitle = titleToCheck?.toLowerCase().trim();

        const isClaimed = state.claimedGameIds.some(claimedId => {
          if (claimedId === id) return true;
          if (!normalizedTitle) return false;
          const custom = state.customGames?.[claimedId];
          const staticGame = GAMES_DATA.find(sg => sg.id === claimedId);
          const claimedTitle = custom?.title || staticGame?.title;
          return claimedTitle && claimedTitle.toLowerCase().trim() === normalizedTitle;
        });

        if (isClaimed) {
          return {
            claimedGameIds: state.claimedGameIds.filter((gameId) => {
              if (gameId === id) return false;
              if (!normalizedTitle) return true;
              const custom = state.customGames?.[gameId];
              const staticGame = GAMES_DATA.find(sg => sg.id === gameId);
              const claimedTitle = custom?.title || staticGame?.title;
              return !(claimedTitle && claimedTitle.toLowerCase().trim() === normalizedTitle);
            })
          };
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
      
      isGameClaimed: (id, gameOrTitle) => {
        const state = get();
        if (state.claimedGameIds.includes(id)) return true;
        
        let titleToCheck = typeof gameOrTitle === 'string' ? gameOrTitle : gameOrTitle?.title;
        if (!titleToCheck) {
          const custom = state.customGames?.[id];
          const staticGame = GAMES_DATA.find(sg => sg.id === id);
          titleToCheck = custom?.title || staticGame?.title;
        }
        if (!titleToCheck) return false;
        
        const normalized = titleToCheck.toLowerCase().trim();
        return state.claimedGameIds.some(claimedId => {
          const custom = state.customGames?.[claimedId];
          const staticGame = GAMES_DATA.find(sg => sg.id === claimedId);
          const claimedTitle = custom?.title || staticGame?.title;
          return claimedTitle && claimedTitle.toLowerCase().trim() === normalized;
        });
      },
      
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
      
      isWishlisted: (id, gameOrTitle) => {
        const state = get();
        if (state.wishlistGameIds.includes(id)) return true;
        
        let titleToCheck = typeof gameOrTitle === 'string' ? gameOrTitle : gameOrTitle?.title;
        if (!titleToCheck) {
          const custom = state.customGames?.[id];
          const staticGame = GAMES_DATA.find(sg => sg.id === id);
          titleToCheck = custom?.title || staticGame?.title;
        }
        if (!titleToCheck) return false;
        
        const normalized = titleToCheck.toLowerCase().trim();
        return state.wishlistGameIds.some(wishlistId => {
          const custom = state.customGames?.[wishlistId];
          const staticGame = GAMES_DATA.find(sg => sg.id === wishlistId);
          const wishlistedTitle = custom?.title || staticGame?.title;
          return wishlistedTitle && wishlistedTitle.toLowerCase().trim() === normalized;
        });
      },
      
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
