'use client'

import { useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Heart, Trash2, Tag, Calendar, Gamepad2 } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

import { GAMES_DATA } from '@/data/games'
import { useLibraryStore } from '@/store/use-library-store'
import { formatPrice } from '@/lib/utils'
import { Button, buttonVariants } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'

export default function WishlistPage() {
  const { wishlistGameIds, toggleWishlist } = useLibraryStore()

  const wishlistedGames = useMemo(() => {
    return GAMES_DATA.filter((game) => wishlistGameIds.includes(game.id))
      .sort((a, b) => new Date(b.giveawayStartDate).getTime() - new Date(a.giveawayStartDate).getTime())
  }, [wishlistGameIds])

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
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight bg-gradient-to-r from-pink-500 to-rose-400 bg-clip-text text-transparent flex items-center gap-3">
            <Heart className="w-8 h-8 text-pink-500 fill-pink-500" />
            Your Wishlist
          </h1>
          <p className="text-muted-foreground mt-2">
            Games you're keeping an eye on for future giveaways.
          </p>
        </div>
        
        {stats.count > 0 && (
          <div className="flex items-center gap-6 bg-card/50 border border-white/10 rounded-xl p-4 backdrop-blur">
            <div className="flex flex-col">
              <span className="text-sm text-muted-foreground">Wishlisted Games</span>
              <span className="text-2xl font-bold">{stats.count}</span>
            </div>
            <div className="w-px h-10 bg-white/10" />
            <div className="flex flex-col">
              <span className="text-sm text-muted-foreground">Total Value</span>
              <span className="text-2xl font-bold text-emerald-400">{formatPrice(stats.totalCurrentValue)}</span>
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
          <div className="w-24 h-24 mb-6 rounded-full bg-pink-500/10 flex items-center justify-center">
            <Heart className="w-12 h-12 text-pink-500/50" />
          </div>
          <h2 className="text-2xl font-bold mb-2">Your wishlist is empty</h2>
          <p className="text-muted-foreground max-w-md mb-8">
            You haven't added any games to your wishlist yet. Browse the history and find games you'd like to see given away again!
          </p>
          <Link 
            href="/archive" 
            className={buttonVariants({ className: "bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white border-0" })}
          >
            <Gamepad2 className="w-4 h-4 mr-2" />
            Browse Games
          </Link>
        </motion.div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
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
                <Card className="h-full bg-card/50 backdrop-blur border-white/10 overflow-hidden group hover:border-pink-500/50 transition-colors flex flex-col">
                  <div className="relative aspect-[16/9] w-full overflow-hidden">
                    {game.coverArt ? (
                      <Image
                        src={game.coverArt}
                        alt={game.title}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="w-full h-full bg-secondary flex items-center justify-center">
                        <Gamepad2 className="w-12 h-12 text-muted-foreground/30" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-background/90 to-transparent" />
                    
                    <div className="absolute top-2 right-2">
                      <Button
                        variant="destructive"
                        size="icon"
                        className="h-8 w-8 rounded-full opacity-0 group-hover:opacity-100 transition-opacity bg-red-500/80 hover:bg-red-500 backdrop-blur"
                        onClick={() => toggleWishlist(game.id)}
                        title="Remove from Wishlist"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>

                    <div className="absolute bottom-2 left-2 right-2">
                      <h3 className="font-bold text-lg leading-tight line-clamp-1">{game.title}</h3>
                      <div className="flex items-center justify-between mt-1">
                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                          <Tag className="w-3 h-3" />
                          {game.publisher}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <CardContent className="p-4 flex-1">
                    <div className="flex flex-col gap-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Original Price</span>
                        <span className="font-bold text-emerald-400">{formatPrice(game.originalPrice)}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Last Given Away</span>
                        <span className="text-sm font-medium">
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
