import * as React from "react"

interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {}

const Badge = React.forwardRef<HTMLDivElement, BadgeProps>(({ className = "", ...props }, ref) => (
  <div
    ref={ref}
    className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors ${className}`}
    {...props}
  />
))
Badge.displayName = "Badge"

export { Badge }
