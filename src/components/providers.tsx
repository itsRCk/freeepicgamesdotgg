"use client"

import * as React from "react"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { SmoothScrollProvider } from "@/components/providers/smooth-scroll-provider"

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = React.useState(() => new QueryClient())

  return (
    <QueryClientProvider client={queryClient}>
      <SmoothScrollProvider>
        {children}
      </SmoothScrollProvider>
    </QueryClientProvider>
  )
}
