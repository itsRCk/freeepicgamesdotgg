# 🎮 FreeEpicGames.gg

> **The Ultimate Epic Games Store Freebie Tracker, Archive, Personal Library & Analytics Dashboard.**  
> Never miss an Epic Games Store freebie again. Track active weekly giveaways, explore a 6-year database of 400+ past free games, import your claimed library, and calculate your total savings.

[![Live Demo](https://img.shields.io/badge/Live_Demo-freeepicgamesdotgg.vercel.app-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://freeepicgamesdotgg.vercel.app)
[![Next.js 16](https://img.shields.io/badge/Next.js_16-Black?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org)
[![React 19](https://img.shields.io/badge/React_19-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com)
[![Vercel Geist](https://img.shields.io/badge/Design_System-Vercel_Geist-111111?style=for-the-badge&logo=vercel&logoColor=white)](https://vercel.com/geist)

---

## ✨ Key Features

- **🎁 Live Giveaway Dashboard & Auto-Sync:**  
  Real-time countdown timers tracking active weekly Epic Games Store freebies and upcoming scheduled giveaways. Automatically syncs with Epic Games Store's live promotions API (`/api/live`) and Vercel Cron (`/api/admin/sync`) so new freebies transition seamlessly without manual spreadsheet updates.

- **📚 400+ Enriched Game Archive Database (2018–2026+):**  
  Explore the full historical archive of every free game given away by Epic Games. Enriched with real developer studio names and publisher metadata verified via Steam Store API. Filter by year, genre, developer, and giveaway category (*Weekly*, *Holiday Vault*, *Mystery*, *Always Free*, *DLC*, *Bundle*).

- **💼 Personal Library & Epic Account Importer:**  
  - Track which freebies you've claimed and which ones you missed.
  - **1-Click Epic Games Auto-Importer:** Connect directly to your Epic Games account library using our secure browser console bookmarklet or import via JSON/CSV export files.
  - Interactive multi-select library management with quick claim and wishlist toggling.

- **🌍 Site-Wide Currency Localization:**  
  Seamlessly switch between **12+ international currencies** (`INR ₹`, `USD $`, `EUR €`, `GBP £`, `BRL R$`, `CAD $`, `AUD $`, `JPY ¥`, etc.). All regular game values, claimed savings, and archive totals dynamically adapt across every page and modal.

- **🖼️ Widescreen Cover Artwork & Interactive Image Gallery:**  
  - Automatically upgrades portrait library art to official 16:9 widescreen landscape cover banners.
  - Interactive screenshot gallery carousel with clickable thumbnail strip and keyboard navigation (`←` / `→`).

- **🔍 Command-Palette Global Search:**  
  Fast modal search (`ESC` or search button) across the entire catalog with quick-action previews, release year badges, and direct navigation.

- **📊 Personal & Global Statistics:**  
  Analyze your collection with detailed metrics: total value claimed, claim vs. miss ratio, average game price, and most expensive freebies.

- **🎨 Vercel Geist Dark Mode Aesthetics:**  
  Built from the ground up following the **Vercel Geist Design System** with crisp typography (`Geist Sans` & `Geist Mono`), subtle subpixel borders, glassmorphic overlays, and Framer Motion micro-animations.

---

## 🚀 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org) (v20 or newer recommended)
- `npm`, `pnpm`, `yarn`, or `bun`

### 1. Clone the Repository
```bash
git clone https://github.com/itsRCk/freeepicgamesdotgg.git
cd freeepicgamesdotgg
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Start the Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to explore the webapp locally.

---

## 📥 How to Import Your Epic Games Library

1. Go to the **[Library](https://freeepicgamesdotgg.vercel.app/library)** page and click **`Import from Epic Games`**.
2. **Auto-Import via Bookmarklet:**  
   - Copy the generated 1-click import script from the modal.
   - Open [store.epicgames.com](https://store.epicgames.com) while logged into your Epic account.
   - Open your browser's Developer Tools (`F12` or `Ctrl+Shift+I` → **Console** tab), paste the script, and press **Enter**.
   - Your library will automatically sync to **FreeEpicGames.gg**!
3. **Manual File Import:**  
   - Alternatively, drag and drop a `.json` or `.csv` file of your library export directly into the importer modal.

---

## 🛠️ Tech Stack

| Component | Technology |
| :--- | :--- |
| **Framework** | [Next.js 16](https://nextjs.org) (App Router, Turbopack) |
| **Language** | [TypeScript](https://www.typescriptlang.org) |
| **Styling & Tokens** | [Tailwind CSS](https://tailwindcss.com) + [Vercel Geist Design System](https://vercel.com/geist) |
| **Animations** | [Framer Motion](https://www.framer.com/motion/) |
| **Icons** | [Lucide React](https://lucide.dev) |
| **Data & Integrations** | Epic Games Catalog API, RAWG Game Database API, Steam Static CDN |
| **Hosting & Deployments** | [Vercel](https://vercel.com) |

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!  
Feel free to open a pull request or check the issues page if you have suggestions for improvements.

---

## 📝 License

This project is open-source and available under the [MIT License](LICENSE).

---

<p align="center">
  Built with ❤️ for gamers who love free PC games.
</p>
