export interface CurrencyConfig {
  code: string;
  name: string;
  symbol: string;
  rate: number; // exchange rate relative to USD (1.0)
  locale: string;
  decimals: number;
}

export const SUPPORTED_CURRENCIES: Record<string, CurrencyConfig> = {
  USD: { code: 'USD', name: 'US Dollar', symbol: '$', rate: 1.0, locale: 'en-US', decimals: 2 },
  EUR: { code: 'EUR', name: 'Euro', symbol: '€', rate: 0.92, locale: 'de-DE', decimals: 2 },
  GBP: { code: 'GBP', name: 'British Pound', symbol: '£', rate: 0.79, locale: 'en-GB', decimals: 2 },
  CAD: { code: 'CAD', name: 'Canadian Dollar', symbol: 'CA$', rate: 1.38, locale: 'en-CA', decimals: 2 },
  AUD: { code: 'AUD', name: 'Australian Dollar', symbol: 'A$', rate: 1.52, locale: 'en-AU', decimals: 2 },
  INR: { code: 'INR', name: 'Indian Rupee', symbol: '₹', rate: 83.50, locale: 'en-IN', decimals: 2 },
  BRL: { code: 'BRL', name: 'Brazilian Real', symbol: 'R$', rate: 5.45, locale: 'pt-BR', decimals: 2 },
  JPY: { code: 'JPY', name: 'Japanese Yen', symbol: '¥', rate: 155.0, locale: 'ja-JP', decimals: 0 },
  CNY: { code: 'CNY', name: 'Chinese Yuan', symbol: '¥', rate: 7.25, locale: 'zh-CN', decimals: 0 },
  MXN: { code: 'MXN', name: 'Mexican Peso', symbol: 'MX$', rate: 18.50, locale: 'es-MX', decimals: 2 },
};

export const DEFAULT_CURRENCY = 'USD';

export function getCurrencyByCode(code: string): CurrencyConfig {
  return SUPPORTED_CURRENCIES[code.toUpperCase()] || SUPPORTED_CURRENCIES[DEFAULT_CURRENCY];
}

/**
 * Detect user's currency from their browser timezone and locale.
 * Runs safely on client side.
 */
export function detectDefaultCurrencyCode(): string {
  if (typeof window === 'undefined') return DEFAULT_CURRENCY;

  try {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || '';
    const lang = navigator.language || '';

    // Check timezone first
    if (tz.includes('KolkataCalcutta') || tz.includes('Kolkata') || tz.includes('Calcutta') || lang === 'en-IN' || lang === 'hi-IN') {
      return 'INR';
    }
    if (tz.includes('London') || lang === 'en-GB') {
      return 'GBP';
    }
    if (tz.startsWith('Europe/') || lang.endsWith('-DE') || lang.endsWith('-FR') || lang.endsWith('-IT') || lang.endsWith('-ES') || lang.endsWith('-NL')) {
      return 'EUR';
    }
    if (tz.includes('Sao_Paulo') || tz.includes('Brazil') || lang.startsWith('pt-BR')) {
      return 'BRL';
    }
    if (tz.includes('Tokyo') || lang.startsWith('ja')) {
      return 'JPY';
    }
    if (tz.includes('Shanghai') || tz.includes('Beijing') || lang.startsWith('zh')) {
      return 'CNY';
    }
    if (tz.includes('Sydney') || tz.includes('Melbourne') || lang === 'en-AU') {
      return 'AUD';
    }
    if (tz.includes('Toronto') || tz.includes('Vancouver') || tz.includes('Montreal') || lang === 'en-CA' || lang === 'fr-CA') {
      return 'CAD';
    }
    if (tz.includes('Mexico') || lang === 'es-MX') {
      return 'MXN';
    }
  } catch {
    // Ignore errors and fallback to USD
  }

  return DEFAULT_CURRENCY;
}

/**
 * Convert USD price to local currency amount
 */
export function convertPrice(usdAmount: number, currencyCode: string): number {
  const config = getCurrencyByCode(currencyCode);
  return usdAmount * config.rate;
}

/**
 * Convert USD price and format it as a localized currency string
 */
export function formatLocalizedCurrency(usdAmount: number, currencyCode: string): string {
  const config = getCurrencyByCode(currencyCode);
  const converted = usdAmount * config.rate;

  return new Intl.NumberFormat(config.locale, {
    style: 'currency',
    currency: config.code,
    minimumFractionDigits: config.decimals,
    maximumFractionDigits: config.decimals,
  }).format(converted);
}
