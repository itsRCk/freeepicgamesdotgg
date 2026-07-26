'use client'

import React, { useState, useMemo } from 'react';
import { GAMES_DATA } from '@/data/games';
import { useLibraryStore } from '@/store/use-library-store';
import { useUIStore } from '@/store/use-ui-store';
import { useGameFilters } from '@/hooks/use-game-filters';
import { GameCard } from '@/components/shared/game-card';
import { getUniqueValues } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Filter, Grid, List, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function ArchivePage() {
  const { claimedGameIds, wishlistGameIds, toggleClaim, toggleWishlist } = useLibraryStore();
  const { filterOptions, updateFilters, resetFilters } = useUIStore();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [visibleCount, setVisibleCount] = useState(24);
  const [showFiltersMobile, setShowFiltersMobile] = useState(false);

  // Reset pagination when filters change
  React.useEffect(() => {
    setVisibleCount(24);
  }, [filterOptions]);

  const filteredGames = useGameFilters(GAMES_DATA, filterOptions, claimedGameIds);
  
  const uniqueGenres = useMemo(() => getUniqueValues(GAMES_DATA, 'genres'), []);
  const uniquePublishers = useMemo(() => getUniqueValues(GAMES_DATA, 'publisher'), []);
  const uniqueYears = useMemo(() => {
    const years = GAMES_DATA.map(g => new Date(g.giveawayStartDate).getFullYear().toString());
    return [...new Set(years)].sort((a, b) => b.localeCompare(a));
  }, []);

  const displayedGames = filteredGames.slice(0, visibleCount);
  const hasMore = visibleCount < filteredGames.length;

  const handleLoadMore = () => {
    setVisibleCount(prev => prev + 24);
  };

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-primary to-purple-500 bg-clip-text text-transparent">
            Giveaway Archive
          </h1>
          <p className="text-muted-foreground mt-1">
            Explore {GAMES_DATA.length} games given away since 2018
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <Button 
            variant={viewMode === 'grid' ? 'default' : 'outline'} 
            size="icon"
            onClick={() => setViewMode('grid')}
          >
            <Grid className="h-4 w-4" />
          </Button>
          <Button 
            variant={viewMode === 'list' ? 'default' : 'outline'} 
            size="icon"
            onClick={() => setViewMode('list')}
          >
            <List className="h-4 w-4" />
          </Button>
          <Button 
            variant="outline" 
            className="md:hidden"
            onClick={() => setShowFiltersMobile(!showFiltersMobile)}
          >
            <Filter className="h-4 w-4 mr-2" /> Filters
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className={`grid grid-cols-1 md:grid-cols-4 lg:grid-cols-6 gap-4 p-4 rounded-xl border bg-card/50 backdrop-blur-sm ${showFiltersMobile ? 'block' : 'hidden md:grid'}`}>
        <div className="col-span-1 md:col-span-2 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search games..." 
            className="pl-9"
            value={filterOptions.search || ''}
            onChange={(e) => updateFilters({ search: e.target.value })}
          />
        </div>
        
        <select 
          className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          value={filterOptions.year || ''}
          onChange={(e) => updateFilters({ year: e.target.value ? parseInt(e.target.value) : null })}
        >
          <option value="">All Years</option>
          {uniqueYears.map(year => (
            <option key={year} value={year}>{year}</option>
          ))}
        </select>
        
        <select 
          className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
          value={filterOptions.genre || ''}
          onChange={(e) => updateFilters({ genre: e.target.value || null })}
        >
          <option value="">All Genres</option>
          {uniqueGenres.map(genre => (
            <option key={genre} value={genre}>{genre}</option>
          ))}
        </select>

        <select 
          className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
          value={filterOptions.sortBy || 'date_desc'}
          onChange={(e) => updateFilters({ sortBy: e.target.value as any })}
        >
          <option value="date_desc">Newest First</option>
          <option value="date_asc">Oldest First</option>
          <option value="price_desc">Price (High to Low)</option>
          <option value="price_asc">Price (Low to High)</option>
          <option value="title_asc">Title (A-Z)</option>
          <option value="title_desc">Title (Z-A)</option>
        </select>

        <Button variant="ghost" onClick={resetFilters} className="flex items-center gap-2">
          <X className="h-4 w-4" /> Reset
        </Button>
      </div>

      {/* Results summary */}
      <div className="text-sm text-muted-foreground font-medium">
        Showing {filteredGames.length} result{filteredGames.length !== 1 ? 's' : ''}
      </div>

      {/* Games Grid/List */}
      <motion.div 
        layout
        className={
          viewMode === 'grid' 
            ? "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4"
            : "flex flex-col gap-2"
        }
      >
        <AnimatePresence mode="popLayout">
          {displayedGames.map((game, index) => (
            <GameCard 
              key={game.id}
              game={game}
              variant={viewMode}
              isClaimed={claimedGameIds.includes(game.id)}
              isWishlisted={wishlistGameIds.includes(game.id)}
              onToggleClaim={() => toggleClaim(game.id)}
              onToggleWishlist={() => toggleWishlist(game.id)}
              index={index % 24}
            />
          ))}
        </AnimatePresence>
      </motion.div>

      {/* Empty State */}
      {filteredGames.length === 0 && (
        <div className="py-20 text-center flex flex-col items-center justify-center space-y-4">
          <Search className="h-12 w-12 text-muted-foreground/50" />
          <h3 className="text-xl font-semibold">No games found</h3>
          <p className="text-muted-foreground max-w-md mx-auto">
            Try adjusting your filters or search query to find what you're looking for.
          </p>
          <Button onClick={resetFilters} variant="outline" className="mt-4">
            Clear Filters
          </Button>
        </div>
      )}

      {/* Load More */}
      {hasMore && (
        <div className="flex justify-center pt-8">
          <Button 
            size="lg" 
            onClick={handleLoadMore}
            className="w-full sm:w-auto px-12 rounded-full shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all"
          >
            Load More Games
          </Button>
        </div>
      )}
    </div>
  );
}
