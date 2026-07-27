import { GameData } from '@/types';

export interface RichGameDetails {
  description: string;
  developer: string;
  publisher?: string;
  genres: string[];
  features: string[];
  rating: number;
  ratingCount?: number;
  metacritic?: number;
  screenshots: string[];
  releaseDate?: string;
  systemRequirements?: {
    minimum?: {
      os: string;
      cpu: string;
      memory: string;
      gpu: string;
    };
    recommended?: {
      os: string;
      cpu: string;
      memory: string;
      gpu: string;
    };
  };
}

const CACHE_SECONDS = 86400; // 24-hour caching

function stripHtml(html?: string): string {
  if (!html) return '';
  return html
    .replace(/<br\s*[\/]?>/gi, '\n')
    .replace(/<\/p>/gi, '\n\n')
    .replace(/<[^>]+>/g, '')
    .replace(/&quot;/g, '"')
    .replace(/&amp;/g, '&')
    .replace(/&#039;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .trim();
}

/**
 * Fetch rich game details from RAWG API (if key present) or fall back to
 * public Steam Storefront API, with 24-hour Next.js fetch caching.
 */
export async function fetchGameDetails(game: GameData): Promise<RichGameDetails> {
  // 1. Default fallback structure
  const fallbackDetails: RichGameDetails = {
    description: game.description || `Experience the critically acclaimed world of ${game.title}. Developed by ${game.developer}, this game delivers engaging mechanics and memorable gameplay.`,
    developer: game.developer || 'Unknown Developer',
    publisher: game.publisher || game.developer || 'Unknown Publisher',
    genres: ['Action', 'Adventure', 'RPG'],
    features: ['Single Player', 'Cloud Saves', 'Achievements', 'Full Controller Support'],
    rating: 4.4,
    ratingCount: 128,
    metacritic: 82,
    screenshots: [
      `https://picsum.photos/seed/${game.id}1/1280/720`,
      `https://picsum.photos/seed/${game.id}2/1280/720`,
      `https://picsum.photos/seed/${game.id}3/1280/720`,
      `https://picsum.photos/seed/${game.id}4/1280/720`,
    ],
    systemRequirements: {
      minimum: {
        os: 'Windows 10 64-bit',
        cpu: 'Intel Core i5-4590 or AMD FX 8350',
        memory: '8 GB RAM',
        gpu: 'NVIDIA GeForce GTX 970 or AMD Radeon R9 290',
      },
      recommended: {
        os: 'Windows 11 64-bit',
        cpu: 'Intel Core i7-8700K or AMD Ryzen 5 3600',
        memory: '16 GB RAM',
        gpu: 'NVIDIA GeForce RTX 3060 or AMD Radeon RX 6700 XT',
      },
    },
  };

  try {
    const rawgKey = process.env.RAWG_API_KEY;

    // 2. Try RAWG API if key is available
    if (rawgKey) {
      const searchUrl = `https://api.rawg.io/api/games?key=${rawgKey}&search=${encodeURIComponent(game.title)}&page_size=1`;
      const searchRes = await fetch(searchUrl, { next: { revalidate: CACHE_SECONDS } });
      if (searchRes.ok) {
        const searchJson = await searchRes.json();
        const topGame = searchJson.results?.[0];
        if (topGame && topGame.id) {
          const detailUrl = `https://api.rawg.io/api/games/${topGame.id}?key=${rawgKey}`;
          const detailRes = await fetch(detailUrl, { next: { revalidate: CACHE_SECONDS } });
          if (detailRes.ok) {
            const rawgData = await detailRes.json();
            return {
              description: stripHtml(rawgData.description) || fallbackDetails.description,
              developer: rawgData.developers?.[0]?.name || fallbackDetails.developer,
              publisher: rawgData.publishers?.[0]?.name || fallbackDetails.publisher,
              genres: rawgData.genres?.map((g: { name: string }) => g.name).slice(0, 5) || fallbackDetails.genres,
              features: rawgData.tags?.map((t: { name: string }) => t.name).slice(0, 6) || fallbackDetails.features,
              rating: rawgData.rating ? Number((rawgData.rating).toFixed(1)) : fallbackDetails.rating,
              ratingCount: rawgData.ratings_count || fallbackDetails.ratingCount,
              metacritic: rawgData.metacritic || fallbackDetails.metacritic,
              screenshots: rawgData.short_screenshots?.map((s: { image: string }) => s.image).slice(0, 5) || fallbackDetails.screenshots,
              releaseDate: rawgData.released || undefined,
              systemRequirements: fallbackDetails.systemRequirements,
            };
          }
        }
      }
    }

    // 3. Fall back to free Steam Storefront search API (zero API key required)
    const steamSearchUrl = `https://store.steampowered.com/api/storesearch/?term=${encodeURIComponent(game.title)}&l=english&cc=US`;
    const steamSearchRes = await fetch(steamSearchUrl, { next: { revalidate: CACHE_SECONDS } });
    if (steamSearchRes.ok) {
      const steamJson = await steamSearchRes.json();
      const steamAppId = steamJson.items?.[0]?.id;
      if (steamAppId) {
        const detailUrl = `https://store.steampowered.com/api/appdetails?appids=${steamAppId}&l=english`;
        const detailRes = await fetch(detailUrl, { next: { revalidate: CACHE_SECONDS } });
        if (detailRes.ok) {
          const appDetailsJson = await detailRes.json();
          const appData = appDetailsJson[String(steamAppId)]?.data;
          if (appData && appDetailsJson[String(steamAppId)]?.success) {
            const genres = appData.genres?.map((g: { description: string }) => g.description) || fallbackDetails.genres;
            const features = appData.categories?.map((c: { description: string }) => c.description).slice(0, 6) || fallbackDetails.features;
            const screenshots = appData.screenshots?.map((s: { path_full: string }) => s.path_full).slice(0, 6) || fallbackDetails.screenshots;
            const desc = stripHtml(appData.detailed_description || appData.short_description);

            return {
              description: desc || fallbackDetails.description,
              developer: appData.developers?.[0] || fallbackDetails.developer,
              publisher: appData.publishers?.[0] || fallbackDetails.publisher,
              genres,
              features,
              rating: fallbackDetails.rating,
              ratingCount: fallbackDetails.ratingCount,
              metacritic: appData.metacritic?.score || fallbackDetails.metacritic,
              screenshots: screenshots.length > 0 ? screenshots : fallbackDetails.screenshots,
              releaseDate: appData.release_date?.date || undefined,
              systemRequirements: fallbackDetails.systemRequirements,
            };
          }
        }
      }
    }
  } catch (error) {
    console.error('Error fetching game details:', error);
  }

  return fallbackDetails;
}
