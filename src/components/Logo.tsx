import { Flame } from "lucide-react";
import { Link } from '@tanstack/react-router'


interface LogoProps {
    variant?: "default" | "sheet";
}

export function Logo({ variant = "default" }: LogoProps) {
    const textColor = variant === "sheet" ? "text-foreground" : "text-primary-foreground";
    const subTextColor = variant === "sheet" ? "text-muted-foreground" : "text-primary-foreground/80";

    return (
        <Link to="/" className="flex items-center gap-2 group">
            <div className={`bg-primary-foreground/20 p-2 rounded-full group-hover:bg-primary-foreground/30 transition-colors ${variant === "sheet" ? "bg-primary/10" : ""}`}>
                <Flame className={`fill-orange-500 ${variant === "sheet" ? "text-primary" : "text-primary-foreground"}`} size={24} />
            </div>
            <div className="flex flex-col">
                <span className={`font-bold text-lg leading-none tracking-tight ${textColor}`}>Miami Fireplace and BBQ</span>
                <span className={`text-[10px] uppercase tracking-widest ${subTextColor}`}>Est. 1970</span>
            </div>
        </Link>
    );
}
