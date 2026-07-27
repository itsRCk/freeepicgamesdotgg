# Project-Scoped Rules

## Design System & Styling
- **Strictly adhere to the Vercel Geist Design System** (https://vercel.com/geist).
- When creating or updating any UI component, page, or layout, automatically follow the principles and tokens in the `vercel-geist` skill (`.agents/skills/vercel-geist/SKILL.md`).
- Use minimal dark mode styling (`#0a0a0a` backgrounds, `#111111` card surfaces, subtle `border-white/10` 1px subpixel borders, crisp `Geist Sans` and `Geist Mono` typography, and high-contrast white/black interactive buttons).
- Avoid heavy drop-shadows, neon colors, Bootstrap-like styles, and excessive glassmorphism.
- **Card Artwork Aspect Ratio:** Use `aspect-[3/4]` for all `<GameCard>` cover images across Database, Library, Wishlist, and Homepage sections to maintain balanced vertical proportions.

## Catalog, Developer & Studio Metadata
- **Developer vs. Publisher Priority:** Always display `game.developer` prominently on game cards and titles, falling back to `game.publisher` only if developer is unknown.
- **Studio Enrichment:** Games in `src/data/games.ts` have been enriched with real developer studio names via Steam Store API instead of placeholder generic publisher names.
- **Auto-Recovering Cover Art:** All cards must use `<GameCoverImage>` (`src/components/shared/game-cover-image.tsx`) to support multi-CDN fallback and dynamic `/api/cover-search` Steam cover recovery.

## Live Sync & Library Matching
- **Automated Live Sync (`/api/live`):** Never rely on static spreadsheets for active or upcoming free games. Real-time weekly giveaways are automatically fetched from Epic Games Store's official Free Games Promotions API and merged into `useAllGames()`.
- **Title + ID Matching in Library Store:** Games in `/api/live` have different internal IDs than static archive items (`live-active-0` vs `epic-418`). When checking `isWishlisted(id, gameOrTitle)` or `isGameClaimed(id, gameOrTitle)` in `useLibraryStore`, always match by both `id` AND normalized game `title` (`toLowerCase().trim()`).
