import { useRef, useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface SimpleCarouselProps {
    children: React.ReactNode;
    className?: string; // Container class
    scrollContainerClassName?: string; // Scroll container specific class
    scrollAmount?: number;
    rows?: 1 | 2;
}

export const SimpleCarousel: React.FC<SimpleCarouselProps> = ({ children, className, scrollContainerClassName, scrollAmount = 300, rows = 1 }) => {
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const [canScrollLeft, setCanScrollLeft] = useState(false);
    const [canScrollRight, setCanScrollRight] = useState(false);

    const checkScroll = () => {
        if (scrollContainerRef.current) {
            const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
            const scrollBuffer = 10;
            setCanScrollLeft(scrollLeft > scrollBuffer);
            setCanScrollRight(scrollLeft < scrollWidth - clientWidth - scrollBuffer);
        }
    };

    useEffect(() => {
        checkScroll();
        window.addEventListener('resize', checkScroll);
        // Also check scroll on load/content change
        return () => window.removeEventListener('resize', checkScroll);
    }, [children]);

    const scroll = (direction: 'left' | 'right') => {
        if (!scrollContainerRef.current) return;
        const container = scrollContainerRef.current;
        const targetScroll = container.scrollLeft + (direction === 'left' ? -scrollAmount : scrollAmount);

        container.scrollTo({ left: targetScroll, behavior: 'smooth' });
    };

    return (
        <div className={cn("relative group/carousel", className)}>
            {/* Left Arrow */}
            <div className={cn(
                "absolute left-0 top-0 bottom-0 w-12 bg-gradient-to-r from-background via-background/80 to-transparent z-30 flex items-center justify-start pl-2 transition-opacity duration-300 pointer-events-none",
                canScrollLeft ? "opacity-100" : "opacity-0"
            )}>
                <Button
                    variant="secondary"
                    size="icon"
                    className="h-8 w-8 rounded-full shadow-md pointer-events-auto"
                    onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        scroll('left');
                    }}
                >
                    <ChevronLeft className="h-4 w-4" />
                </Button>
            </div>

            {/* Scroll Container */}
            <div
                ref={scrollContainerRef}
                onScroll={checkScroll}
                className={cn(
                    "w-full overflow-x-auto gap-4 py-4 px-4 md:px-0 scroll-pl-12 snap-x snap-mandatory scrollbar-hide",
                    rows === 1 ? "flex" : "grid grid-flow-col auto-cols-max",
                    rows === 2 ? "grid-rows-2" : "",
                    scrollContainerClassName
                )}
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
                {children}

                {/* Spacer for end spacing if needed */}
                <div className="w-1 shrink-0" />
            </div>

            {/* Right Arrow */}
            <div className={cn(
                "absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-background via-background/80 to-transparent z-30 flex items-center justify-end pr-2 transition-opacity duration-300 pointer-events-none",
                canScrollRight ? "opacity-100" : "opacity-0"
            )}>
                <Button
                    variant="secondary"
                    size="icon"
                    className="h-8 w-8 rounded-full shadow-md pointer-events-auto"
                    onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        scroll('right');
                    }}
                >
                    <ChevronRight className="h-4 w-4" />
                </Button>
            </div>
        </div>
    );
};
