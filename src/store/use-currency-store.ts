'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { DEFAULT_CURRENCY, detectDefaultCurrencyCode, getCurrencyByCode } from '@/lib/currency';

interface CurrencyState {
  currency: string;
  hasAutoDetected: boolean;
  setCurrency: (code: string) => void;
  runAutoDetect: () => void;
}

export const useCurrencyStore = create<CurrencyState>()(
  persist(
    (set, get) => ({
      currency: DEFAULT_CURRENCY,
      hasAutoDetected: false,
      setCurrency: (code: string) => {
        const config = getCurrencyByCode(code);
        set({ currency: config.code, hasAutoDetected: true });
      },
      runAutoDetect: () => {
        if (!get().hasAutoDetected) {
          const detectedCode = detectDefaultCurrencyCode();
          const config = getCurrencyByCode(detectedCode);
          set({ currency: config.code, hasAutoDetected: true });
        }
      },
    }),
    {
      name: 'epic-currency-store',
    }
  )
);
