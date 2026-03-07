import * as React from "react"
import { cn } from "@/lib/utils"

function HoverCard({
  children,
  ...props
}: {
  children: React.ReactNode
  openDelay?: number
  closeDelay?: number
}) {
  return (
    <div data-slot="hover-card" className="relative inline-block group/hover-card" {...props}>
      {children}
    </div>
  )
}

function HoverCardTrigger({
  children,
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="hover-card-trigger"
      className={cn("cursor-default", className)}
      {...props}
    >
      {children}
    </div>
  )
}

function HoverCardContent({
  className,
  align = "center",
  sideOffset = 4,
  children,
  ...props
}: React.ComponentProps<"div"> & {
  align?: "start" | "center" | "end"
  sideOffset?: number
}) {
  return (
    <div
      data-slot="hover-card-content"
      className={cn(
        "absolute bottom-full left-1/2 -translate-x-1/2 mb-2 z-50 w-64 rounded-md border bg-base-200 p-4 shadow-lg",
        "opacity-0 invisible scale-95 transition-all duration-200",
        "group-hover/hover-card:opacity-100 group-hover/hover-card:visible group-hover/hover-card:scale-100",
        align === "start" && "left-0 translate-x-0",
        align === "end" && "left-auto right-0 translate-x-0",
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

export { HoverCard, HoverCardTrigger, HoverCardContent }
