/**
 * enrich-developers.mjs
 *
 * Script to enrich developer and publisher names for all games in src/data/games.ts
 * using Steam store API (appdetails / storesearch).
 *
 * Usage: node scripts/enrich-developers.mjs
 */

import { readFileSync, writeFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const GAMES_FILE = resolve(__dirname, '..', 'src', 'data', 'games.ts');

function sleep(ms) {
  return new Promise(r => setTimeout(r, ms));
}

function extractSteamAppId(coverArt) {
  if (!coverArt) return null;
  const match = coverArt.match(/\/apps\/(\d+)\//);
  return match ? match[1] : null;
}

async function fetchStudioByAppId(appId) {
  try {
    const url = `https://store.steampowered.com/api/appdetails?appids=${appId}&cc=US&l=english`;
    const res = await fetch(url);
    if (!res.ok) return null;
    const json = await res.json();
    const appData = json[String(appId)];
    if (!appData?.success || !appData?.data) return null;
    const data = appData.data;
    const developer = data.developers?.[0] || null;
    const publisher = data.publishers?.[0] || null;
    return { developer, publisher };
  } catch {
    return null;
  }
}

async function fetchStudioByTitle(title) {
  try {
    const url = `https://store.steampowered.com/api/storesearch/?term=${encodeURIComponent(title)}&l=english&cc=US`;
    const res = await fetch(url);
    if (!res.ok) return null;
    const json = await res.json();
    const items = json.items || [];
    if (items.length === 0) return null;
    const top = items[0];
    if (top?.id) {
      return await fetchStudioByAppId(String(top.id));
    }
    return null;
  } catch {
    return null;
  }
}

async function main() {
  console.log('📦 Reading games.ts...');
  const rawFile = readFileSync(GAMES_FILE, 'utf-8');

  const assignmentIdx = rawFile.indexOf('= [');
  if (assignmentIdx === -1) {
    console.error('❌ Could not find "= [" in games.ts');
    process.exit(1);
  }
  const jsonStart = assignmentIdx + 2;
  const jsonEnd = rawFile.lastIndexOf(']') + 1;
  const jsonStr = rawFile.substring(jsonStart, jsonEnd);

  let games;
  try {
    games = JSON.parse(jsonStr);
  } catch (e) {
    console.error('❌ Failed to parse games JSON:', e.message);
    process.exit(1);
  }

  console.log(`🎮 Found ${games.length} games. Starting developer/publisher enrichment...`);

  let updatedCount = 0;
  const BATCH_SIZE = 8;

  for (let i = 0; i < games.length; i += BATCH_SIZE) {
    const batch = games.slice(i, i + BATCH_SIZE);
    await Promise.all(
      batch.map(async (game) => {
        let appId = extractSteamAppId(game.coverArt);
        let studioData = null;

        if (appId) {
          studioData = await fetchStudioByAppId(appId);
        }
        if (!studioData || (!studioData.developer && !studioData.publisher)) {
          studioData = await fetchStudioByTitle(game.title);
        }

        let modified = false;
        if (studioData?.developer && studioData.developer !== 'Unknown') {
          game.developer = studioData.developer;
          modified = true;
        } else if (game.developer === 'Unknown') {
          // If we couldn't find a developer, check if publisher was found or use a cleaner default
          game.developer = studioData?.publisher || 'Epic Games Store';
          modified = true;
        }

        if (studioData?.publisher && studioData.publisher !== 'Unknown') {
          game.publisher = studioData.publisher;
          modified = true;
        } else if (game.publisher === 'Epic Games' || game.publisher === 'Unknown') {
          game.publisher = game.developer || 'Epic Games Store';
          modified = true;
        }

        if (modified) {
          updatedCount++;
        }
      })
    );

    if ((i + BATCH_SIZE) % 40 === 0 || i + BATCH_SIZE >= games.length) {
      console.log(`⏳ Progress: ${Math.min(i + BATCH_SIZE, games.length)} / ${games.length} games processed (${updatedCount} enriched)...`);
    }

    await sleep(150);
  }

  console.log(`\n✅ Enrichment complete! Updated studio info for ${updatedCount} games.`);

  const newJsonStr = JSON.stringify(games, null, 2);
  const newFileContent =
    rawFile.substring(0, jsonStart) +
    newJsonStr +
    rawFile.substring(jsonEnd);

  writeFileSync(GAMES_FILE, newFileContent, 'utf-8');
  console.log('💾 Successfully saved updated src/data/games.ts!');
}

main().catch((err) => {
  console.error('❌ Fatal error:', err);
  process.exit(1);
});
