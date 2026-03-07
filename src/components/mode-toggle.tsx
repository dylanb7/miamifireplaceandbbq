import { Moon, Sun } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useTheme } from "@/components/theme-provider"

export function ModeToggle({ className, dropdownDirection = "dropdown-end" }: { className?: string, dropdownDirection?: string }) {
    const { setTheme, theme } = useTheme()

    const themes = [
        "light", "dark", "cupcake", "bumblebee", "emerald", "corporate", "synthwave", "retro", "cyberpunk",
        "valentine", "halloween", "garden", "forest", "aqua", "lofi", "pastel", "fantasy", "wireframe",
        "black", "luxury", "dracula", "cmyk", "autumn", "business", "acid", "lemonade", "night", "coffee",
        "winter", "dim", "nord", "sunset"
    ]

    return (
        <div className={`dropdown ${dropdownDirection}`}>
            <Button variant="outline" size="icon" className={className} tabIndex={0} role="button">
                <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 stroke-foreground scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                <span className="sr-only">Toggle theme</span>
            </Button>
            <ul tabIndex={0} className="dropdown-content menu bg-base-200 rounded-box z-50 min-w-[8rem] p-2 shadow-lg border border-base-300 max-h-[50vh] overflow-y-auto flex flex-col flex-nowrap w-48">
                <li>
                    <a onClick={() => setTheme("system")} className={theme === "system" ? "active" : ""}>
                        System
                    </a>
                </li>
                {themes.map((t) => (
                    <li key={t}>
                        <a onClick={() => setTheme(t)} className={`capitalize ${theme === t ? "active" : ""}`}>
                            {t}
                        </a>
                    </li>
                ))}
            </ul>
        </div>
    )
}
