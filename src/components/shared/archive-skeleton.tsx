'use client';

import React from 'react';
import { GameCardSkeleton } from '@/components/shared/game-card-skeleton';

export function ArchiveSkeleton() {
  return (
    <div className="container mx-auto px-4 py-8 space-y-8 animate-pulse">
      {/* Header Skeleton */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-white/10 pb-6">
        <div className="space-y-2">
          <div className="h-9 w-64 bg-white/10 rounded-md" />
          <div className="h-4 w-96 max-w-full bg-white/5 rounded-md" />
        </div>
        <div className="flex items-center gap-2">
          <div className="h-6 w-32 bg-white/10 rounded-md" />
          <div className="h-6 w-24 bg-white/5 rounded-md" />
        </div>
      </div>

      {/* Controls & Filter Bar Skeleton */}
      <div className="flex flex-col md:flex-row gap-4">
        {/* Search Input */}
        <div className="h-10 flex-1 bg-[#111] border border-white/10 rounded-md" />
        {/* Category Filter */}
        <div className="h-10 w-full md:w-[180px] bg-[#111] border border-white/10 rounded-md" />
        {/* Status Filter */}
        <div className="h-10 w-full md:w-[180px] bg-[#111] border border-white/10 rounded-md" />
        {/* Sort Filter */}
        <div className="h-10 w-full md:w-[200px] bg-[#111] border border-white/10 rounded-md" />
      </div>

      {/* Grid of Game Card Skeletons */}
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((i) => (
          <GameCardSkeleton key={i} variant="grid" />
        ))}
      </div>
    </div>
  );
}
