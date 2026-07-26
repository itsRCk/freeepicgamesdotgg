'use client';

import React from 'react';
import { GameCardSkeleton } from '@/components/shared/game-card-skeleton';

export function LibrarySkeleton() {
  return (
    <div className="container mx-auto px-4 py-8 space-y-8 animate-pulse">
      {/* Header Skeleton */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-white/10 pb-6">
        <div className="space-y-2">
          <div className="h-9 w-48 bg-white/10 rounded-md" />
          <div className="h-4 w-72 bg-white/5 rounded-md" />
        </div>
        <div className="flex items-center gap-3">
          <div className="h-6 w-24 bg-white/10 rounded-md" />
          <div className="h-9 w-28 bg-white/10 rounded-md" />
        </div>
      </div>

      {/* Stats Summary Bar Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="p-5 rounded-xl border border-white/8 bg-[#111] space-y-2">
            <div className="h-3 w-28 bg-white/5 rounded" />
            <div className="h-7 w-20 bg-white/10 rounded font-mono" />
          </div>
        ))}
      </div>

      {/* Grid of Claimed Game Card Skeletons */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
          <GameCardSkeleton key={i} variant="grid" />
        ))}
      </div>
    </div>
  );
}
