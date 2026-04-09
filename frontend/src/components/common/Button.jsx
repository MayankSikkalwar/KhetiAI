import React from 'react'
import { cn } from '../../utils/cn'

export const Button = React.forwardRef(({ className, variant = 'primary', size = 'default', children, ...props }, ref) => {
  const baseStyles = "inline-flex items-center justify-center whitespace-nowrap rounded-full text-sm font-medium transition-all duration-300 outline-none focus-visible:ring-2 focus-visible:ring-green-600 disabled:pointer-events-none disabled:opacity-50"
  
  const variants = {
    primary: "bg-green-600 text-white shadow hover:bg-green-700 hover:shadow-green-600/30",
    secondary: "bg-white text-green-800 border border-green-200 hover:bg-green-50 shadow-sm",
    ghost: "bg-transparent text-green-800 hover:bg-green-100",
    outline: "border-2 border-green-600 text-green-600 bg-transparent hover:bg-green-50"
  }

  const sizes = {
    default: "h-10 px-6 py-2",
    sm: "h-8 px-4 text-xs",
    lg: "h-12 px-8 text-base",
    icon: "h-10 w-10"
  }

  return (
    <button
      ref={ref}
      className={cn(baseStyles, variants[variant], sizes[size], className)}
      {...props}
    >
      {children}
    </button>
  )
})

Button.displayName = "Button"
