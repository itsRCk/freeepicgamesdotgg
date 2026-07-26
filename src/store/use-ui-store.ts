'use client';

import { create } from 'zustand';
import type { FilterOptions } from '@/types';

const defaultFilterOptions: FilterOptions = {
  search: '',
  year: null,
  month: null,
  genre: null,
  publisher: null,
  giveawayType: null,
  priceRange: null,
  isMystery: null,
  claimStatus: 'all',
  sortBy: 'date_desc',
};

interface UIState {
  sidebarOpen: boolean;
  searchOpen: boolean;
  selectedGameId: string | null;
  filterOptions: FilterOptions;

  toggleSidebar: () => void;
  openSearch: () => void;
  closeSearch: () => void;
  selectGame: (id: string | null) => void;
  clearSelection: () => void;
  updateFilters: (filters: Partial<FilterOptions>) => void;
  resetFilters: () => void;
}

export const useUIStore = create<UIState>((set) => ({
  sidebarOpen: false,
  searchOpen: false,
  selectedGameId: null,
  filterOptions: defaultFilterOptions,

  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
  openSearch: () => set({ searchOpen: true }),
  closeSearch: () => set({ searchOpen: false }),
  selectGame: (id) => set({ selectedGameId: id }),
  clearSelection: () => set({ selectedGameId: null }),
  updateFilters: (filters) => set((state) => ({
    filterOptions: { ...state.filterOptions, ...filters }
  })),
  resetFilters: () => set({ filterOptions: defaultFilterOptions }),
}));
