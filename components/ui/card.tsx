import * as React from "react"

import { cn } from "@/lib/utils"

const Card = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { 
    as?: React.ElementType;
    borderBeam?: boolean;
    duration?: number;
    delay?: number;
    gradientFrom?: string;
    gradientTo?: string;
  }
>(({ 
  className, 
  as: Comp = "div",
  borderBeam = false,
  duration = 5,
  delay = 0,
  gradientFrom = "#ff0000",
  gradientTo = "#0000ff",
  ...props 
}, ref) => (
  <Comp
    ref={ref}
    className={cn(
      "relative rounded-xl border bg-card text-card-foreground shadow",
      borderBeam && "overflow-hidden",
      className
    )}
    {...props}
  >
    {borderBeam && (
        <div
            className="absolute top-0 left-0 w-full h-full"
            style={{
                background: `
                    radial-gradient(circle at 50% 50%, transparent 0%, transparent 70%, ${gradientFrom}),
                    conic-gradient(from 180deg at 50% 50%, ${gradientFrom}, ${gradientTo}, ${gradientFrom})
                `,
                backgroundBlendMode: "multiply",
                animation: `border-beam calc(var(--duration) * 1s) infinite linear`,
                animationDelay: `calc(var(--delay) * -1s)`,
                offsetPath: `path("M 0.5,0.5 L 99.5,0.5 L 99.5,99.5 L 0.5,99.5 Z")`,
                offsetDistance: "0%",
                offsetRotate: "auto",
                opacity: 0.5,
            } as React.CSSProperties}
        />
    )}
    <div className="relative z-10">
        {props.children}
    </div>
  </Comp>
))
Card.displayName = "Card"

const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col space-y-1.5 p-6", className)}
    {...props}
  />
))
CardHeader.displayName = "CardHeader"

const CardTitle = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("font-semibold leading-none tracking-tight", className)}
    {...props}
  />
))
CardTitle.displayName = "CardTitle"

const CardDescription = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
))
CardDescription.displayName = "CardDescription"

const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />
))
CardContent.displayName = "CardContent"

const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center p-6 pt-0", className)}
    {...props}
  />
))
CardFooter.displayName = "CardFooter"

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent }
