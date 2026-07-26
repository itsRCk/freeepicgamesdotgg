export type GiveawayType = 'weekly' | 'holiday' | 'always_free' | 'dlc' | 'bundle' | 'mystery';

export interface GameData {
  id: string;
  epicId?: string;
  title: string;
  coverArt: string;
  heroArt: string;
  publisher: string;
  developer: string;
  genres: string[];
  tags: string[];
  description: string;
  storeUrl: string;
  giveawayStartDate: string;
  giveawayEndDate: string;
  originalPrice: number;
  currentPrice: number;
  currency: string;
  platformSupport: string[];
  releaseDate: string;
  metacriticScore: number | null;
  openCriticScore: number | null;
  userRating: number | null;
  giveawayType: GiveawayType;
  isMystery: boolean;
}

export interface UserStats {
  totalGiveaways: number;
  totalGames: number;
  claimedCount: number;
  missedCount: number;
  claimedPercentage: number;
  missedPercentage: number;
  totalClaimedValue: number;
  totalMissedValue: number;
  averageClaimedValue: number;
  mostExpensiveClaim: GameData | null;
  cheapestClaim: GameData | null;
  biggestMissedOpportunity: GameData | null;
  currentStreak: number;
  longestStreak: number;
  moneySaved: number;
  mostValuableMonth: { month: string; value: number } | null;
  mostValuableYear: { year: number; value: number } | null;
  mysteryGamesClaimed: number;
  averageMonthlyClaimRate: number;
  completionPercentage: number;
}

export interface YearlyStats {
  year: number;
  totalGames: number;
  claimedGames: number;
  totalValue: number;
  claimedValue: number;
}

export interface MonthlyStats {
  month: string;
  year: number;
  totalGames: number;
  claimedGames: number;
  totalValue: number;
  claimedValue: number;
}

export interface GenreStats {
  genre: string;
  count: number;
  claimedCount: number;
  totalValue: number;
}

export interface PublisherStats {
  publisher: string;
  count: number;
  claimedCount: number;
  totalValue: number;
}

export interface FilterOptions {
  search: string;
  year: number | null;
  month: number | null;
  genre: string | null;
  publisher: string | null;
  giveawayType: GiveawayType | null;
  giveawayStatus?: 'all' | 'present' | 'upcoming' | 'past';
  priceRange: [number, number] | null;
  isMystery: boolean | null;
  claimStatus: 'all' | 'claimed' | 'missed';
  sortBy: 'date_desc' | 'date_asc' | 'price_desc' | 'price_asc' | 'title_asc' | 'title_desc';
}
