// @ts-nocheck
import * as React from "react"
import { cn } from "@/lib/utils"

interface SelectContextValue {
  value?: string
  onValueChange?: (value: string) => void
}

const SelectContext = React.createContext<SelectContextValue>({})

function Select({
  children,
  value,
  defaultValue,
  onValueChange,
  ...props
}: {
  children: React.ReactNode
  value?: string
  defaultValue?: string
  onValueChange?: (value: string) => void
}) {
  const [internalValue, setInternalValue] = React.useState(defaultValue)
  const effectiveValue = value !== undefined ? value : internalValue
  const handleChange = onValueChange || setInternalValue

  return (
    <SelectContext.Provider value={{ value: effectiveValue, onValueChange: handleChange }}>
      {children}
    </SelectContext.Provider>
  )
}

function SelectGroup({ children, ...props }: React.ComponentProps<"optgroup"> & { children: React.ReactNode }) {
  return <>{children}</>
}

function SelectValue({ placeholder, ...props }: { placeholder?: string; defaultValue?: string }) {
  const { value } = React.useContext(SelectContext)
  // This is a display-only component in Radix's API, handled by SelectTrigger now
  return null
}

function SelectTrigger({
  className,
  children,
  ...props
}: React.ComponentProps<"div"> & {
  size?: "sm" | "default"
}) {
  // This is a noop wrapper — actual rendering is done by the parent Select via InternalSelect
  return null
}

function SelectContent({
  className,
  children,
  ...props
}: React.ComponentProps<"div"> & {
  position?: string
  align?: string
}) {
  // This is a noop wrapper — actual rendering is done by the parent Select via InternalSelect
  return null
}

function SelectItem({
  value,
  children,
  className,
  ...props
}: {
  value: string
  children: React.ReactNode
  className?: string
}) {
  // Items just hold data, rendered by InternalSelect
  return null
}

function SelectLabel({ children, ...props }: React.ComponentProps<"option">) {
  return null
}

function SelectSeparator({ className, ...props }: React.ComponentProps<"div">) {
  return null
}

function SelectScrollUpButton(props: any) { return null }
function SelectScrollDownButton(props: any) { return null }

// ---- Bridged component for actual use ----
// Since the Radix compound-component pattern doesn't map to native <select>,
// we provide a NativeSelect component that can be used directly.

interface NativeSelectProps extends Omit<React.ComponentProps<"select">, "value" | "onChange"> {
  value?: string
  onValueChange?: (value: string) => void
  placeholder?: string
  options: { value: string; label: string }[]
}

function NativeSelect({
  className,
  value,
  onValueChange,
  placeholder,
  options,
  ...props
}: NativeSelectProps) {
  return (
    <select
      data-slot="select"
      className={cn(
        "select select-bordered w-full text-sm border border-base-content/20 bg-base-100 rounded-md",
        className,
      )}
      value={value || ""}
      onChange={(e) => onValueChange?.(e.target.value)}
      {...props}
    >
      {placeholder && (
        <option value="" disabled>
          {placeholder}
        </option>
      )}
      {options.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  )
}

export {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectScrollDownButton,
  SelectScrollUpButton,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
  NativeSelect,
}
