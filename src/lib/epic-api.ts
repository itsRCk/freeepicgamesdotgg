import { GameData, GiveawayType } from '@/types';

const EPIC_API_URL = 'https://store-site-backend-static.ak.epicgames.com/freeGamesPromotions?locale=en-US&country=US&allowCountries=US';

function cleanSlug(rawSlug?: string | null): string | null {
  if (!rawSlug) return null;
  let cleaned = rawSlug.replace(/\/home$/i, '');
  cleaned = cleaned.replace(/-[0-9a-z]{6}$/i, '');
  return cleaned;
}

function getEpicStoreUrl(game: any): string {
  let slug = cleanSlug(game.productSlug);
  if (!slug && game.catalogNs?.mappings) {
    const homeMapping = game.catalogNs.mappings.find((m: any) => m.pageType === 'productHome') || game.catalogNs.mappings[0];
    slug = cleanSlug(homeMapping?.pageSlug);
  }
  if (!slug && game.offerMappings) {
    const offerMapping = game.offerMappings.find((m: any) => m.pageType === 'productHome') || game.offerMappings[0];
    slug = cleanSlug(offerMapping?.pageSlug);
  }
  if (!slug) {
    slug = cleanSlug(game.urlSlug);
  }
  if (slug && !/^[0-9a-f]{32}$/i.test(slug)) {
    return `https://store.epicgames.com/en-US/p/${slug}`;
  }
  return 'https://store.epicgames.com/en-US/free-games';
}

export async function fetchLiveEpicGames(): Promise<{ active: GameData[], upcoming: GameData[] }> {
  try {
    const res = await fetch(EPIC_API_URL, { next: { revalidate: 3600 } }); // revalidate every hour
    if (!res.ok) {
      throw new Error(`Epic API responded with status: ${res.status}`);
    }
    const data = await res.json();
    const elements = data?.data?.Catalog?.searchStore?.elements || [];

    const activeGames: GameData[] = [];
    const upcomingGames: GameData[] = [];

    for (const game of elements) {
      // Find promotions
      const activePromos = game.promotions?.promotionalOffers || [];
      const upcomingPromos = game.promotions?.upcomingPromotionalOffers || [];

      // A game is only a "Free Game" if its discountPercentage is 0 (which means 100% off in Epic's API)
      const getFreeOffer = (promos: any[]) => {
        for (const promo of promos) {
          if (promo.promotionalOffers) {
            for (const offer of promo.promotionalOffers) {
              if (offer.discountSetting?.discountPercentage === 0) {
                return offer;
              }
            }
          }
        }
        return null;
      };

      const activeFreeOffer = getFreeOffer(activePromos);
      const upcomingFreeOffer = getFreeOffer(upcomingPromos);

      const isActive = !!activeFreeOffer;
      const isUpcoming = !!upcomingFreeOffer;

      if (!isActive && !isUpcoming) continue;

      // Determine dates
      let startDate = new Date().toISOString();
      let endDate = new Date().toISOString();

      if (isActive) {
        startDate = activeFreeOffer.startDate;
        endDate = activeFreeOffer.endDate;
      } else if (isUpcoming) {
        startDate = upcomingFreeOffer.startDate;
        endDate = upcomingFreeOffer.endDate;
      }

      // Extract images
      let coverArt = 'https://images.unsplash.com/photo-1552820728-8b83bb6b773f?q=80&w=600&auto=format&fit=crop';
      let heroArt = 'https://images.unsplash.com/photo-1552820728-8b83bb6b773f?q=80&w=1200&auto=format&fit=crop';

      const keyImages = game.keyImages || [];
      const thumbnailImage = keyImages.find((img: any) => img.type === 'Thumbnail' || img.type === 'DieselStoreFrontTall');
      const dieselImage = keyImages.find((img: any) => img.type === 'DieselStoreFrontWide' || img.type === 'OfferImageWide');

      if (thumbnailImage) coverArt = thumbnailImage.url;
      if (dieselImage) heroArt = dieselImage.url;

      // Extract Price
      const originalPrice = game.price?.totalPrice?.originalPrice || 0;
      // epic returns prices in cents usually (e.g. 1999 = $19.99), but sometimes 0 if free anyway
      const priceInDollars = originalPrice / 100;

      const gameData: GameData = {
        id: game.id,
        epicId: game.id,
        title: game.title,
        coverArt,
        heroArt,
        publisher: game.seller?.name || 'Unknown',
        developer: game.customAttributes?.find((attr: any) => attr.key === 'developerName')?.value || 'Unknown',
        genres: game.categories?.map((c: any) => c.path) || [],
        tags: [],
        description: game.description,
        storeUrl: getEpicStoreUrl(game),
        giveawayStartDate: startDate,
        giveawayEndDate: endDate,
        originalPrice: priceInDollars,
        currentPrice: 0,
        currency: game.price?.totalPrice?.currencyCode || 'USD',
        platformSupport: ['Windows'],
        releaseDate: game.effectiveDate || new Date().toISOString(),
        metacriticScore: null,
        openCriticScore: null,
        userRating: null,
        giveawayType: 'weekly' as GiveawayType,
        isMystery: false,
      };

      if (isActive) {
        activeGames.push(gameData);
      } else {
        upcomingGames.push(gameData);
      }
    }

    return { active: activeGames, upcoming: upcomingGames };
  } catch (error) {
    console.error("Error fetching Epic Games:", error);
    return { active: [], upcoming: [] };
  }
}
