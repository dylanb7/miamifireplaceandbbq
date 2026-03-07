import * as React from "react"
import { cn } from "@/lib/utils"

interface DropdownMenuProps {
  children: React.ReactNode
}

function DropdownMenu({ children }: DropdownMenuProps) {
  return (
    <div data-slot="dropdown-menu" className="dropdown dropdown-end">
      {children}
    </div>
  )
}

function DropdownMenuTrigger({
  className,
  asChild = false,
  children,
  ...props
}: React.ComponentProps<"button"> & { asChild?: boolean }) {
  // When asChild, clone the child element and add tabIndex + role
  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(children as React.ReactElement<any>, {
      tabIndex: 0,
      role: "button",
      "data-slot": "dropdown-menu-trigger",
      ...props,
    })
  }

  return (
    <button
      data-slot="dropdown-menu-trigger"
      tabIndex={0}
      role="button"
      className={cn(className)}
      {...props}
    >
      {children}
    </button>
  )
}

function DropdownMenuContent({
  className,
  align = "end",
  children,
  ...props
}: React.ComponentProps<"ul"> & {
  align?: "start" | "center" | "end"
  sideOffset?: number
}) {
  return (
    <ul
      data-slot="dropdown-menu-content"
      tabIndex={0}
      className={cn(
        "dropdown-content menu bg-base-200 rounded-box z-50 min-w-[8rem] p-2 shadow-lg border border-base-300",
        className
      )}
      {...props}
    >
      {children}
    </ul>
  )
}

function DropdownMenuGroup({
  children,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div data-slot="dropdown-menu-group" {...props}>
      {children}
    </div>
  )
}

function DropdownMenuItem({
  className,
  children,
  onClick,
  ...props
}: React.ComponentProps<"li"> & {
  inset?: boolean
  variant?: "default" | "destructive"
}) {
  return (
    <li data-slot="dropdown-menu-item">
      <a
        className={cn(
          "flex items-center gap-2 rounded-md px-2 py-1.5 text-sm cursor-pointer select-none transition-colors",
          className
        )}
        onClick={onClick as any}
        {...(props as any)}
      >
        {children}
      </a>
    </li>
  )
}

function DropdownMenuSeparator({
  className,
  ...props
}: React.ComponentProps<"li">) {
  return (
    <li
      data-slot="dropdown-menu-separator"
      className={cn("divider my-1", className)}
      {...props}
    />
  )
}

function DropdownMenuLabel({
  className,
  children,
  ...props
}: React.ComponentProps<"li"> & { inset?: boolean }) {
  return (
    <li
      data-slot="dropdown-menu-label"
      className={cn("menu-title px-2 py-1.5 text-sm font-medium", className)}
      {...props}
    >
      {children}
    </li>
  )
}

function DropdownMenuShortcut({
  className,
  ...props
}: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="dropdown-menu-shortcut"
      className={cn(
        "text-muted-foreground ml-auto text-xs tracking-widest",
        className
      )}
      {...props}
    />
  )
}

// Stubs for unused exports to avoid breaking anything
const DropdownMenuPortal = ({ children }: { children: React.ReactNode }) => <>{children}</>
const DropdownMenuCheckboxItem = DropdownMenuItem
const DropdownMenuRadioGroup = DropdownMenuGroup
const DropdownMenuRadioItem = DropdownMenuItem
const DropdownMenuSub = DropdownMenuGroup
const DropdownMenuSubTrigger = DropdownMenuTrigger as any
const DropdownMenuSubContent = DropdownMenuContent as any

export {
  DropdownMenu,
  DropdownMenuPortal,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuItem,
  DropdownMenuCheckboxItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
}
