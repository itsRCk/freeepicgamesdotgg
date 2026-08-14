'use client'

import { useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Heart, Gamepad2 } from 'lucide-react'
import Link from 'next/link'

import { useAllGames } from '@/hooks/use-all-games'
import { useLibraryStore } from '@/store/use-library-store'
import { GAMES_DATA } from '@/data/games'
import { GameData } from '@/types'
import { PriceDisplay } from '@/components/shared/price-display'
import { Button, buttonVariants } from '@/components/ui/button'
import { GameCard } from '@/components/shared/game-card'

export default function WishlistPage() {
  const {
    claimedGameIds,
    wishlistGameIds,
    customGames,
    toggleClaim,
    toggleWishlist,
    isWishlisted,
    isGameClaimed,
  } = useLibraryStore()
  const { allGames } = useAllGames()

  const wishlistedGames = useMemo(() => {
    const wishlistedTitles = new Set<string>()
    const wishlistedIds = new Set<string>(wishlistGameIds)

    // 1. Collect normalized titles from any saved wishlist ID
    wishlistGameIds.forEach((id) => {
      const custom = customGames?.[id]
      const staticGame = GAMES_DATA.find((g) => g.id === id)
      const title = custom?.title || staticGame?.title
      if (title) {
        wishlistedTitles.add(title.toLowerCase().trim())
      }
    })

    const matchedMap = new Map<string, GameData>()

    // 2. Add matching games from allGames (live + custom + static)
    allGames.forEach((game) => {
      const normTitle = game.title?.toLowerCase().trim() || ''
      if (wishlistedIds.has(game.id) || (normTitle && wishlistedTitles.has(normTitle))) {
        matchedMap.set(normTitle || game.id, game)
      }
    })

    // 3. Fallback: ensure every wishlisted ID from GAMES_DATA/customGames is present
    wishlistGameIds.forEach((id) => {
      const custom = customGames?.[id]
      const staticGame = GAMES_DATA.find((g) => g.id === id)
      const game = custom || staticGame
      if (game) {
        const normTitle = game.title?.toLowerCase().trim() || ''
        if (!matchedMap.has(normTitle || id)) {
          matchedMap.set(normTitle || id, game)
        }
      }
    })

    return Array.from(matchedMap.values()).sort(
      (a, b) => new Date(b.giveawayStartDate || 0).getTime() - new Date(a.giveawayStartDate || 0).getTime()
    )
  }, [allGames, wishlistGameIds, customGames])

  const stats = useMemo(() => {
    const totalCurrentValue = wishlistedGames.reduce((sum, game) => sum + game.originalPrice, 0)
    return {
      count: wishlistedGames.length,
      totalCurrentValue
    }
  }, [wishlistedGames])

  return (
    <div className="container mx-auto py-8 px-4 max-w-7xl">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-white flex items-center gap-3">
            <Heart className="w-6 h-6 text-[#888]" />
            Your Wishlist
          </h1>
          <p className="text-sm text-[#888] mt-2">
            Games you're keeping an eye on for future giveaways.
          </p>
        </div>
        
        {stats.count > 0 && (
          <div className="flex items-center gap-6 bg-[#111] border border-white/8 rounded-md p-4">
            <div className="flex flex-col">
              <span className="text-xs font-medium text-[#555]">Wishlisted Games</span>
              <span className="text-2xl font-mono font-semibold text-white">{stats.count}</span>
            </div>
            <div className="w-px h-10 bg-white/10" />
            <div className="flex flex-col">
              <span className="text-xs font-medium text-[#555]">Total Value</span>
              <span className="text-2xl font-mono font-semibold text-green-400"><PriceDisplay amount={stats.totalCurrentValue} /></span>
            </div>
          </div>
        )}
      </div>

      {wishlistedGames.length === 0 ? (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center justify-center py-20 text-center"
        >
          <div className="w-20 h-20 mb-6 rounded-md bg-white/5 border border-white/8 flex items-center justify-center">
            <Heart className="w-10 h-10 text-[#555]" />
          </div>
          <h2 className="text-lg font-semibold text-white mb-2">Your wishlist is empty</h2>
          <p className="text-sm text-[#888] max-w-md mb-8">
            You haven't added any games to your wishlist yet. Browse the database and find games you'd like to see given away again!
          </p>
          <Link 
            href="/archive" 
            className={buttonVariants({ className: "bg-white text-black hover:bg-[#ebebeb] border-0 text-sm font-medium px-5 py-2 rounded-md" })}
          >
            <Gamepad2 className="w-4 h-4 mr-2" />
            Browse Games
          </Link>
        </motion.div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-3 sm:gap-8 lg:gap-10 xl:gap-12">
          <AnimatePresence>
            {wishlistedGames.map((game, index) => (
              <motion.div
                key={game.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.2, delay: index * 0.05 }}
              >
                <GameCard
                  game={game}
                  index={index}
                  isWishlisted={isWishlisted(game.id, game)}
                  isClaimed={isGameClaimed(game.id, game)}
                  onToggleWishlist={toggleWishlist}
                  onToggleClaim={toggleClaim}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  )
}

