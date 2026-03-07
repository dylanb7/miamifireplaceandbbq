import * as React from "react"
import { cn } from "@/lib/utils"

const Tabs = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement> & {
        value?: string
        defaultValue?: string
        onValueChange?: (value: string) => void
    }
>(({ className, value, defaultValue, onValueChange, children, ...props }, ref) => {
    const [internalValue, setInternalValue] = React.useState(value || defaultValue)

    React.useEffect(() => {
        if (value !== undefined) {
            setInternalValue(value)
        }
    }, [value])

    const handleValueChange = (newValue: string) => {
        if (value === undefined) {
            setInternalValue(newValue)
        }
        onValueChange?.(newValue)
    }

    return (
        <TabsContext.Provider value={{ value: internalValue, onValueChange: handleValueChange }}>
            <div ref={ref} className={cn("w-full", className)} {...props}>
                {children}
            </div>
        </TabsContext.Provider>
    )
})
Tabs.displayName = "Tabs"

const TabsContext = React.createContext<{
    value?: string
    onValueChange?: (value: string) => void
}>({})

const TabsList = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
    <div
        ref={ref}
        className={cn(
            "inline-flex h-10 items-center justify-center rounded-md bg-muted p-1 text-muted-foreground",
            className
        )}
        {...props}
    />
))
TabsList.displayName = "TabsList"

const TabsTrigger = React.forwardRef<
    HTMLButtonElement,
    React.ButtonHTMLAttributes<HTMLButtonElement> & { value: string }
>(({ className, value: triggerValue, onClick, ...props }, ref) => {
    const { value, onValueChange } = React.useContext(TabsContext)
    const isActive = value === triggerValue

    return (
        <button
            ref={ref}
            type="button"
            className={cn(
                "inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
                isActive && "bg-background text-foreground shadow-sm",
                "data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm",
                className
            )}
            onClick={(e) => {
                onValueChange?.(triggerValue)
                onClick?.(e)
            }}
            data-state={isActive ? "active" : "inactive"}
            {...props}
        />
    )
})
TabsTrigger.displayName = "TabsTrigger"

const TabsContent = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement> & { value: string }
>(({ className, value: contentValue, ...props }, ref) => {
    const { value } = React.useContext(TabsContext)
    if (value !== contentValue) return null

    return (
        <div
            ref={ref}
            className={cn(
                "mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                className
            )}
            {...props}
        />
    )
})
TabsContent.displayName = "TabsContent"

export { Tabs, TabsList, TabsTrigger, TabsContent }
