import React from 'react'
import { cn } from '../../utils/cn'

export function Card({ className, children, glass = false }) {
  return (
    <div className={cn(
      "rounded-3xl border border-green-100 bg-white text-charcoal shadow-sm",
      glass && "bg-white/80 backdrop-blur-md border-white/20 shadow-xl",
      className
    )}>
      {children}
    </div>
  )
}

export function CardHeader({ className, children }) {
  return <div className={cn("flex flex-col space-y-1.5 p-6", className)}>{children}</div>
}

export function CardTitle({ className, children }) {
  return <h3 className={cn("text-xl font-bold leading-none tracking-tight", className)}>{children}</h3>
}

export function CardContent({ className, children }) {
  return <div className={cn("p-6 pt-0", className)}>{children}</div>
}
