"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion } from "framer-motion"
import { Gamepad2, Menu, Search, X } from "lucide-react"
import { cn } from "@/lib/utils"
import { useUIStore } from "@/store/use-ui-store"
import { useLibraryStore } from "@/store/use-library-store"
import { GlobalSearch } from "@/components/shared/global-search"
import { GameDetailModal } from "@/components/shared/game-detail-modal"
import { GAMES_DATA } from "@/data/games"
import { useAllGames } from "@/hooks/use-all-games"

const navLinks = [
  { name: "Dashboard", href: "/" },
  { name: "Archive", href: "/archive" },
  { name: "Library", href: "/library" },
  { name: "Statistics", href: "/statistics" },
  { name: "Wishlist", href: "/wishlist" },
]

export function Navbar() {
  const pathname = usePathname()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false)
  const { searchOpen, openSearch, closeSearch, selectedGameId, selectGame, clearSelection } = useUIStore()
  const { claimedGameIds, wishlistGameIds, toggleClaim, toggleWishlist } = useLibraryStore()
  const { allGames } = useAllGames()

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault()
        if (searchOpen) closeSearch()
        else openSearch()
      }
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [searchOpen, openSearch, closeSearch])

  const selectedGame = React.useMemo(() => {
    if (!selectedGameId) return null
    return allGames.find((g) => g.id === selectedGameId) || null
  }, [selectedGameId, allGames])

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b border-white/8 bg-[#0a0a0a]/90 backdrop-blur-sm">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <motion.div
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              <Gamepad2 className="h-5 w-5 text-white" />
            </motion.div>
            <span className="font-semibold text-sm text-[#ededed] tracking-tight">
              Free Epic Games .gg
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center space-x-1">
            {navLinks.map((link) => {
              const isActive = pathname === link.href
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={cn(
                    "relative px-3 py-2 text-sm font-medium transition-colors hover:text-white",
                    isActive ? "text-white" : "text-[#888]"
                  )}
                >
                  {link.name}
                  {isActive && (
                    <motion.div
                      layoutId="navbar-active"
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-white"
                      initial={false}
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}
                </Link>
              )
            })}
          </nav>

          {/* Right Action Bar (Search & Mobile Menu) */}
          <div className="flex items-center space-x-2">
            <button
              onClick={openSearch}
              className="flex items-center gap-2 h-8 px-3 rounded-md border border-white/10 bg-[#111] text-xs text-[#888] hover:border-white/20 hover:text-[#ededed] transition-colors"
              title="Search games (Ctrl+K)"
            >
              <Search className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Search...</span>
              <kbd className="hidden sm:inline-block font-mono text-[10px] bg-white/5 border border-white/8 text-[#555] px-1.5 py-0.5 rounded">
                ⌘K
              </kbd>
            </button>

            {/* Mobile Menu Toggle */}
            <button
              className="md:hidden h-8 w-8 rounded-md text-[#888] hover:text-[#ededed] hover:bg-white/5 transition-colors inline-flex items-center justify-center"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </button>
          </div>
        </div>

        {/* Mobile Nav */}
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="md:hidden border-t border-white/8 bg-[#0a0a0a]"
          >
            <div className="container mx-auto px-4 py-4 flex flex-col space-y-3">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className={cn(
                    "px-3 py-2 text-sm font-medium rounded-md transition-colors",
                    pathname === link.href
                      ? "bg-white/8 text-white"
                      : "text-[#888] hover:bg-white/5 hover:text-[#ededed]"
                  )}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </header>

      {/* Search Modal */}
      <GlobalSearch
        isOpen={searchOpen}
        onClose={closeSearch}
        onSelectGame={(id) => selectGame(id)}
      />

      {/* Global Game Detail Modal */}
      <GameDetailModal
        game={selectedGame}
        isOpen={!!selectedGame}
        onClose={clearSelection}
        isClaimed={selectedGame ? claimedGameIds.includes(selectedGame.id) : false}
        isWishlisted={selectedGame ? wishlistGameIds.includes(selectedGame.id) : false}
        onToggleClaim={(id) => toggleClaim(id)}
        onToggleWishlist={(id) => toggleWishlist(id)}
      />
    </>
  )
}
