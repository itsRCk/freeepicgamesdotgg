'use client';

import React, { useState, useEffect } from 'react';
import { getFallbackCoverUrls } from '@/lib/image-fallback';
import { cn } from '@/lib/utils';
import { Gamepad2 } from 'lucide-react';

interface GameCoverImageProps {
  title: string;
  coverArt?: string;
  className?: string;
  alt?: string;
  priority?: boolean;
}

export function GameCoverImage({
  title,
  coverArt,
  className,
  alt,
  priority = false,
}: GameCoverImageProps) {
  const [urls, setUrls] = useState<string[]>(() => getFallbackCoverUrls(title, coverArt));
  const [currentIndex, setCurrentIndex] = useState(0);
  const [hasTriedApi, setHasTriedApi] = useState(false);
  const [allFailed, setAllFailed] = useState(false);

  // If title or coverArt prop changes, reset state
  useEffect(() => {
    setUrls(getFallbackCoverUrls(title, coverArt));
    setCurrentIndex(0);
    setHasTriedApi(false);
    setAllFailed(false);
  }, [title, coverArt]);

  const handleError = async () => {
    // 1. Try next static fallback URL in the list
    if (currentIndex + 1 < urls.length) {
      setCurrentIndex((prev) => prev + 1);
      return;
    }

    // 2. If static URLs exhausted and we haven't checked our fallback search API yet
    if (!hasTriedApi) {
      setHasTriedApi(true);
      try {
        const res = await fetch(`/api/cover-search?title=${encodeURIComponent(title)}`);
        if (res.ok) {
          const data = await res.json();
          if (data.found && data.coverArt && !urls.includes(data.coverArt)) {
            setUrls((prev) => [...prev, data.coverArt]);
            setCurrentIndex((prev) => prev + 1);
            return;
          }
        }
      } catch (err) {
        console.warn(`Fallback image API check failed for "${title}":`, err);
      }
    }

    // 3. All fallbacks failed, show elegant gradient placeholder card
    setAllFailed(true);
  };

  if (allFailed || urls.length === 0) {
    return (
      <div
        className={cn(
          "w-full h-full flex flex-col items-center justify-center p-3 text-center bg-gradient-to-br from-zinc-900 via-purple-950/40 to-slate-900 border border-white/5 overflow-hidden",
          className
        )}
      >
        <Gamepad2 className="w-8 h-8 text-purple-400/50 mb-2 flex-shrink-0" />
        <span className="text-xs sm:text-sm font-extrabold text-white/90 line-clamp-3 leading-snug tracking-tight">
          {title}
        </span>
      </div>
    );
  }

  return (
    <img
      src={urls[currentIndex]}
      alt={alt || title}
      className={cn("w-full h-full object-cover", className)}
      loading={priority ? "eager" : "lazy"}
      onError={handleError}
    />
  );
}
