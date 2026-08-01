'use client'

import React, { useState, useRef, useMemo } from 'react';
import { GAMES_DATA } from '@/data/games';
import { useAllGames } from '@/hooks/use-all-games';
import { useLibraryStore } from '@/store/use-library-store';
import { GameCard } from '@/components/shared/game-card';
import { ValuableGameCard } from '@/components/shared/valuable-game-card';
import { ClearLibraryModal } from '@/components/shared/clear-library-modal';
import { EpicImporterModal } from '@/components/shared/epic-importer-modal';
import { formatPrice } from '@/lib/utils';
import { PriceDisplay } from '@/components/shared/price-display';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Download, Upload, Trash2, CheckSquare, Square, Search, Layers, Gamepad2, XCircle, Trophy, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

type TabType = 'claimed' | 'missed' | 'all';

export default function LibraryPage() {
  const { claimedGameIds, wishlistGameIds, customGames, isGameClaimed, toggleClaim, toggleWishlist, claimMultiple, unclaimMultiple, exportClaims, importClaims, clearAll } = useLibraryStore();
  const [activeTab, setActiveTab] = useState<TabType>('claimed');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isClearModalOpen, setIsClearModalOpen] = useState(false);
  const [isImporterOpen, setIsImporterOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { allGames } = useAllGames();

  // Derived state
  const claimedGames = useMemo(() => allGames.filter(g => isGameClaimed(g.id, g)), [allGames, isGameClaimed, claimedGameIds, customGames]);
  
  const pastGiveaways = useMemo(() => allGames.filter(g => new Date(g.giveawayEndDate) < new Date()), [allGames]);
  const missedGames = useMemo(() => pastGiveaways.filter(g => !isGameClaimed(g.id, g)), [pastGiveaways, isGameClaimed, claimedGameIds, customGames]);
  
  // Top 4 Most Valuable Games in user's library
  const topValuableGames = useMemo(() => {
    if (claimedGames.length === 0) return [];
    return [...claimedGames]
      .sort((a, b) => (b.originalPrice || 0) - (a.originalPrice || 0))
      .slice(0, 4);
  }, [claimedGames]);

  const displayedGames = useMemo(() => {
    let baseList = [];
    if (activeTab === 'claimed') baseList = claimedGames;
    else if (activeTab === 'missed') baseList = missedGames;
    else baseList = allGames;
    
    if (!searchQuery) return baseList;
    return baseList.filter(g => g.title.toLowerCase().includes(searchQuery.toLowerCase()));
  }, [activeTab, claimedGames, missedGames, allGames, searchQuery]);

  // Stats
  const claimedValue = claimedGames.reduce((sum, g) => sum + (g.originalPrice || 0), 0);
  
  const missedValue = missedGames.reduce((sum, g) => sum + (g.originalPrice || 0), 0);

  // Actions
  const handleToggleSelect = (id: string) => {
    setSelectedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  const handleSelectAll = () => {
    if (selectedIds.length === displayedGames.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(displayedGames.map(g => g.id));
    }
  };

  const handleMarkClaimed = () => {
    claimMultiple(selectedIds);
    setSelectedIds([]);
  };

  const handleMarkUnclaimed = () => {
    unclaimMultiple(selectedIds);
    setSelectedIds([]);
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target?.result as string);
        if (Array.isArray(data)) {
          importClaims(data);
        }
      } catch (err) {
        console.error("Failed to import claims", err);
      }
    };
    reader.readAsText(file);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.05 }
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-white">
            Your Library
          </h1>
          <p className="text-sm text-[#888] mt-1">
            Track, manage, and analyze your collection
          </p>
        </div>
        
        <div className="flex flex-wrap items-center gap-2">
          <input 
            type="file" 
            accept=".json" 
            className="hidden" 
            ref={fileInputRef}
            onChange={handleImport}
          />
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => setIsImporterOpen(true)}
            className="bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border-amber-500/25 transition-all font-medium"
          >
            <Sparkles className="h-4 w-4 mr-2 text-amber-400" /> Sync Epic Account
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => setIsImporterOpen(true)}
            className="bg-white/5 hover:bg-white/10 text-white border-white/15 transition-all"
          >
            <Download className="h-4 w-4 mr-2 text-green-400" /> Export (JSON/CSV/SQL)
          </Button>
          <Button 
            variant="destructive" 
            size="sm" 
            onClick={() => setIsClearModalOpen(true)} 
            className="bg-red-500/10 text-red-400 hover:bg-red-500/15 border border-red-500/20"
          >
            <Trash2 className="h-4 w-4 mr-2" /> Clear All
          </Button>
        </div>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-white/8 bg-[#111]">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-md bg-white/5 border border-white/8 text-[#ededed]">
                <Gamepad2 className="h-5 w-5 text-[#888]" />
              </div>
              <div>
                <p className="text-xs font-medium text-[#555]">Claimed Games</p>
                <h3 className="text-2xl font-mono font-semibold text-white">{claimedGames.length}</h3>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-white/8 bg-[#111]">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-md bg-white/5 border border-white/8 text-[#ededed]">
                <Layers className="h-5 w-5 text-green-400" />
              </div>
              <div>
                <p className="text-xs font-medium text-[#555]">Total Value</p>
                <h3 className="text-2xl font-mono font-semibold text-white"><PriceDisplay amount={claimedValue} /></h3>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-white/8 bg-[#111]">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-md bg-white/5 border border-white/8 text-[#ededed]">
                <XCircle className="h-5 w-5 text-amber-400" />
              </div>
              <div>
                <p className="text-xs font-medium text-[#555]">Missed Games</p>
                <h3 className="text-2xl font-mono font-semibold text-white">{missedGames.length}</h3>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-white/8 bg-[#111]">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-md bg-white/5 border border-white/8 text-[#ededed]">
                <CheckSquare className="h-5 w-5 text-[#888]" />
              </div>
              <div>
                <p className="text-xs font-medium text-[#555]">Completion Rate</p>
                <h3 className="text-2xl font-mono font-semibold text-white">
                  {pastGiveaways.length > 0 ? Math.round((claimedGames.length / pastGiveaways.length) * 100) : 0}%
                </h3>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Your Top 4 Most Valuable Games */}
      {topValuableGames.length > 0 && (
        <section className="space-y-4">
          <div className="flex items-center justify-between border-b border-white/8 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-md bg-white/5 border border-white/10 flex items-center justify-center">
                  <Trophy className="w-3.5 h-3.5 text-amber-400" />
                </div>
                <h2 className="text-xl font-semibold tracking-tight text-white">
                  Your Most Valuable Games
                </h2>
              </div>
              <p className="text-xs text-[#888] mt-1">
                The 4 highest-value free games in your library
              </p>
            </div>
            <div className="hidden sm:flex items-center gap-2">
              <span className="text-xs font-mono text-[#888] bg-[#111] px-3 py-1 rounded-full border border-white/8">
                Top 4 Value
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {topValuableGames.map((game, index) => (
              <ValuableGameCard
                key={game.id}
                game={game}
                rank={index + 1}
                index={index}
              />
            ))}
          </div>
        </section>
      )}

      {/* Tabs & Search */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-[#111] border border-white/8 p-2 rounded-md">
        <div className="flex space-x-1">
          <Button 
            variant={activeTab === 'claimed' ? 'default' : 'ghost'} 
            onClick={() => { setActiveTab('claimed'); setSelectedIds([]); }}
            className="rounded-md"
          >
            Claimed ({claimedGames.length})
          </Button>
          <Button 
            variant={activeTab === 'missed' ? 'default' : 'ghost'} 
            onClick={() => { setActiveTab('missed'); setSelectedIds([]); }}
            className="rounded-md"
          >
            Missed ({missedGames.length})
          </Button>
          <Button 
            variant={activeTab === 'all' ? 'default' : 'ghost'} 
            onClick={() => { setActiveTab('all'); setSelectedIds([]); }}
            className="rounded-md"
          >
            All Games ({allGames.length})
          </Button>
        </div>
        
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#555]" />
          <Input 
            placeholder="Search in library..." 
            className="pl-9 bg-[#111] border-white/10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Bulk Actions Toolbar */}
      <AnimatePresence>
        {selectedIds.length > 0 && (
          <motion.div 
            initial={{ opacity: 0, y: -20, height: 0 }}
            animate={{ opacity: 1, y: 0, height: 'auto' }}
            exit={{ opacity: 0, y: -20, height: 0 }}
            className="flex items-center gap-2 bg-[#111] border border-white/15 p-3 rounded-md overflow-hidden"
          >
            <span className="text-sm font-medium mr-4">{selectedIds.length} selected</span>
            <Button size="sm" variant="outline" onClick={handleSelectAll}>
              <CheckSquare className="h-4 w-4 mr-2" /> {selectedIds.length === displayedGames.length ? 'Deselect All' : 'Select All'}
            </Button>
            <Button size="sm" variant="default" onClick={handleMarkClaimed} className="bg-white text-black hover:bg-[#ebebeb]">
              Mark Claimed
            </Button>
            <Button size="sm" variant="destructive" onClick={handleMarkUnclaimed}>
              Mark Unclaimed
            </Button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Grid */}
      {displayedGames.length > 0 ? (
        <motion.div 
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-8 lg:gap-10 xl:gap-12"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {displayedGames.map((game, index) => (
            <motion.div 
              key={game.id} 
              variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
              className="relative group"
            >
              <div 
                className="absolute top-3 left-3 z-20 cursor-pointer"
                onClick={(e) => {
                  e.stopPropagation();
                  handleToggleSelect(game.id);
                }}
              >
                {selectedIds.includes(game.id) ? (
                  <div className="bg-primary text-primary-foreground rounded-sm p-0.5 shadow-md">
                    <CheckSquare className="h-5 w-5" />
                  </div>
                ) : (
                  <div className="bg-background/80 backdrop-blur-sm text-muted-foreground rounded-sm p-0.5 opacity-0 group-hover:opacity-100 transition-opacity shadow-sm">
                    <Square className="h-5 w-5" />
                  </div>
                )}
              </div>
              <div className={`transition-all duration-200 h-full ${selectedIds.includes(game.id) ? 'ring-2 ring-primary ring-offset-2 ring-offset-background rounded-xl scale-[0.98]' : ''}`}>
                <GameCard 
                  game={game}
                  isClaimed={isGameClaimed(game.id, game)}
                  isWishlisted={false}
                  onToggleClaim={() => toggleClaim(game.id, game)}
                  onToggleWishlist={() => {}}
                  index={index}
                  selectable={true}
                  selected={selectedIds.includes(game.id)}
                  onToggleSelect={() => handleToggleSelect(game.id)}
                />
              </div>
            </motion.div>
          ))}
        </motion.div>
      ) : (
        <div className="py-20 text-center flex flex-col items-center justify-center space-y-4 bg-muted/10 rounded-2xl border border-dashed">
          <Layers className="h-12 w-12 text-muted-foreground/50" />
          <h3 className="text-xl font-semibold">No games found</h3>
          <p className="text-muted-foreground max-w-md mx-auto">
            {searchQuery 
              ? `No games matching "${searchQuery}" in ${activeTab}`
              : `Your ${activeTab} list is empty.`
            }
          </p>
          {searchQuery && (
            <Button onClick={() => setSearchQuery('')} variant="outline" className="mt-4">
              Clear Search
            </Button>
          )}
        </div>
      )}

      {/* Destructive Clear Library Modal (Vercel Geist Design System) */}
      <ClearLibraryModal
        isOpen={isClearModalOpen}
        onClose={() => setIsClearModalOpen(false)}
        onConfirmClear={clearAll}
        onExportJson={exportClaims}
        claimedCount={claimedGames.length}
      />

      {/* Epic Games Store Library Importer Modal (Vercel Geist Design System) */}
      <EpicImporterModal
        isOpen={isImporterOpen}
        onClose={() => setIsImporterOpen(false)}
      />
    </div>
  );
}
