"use client";

import Link from "next/link";
import { GitFork, Database, Library, Star, ChartBar, Heart } from "lucide-react";
import { RuixenGradientFooter } from "@/components/ui/ruixen-gradient-footer";

const NAV_COLUMNS = [
  {
    title: "Explore",
    links: [
      { label: "Dashboard",  href: "/" },
      { label: "Database",   href: "/archive" },
      { label: "Library",    href: "/library" },
      { label: "Statistics", href: "/statistics" },
      { label: "Wishlist",   href: "/wishlist" },
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "Epic Games Store", href: "https://store.epicgames.com/en-US/free-games", external: true },
      { label: "Epic Free Games",  href: "https://store.epicgames.com/en-US/browse?sortBy=releaseDate&sortDir=DESC&priceTier=tierFree&start=0&count=40", external: true },
      { label: "GitHub",           href: "https://github.com/itsRCk/freeepicgamesdotgg", external: true },
      { label: "Report an Issue",  href: "https://github.com/itsRCk/freeepicgamesdotgg/issues", external: true },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Privacy",     href: "/privacy" },
      { label: "Terms",       href: "/terms" },
      { label: "Disclaimer",  href: "/terms" },
    ],
  },
];

export function Footer() {
  return (
    <RuixenGradientFooter gradientHeight="24vh" minReveal={0}>
      <div className="mx-auto w-full max-w-7xl px-6 pt-20 pb-16">
        {/* Top row: brand + nav columns */}
        <div className="grid gap-12 pb-16 sm:grid-cols-2 lg:grid-cols-5">
          {/* Brand block */}
          <div className="lg:col-span-2">
            {/* Logo + name */}
            <Link href="/" className="flex items-center gap-2.5 group w-fit">
              {/* Simple diamond icon echoing Epic's brand */}
              <div className="relative w-7 h-7 flex items-center justify-center">
                <div className="absolute inset-0 bg-white/5 border border-white/10 rounded-md rotate-45 group-hover:border-white/20 transition-colors" />
                <Database className="relative z-10 w-3.5 h-3.5 text-[#ededed]" />
              </div>
              <span className="font-mono text-sm uppercase tracking-widest text-[#ededed] group-hover:text-white font-semibold transition-colors">
                Free Epic Games.gg
              </span>
            </Link>

            <p className="mt-4 max-w-xs text-sm text-[#888] leading-relaxed">
              Track every free game ever offered on the Epic Games Store — past, present, and upcoming.
              Built for the community, not affiliated with Epic Games.
            </p>

            {/* Quick stat badges */}
            <div className="mt-6 flex flex-wrap gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-md border border-white/10 bg-white/5 px-2.5 py-1 font-mono text-xs text-[#888]">
                <Star className="w-3.5 h-3.5 text-yellow-500/80" />
                637+ Giveaways Tracked
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-md border border-white/10 bg-white/5 px-2.5 py-1 font-mono text-xs text-[#888]">
                <Heart className="w-3.5 h-3.5 text-red-500/80" />
                Open Source
              </span>
            </div>

            {/* Social links */}
            <div className="mt-6 flex items-center gap-3">
              <a
                href="https://github.com/itsRCk/freeepicgamesdotgg"
                target="_blank"
                rel="noreferrer"
                aria-label="GitHub repository"
                className="flex items-center justify-center w-9 h-9 rounded-md border border-white/10 bg-white/5 text-[#888] hover:text-white hover:border-white/20 transition-all"
              >
                <GitFork className="w-4 h-4" />
              </a>
              <a
                href="https://store.epicgames.com/en-US/free-games"
                target="_blank"
                rel="noreferrer"
                aria-label="Epic Games Store – current free games"
                className="flex items-center justify-center w-9 h-9 rounded-md border border-white/10 bg-white/5 text-[#888] hover:text-white hover:border-white/20 transition-all"
              >
                <ChartBar className="w-4 h-4" />
              </a>
              <a
                href="/library"
                aria-label="Your library"
                className="flex items-center justify-center w-9 h-9 rounded-md border border-white/10 bg-white/5 text-[#888] hover:text-white hover:border-white/20 transition-all"
              >
                <Library className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Nav columns */}
          <nav className="grid grid-cols-2 gap-10 sm:grid-cols-3 lg:col-span-3">
            {NAV_COLUMNS.map((col) => (
              <div key={col.title}>
                <h3 className="font-mono text-xs uppercase tracking-wider text-white font-semibold">{col.title}</h3>
                <ul className="mt-4 flex flex-col gap-3">
                  {col.links.map((link) =>
                    "external" in link && link.external ? (
                      <li key={link.label}>
                        <a
                          href={link.href}
                          target="_blank"
                          rel="noreferrer"
                          className="text-sm text-[#888] transition-colors hover:text-white"
                        >
                          {link.label}
                        </a>
                      </li>
                    ) : (
                      <li key={link.label}>
                        <Link
                          href={link.href}
                          className="text-sm text-[#888] transition-colors hover:text-white"
                        >
                          {link.label}
                        </Link>
                      </li>
                    )
                  )}
                </ul>
              </div>
            ))}
          </nav>
        </div>

        {/* Bottom bar with generous bottom margin above gradient */}
        <div className="flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-8 pb-16 font-mono text-xs text-[#888] sm:flex-row">
          <span>© {new Date().getFullYear()} Free Epic Games.gg — Community Project</span>
          <span className="flex items-center gap-2">
            <span className="size-2 rounded-full bg-green-500" />
            All systems operational
          </span>
          <span>Not affiliated with Epic Games, Inc.</span>
        </div>
      </div>
    </RuixenGradientFooter>
  );
}
