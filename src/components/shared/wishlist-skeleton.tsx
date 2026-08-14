'use client';

import React from 'react';
import { GameCardSkeleton } from '@/components/shared/game-card-skeleton';

export function WishlistSkeleton() {
  return (
    <div className="container mx-auto px-4 py-8 space-y-8 animate-pulse">
      {/* Header Skeleton */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-white/10 pb-6">
        <div className="space-y-2">
          <div className="h-9 w-48 bg-white/10 rounded-md" />
          <div className="h-4 w-64 bg-white/5 rounded-md" />
        </div>
        <div className="h-6 w-24 bg-white/10 rounded-md" />
      </div>

      {/* Grid of Wishlisted Game Card Skeletons */}
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6">
        {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
          <GameCardSkeleton key={i} variant="grid" />
        ))}
      </div>
    </div>
  );
}
