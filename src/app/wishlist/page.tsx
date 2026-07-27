'use client'

import { useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Heart, Trash2, Tag, Calendar, Gamepad2 } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

import { useAllGames } from '@/hooks/use-all-games'
import { useLibraryStore } from '@/store/use-library-store'
import { formatPrice } from '@/lib/utils'
import { PriceDisplay } from '@/components/shared/price-display'
import { Button, buttonVariants } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'

export default function WishlistPage() {
  const { wishlistGameIds, toggleWishlist } = useLibraryStore()
  const { allGames } = useAllGames()

  const wishlistedGames = useMemo(() => {
    return allGames.filter((game) => wishlistGameIds.includes(game.id))
      .sort((a, b) => new Date(b.giveawayStartDate).getTime() - new Date(a.giveawayStartDate).getTime())
  }, [allGames, wishlistGameIds])

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
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 md:gap-8">
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
                <Card className="h-full border border-white/8 bg-[#111] overflow-hidden group hover:border-white/15 transition-colors flex flex-col">
                  <div className="relative aspect-[2/3] w-full overflow-hidden">
                    {game.coverArt ? (
                      <Image
                        src={game.coverArt}
                        alt={game.title}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="w-full h-full bg-[#1a1a1a] flex items-center justify-center">
                        <Gamepad2 className="w-10 h-10 text-[#555]" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#111]/90 to-transparent" />
                    
                    <div className="absolute top-2 right-2">
                      <Button
                        variant="destructive"
                        size="icon"
                        className="h-7 w-7 rounded-md opacity-0 group-hover:opacity-100 transition-opacity bg-[#111]/80 hover:bg-white/10 border border-white/15 text-[#ededed]"
                        onClick={() => toggleWishlist(game.id)}
                        title="Remove from Wishlist"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>

                    <div className="absolute bottom-2 left-2 right-2">
                      <h3 className="font-semibold text-sm text-white leading-tight line-clamp-1">{game.title}</h3>
                      <div className="flex items-center justify-between mt-1">
                        <span className="text-xs text-[#888] flex items-center gap-1">
                          <Tag className="w-3 h-3" />
                          {game.publisher}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <CardContent className="p-4 flex-1">
                    <div className="flex flex-col gap-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-medium text-[#555]">Original Price</span>
                        <span className="font-mono text-sm font-semibold text-green-400"><PriceDisplay amount={game.originalPrice} /></span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-medium text-[#555]">Last Given Away</span>
                        <span className="text-xs font-mono text-[#ededed]">
                          {new Date(game.giveawayStartDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  )
}
