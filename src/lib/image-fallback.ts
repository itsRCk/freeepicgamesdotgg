export interface FallbackImageSource {
  coverArt: string;
  heroArt: string;
}

// A curated database of fallback cover images for Epic exclusives, titles with tricky Steam IDs, or common giveaways
export const FALLBACK_COVER_DATABASE: Record<string, FallbackImageSource> = {
  "fortnite": {
    coverArt: "https://cdn2.unrealengine.com/26s-fn-top-tile-3840x2160-c11575459f2a.jpg",
    heroArt: "https://cdn2.unrealengine.com/26s-fn-top-tile-3840x2160-c11575459f2a.jpg"
  },
  "rocket league": {
    coverArt: "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/252950/library_600x900_2x.jpg",
    heroArt: "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/252950/header.jpg"
  },
  "fall guys": {
    coverArt: "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/1097150/library_600x900_2x.jpg",
    heroArt: "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/1097150/header.jpg"
  },
  "alan wake 2": {
    coverArt: "https://cdn1.epicgames.com/offer/c4763f236d08423bb47a01f56828e4ff/EGS_AlanWake2_RemedyEntertainment_S2_1200x1600-c758078dbbbaee84b423f66299d6fb35",
    heroArt: "https://cdn1.epicgames.com/offer/c4763f236d08423bb47a01f56828e4ff/EGS_AlanWake2_RemedyEntertainment_S1_2560x1440-5e714660def36a83decdca0ccde1de14"
  },
  "luto": {
    coverArt: "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/1729740/library_600x900_2x.jpg",
    heroArt: "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/1729740/header.jpg"
  },
  "grand theft auto v": {
    coverArt: "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/271590/library_600x900_2x.jpg",
    heroArt: "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/271590/header.jpg"
  },
  "death stranding": {
    coverArt: "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/1850570/library_600x900_2x.jpg",
    heroArt: "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/1850570/header.jpg"
  },
  "lost castle": {
    coverArt: "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/434650/library_600x900_2x.jpg",
    heroArt: "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/434650/header.jpg"
  }
};

export function normalizeGameTitle(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Extracts Steam App ID from a Steam image URL if present
 */
export function extractSteamAppId(url?: string): string | null {
  if (!url) return null;
  const match = url.match(/\/apps\/(\d+)\//);
  return match ? match[1] : null;
}

/**
 * Returns an ordered array of fallback image URLs for a game cover art (1200x1600 / 600x900 portrait ratio)
 */
export function getFallbackCoverUrls(title: string, currentCoverUrl?: string): string[] {
  const urls: string[] = [];
  const normalized = normalizeGameTitle(title);

  // 1. Add current primary cover url if it exists
  if (currentCoverUrl && currentCoverUrl !== '#' && !currentCoverUrl.includes('placeholder')) {
    urls.push(currentCoverUrl);
  }

  // 2. Check if we have a direct hit in our curated fallback database
  if (FALLBACK_COVER_DATABASE[normalized]) {
    urls.push(FALLBACK_COVER_DATABASE[normalized].coverArt);
  } else {
    // try partial match in database
    for (const [key, val] of Object.entries(FALLBACK_COVER_DATABASE)) {
      if (normalized.includes(key) || key.includes(normalized)) {
        urls.push(val.coverArt);
        break;
      }
    }
  }

  // 3. If we can extract a Steam App ID, add Steam's most reliable CDNs (Akamai and Cloudflare)
  const appId = extractSteamAppId(currentCoverUrl);
  if (appId) {
    urls.push(`https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/${appId}/library_600x900_2x.jpg`);
    urls.push(`https://cdn.cloudflare.steamstatic.com/steam/apps/${appId}/library_600x900_2x.jpg`);
    urls.push(`https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/${appId}/header.jpg`);
    urls.push(`https://cdn.cloudflare.steamstatic.com/steam/apps/${appId}/header.jpg`);
  }

  // Deduplicate preserving order
  return Array.from(new Set(urls.filter(Boolean)));
}
