import { chromium, Page } from 'playwright';
import * as fs from 'fs';
import * as path from 'path';
import { GAMES_DATA } from '../src/data/games';
import { GameData } from '../src/types';

interface ClaimedGameEntry {
  gameId: string;
  title: string;
  claimDate: string;
  retailPriceUSD: number;
  rawEpicTitle: string;
}

interface EpicLibraryExport {
  version: string;
  generatedAt: string;
  claimedGameIds: string[];
  missedGameIds: string[];
  stats: {
    claimedCount: number;
    missedCount: number;
    totalCatalogCount: number;
    claimedPercentage: number;
    totalRetailValueUSD: number;
    averageMonthlyClaimRate: number;
  };
  timeline: ClaimedGameEntry[];
  unmatchedEpicTitles: string[];
}

// Known bundle & title aliases where Epic Games Store title differs from retail / Steam title
const EPIC_TITLE_ALIASES: Record<string, string[]> = {
  'tomb raider game of the year edition': ['tomb raider'],
  'tomb raider goty': ['tomb raider'],
  'tomb raider trilogy': ['tomb raider', 'rise of the tomb raider', 'shadow of the tomb raider'],
  'bioshock the collection': ['bioshock remastered', 'bioshock 2 remastered', 'bioshock infinite'],
  'batman arkham collection': ['batman: arkham asylum', 'batman: arkham city', 'batman: arkham knight'],
  'destiny 2 legacy collection': ['destiny 2: legacy collection'],
  'fallout 3 game of the year edition': ['fallout 3'],
  'fallout new vegas ultimate edition': ['fallout: new vegas'],
  'control standard edition': ['control'],
  'death stranding standard edition': ['death stranding'],
  'the outer worlds spacer s choice edition': ['the outer worlds'],
  'metro 2033 redux': ['metro 2033'],
  'metro last light redux': ['metro: last light'],
  'the witcher 3 wild hunt complete edition': ['the witcher 3: wild hunt'],
  'grand theft auto v premium edition': ['grand theft auto v'],
  'borderlands the handsome collection': ['borderlands 2', 'borderlands: the pre-sequel'],
};

/**
 * Normalizes a game title for fuzzy comparison
 */
function normalizeTitle(str: string): string {
  return str
    .toLowerCase()
    .replace(/[^\w\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .replace(/\b(standard|game of the year|goty|ultimate|enhanced|complete|definitive|director s cut|edition|redux|remastered)\b/g, '')
    .trim();
}

/**
 * Matches an Epic transaction title to one or more games in GAMES_DATA
 */
function matchEpicTitleToArchive(rawTitle: string): GameData[] {
  const cleanRaw = rawTitle.toLowerCase().trim();
  const normalizedRaw = normalizeTitle(rawTitle);

  // 1. Check alias bundles first
  if (EPIC_TITLE_ALIASES[cleanRaw] || EPIC_TITLE_ALIASES[normalizedRaw]) {
    const targetTitles = EPIC_TITLE_ALIASES[cleanRaw] || EPIC_TITLE_ALIASES[normalizedRaw];
    return GAMES_DATA.filter((g) => {
      const normG = normalizeTitle(g.title);
      return targetTitles.some(
        (t) => normalizeTitle(t) === normG || g.title.toLowerCase().includes(t.toLowerCase())
      );
    });
  }

  // 2. Exact normalized match
  const exactMatches = GAMES_DATA.filter((g) => normalizeTitle(g.title) === normalizedRaw);
  if (exactMatches.length > 0) return exactMatches;

  // 3. Substring match (either direction, minimum 4 characters)
  const subMatches = GAMES_DATA.filter((g) => {
    const normG = normalizeTitle(g.title);
    if (normG.length < 4 || normalizedRaw.length < 4) return false;
    return normG === normalizedRaw || normG.includes(normalizedRaw) || normalizedRaw.includes(normG);
  });
  if (subMatches.length > 0) return subMatches;

  return [];
}

/**
 * Scrapes all transaction rows currently rendered in the DOM
 */
async function scrapeTransactionsFromDOM(page: Page): Promise<{ title: string; date: string; amount: string }[]> {
  return await page.evaluate(() => {
    const items: { title: string; date: string; amount: string }[] = [];

    // Epic Games Store transaction row selectors (tolerates various class/role mutations)
    const rows = document.querySelectorAll(
      'tr, [role="row"], .order-history-row, [class*="Transaction"], [class*="OrderHistory"]'
    );

    rows.forEach((row) => {
      const textContent = row.textContent || '';
      // Exclude header rows
      if (
        textContent.toLowerCase().includes('date') &&
        textContent.toLowerCase().includes('description') &&
        textContent.toLowerCase().includes('price')
      ) {
        return;
      }

      // Find date, title, amount cells
      const cells = row.querySelectorAll('td, [role="cell"], [class*="Cell"], [class*="Column"], div');
      let date = '';
      let title = '';
      let amount = '';

      if (cells.length >= 3) {
        date = (cells[0]?.textContent || '').trim();
        title = (cells[1]?.textContent || '').trim();
        amount = (cells[cells.length - 1]?.textContent || '').trim();
      } else {
        // Fallback parser by lines
        const lines = textContent
          .split('\n')
          .map((l) => l.trim())
          .filter(Boolean);
        if (lines.length >= 2) {
          date = lines[0];
          title = lines[1];
          amount = lines[lines.length - 1];
        }
      }

      if (title && title.length > 1) {
        items.push({ title, date, amount });
      }
    });

    return items;
  });
}

/**
 * Infinitely clicks "Show More" until all transaction rows are rendered
 */
async function loadAllTransactions(page: Page): Promise<void> {
  console.log('[-] Searching for pagination / "Show More" buttons...');

  let noChangeCount = 0;
  let previousRowCount = 0;

  while (noChangeCount < 3) {
    const currentRows = await page.evaluate(() => {
      return document.querySelectorAll('tr, [role="row"], .order-history-row').length;
    });

    if (currentRows === previousRowCount && currentRows > 0) {
      noChangeCount++;
    } else {
      noChangeCount = 0;
      previousRowCount = currentRows;
      if (currentRows > 0) {
        console.log(`    [i] Currently loaded ${currentRows} transaction rows...`);
      }
    }

    // Look for "Show More" / "Load More" / next page button
    const showMoreButton = page.locator(
      'button:has-text("Show More"), button:has-text("Load More"), button[class*="ShowMore"], button[aria-label*="more"]'
    ).first();

    const isVisible = await showMoreButton.isVisible().catch(() => false);
    if (isVisible) {
      try {
        await showMoreButton.click({ timeout: 2000 });
        await page.waitForTimeout(1500);
      } catch {
        // Scroll down to trigger lazy loading
        await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
        await page.waitForTimeout(1000);
      }
    } else {
      // Scroll to bottom to trigger infinite scroll if present
      await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
      await page.waitForTimeout(1500);

      // Check if button appeared after scroll
      const appearedAfterScroll = await showMoreButton.isVisible().catch(() => false);
      if (!appearedAfterScroll && noChangeCount >= 2) {
        break;
      }
    }
  }

  console.log('[-] Finished loading transaction history!');
}

/**
 * Main Importer Entrypoint
 */
async function runEpicImporter() {
  console.log('============================================================');
  console.log('      EPIC GAMES STORE FREE GAMES LIBRARY IMPORTER          ');
  console.log('============================================================\n');

  const userDataDir = path.join(process.cwd(), '.epic-session');

  console.log('[-] Launching Chromium with persistent local profile...');
  console.log(`    Profile directory: ${userDataDir}\n`);

  const browser = await chromium.launchPersistentContext(userDataDir, {
    headless: false,
    viewport: { width: 1280, height: 860 },
    args: [
      '--disable-blink-features=AutomationControlled',
      '--no-default-browser-check',
      '--no-first-run',
    ],
  });

  const page = await browser.newPage();

  const targetUrl = 'https://www.epicgames.com/account/transactions';
  console.log(`[-] Navigating to Epic Games Store transactions page:`);
  console.log(`    ${targetUrl}\n`);

  await page.goto(targetUrl, { waitUntil: 'domcontentloaded', timeout: 60000 });

  // Check if user needs to log in
  console.log('[-] Checking login status...');
  const currentUrl = page.url();

  if (currentUrl.includes('login') || currentUrl.includes('id.epicgames.com')) {
    console.log('\n============================================================');
    console.log(' ⚠️  EPIC GAMES STORE LOGIN REQUIRED');
    console.log('============================================================');
    console.log(' Please sign into your Epic Games account in the opened window.');
    console.log(' Once signed in, this script will automatically resume...');
    console.log('============================================================\n');

    // Wait up to 5 minutes for redirect back to transactions
    await page.waitForURL(/account\/transactions|account\/orders/i, {
      timeout: 300000,
    });
  }

  console.log('[-] Successfully reached account transactions page!');
  await page.waitForTimeout(3000);

  // Click Show More until all items are loaded
  await loadAllTransactions(page);

  // Scrape all rendered transaction rows
  console.log('[-] Scraping transaction rows from DOM...');
  const allTransactions = await scrapeTransactionsFromDOM(page);
  console.log(`    Total transactions scraped: ${allTransactions.length}\n`);

  // Filter for free / $0.00 giveaways (ignoring refunds)
  const freeTransactions = allTransactions.filter((t) => {
    const amt = t.amount.toLowerCase().trim();
    const isZeroOrFree =
      amt === '0.00' ||
      amt === '$0.00' ||
      amt === '€0.00' ||
      amt === '£0.00' ||
      amt === '0,00' ||
      amt === 'free' ||
      amt === '0' ||
      amt.includes('0.00') ||
      amt.includes('free');

    const isRefund =
      t.title.toLowerCase().includes('refund') ||
      amt.includes('-') ||
      amt.includes('refund');

    return isZeroOrFree && !isRefund;
  });

  console.log(`[-] Found ${freeTransactions.length} free giveaway transactions.`);
  console.log('[-] Matching against 418-game historical archive...\n');

  const claimedGameIdsSet = new Set<string>();
  const timelineMap = new Map<string, ClaimedGameEntry>();
  const unmatchedEpicTitles = new Set<string>();

  for (const item of freeTransactions) {
    const matches = matchEpicTitleToArchive(item.title);

    if (matches.length > 0) {
      for (const matchedGame of matches) {
        if (!claimedGameIdsSet.has(matchedGame.id)) {
          claimedGameIdsSet.add(matchedGame.id);
          timelineMap.set(matchedGame.id, {
            gameId: matchedGame.id,
            title: matchedGame.title,
            claimDate: item.date || matchedGame.giveawayStartDate,
            retailPriceUSD: matchedGame.originalPrice || 0,
            rawEpicTitle: item.title,
          });
        }
      }
    } else {
      unmatchedEpicTitles.add(item.title);
    }
  }

  const claimedGameIds = Array.from(claimedGameIdsSet);
  const missedGameIds = GAMES_DATA.filter((g) => !claimedGameIdsSet.has(g.id)).map(
    (g) => g.id
  );

  const claimedGamesList = GAMES_DATA.filter((g) => claimedGameIdsSet.has(g.id));
  const totalRetailValueUSD = claimedGamesList.reduce(
    (sum, g) => sum + (g.originalPrice || 0),
    0
  );

  const claimedPercentage =
    GAMES_DATA.length > 0
      ? Number(((claimedGameIds.length / GAMES_DATA.length) * 100).toFixed(1))
      : 0;

  // Compute average monthly claim rate
  let averageMonthlyClaimRate = 0;
  if (claimedGameIds.length > 0) {
    const startYear = 2018;
    const nowYear = new Date().getFullYear();
    const totalMonths = Math.max(1, (nowYear - startYear) * 12);
    averageMonthlyClaimRate = Number(
      (claimedGameIds.length / totalMonths).toFixed(1)
    );
  }

  const timeline = Array.from(timelineMap.values()).sort((a, b) => {
    return new Date(b.claimDate).getTime() - new Date(a.claimDate).getTime();
  });

  const exportData: EpicLibraryExport = {
    version: '1.0.0',
    generatedAt: new Date().toISOString(),
    claimedGameIds,
    missedGameIds,
    stats: {
      claimedCount: claimedGameIds.length,
      missedCount: missedGameIds.length,
      totalCatalogCount: GAMES_DATA.length,
      claimedPercentage,
      totalRetailValueUSD: Number(totalRetailValueUSD.toFixed(2)),
      averageMonthlyClaimRate,
    },
    timeline,
    unmatchedEpicTitles: Array.from(unmatchedEpicTitles),
  };

  // 1. Export JSON
  const jsonPath = path.join(process.cwd(), 'epic-library-export.json');
  fs.writeFileSync(jsonPath, JSON.stringify(exportData, null, 2), 'utf-8');

  // 2. Export CSV
  const csvPath = path.join(process.cwd(), 'epic-library-export.csv');
  const csvHeaders = 'gameId,title,claimDate,retailPriceUSD,rawEpicTitle\n';
  const csvRows = timeline
    .map(
      (entry) =>
        `"${entry.gameId}","${entry.title.replace(/"/g, '""')}","${entry.claimDate}",${entry.retailPriceUSD},"${entry.rawEpicTitle.replace(/"/g, '""')}"`
    )
    .join('\n');
  fs.writeFileSync(csvPath, csvHeaders + csvRows, 'utf-8');

  console.log('============================================================');
  console.log('                 IMPORT SUMMARY & STATS                     ');
  console.log('============================================================');
  console.log(` ✅ Claimed Free Games:   ${claimedGameIds.length} / ${GAMES_DATA.length} (${claimedPercentage}%)`);
  console.log(` ❌ Missed Free Games:    ${missedGameIds.length} / ${GAMES_DATA.length} (${(100 - claimedPercentage).toFixed(1)}%)`);
  console.log(` 💰 Total Retail Value:   $${exportData.stats.totalRetailValueUSD.toFixed(2)} USD`);
  console.log(` 📈 Avg Claim Rate:       ~${averageMonthlyClaimRate} games / month`);
  console.log(` 📄 Export JSON Saved:    ./epic-library-export.json`);
  console.log(` 📊 Export CSV Saved:     ./epic-library-export.csv`);
  console.log('============================================================');
  console.log(' Next step: Open freeepicgamesdotgg in your browser and');
  console.log(' click "Import Library" to instantly sync your collection!');
  console.log('============================================================\n');

  await browser.close();
}

runEpicImporter().catch((err) => {
  console.error('❌ Error running Epic Importer:', err);
  process.exit(1);
});
