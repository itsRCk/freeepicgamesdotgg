'use client';

import React, { useState, useCallback, useEffect, useMemo } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Play } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface MediaItem {
  type: 'video' | 'image';
  url: string;
  thumbnail: string;
  title?: string;
}

interface GameImageGalleryProps {
  screenshots: string[];
  videos?: { name: string; preview: string; url: string }[];
  title: string;
}

export function GameImageGallery({ screenshots, videos, title }: GameImageGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);

  const mediaItems = useMemo<MediaItem[]>(() => {
    const items: MediaItem[] = [];
    if (videos && Array.isArray(videos)) {
      videos.forEach((v) => {
        if (v && v.url) {
          items.push({
            type: 'video',
            url: v.url,
            thumbnail: v.preview || screenshots?.[0] || '',
            title: v.name,
          });
        }
      });
    }
    if (screenshots && Array.isArray(screenshots)) {
      screenshots.forEach((s) => {
        if (s) {
          items.push({
            type: 'image',
            url: s,
            thumbnail: s,
          });
        }
      });
    }
    return items;
  }, [videos, screenshots]);

  const total = mediaItems.length;
  const safeIndex = selectedIndex < total ? selectedIndex : 0;
  const activeItem = mediaItems[safeIndex];

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

  if (!mediaItems || mediaItems.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4 select-none">
      {/* Active Main Screenshot / Video Preview */}
      <div className="rounded-xl overflow-hidden bg-[#0a0a0a] aspect-video relative border border-white/10 shadow-2xl">
        <div className="relative w-full h-full overflow-hidden bg-black flex items-center justify-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeItem.url}
              initial={{ opacity: 0, scale: 1.01 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="absolute inset-0 w-full h-full"
            >
              {activeItem.type === 'video' ? (
                <video
                  key={activeItem.url}
                  src={activeItem.url}
                  poster={activeItem.thumbnail}
                  controls
                  autoPlay
                  playsInline
                  className="w-full h-full object-contain bg-black"
                />
              ) : (
                <Image
                  src={activeItem.url}
                  alt={`${title} media ${safeIndex + 1}`}
                  fill
                  className="object-cover"
                  unoptimized
                  priority={safeIndex === 0}
                />
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Counter Badge */}
        {total > 1 && (
          <div className="absolute top-4 right-4 z-10 bg-black/70 backdrop-blur-md text-white text-xs font-mono px-3 py-1 rounded-md border border-white/10 pointer-events-none">
            {safeIndex + 1} / {total}
          </div>
        )}
      </div>

      {/* Thumbnail Strip / Carousel Below Main Image */}
      {total > 1 && (
        <div className="flex items-center justify-between gap-3 px-1">
          {/* Left Navigation Button */}
          <button
            onClick={handlePrev}
            aria-label="Previous media item"
            className="w-10 h-10 sm:w-11 sm:h-11 flex-shrink-0 rounded-full bg-[#1a1a1a] hover:bg-[#252525] text-white border border-white/10 flex items-center justify-center transition-all hover:scale-105 active:scale-95 shadow-md"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          {/* Horizontally Scrollable Thumbnail Strip */}
          <div className="flex items-center justify-center gap-2.5 sm:gap-3 overflow-x-auto py-1 px-1">
            {mediaItems.map((item, idx) => (
              <button
                key={idx}
                onClick={() => setSelectedIndex(idx)}
                aria-label={`Select media ${idx + 1}`}
                className={cn(
                  "w-20 h-12 sm:w-28 sm:h-16 relative rounded-lg overflow-hidden transition-all flex-shrink-0 border-2 group/thumb bg-[#111]",
                  idx === safeIndex
                    ? "border-white scale-105 shadow-md opacity-100"
                    : "border-transparent opacity-50 hover:opacity-100 hover:border-white/40"
                )}
              >
                <Image
                  src={item.thumbnail}
                  alt={`${title} thumbnail ${idx + 1}`}
                  fill
                  className="object-cover"
                  unoptimized
                />
                {item.type === 'video' && (
                  <div className="absolute inset-0 bg-black/45 flex items-center justify-center pointer-events-none">
                    <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-black/80 border border-white/60 flex items-center justify-center text-white shadow-lg group-hover/thumb:scale-110 transition-transform">
                      <Play className="w-3 h-3 sm:w-3.5 sm:h-3.5 fill-current ml-0.5" />
                    </div>
                  </div>
                )}
              </button>
            ))}
          </div>

          {/* Right Navigation Button */}
          <button
            onClick={handleNext}
            aria-label="Next media item"
            className="w-10 h-10 sm:w-11 sm:h-11 flex-shrink-0 rounded-full bg-[#1a1a1a] hover:bg-[#252525] text-white border border-white/10 flex items-center justify-center transition-all hover:scale-105 active:scale-95 shadow-md"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      )}
    </div>
  );
}
