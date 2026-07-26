import * as React from "react"
import { cn } from "@/lib/utils"

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-9 w-full rounded-md border border-white/10 bg-[#111] px-3 py-1 text-sm text-[#ededed]",
          "placeholder:text-[#555]",
          "hover:border-white/20",
          "focus:outline-none focus:border-white/30 focus:ring-1 focus:ring-white/20",
          "transition-colors duration-150",
          "disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Input.displayName = "Input"

export { Input }
