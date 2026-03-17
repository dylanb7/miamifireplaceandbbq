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
        <div className={`dropdown group/dropdown ${dropdownDirection}`}>
            <Button variant="outline" size="icon" className={className} tabIndex={0} role="button">
                <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0 text-base-content stroke-current" />
                <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100 text-base-content stroke-current" />
                <span className="sr-only">Toggle theme</span>
            </Button>

            {/* Native Mobile OS Picker Overlay */}
            <select
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer md:hidden appearance-none z-10"
                value={theme ?? "system"}
                onChange={(e) => setTheme(e.target.value)}
                aria-label="Select theme"
            >
                <option value="system">System</option>
                {themes.map((t) => (
                    <option key={t} value={t} className="capitalize">
                        {t}
                    </option>
                ))}
            </select>

            <ul tabIndex={0} className="dropdown-content menu rounded-box z-[100] p-2 shadow-2xl border border-base-content/10 max-h-[35vh] overflow-y-auto hidden md:flex flex-col flex-nowrap w-48 opacity-0 invisible pointer-events-none group-focus-within/dropdown:pointer-events-auto group-focus-within/dropdown:opacity-100 group-focus-within/dropdown:visible bg-base-100 text-base-content backdrop-blur-3xl">
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
