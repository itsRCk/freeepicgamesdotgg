'use client';

import { useState, useEffect, useCallback } from 'react';
import { useCurrencyStore } from '@/store/use-currency-store';
import { formatLocalizedCurrency, convertPrice, getCurrencyByCode, DEFAULT_CURRENCY } from '@/lib/currency';

export function usePrice() {
  const { currency, setCurrency, runAutoDetect } = useCurrencyStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    runAutoDetect();
  }, [runAutoDetect]);

  const activeCurrencyCode = mounted ? currency : DEFAULT_CURRENCY;
  const config = getCurrencyByCode(activeCurrencyCode);

  const format = useCallback((usdAmount: number, gameTitle?: string): string => {
    return formatLocalizedCurrency(usdAmount, activeCurrencyCode, gameTitle);
  }, [activeCurrencyCode]);

  const convert = useCallback((usdAmount: number, gameTitle?: string): number => {
    return convertPrice(usdAmount, activeCurrencyCode, gameTitle);
  }, [activeCurrencyCode]);

  return {
    currency: activeCurrencyCode,
    setCurrency,
    format,
    convert,
    symbol: config.symbol,
    code: config.code,
    name: config.name,
    mounted,
  };
}
