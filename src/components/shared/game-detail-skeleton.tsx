export function GameDetailSkeleton() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-[#ededed] font-sans pb-20 animate-pulse">
      {/* Top Navigation Bar Skeleton */}
      <div className="sticky top-0 z-40 bg-[#0a0a0a]/90 backdrop-blur-md border-b border-white/10 px-4 md:px-8 h-14 flex items-center">
        <div className="h-4 w-16 bg-white/10 rounded" />
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-8 pt-8">
        {/* Header Section */}
        <div className="mb-8">
          <div className="h-10 w-3/4 md:w-1/2 bg-white/10 rounded mb-4" />
          <div className="flex items-center gap-3">
            <div className="h-4 w-28 bg-white/5 rounded" />
            <div className="h-4 w-12 bg-white/5 rounded font-mono" />
          </div>

          {/* Navigation Tabs */}
          <div className="flex gap-6 mt-8 border-b border-white/10 pb-3">
            <div className="h-5 w-20 bg-white/10 rounded" />
            <div className="h-5 w-20 bg-white/5 rounded" />
            <div className="h-5 w-24 bg-white/5 rounded" />
          </div>
        </div>

        {/* Main Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-12">
          {/* LEFT COLUMN */}
          <div className="space-y-12">
            {/* Aspect Video Screenshot Skeleton */}
            <div className="rounded-md overflow-hidden bg-[#111111] aspect-video border border-white/10 relative">
              <div className="absolute inset-0 bg-white/5" />
            </div>

            {/* Thumbnail Strip */}
            <div className="flex gap-2">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="w-16 h-10 rounded-md bg-[#111111] border border-white/10" />
              ))}
            </div>

            {/* Description & Metadata Skeleton */}
            <div className="space-y-3">
              <div className="h-4 w-full bg-white/5 rounded" />
              <div className="h-4 w-11/12 bg-white/5 rounded" />
              <div className="h-4 w-4/5 bg-white/5 rounded" />
            </div>

            {/* Genres & Features */}
            <div className="grid grid-cols-2 gap-8 py-6 border-y border-white/10">
              <div className="space-y-3">
                <div className="h-3 w-16 bg-white/10 rounded uppercase font-mono" />
                <div className="flex flex-wrap gap-2">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="h-7 w-20 bg-white/5 border border-white/10 rounded-md" />
                  ))}
                </div>
              </div>
              <div className="space-y-3">
                <div className="h-3 w-16 bg-white/10 rounded uppercase font-mono" />
                <div className="flex flex-wrap gap-2">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="h-7 w-24 bg-white/5 border border-white/10 rounded-md" />
                  ))}
                </div>
              </div>
            </div>

            {/* Ratings & Reviews Skeleton */}
            <div className="pt-8 border-t border-white/10">
              <div className="h-6 w-44 bg-white/10 rounded mb-6" />
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="bg-[#111111] p-6 rounded-md border border-white/10 h-36 flex flex-col justify-between">
                    <div className="h-3 w-16 bg-white/5 rounded font-mono" />
                    <div className="h-6 w-20 bg-white/10 rounded font-mono" />
                    <div className="h-4 w-full bg-white/5 rounded" />
                  </div>
                ))}
              </div>
            </div>

            {/* System Requirements Skeleton */}
            <div className="pt-8 border-t border-white/10">
              <div className="h-6 w-52 bg-white/10 rounded mb-6" />
              <div className="bg-[#111111] rounded-md p-8 border border-white/10 space-y-6">
                <div className="border-b border-white/10 pb-4 flex gap-6">
                  <div className="h-5 w-20 bg-white/10 rounded" />
                  <div className="h-5 w-20 bg-white/5 rounded" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                  <div className="space-y-4">
                    <div className="h-4 w-24 bg-white/10 rounded mb-4" />
                    {[1, 2, 3, 4].map((j) => (
                      <div key={j} className="space-y-1">
                        <div className="h-3 w-16 bg-white/5 rounded font-mono" />
                        <div className="h-4 w-32 bg-white/10 rounded" />
                      </div>
                    ))}
                  </div>
                  <div className="space-y-4">
                    <div className="h-4 w-28 bg-white/10 rounded mb-4" />
                    {[1, 2, 3, 4].map((j) => (
                      <div key={j} className="space-y-1">
                        <div className="h-3 w-16 bg-white/5 rounded font-mono" />
                        <div className="h-4 w-36 bg-white/10 rounded" />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN (Sidebar Card Skeleton) */}
          <div className="space-y-6">
            <div className="bg-[#111111] border border-white/10 rounded-lg p-6 space-y-6">
              <div className="aspect-video w-full rounded-md bg-white/5 border border-white/10" />
              <div className="space-y-2">
                <div className="h-4 w-20 bg-white/10 rounded font-mono" />
                <div className="h-8 w-32 bg-white/10 rounded font-mono" />
              </div>
              <div className="h-12 w-full bg-white/10 rounded-md" />
              <div className="space-y-3 pt-4 border-t border-white/10 text-xs">
                <div className="flex justify-between">
                  <div className="h-3 w-20 bg-white/5 rounded font-mono" />
                  <div className="h-3 w-24 bg-white/10 rounded font-mono" />
                </div>
                <div className="flex justify-between">
                  <div className="h-3 w-20 bg-white/5 rounded font-mono" />
                  <div className="h-3 w-28 bg-white/10 rounded font-mono" />
                </div>
                <div className="flex justify-between">
                  <div className="h-3 w-24 bg-white/5 rounded font-mono" />
                  <div className="h-3 w-20 bg-white/10 rounded font-mono" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
