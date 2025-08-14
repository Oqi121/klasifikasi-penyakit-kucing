import * as React from "react"

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "outline"
  size?: "default" | "sm"
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className = "", variant = "default", size = "default", ...props }, ref) => {
    const baseStyles =
      "inline-flex items-center justify-center rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-black disabled:opacity-50 disabled:pointer-events-none"

const variants = {
  default: "bg-black text-white hover:bg-gray-600",
  outline:
    "border border-black bg-white text-black hover:bg-gray-400 hover:text-black",
}


    const sizes = {
      default: "h-10 px-4 py-2",
      sm: "h-8 px-3 text-sm",
    }

    return (
      <button
        className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
        ref={ref}
        {...props}
      />
    )
  }
)

Button.displayName = "Button"

export { Button }
