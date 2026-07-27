'use client';

import React, { useState, useCallback, useEffect } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface GameImageGalleryProps {
  screenshots: string[];
  title: string;
}

export function GameImageGallery({ screenshots, title }: GameImageGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);

  const total = screenshots.length;

  const handlePrev = useCallback(() => {
    setSelectedIndex((prev) => (prev === 0 ? total - 1 : prev - 1));
  }, [total]);

  const handleNext = useCallback(() => {
    setSelectedIndex((prev) => (prev === total - 1 ? 0 : prev + 1));
  }, [total]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        handlePrev();
      } else if (e.key === 'ArrowRight') {
        handleNext();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handlePrev, handleNext]);

  if (!screenshots || screenshots.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4 select-none">
      {/* Active Screenshot Display */}
      <div className="rounded-xl overflow-hidden bg-[#0a0a0a] aspect-video relative group border border-white/10 shadow-2xl">
        <div className="relative w-full h-full overflow-hidden bg-black">
          <AnimatePresence mode="wait">
            <motion.div
              key={selectedIndex}
              initial={{ opacity: 0, scale: 1.02 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="absolute inset-0"
            >
              <Image
                src={screenshots[selectedIndex]}
                alt={`${title} screenshot ${selectedIndex + 1}`}
                fill
                className="object-cover"
                unoptimized
                priority={selectedIndex === 0}
              />
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Counter Badge */}
        {total > 1 && (
          <div className="absolute top-4 right-4 z-20 bg-black/70 backdrop-blur-md text-white text-xs font-mono px-3 py-1 rounded-md border border-white/10">
            {selectedIndex + 1} / {total}
          </div>
        )}
      </div>

      {/* Thumbnail Carousel & Navigation Below Preview */}
      {total > 1 && (
        <div className="flex items-center justify-between gap-3 px-1">
          {/* Left Arrow Button */}
          <button
            onClick={handlePrev}
            aria-label="Previous screenshot"
            className="w-10 h-10 sm:w-11 sm:h-11 flex-shrink-0 rounded-full bg-[#1a1a1a] hover:bg-[#252525] text-white border border-white/10 flex items-center justify-center transition-all hover:scale-105 active:scale-95 shadow-md"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          {/* Thumbnail Strip */}
          <div className="flex items-center justify-center gap-2.5 sm:gap-3 overflow-x-auto py-1 px-1">
            {screenshots.map((img, idx) => (
              <button
                key={idx}
                onClick={() => setSelectedIndex(idx)}
                aria-label={`Select screenshot ${idx + 1}`}
                className={cn(
                  "w-20 h-12 sm:w-28 sm:h-16 relative rounded-lg overflow-hidden transition-all flex-shrink-0 border-2 bg-[#111]",
                  idx === selectedIndex
                    ? "border-white scale-105 shadow-md opacity-100"
                    : "border-transparent opacity-50 hover:opacity-100 hover:border-white/40"
                )}
              >
                <Image
                  src={img}
                  alt={`${title} thumbnail ${idx + 1}`}
                  fill
                  className="object-cover"
                  unoptimized
                />
              </button>
            ))}
          </div>

          {/* Right Arrow Button */}
          <button
            onClick={handleNext}
            aria-label="Next screenshot"
            className="w-10 h-10 sm:w-11 sm:h-11 flex-shrink-0 rounded-full bg-[#1a1a1a] hover:bg-[#252525] text-white border border-white/10 flex items-center justify-center transition-all hover:scale-105 active:scale-95 shadow-md"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      )}
    </div>
  );
}
