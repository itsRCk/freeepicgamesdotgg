import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(price: number, currency: string = 'USD'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
  }).format(price);
}

export function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

export function formatDateRange(start: string, end: string): string {
  const startDate = new Date(start);
  const endDate = new Date(end);
  const startStr = startDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  const endStr = endDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  return `${startStr} – ${endStr}`;
}

export function getTimeRemaining(endDate: string | Date): {
  total: number;
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
} {
  const end = new Date(endDate).getTime();
  const now = Date.now();
  const total = Math.max(0, end - now);

  return {
    total,
    days: Math.floor(total / (1000 * 60 * 60 * 24)),
    hours: Math.floor((total / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((total / (1000 * 60)) % 60),
    seconds: Math.floor((total / 1000) % 60),
  };
}

export function getGiveawayTypeLabel(type: string): string {
  const labels: Record<string, string> = {
    weekly: 'Weekly',
    holiday: 'Holiday',
    always_free: 'Always Free',
    dlc: 'DLC',
    bundle: 'Bundle',
    mystery: 'Mystery',
  };
  return labels[type] || type;
}

export function getGiveawayTypeColor(type: string): string {
  const colors: Record<string, string> = {
    weekly: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    holiday: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
    always_free: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
    dlc: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
    bundle: 'bg-pink-500/20 text-pink-400 border-pink-500/30',
    mystery: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
  };
  return colors[type] || 'bg-zinc-500/20 text-zinc-400 border-zinc-500/30';
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

export function getUniqueValues<T>(items: T[], key: keyof T): string[] {
  const values = new Set<string>();
  items.forEach((item) => {
    const value = item[key];
    if (Array.isArray(value)) {
      value.forEach((v) => values.add(String(v)));
    } else if (value != null) {
      values.add(String(value));
    }
  });
  return Array.from(values).sort();
}

export function isCurrentlyFree(game: {
  startDate?: string;
  endDate?: string;
  giveawayStartDate?: string;
  giveawayEndDate?: string;
  giveAwayType?: string;
  giveawayType?: string;
  originalPrice?: number;
}): boolean {
  if (
    game.originalPrice === 0 ||
    game.giveAwayType === 'always_free' ||
    game.giveawayType === 'always_free'
  ) {
    return true;
  }
  const startStr = game.startDate || game.giveawayStartDate;
  const endStr = game.endDate || game.giveawayEndDate;
  if (!startStr || !endStr) return false;

  const now = Date.now();
  const start = new Date(startStr).getTime();
  const end = new Date(endStr).getTime();
  return now >= start && now <= end;
}

export function isUpcomingGiveaway(game: {
  startDate?: string;
  giveawayStartDate?: string;
}): boolean {
  const startStr = game.startDate || game.giveawayStartDate;
  if (!startStr) return false;
  return Date.now() < new Date(startStr).getTime();
}

