import { Sparkles } from "lucide-react";
import type { Promotion } from "@/data/types";
import { cn } from "@/lib/utils";
import { CardDescription, CardTitle } from "./ui/card";
import {
    HoverCard,
    HoverCardContent,
    HoverCardTrigger,
} from "@/components/ui/hover-card";

interface PromotionBannerProps {
    promotion: Promotion;
    className?: string;
    compact?: boolean;
}

export function PromotionBanner({ promotion, className }: PromotionBannerProps) {
    const TriggerContent = (
        <div className={cn(
            "inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary border border-primary/20 transition-colors hover:bg-primary/20 cursor-default",
            className
        )}>
            <Sparkles size={14} />
            <span className="text-xs font-medium">{promotion.title}</span>
        </div>
    );

    return (
        <HoverCard>
            <HoverCardTrigger>
                {TriggerContent}
            </HoverCardTrigger>
            <HoverCardContent className="w-80">
                <div className="space-y-2">
                    <div className="flex items-center gap-2 text-primary font-semibold">
                        <Sparkles size={16} />
                        <span className="text-sm uppercase tracking-wider">{promotion.title}</span>
                    </div>
                    <CardTitle className="text-lg font-bold tracking-tight">
                        {promotion.description}
                    </CardTitle>
                    <CardDescription className="text-sm text-muted-foreground">
                        {promotion.details}
                    </CardDescription>
                </div>
            </HoverCardContent>
        </HoverCard>
    );
}
