'use client';

import React from 'react';
import { cn } from '@/lib/utils';

interface GameCardSkeletonProps {
  className?: string;
  variant?: 'grid' | 'list' | 'hero';
}

export function GameCardSkeleton({ className, variant = 'grid' }: GameCardSkeletonProps) {
  if (variant === 'list') {
    return (
      <div className={cn("flex items-center justify-between p-4 rounded-xl border border-white/8 bg-[#111] animate-pulse", className)}>
        <div className="flex items-center gap-4 flex-1">
          <div className="w-12 h-16 rounded-md bg-white/5 border border-white/10" />
          <div className="space-y-2 flex-1 max-w-md">
            <div className="h-4 w-2/3 bg-white/10 rounded" />
            <div className="h-3 w-1/3 bg-white/5 rounded" />
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="h-4 w-12 bg-white/5 rounded" />
          <div className="h-6 w-20 bg-white/10 rounded" />
        </div>
      </div>
    );
  }

  if (variant === 'hero') {
    return (
      <div className={cn("rounded-xl border border-white/8 bg-[#111] overflow-hidden flex flex-col h-full animate-pulse", className)}>
        {/* 16:9 Landscape Cover Skeleton */}
        <div className="relative aspect-video w-full bg-white/5 border-b border-white/8" />
        {/* Card Content Skeleton */}
        <div className="p-5 flex flex-col justify-between flex-1 space-y-4">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="h-5 w-20 bg-white/10 rounded-md" />
              <div className="h-5 w-16 bg-white/5 rounded-md" />
            </div>
            <div className="h-6 w-4/5 bg-white/10 rounded-md" />
            <div className="h-4 w-3/5 bg-white/5 rounded-md" />
          </div>
          <div className="flex items-center justify-between pt-4 border-t border-white/8">
            <div className="h-5 w-16 bg-white/10 rounded" />
            <div className="h-9 w-28 bg-white/10 rounded-md" />
          </div>
        </div>
      </div>
    );
  }

  // Default Grid variant (3:4 portrait)
  return (
    <div className={cn("flex flex-col h-full animate-pulse", className)}>
      {/* Portrait Cover Skeleton */}
      <div className="relative aspect-[3/4] sm:aspect-[2/3] w-full rounded-xl bg-[#111] border border-white/8 overflow-hidden" />
      {/* Card Content Skeleton */}
      <div className="mt-3 flex flex-col justify-between flex-1 space-y-2.5">
        <div className="space-y-1.5">
          <div className="h-4 w-4/5 bg-white/10 rounded" />
          <div className="h-3 w-1/2 bg-white/5 rounded" />
        </div>
        <div className="mt-2.5 pt-2 border-t border-white/5 flex items-center justify-between">
          <div className="h-3 w-16 bg-white/10 rounded" />
          <div className="h-4 w-12 bg-white/5 rounded" />
        </div>
      </div>
    </div>
  );
}
