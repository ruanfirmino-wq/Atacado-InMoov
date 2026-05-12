import * as React from "react"
import { cn } from "../../lib/utils"

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: "default" | "outline";
  }

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary disabled:opacity-50 disabled:pointer-events-none",
          variant === "default" && "bg-brand-primary text-white hover:opacity-90 h-12 px-6 py-2",
          variant === "outline" && "border border-gray-300 bg-transparent hover:bg-gray-100 h-12 px-6 py-2 text-gray-900",
          className
        )}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button }
