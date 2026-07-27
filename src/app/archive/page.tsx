'use client'

import React, { useState, useMemo } from 'react';
import { GAMES_DATA } from '@/data/games';
import { useAllGames } from '@/hooks/use-all-games';
import { useLibraryStore } from '@/store/use-library-store';
import { useUIStore } from '@/store/use-ui-store';
import { useGameFilters } from '@/hooks/use-game-filters';
import { GameCard } from '@/components/shared/game-card';
import { getUniqueValues } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { GeistSelect } from '@/components/ui/select';
import { Search, Filter, Grid, List, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function ArchivePage() {
  const { claimedGameIds, wishlistGameIds, isGameClaimed, toggleClaim, toggleWishlist } = useLibraryStore();
  const { filterOptions, updateFilters, resetFilters } = useUIStore();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [visibleCount, setVisibleCount] = useState(24);
  const [showFiltersMobile, setShowFiltersMobile] = useState(false);

  // Reset pagination + scroll to top when filters change
  React.useEffect(() => {
    setVisibleCount(24);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [filterOptions]);

  const { allGames } = useAllGames();
  const filteredGames = useGameFilters(allGames, filterOptions, claimedGameIds);
  
  const uniqueGenres = useMemo(() => getUniqueValues(allGames, 'genres'), [allGames]);
  const uniquePublishers = useMemo(() => getUniqueValues(allGames, 'publisher'), [allGames]);
  const uniqueYears = useMemo(() => {
    const years = allGames.map(g => new Date(g.giveawayStartDate).getFullYear().toString());
    return [...new Set(years)].sort((a, b) => b.localeCompare(a));
  }, [allGames]);

  const statusOptions = useMemo(() => [
    { value: 'all', label: 'All Statuses' },
    { value: 'present', label: 'Currently Free (Present)' },
    { value: 'upcoming', label: 'Coming Soon (Upcoming)' },
    { value: 'past', label: 'Past Giveaways' },
  ], []);

  const yearOptions = useMemo(() => [
    { value: '', label: 'All Years' },
    ...uniqueYears.map(y => ({ value: y, label: y })),
  ], [uniqueYears]);

  const genreOptions = useMemo(() => [
    { value: '', label: 'All Genres' },
    ...uniqueGenres.map(g => ({ value: g, label: g })),
  ], [uniqueGenres]);

  const sortOptions = useMemo(() => [
    { value: 'date_desc', label: 'Newest First' },
    { value: 'date_asc', label: 'Oldest First' },
    { value: 'price_desc', label: 'Price (High to Low)' },
    { value: 'price_asc', label: 'Price (Low to High)' },
    { value: 'title_asc', label: 'Title (A-Z)' },
    { value: 'title_desc', label: 'Title (Z-A)' },
  ], []);

  const displayedGames = filteredGames.slice(0, visibleCount);
  const hasMore = visibleCount < filteredGames.length;

  const handleLoadMore = () => {
    setVisibleCount(prev => prev + 24);
  };

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-white">
            Giveaway Database
          </h1>
          <p className="text-sm text-[#888] mt-1">
            Explore {allGames.length} free games — past giveaways, present live freebies, and future upcoming drops
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
      <div className={`grid grid-cols-1 md:grid-cols-4 lg:grid-cols-7 gap-4 p-4 rounded-xl border border-white/8 bg-[#111] ${showFiltersMobile ? 'block' : 'hidden md:grid'}`}>
        <div className="col-span-1 md:col-span-2 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#555]" />
          <Input 
            placeholder="Search games..." 
            className="pl-9"
            value={filterOptions.search || ''}
            onChange={(e) => updateFilters({ search: e.target.value })}
          />
        </div>

        <GeistSelect 
          value={filterOptions.giveawayStatus || 'all'}
          onChange={(val) => updateFilters({ giveawayStatus: val as any })}
          options={statusOptions}
          ariaLabel="Filter by status"
        />
        
        <GeistSelect 
          value={filterOptions.year ? String(filterOptions.year) : ''}
          onChange={(val) => updateFilters({ year: val ? parseInt(val) : null })}
          options={yearOptions}
          ariaLabel="Filter by year"
        />
        
        <GeistSelect 
          value={filterOptions.genre || ''}
          onChange={(val) => updateFilters({ genre: val || null })}
          options={genreOptions}
          ariaLabel="Filter by genre"
        />

        <GeistSelect 
          value={filterOptions.sortBy || 'date_desc'}
          onChange={(val) => updateFilters({ sortBy: val as any })}
          options={sortOptions}
          ariaLabel="Sort by"
        />

        <Button variant="ghost" onClick={resetFilters} className="flex items-center gap-2">
          <X className="h-4 w-4" /> Reset
        </Button>
      </div>

      {/* Results summary */}
      <div className="text-xs font-mono text-[#888]">
        Showing {filteredGames.length} result{filteredGames.length !== 1 ? 's' : ''}
      </div>

      {/* Games Grid/List */}
      <motion.div 
        layout
        className={
          viewMode === 'grid' 
            ? "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-8 lg:gap-10 xl:gap-12"
            : "flex flex-col gap-2"
        }
      >
        <AnimatePresence mode="popLayout">
          {displayedGames.map((game, index) => (
            <GameCard 
              key={game.id}
              game={game}
              variant={viewMode}
              isClaimed={isGameClaimed(game.id, game)}
              isWishlisted={wishlistGameIds.includes(game.id)}
              onToggleClaim={() => toggleClaim(game.id, game)}
              onToggleWishlist={() => toggleWishlist(game.id)}
              index={index % 24}
            />
          ))}
        </AnimatePresence>
      </motion.div>

      {/* Empty State */}
      {filteredGames.length === 0 && (
        <div className="py-20 text-center flex flex-col items-center justify-center space-y-4">
          <Search className="h-10 w-10 text-[#555]" />
          <h3 className="text-lg font-semibold text-white">No games found</h3>
          <p className="text-sm text-[#888] max-w-md mx-auto">
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
            className="w-full sm:w-auto px-8 rounded-md bg-white text-black hover:bg-[#ebebeb] text-sm font-medium transition-colors"
          >
            Load More Games
          </Button>
        </div>
      )}
    </div>
  );
}
