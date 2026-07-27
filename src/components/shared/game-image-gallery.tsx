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
    <div className="rounded-xl overflow-hidden bg-[#0a0a0a] aspect-video relative group border border-white/10 shadow-2xl select-none">
      {/* Active Screenshot Display */}
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

      {/* Navigation Arrows */}
      {total > 1 && (
        <>
          <button
            onClick={handlePrev}
            aria-label="Previous screenshot"
            className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-black/60 hover:bg-black/90 backdrop-blur-md text-white border border-white/15 flex items-center justify-center opacity-80 group-hover:opacity-100 hover:scale-105 transition-all shadow-lg"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={handleNext}
            aria-label="Next screenshot"
            className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-black/60 hover:bg-black/90 backdrop-blur-md text-white border border-white/15 flex items-center justify-center opacity-80 group-hover:opacity-100 hover:scale-105 transition-all shadow-lg"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </>
      )}

      {/* Thumbnail Strip */}
      {total > 1 && (
        <div className="absolute bottom-4 left-0 right-0 z-20 flex justify-center px-4">
          <div className="flex gap-2 p-2 rounded-xl bg-black/70 backdrop-blur-md border border-white/15 shadow-xl max-w-full overflow-x-auto">
            {screenshots.map((img, idx) => (
              <button
                key={idx}
                onClick={() => setSelectedIndex(idx)}
                aria-label={`Select screenshot ${idx + 1}`}
                className={cn(
                  "w-16 h-10 sm:w-20 sm:h-12 relative rounded-md overflow-hidden transition-all flex-shrink-0",
                  idx === selectedIndex
                    ? "border-2 border-white scale-105 shadow-md opacity-100"
                    : "border border-white/20 opacity-50 hover:opacity-100 hover:border-white/50"
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
        </div>
      )}
    </div>
  );
}
