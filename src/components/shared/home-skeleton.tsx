'use client';

import React from 'react';
import { GameCardSkeleton } from '@/components/shared/game-card-skeleton';

export function EgsFreeGamesSkeleton() {
  return (
    <div className="space-y-8 animate-pulse">
      {/* Free Now Section Skeleton */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="h-6 w-36 bg-white/10 rounded-md" />
          <div className="h-4 w-28 bg-white/5 rounded-md" />
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6">
          {[1, 2].map((i) => (
            <GameCardSkeleton key={i} variant="hero" />
          ))}
        </div>
      </div>

      {/* Upcoming Free Games Section Skeleton */}
      <div className="space-y-4 pt-4 border-t border-white/8">
        <div className="flex items-center justify-between">
          <div className="h-6 w-44 bg-white/10 rounded-md" />
          <div className="h-4 w-32 bg-white/5 rounded-md" />
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6">
          {[1, 2].map((i) => (
            <GameCardSkeleton key={i} variant="hero" />
          ))}
        </div>
      </div>
    </div>
  );
}

export function HomeSkeleton() {
  return (
    <div className="container mx-auto px-4 py-8 space-y-12 animate-pulse">
      {/* Top Banner Skeleton */}
      <div className="rounded-xl border border-white/15 bg-[#141414] p-6 h-28 flex items-center justify-between">
        <div className="space-y-2">
          <div className="h-6 w-64 bg-white/10 rounded-md" />
          <div className="h-4 w-48 bg-white/5 rounded-md" />
        </div>
        <div className="flex gap-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="w-16 h-16 rounded-md bg-white/5 border border-white/10" />
          ))}
        </div>
      </div>

      {/* EGS Free Games Section Skeleton */}
      <EgsFreeGamesSkeleton />

      {/* Quick Stats Grid Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="p-6 rounded-xl border border-white/8 bg-[#111] flex items-center gap-4 h-24">
            <div className="w-12 h-12 rounded-md bg-white/5 border border-white/8" />
            <div className="space-y-2 flex-1">
              <div className="h-3 w-24 bg-white/5 rounded" />
              <div className="h-6 w-16 bg-white/10 rounded" />
            </div>
          </div>
        ))}
      </div>

      {/* Recently Free Section Skeleton */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="h-6 w-40 bg-white/10 rounded-md" />
          <div className="h-4 w-24 bg-white/5 rounded-md" />
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6">
          {[1, 2, 3, 4].map((i) => (
            <GameCardSkeleton key={i} variant="grid" />
          ))}
        </div>
      </div>
    </div>
  );
}
