import * as React from "react"
import { cn } from "@/lib/utils"

function Tooltip({ children, content, className }: { children: React.ReactNode; content: string; className?: string }) {
  return (
    <div className="group relative inline-flex">
      {children}
      <div className={cn(
        "pointer-events-none absolute bottom-full left-1/2 -translate-x-1/2 mb-2 z-50",
        "bg-[#111] border border-white/8 text-[#ededed] text-xs rounded-md px-2 py-1 whitespace-nowrap",
        "opacity-0 scale-95 group-hover:opacity-100 group-hover:scale-100",
        "transition-all duration-150",
        className
      )}>
        {content}
      </div>
    </div>
  )
}

export { Tooltip }
