import React, { useEffect, useState, useRef } from 'react';
import { cn } from '../../lib/utils';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export interface TocItem {
    id: string;
    title: string;
}

interface FloatingTocProps {
    items: TocItem[];
    className?: string; // For overriding responsive visibility
}

export const FloatingToc: React.FC<FloatingTocProps> = ({ items, className }) => {
    const [activeId, setActiveId] = useState<string>('');
    const [isVisible, setIsVisible] = useState(false);
    const [canScrollLeft, setCanScrollLeft] = useState(false);
    const [canScrollRight, setCanScrollRight] = useState(false);

    const scrollContainerRef = useRef<HTMLUListElement>(null);
    const itemRefs = useRef<Record<string, HTMLLIElement | null>>({});
    const isClickScrolling = useRef(false);
    const scrollTimeoutRef = useRef<number | null>(null);

    // Update scroll button visibility
    const checkScroll = () => {
        if (scrollContainerRef.current) {
            const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
            setCanScrollLeft(scrollLeft > 0);
            setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 1); // 1px rounding buffer
        }
    };

    useEffect(() => {
        checkScroll();
        window.addEventListener('resize', checkScroll);
        // Small delay to allow layout to settle
        const timeoutId = setTimeout(checkScroll, 100);
        return () => {
            window.removeEventListener('resize', checkScroll);
            clearTimeout(timeoutId);
        };
    }, [items, isVisible]);

    // Visibility scroll listener
    useEffect(() => {
        const handleScroll = () => {
            const isPastTopThreshold = window.scrollY > 400;

            // Calculate distance from bottom
            const distanceToBottom = document.body.scrollHeight - (window.innerHeight + window.scrollY);
            const isNearBottom = distanceToBottom < 800; // Increased threshold to avoid footer overlap

            if (isPastTopThreshold && !isNearBottom) {
                setIsVisible(true);
            } else {
                setIsVisible(false);
            }
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        handleScroll(); // initial check
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Intersection observer to track active section
    useEffect(() => {
        if (items.length === 0) return;

        const observerOptions = {
            root: null,
            rootMargin: '-20% 0px -60% 0px', // Trigger when section is in the top/middle of viewport
            threshold: 0,
        };

        const observerCallback: IntersectionObserverCallback = (entries) => {
            if (isClickScrolling.current) return;
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    setActiveId(entry.target.id);
                }
            });
        };

        const observer = new IntersectionObserver(observerCallback, observerOptions);

        items.forEach((item) => {
            const element = document.getElementById(item.id);
            if (element) {
                observer.observe(element);
            }
        });

        // Set initial active ID to the first item just in case we are at the top
        if (!activeId) {
            const firstElement = document.getElementById(items[0].id);
            if (firstElement) {
                const rect = firstElement.getBoundingClientRect();
                if (rect.top >= 0 && rect.top <= window.innerHeight) {
                    setActiveId(items[0].id);
                }
            }
        }

        return () => observer.disconnect();
    }, [items, activeId]);

    // Auto-scroll active item into center of horizontal TOC
    useEffect(() => {
        if (activeId && scrollContainerRef.current) {
            const activeElement = itemRefs.current[activeId];
            if (activeElement) {
                activeElement.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
            }
        }
    }, [activeId]);

    const scrollToId = (id: string, e: React.MouseEvent) => {
        e.preventDefault();
        const element = document.getElementById(id);
        if (element) {
            isClickScrolling.current = true;
            if (scrollTimeoutRef.current !== null) {
                window.clearTimeout(scrollTimeoutRef.current);
            }

            // Get navbar absolute height typically ~ 80px, adjusting offset so the navbar doesn't cover heading
            const offset = 100;
            const bodyRect = document.body.getBoundingClientRect().top;
            const elementRect = element.getBoundingClientRect().top;
            const elementPosition = elementRect - bodyRect;
            const offsetPosition = elementPosition - offset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
            // eagerly set active
            setActiveId(id);

            scrollTimeoutRef.current = window.setTimeout(() => {
                isClickScrolling.current = false;
                scrollTimeoutRef.current = null;
            }, 1000);
        }
    };

    const scrollByAmount = (offset: number) => {
        if (scrollContainerRef.current) {
            scrollContainerRef.current.scrollBy({ left: offset, behavior: 'smooth' });
        }
    };

    if (items.length <= 1) return null;

    return (
        <aside
            className={cn(
                "fixed bottom-6 w-full max-w-[100vw] left-1/2 -translate-x-1/2 z-40 flex justify-center transition-all duration-500 ease-in-out px-4",
                isVisible ? "translate-y-0 opacity-100" : "translate-y-12 opacity-0 pointer-events-none",
                className
            )}
        >
            <nav
                className="bg-background/90 backdrop-blur-xl border border-border shadow-lg shadow-black/5 rounded-full p-1.5 max-w-full flex items-center gap-1"
                aria-label="Table of Contents"
            >
                {canScrollLeft && (
                    <button
                        onClick={() => scrollByAmount(-200)}
                        className="p-2 rounded-full hover:bg-muted text-muted-foreground transition-colors shrink-0 outline-none focus-visible:ring-2 focus-visible:ring-primary"
                        aria-label="Scroll left"
                    >
                        <ChevronLeft className="w-4 h-4" />
                    </button>
                )}

                <ul
                    ref={scrollContainerRef}
                    onScroll={checkScroll}
                    className="flex items-center gap-1 overflow-x-auto overflow-y-hidden scroll-smooth w-full px-1 py-1 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
                >
                    {items.map((item) => {
                        const isActive = activeId === item.id;
                        return (
                            <li
                                key={item.id}
                                ref={(el) => {
                                    itemRefs.current[item.id] = el;
                                }}
                                className="shrink-0 group"
                            >
                                <a
                                    href={`#${item.id}`}
                                    onClick={(e) => scrollToId(item.id, e)}
                                    className={cn(
                                        "flex items-center justify-center px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 whitespace-nowrap",
                                        isActive
                                            ? "bg-primary text-primary-foreground shadow-sm scale-105"
                                            : "text-muted-foreground hover:text-foreground hover:bg-muted/60"
                                    )}
                                >
                                    {item.title}
                                </a>
                            </li>
                        );
                    })}
                </ul>

                {canScrollRight && (
                    <button
                        onClick={() => scrollByAmount(200)}
                        className="p-2 rounded-full hover:bg-muted text-muted-foreground transition-colors shrink-0 outline-none focus-visible:ring-2 focus-visible:ring-primary"
                        aria-label="Scroll right"
                    >
                        <ChevronRight className="w-4 h-4" />
                    </button>
                )}
            </nav>
        </aside>
    );
};
