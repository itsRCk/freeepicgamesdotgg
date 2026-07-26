'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface LibraryState {
  claimedGameIds: string[];
  wishlistGameIds: string[];
  
  claimGame: (id: string) => void;
  unclaimGame: (id: string) => void;
  toggleClaim: (id: string) => void;
  claimMultiple: (ids: string[]) => void;
  unclaimMultiple: (ids: string[]) => void;
  isGameClaimed: (id: string) => boolean;
  
  addToWishlist: (id: string) => void;
  removeFromWishlist: (id: string) => void;
  toggleWishlist: (id: string) => void;
  isWishlisted: (id: string) => boolean;
  
  importClaims: (ids: string[]) => void;
  exportClaims: () => string[];
  clearAll: () => void;
}

export const useLibraryStore = create<LibraryState>()(
  persist(
    (set, get) => ({
      claimedGameIds: [],
      wishlistGameIds: [],
      
      claimGame: (id) => set((state) => ({
        claimedGameIds: Array.from(new Set([...state.claimedGameIds, id]))
      })),
      
      unclaimGame: (id) => set((state) => ({
        claimedGameIds: state.claimedGameIds.filter((gameId) => gameId !== id)
      })),
      
      toggleClaim: (id) => set((state) => {
        const isClaimed = state.claimedGameIds.includes(id);
        if (isClaimed) {
          return { claimedGameIds: state.claimedGameIds.filter((gameId) => gameId !== id) };
        } else {
          return { claimedGameIds: [...state.claimedGameIds, id] };
        }
      }),
      
      claimMultiple: (ids) => set((state) => ({
        claimedGameIds: Array.from(new Set([...state.claimedGameIds, ...ids]))
      })),
      
      unclaimMultiple: (ids) => set((state) => ({
        claimedGameIds: state.claimedGameIds.filter((gameId) => !ids.includes(gameId))
      })),
      
      isGameClaimed: (id) => get().claimedGameIds.includes(id),
      
      addToWishlist: (id) => set((state) => ({
        wishlistGameIds: Array.from(new Set([...state.wishlistGameIds, id]))
      })),
      
      removeFromWishlist: (id) => set((state) => ({
        wishlistGameIds: state.wishlistGameIds.filter((gameId) => gameId !== id)
      })),
      
      toggleWishlist: (id) => set((state) => {
        const isWishlisted = state.wishlistGameIds.includes(id);
        if (isWishlisted) {
          return { wishlistGameIds: state.wishlistGameIds.filter((gameId) => gameId !== id) };
        } else {
          return { wishlistGameIds: [...state.wishlistGameIds, id] };
        }
      }),
      
      isWishlisted: (id) => get().wishlistGameIds.includes(id),
      
      importClaims: (ids) => set((state) => ({
        claimedGameIds: Array.from(new Set([...state.claimedGameIds, ...ids]))
      })),
      
      exportClaims: () => get().claimedGameIds,
      
      clearAll: () => set({ claimedGameIds: [], wishlistGameIds: [] }),
    }),
    {
      name: 'epic-games-library',
    }
  )
);
