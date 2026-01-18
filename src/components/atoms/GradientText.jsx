import { cn } from "@/lib/utils"

export function GradientText({ children, className, ...props }) {
  return (
    <span
      className={cn(
        "bg-gradient-to-r from-red-500 via-purple-600 to-blue-500 bg-clip-text text-transparent",
        className
      )}
      {...props}
    >
      {children}
    </span>
  )
}


