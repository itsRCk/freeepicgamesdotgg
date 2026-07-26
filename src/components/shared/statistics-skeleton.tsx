'use client';

import React from 'react';

export function StatisticsSkeleton() {
  return (
    <div className="container mx-auto px-4 py-8 space-y-12 animate-pulse">
      {/* Header Skeleton */}
      <div className="border-b border-white/10 pb-6 space-y-2">
        <div className="h-9 w-64 bg-white/10 rounded-md" />
        <div className="h-4 w-96 max-w-full bg-white/5 rounded-md" />
      </div>

      {/* Top Summary Metrics Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="p-6 rounded-xl border border-white/8 bg-[#111] space-y-3">
            <div className="flex items-center justify-between">
              <div className="h-4 w-28 bg-white/5 rounded" />
              <div className="w-8 h-8 rounded-md bg-white/5 border border-white/8" />
            </div>
            <div className="h-8 w-32 bg-white/10 rounded font-mono" />
            <div className="h-3 w-40 bg-white/5 rounded" />
          </div>
        ))}
      </div>

      {/* Main Charts Grid Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Value Over Time Chart Skeleton (Takes 2 Columns) */}
        <div className="lg:col-span-2 rounded-xl border border-white/8 bg-[#111] p-6 space-y-6">
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <div className="space-y-1">
              <div className="h-6 w-48 bg-white/10 rounded-md" />
              <div className="h-4 w-64 bg-white/5 rounded-md" />
            </div>
            <div className="h-8 w-36 bg-white/5 rounded-md" />
          </div>
          <div className="h-[350px] w-full bg-white/5 rounded-md" />
        </div>

        {/* Genre Distribution Skeleton (Takes 1 Column) */}
        <div className="rounded-xl border border-white/8 bg-[#111] p-6 space-y-6">
          <div className="border-b border-white/10 pb-4 space-y-1">
            <div className="h-6 w-40 bg-white/10 rounded-md" />
            <div className="h-4 w-48 bg-white/5 rounded-md" />
          </div>
          <div className="space-y-4">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="space-y-2">
                <div className="flex justify-between">
                  <div className="h-4 w-24 bg-white/10 rounded" />
                  <div className="h-4 w-12 bg-white/5 rounded font-mono" />
                </div>
                <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                  <div className="h-full bg-white/10 rounded-full" style={{ width: `${85 - i * 12}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
