import { createContext, useContext, useEffect, useState } from "react"

type Theme = string

type ThemeProviderProps = {
    children: React.ReactNode
    defaultTheme?: Theme
    storageKey?: string
}

type ThemeProviderState = {
    theme: Theme
    setTheme: (theme: Theme) => void
}

const initialState: ThemeProviderState = {
    theme: "system",
    setTheme: () => null,
}

const ThemeProviderContext = createContext<ThemeProviderState>(initialState)

export function ThemeProvider({
    children,
    defaultTheme = "system",
    storageKey = "vite-ui-theme",
}: ThemeProviderProps) {
    const [theme, setTheme] = useState<Theme>(
        () => {
            if (typeof window !== "undefined") {
                return (localStorage.getItem(storageKey) as Theme) || defaultTheme
            }
            return defaultTheme
        }
    )

    useEffect(() => {
        const root = window.document.documentElement

        // Remove old theme classes/attributes if needed, but mainly we update data-theme
        root.classList.remove("light", "dark")
        // If we want to support class-based themes for other daisyUI themes, we might need to add them as classes too?
        // Usually data-theme is enough for DaisyUI.
        // However, the explicit "light" and "dark" themes defined in CSS might rely on classes if using .dark class variant.
        // The CSS has `@custom-variant dark (&:is(.dark *));`

        if (theme === "system") {
            const systemTheme = window.matchMedia("(prefers-color-scheme: dark)")
                .matches
                ? "dark"
                : "light"

            root.classList.add(systemTheme)
            root.setAttribute("data-theme", systemTheme)
            return
        }

        root.classList.add(theme)
        root.setAttribute("data-theme", theme)
    }, [theme])

    const value = {
        theme,
        setTheme: (theme: Theme) => {
            localStorage.setItem(storageKey, theme)
            setTheme(theme)
        },
    }

    return (
        <ThemeProviderContext.Provider value={value}>
            {children}
        </ThemeProviderContext.Provider>
    )
}

export const useTheme = () => {
    const context = useContext(ThemeProviderContext)

    if (context === undefined)
        throw new Error("useTheme must be used within a ThemeProvider")

    return context
}
