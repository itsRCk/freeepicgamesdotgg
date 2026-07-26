/**
 * enrich-prices.mjs
 * 
 * One-time script to fix all 418 hardcoded $19.99 prices in src/data/games.ts
 * by looking up real USD prices from the Steam Storefront API.
 * 
 * Strategy:
 *   1. Extract Steam App ID from existing coverArt URL (most games already have it)
 *   2. Call store.steampowered.com/api/appdetails?appids={id}&cc=US for price
 *   3. Fall back to title search if no App ID in URL
 *   4. Keep $19.99 fallback if Steam has no match
 * 
 * Usage: node scripts/enrich-prices.mjs
 */

import { readFileSync, writeFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const GAMES_FILE = resolve(__dirname, '..', 'src', 'data', 'games.ts');

const DELAY_MS = 250; // 250ms between requests (4 req/sec, well under Steam limits)
const BATCH_SIZE = 10; // Process in batches for progress reporting

function sleep(ms) {
  return new Promise(r => setTimeout(r, ms));
}

/**
 * Extract Steam App ID from a steamcdn coverArt URL.
 * e.g. "https://steamcdn-a.akamaihd.net/steam/apps/1729740/library_600x900_2x.jpg" → "1729740"
 */
function extractSteamAppId(coverArt) {
  if (!coverArt) return null;
  const match = coverArt.match(/\/apps\/(\d+)\//);
  return match ? match[1] : null;
}

/**
 * Fetch price from Steam appdetails API by App ID.
 * Returns price in USD dollars, or null if unavailable.
 */
async function fetchPriceByAppId(appId) {
  try {
    const url = `https://store.steampowered.com/api/appdetails?appids=${appId}&cc=US&l=english`;
    const res = await fetch(url);
    if (!res.ok) return null;
    
    const json = await res.json();
    const appData = json[String(appId)];
    if (!appData?.success || !appData?.data) return null;
    
    const data = appData.data;
    
    // Free to play games
    if (data.is_free === true) return 0;
    
    // Price overview exists
    if (data.price_overview) {
      // initial is in cents (e.g. 2999 = $29.99)
      return data.price_overview.initial / 100;
    }
    
    // No price data (might be removed from store, or a package)
    return null;
  } catch {
    return null;
  }
}

/**
 * Search for a game by title on Steam and get its price.
 * Returns { appId, price } or null.
 */
async function fetchPriceByTitle(title) {
  try {
    const url = `https://store.steampowered.com/api/storesearch/?term=${encodeURIComponent(title)}&l=english&cc=US`;
    const res = await fetch(url);
    if (!res.ok) return null;
    
    const json = await res.json();
    const items = json.items || [];
    if (items.length === 0) return null;
    
    const top = items[0];
    
    // storesearch sometimes returns price directly
    if (top.price) {
      return {
        appId: String(top.id),
        price: (top.price.final || top.price.initial || 0) / 100,
      };
    }
    
    // Otherwise fetch full details
    const appId = String(top.id);
    const price = await fetchPriceByAppId(appId);
    return { appId, price };
  } catch {
    return null;
  }
}

async function main() {
  console.log('📦 Reading games.ts...');
  
  const rawFile = readFileSync(GAMES_FILE, 'utf-8');
  
  // Extract JSON array from TypeScript file
  // File format: import { ... } from '...'; \n export const GAMES_DATA: GameData[] = [ ... ];
  // We need to find the '= [' pattern (the data array), not the '[]' in the type annotation
  const assignmentIdx = rawFile.indexOf('= [');
  if (assignmentIdx === -1) {
    console.error('❌ Could not find "= [" in games.ts');
    process.exit(1);
  }
  const jsonStart = assignmentIdx + 2; // points to the '['
  const jsonEnd = rawFile.lastIndexOf(']') + 1;
  const jsonStr = rawFile.substring(jsonStart, jsonEnd);
  
  let games;
  try {
    games = JSON.parse(jsonStr);
  } catch (e) {
    console.error('❌ Failed to parse games JSON:', e.message);
    process.exit(1);
  }
  
  console.log(`🎮 Found ${games.length} games. All have originalPrice: $19.99 placeholder.`);
  console.log(`⏱  Estimated time: ~${Math.ceil(games.length * DELAY_MS / 1000 / 60)} minutes\n`);
  
  let enriched = 0;
  let freeToPlay = 0;
  let fallback = 0;
  let titleSearchUsed = 0;
  
  for (let i = 0; i < games.length; i++) {
    const game = games[i];
    const title = game.title;
    
    // Step 1: Try to extract Steam App ID from coverArt URL
    let appId = extractSteamAppId(game.coverArt);
    let price = null;
    
    if (appId) {
      price = await fetchPriceByAppId(appId);
      await sleep(DELAY_MS);
    }
    
    // Step 2: If no App ID or no price, fall back to title search
    if (price === null && !appId) {
      const result = await fetchPriceByTitle(title);
      titleSearchUsed++;
      if (result) {
        price = result.price;
      }
      await sleep(DELAY_MS);
    } else if (price === null && appId) {
      // Had App ID but appdetails returned no price, try title search
      const result = await fetchPriceByTitle(title);
      titleSearchUsed++;
      if (result) {
        price = result.price;
      }
      await sleep(DELAY_MS);
    }
    
    // Step 3: Apply price
    if (price !== null) {
      game.originalPrice = price;
      if (price === 0) {
        freeToPlay++;
      } else {
        enriched++;
      }
    } else {
      // Keep existing $19.99 as fallback
      fallback++;
    }
    
    // Progress reporting
    if ((i + 1) % BATCH_SIZE === 0 || i === games.length - 1) {
      const pct = Math.round(((i + 1) / games.length) * 100);
      const priceStr = price !== null ? `$${price.toFixed(2)}` : '$19.99 (fallback)';
      console.log(`  [${pct}%] ${i + 1}/${games.length} — "${title}" → ${priceStr}`);
    }
  }
  
  // Write back
  console.log('\n📝 Writing updated prices to games.ts...');
  
  const header = rawFile.substring(0, jsonStart);
  const footer = rawFile.substring(jsonEnd);
  const updatedJson = JSON.stringify(games, null, 2);
  const updatedFile = header + updatedJson + footer;
  
  writeFileSync(GAMES_FILE, updatedFile, 'utf-8');
  
  // Summary
  const totalValue = games.reduce((sum, g) => sum + g.originalPrice, 0);
  console.log('\n✅ Price enrichment complete!\n');
  console.log('📊 Summary:');
  console.log(`   Total games:        ${games.length}`);
  console.log(`   Real prices found:  ${enriched}`);
  console.log(`   Free-to-play:       ${freeToPlay}`);
  console.log(`   Kept fallback:      ${fallback}`);
  console.log(`   Title searches:     ${titleSearchUsed}`);
  console.log(`   Total catalog value: $${totalValue.toFixed(2)}`);
}

main().catch(console.error);
