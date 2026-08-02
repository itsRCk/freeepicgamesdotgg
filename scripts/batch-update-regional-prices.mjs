/**
 * batch-update-regional-prices.mjs
 * 
 * Weekly Batch Job Script for fetching authentic localized regional pricing
 * (e.g., INR, EUR, GBP, BRL, USD) without hitting APIs on every user request.
 * 
 * Strategy:
 *   1. Reads games catalog from src/data/games.ts (or processes specific --test title)
 *   2. Queries Steam Storesearch API across key regional storefront codes:
 *      - IN (INR - Indian Rupee)
 *      - US (USD - US Dollar)
 *      - DE (EUR - Euro)
 *      - GB (GBP - British Pound)
 *      - BR (BRL - Brazilian Real)
 *   3. Updates src/data/regional-prices.json with authentic regional base prices
 * 
 * Usage:
 *   node scripts/batch-update-regional-prices.mjs --test "Nova Lands"
 *   node scripts/batch-update-regional-prices.mjs --limit 20
 *   npm run update-prices
 */

import { readFileSync, writeFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const REGIONAL_PRICES_FILE = resolve(__dirname, '..', 'src', 'data', 'regional-prices.json');

const REGIONS = [
  { code: 'IN', currency: 'INR' },
  { code: 'US', currency: 'USD' },
  { code: 'DE', currency: 'EUR' },
  { code: 'GB', currency: 'GBP' },
  { code: 'BR', currency: 'BRL' },
];

function sleep(ms) {
  return new Promise(r => setTimeout(r, ms));
}

/**
 * Fetch regional price for a game title on Steam Storesearch API
 */
async function fetchRegionalPrice(title, cc) {
  try {
    const url = `https://store.steampowered.com/api/storesearch/?term=${encodeURIComponent(title)}&l=english&cc=${cc}`;
    const res = await fetch(url, {
      headers: { 'User-Agent': 'freeepicgamesdotgg-regional-price-bot/1.0' }
    });
    if (!res.ok) return null;
    
    const json = await res.json();
    const items = json.items || [];
    if (items.length === 0) return null;
    
    const top = items[0];
    if (top.price && top.price.initial) {
      return top.price.initial / 100;
    }
    return null;
  } catch (err) {
    return null;
  }
}

async function main() {
  const args = process.argv.slice(2);
  const testIndex = args.indexOf('--test');
  const limitIndex = args.indexOf('--limit');

  let regionalPrices = {};
  try {
    const raw = readFileSync(REGIONAL_PRICES_FILE, 'utf-8');
    regionalPrices = JSON.parse(raw);
  } catch {
    regionalPrices = {};
  }

  let titlesToProcess = [];
  if (testIndex !== -1 && args[testIndex + 1]) {
    titlesToProcess = [args[testIndex + 1]];
    console.log(`[Batch Price Job] Running in Test Mode for: "${titlesToProcess[0]}"`);
  } else {
    // Read games from games.ts by regex matching title
    const gamesContent = readFileSync(resolve(__dirname, '..', 'src', 'data', 'games.ts'), 'utf-8');
    const matches = [...gamesContent.matchAll(/"title":\s*"([^"]+)"/g)];
    const uniqueTitles = Array.from(new Set(matches.map(m => m[1])));
    
    const maxLimit = limitIndex !== -1 && args[limitIndex + 1] ? parseInt(args[limitIndex + 1], 10) : uniqueTitles.length;
    titlesToProcess = uniqueTitles.slice(0, maxLimit);
    console.log(`[Batch Price Job] Starting batch regional pricing sync for ${titlesToProcess.length} games...`);
  }

  let updatedCount = 0;

  for (let i = 0; i < titlesToProcess.length; i++) {
    const title = titlesToProcess[i];
    const key = title.toLowerCase().trim();
    
    // Initialize or preserve existing record
    if (!regionalPrices[key]) {
      regionalPrices[key] = {};
    }

    let changed = false;
    for (const reg of REGIONS) {
      const price = await fetchRegionalPrice(title, reg.code);
      if (price !== null && !isNaN(price) && price > 0) {
        if (regionalPrices[key][reg.currency] !== price) {
          regionalPrices[key][reg.currency] = price;
          changed = true;
        }
      }
      await sleep(150); // Rate limit protection
    }

    if (changed) {
      updatedCount++;
      console.log(`   [UPDATED] "${title}":`, JSON.stringify(regionalPrices[key]));
    } else {
      console.log(`   [OK] "${title}": existing prices checked`);
    }

    // Save progressively every 5 games
    if ((i + 1) % 5 === 0 || i === titlesToProcess.length - 1) {
      writeFileSync(REGIONAL_PRICES_FILE, JSON.stringify(regionalPrices, null, 2), 'utf-8');
    }
  }

  console.log(`\n[Batch Price Job] Complete! ${updatedCount} games updated in src/data/regional-prices.json`);
}

main().catch(err => {
  console.error('[Batch Price Job] Fatal error:', err);
  process.exit(1);
});
