import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center gap-1 px-2 py-0.5 rounded-md border text-xs font-medium font-mono",
  {
    variants: {
      variant: {
        default: "bg-white/5 border-white/10 text-[#888]",
        secondary: "bg-white/8 border-white/15 text-[#ededed]",
        destructive: "bg-red-500/10 border-red-500/20 text-red-400",
        outline: "border-white/15 text-[#888]",
        success: "bg-green-500/10 border-green-500/20 text-green-400",
        warning: "bg-amber-500/10 border-amber-500/20 text-amber-400",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants }
