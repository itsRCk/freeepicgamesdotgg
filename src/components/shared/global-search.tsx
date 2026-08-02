'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, ArrowRight, Gamepad2, Calendar, Tag } from 'lucide-react';
import { GAMES_DATA } from '@/data/games';
import { useAllGames } from '@/hooks/use-all-games';
import { useUIStore } from '@/store/use-ui-store';
import { GameData } from '@/types';
import { cn, formatPrice, formatDate, isCurrentlyFree } from '@/lib/utils';
import { PriceDisplay } from '@/components/shared/price-display';

interface GlobalSearchProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectGame?: (id: string) => void;
}

export function GlobalSearch({ isOpen, onClose, onSelectGame }: GlobalSearchProps) {
  const { allGames } = useAllGames();
  const { selectedGameId } = useUIStore();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<GameData[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isResultsOpen, setIsResultsOpen] = useState(true);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
      setResults([]);
      setIsResultsOpen(true);
    }
  }, [isOpen]);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    const lower = query.toLowerCase();
    const filtered = allGames.filter((game) =>
      game.title.toLowerCase().includes(lower) ||
      game.publisher.toLowerCase().includes(lower) ||
      game.developer.toLowerCase().includes(lower) ||
      game.genres.some((g) => g.toLowerCase().includes(lower)) ||
      game.tags.some((t) => t.toLowerCase().includes(lower)) ||
      new Date(game.giveawayStartDate).getFullYear().toString().includes(lower)
    ).slice(0, 10);

    setResults(filtered);
    setSelectedIndex(0);
    setIsResultsOpen(true);
  }, [query]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose();
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => Math.min(prev + 1, results.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => Math.max(prev - 1, 0));
    } else if (e.key === 'Enter' && results[selectedIndex]) {
      onSelectGame?.(results[selectedIndex].id);
      setIsResultsOpen(false);
    }
  }, [results, selectedIndex, onClose, onSelectGame]);

  const shouldShowResults = isResultsOpen || !selectedGameId;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className={cn(
              "fixed inset-0 z-[60] transition-colors",
              selectedGameId ? "bg-transparent pointer-events-none" : "bg-black/60 backdrop-blur-sm"
            )}
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.98, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.98, y: -20 }}
            transition={{ duration: 0.15 }}
            className={cn(
              "fixed left-1/2 -translate-x-1/2 w-[calc(100%-2rem)] max-w-xl z-[70] transition-all duration-200",
              selectedGameId ? "top-6 sm:top-8 shadow-2xl" : "top-[15%]"
            )}
          >
            <div className="rounded-xl border border-white/8 bg-[#111] shadow-xl overflow-hidden">
              {/* Search Input */}
              <div className="flex items-center gap-3 px-5 py-4 border-b border-white/8 bg-[#0a0a0a]">
                <Search className="w-5 h-5 text-[#555] flex-shrink-0" />
                <input
                  ref={inputRef}
                  type="text"
                  value={query}
                  onChange={(e) => {
                    setQuery(e.target.value);
                    setIsResultsOpen(true);
                  }}
                  onFocus={() => setIsResultsOpen(true)}
                  onKeyDown={handleKeyDown}
                  placeholder="Search games, publishers, genres..."
                  className="flex-1 bg-transparent text-[#ededed] text-sm placeholder:text-[#555] focus:outline-none"
                />
                <kbd className="hidden sm:inline-flex items-center text-[10px] text-[#555] px-1.5 py-0.5 rounded border border-white/8 bg-white/5 font-mono">
                  ESC
                </kbd>
              </div>

              {/* Results */}
              {shouldShowResults && results.length > 0 && (
                <div className="max-h-96 overflow-y-auto p-2 bg-[#111]">
                  {results.map((game, i) => (
                    <button
                      key={game.id}
                      onClick={() => {
                        onSelectGame?.(game.id);
                        setIsResultsOpen(false);
                      }}
                      onMouseEnter={() => setSelectedIndex(i)}
                      className={cn(
                        "w-full flex items-center gap-3 p-3 rounded-md transition-colors text-left",
                        i === selectedIndex
                          ? "bg-white/[0.06] border border-white/15"
                          : "hover:bg-white/[0.04] border border-transparent"
                      )}
                    >
                      <div className="w-10 h-14 rounded-md overflow-hidden flex-shrink-0 border border-white/8 bg-[#1a1a1a]">
                        <img src={game.coverArt} alt={game.title} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-medium text-[#ededed] truncate">{game.title}</h4>
                        <div className="flex items-center gap-2 text-xs text-[#555]">
                          <span>{game.publisher}</span>
                          <span>•</span>
                          <span>{new Date(game.giveawayStartDate).getFullYear()}</span>
                          <span>•</span>
                          <span className={cn("font-mono tabular-nums text-xs", isCurrentlyFree(game) ? "text-green-400 font-semibold" : "text-[#888]")}>
                            {isCurrentlyFree(game) ? "FREE NOW" : <PriceDisplay amount={game.originalPrice} gameTitle={game.title} />}
                          </span>
                        </div>
                      </div>
                      <ArrowRight className="w-4 h-4 text-[#555] flex-shrink-0" />
                    </button>
                  ))}
                </div>
              )}

              {/* Empty state */}
              {shouldShowResults && query.trim() && results.length === 0 && (
                <div className="p-8 text-center bg-[#111]">
                  <Gamepad2 className="w-8 h-8 text-[#555] mx-auto mb-2" />
                  <p className="text-sm text-[#888]">No games found for &quot;{query}&quot;</p>
                </div>
              )}

              {/* Hint */}
              {shouldShowResults && !query.trim() && !selectedGameId && (
                <div className="p-6 text-center bg-[#111]">
                  <p className="text-xs text-[#555]">Search by game name, publisher, developer, genre, or year</p>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
