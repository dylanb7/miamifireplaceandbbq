import React from 'react';
import { Link, useLocation, getRouteApi } from "@tanstack/react-router";
import { Phone, Facebook, Instagram, MapPin } from "lucide-react";
import { Logo } from "./Logo";
import { ModeToggle } from "./mode-toggle";
import { isActive } from "@/data/navigation";
import { BRAND_EMAIL } from "@/data/brand-info";

const rootRoute = getRouteApi('__root__');

export const DesktopHeader: React.FC<{ visible: boolean }> = ({ visible }) => {
    const location = useLocation();
    const { navigation: navigationStructure } = rootRoute.useLoaderData();

    // Sliding Pill Logic
    const [isMounted, setIsMounted] = React.useState(false);
    const [pillStyle, setPillStyle] = React.useState({ left: 0, top: 0, width: 0, height: 0, opacity: 0 });
    const navContainerRef = React.useRef<HTMLDivElement>(null);
    const navRefs = React.useRef<Map<string, HTMLElement>>(new Map());

    const movePillTo = (name: string) => {
        requestAnimationFrame(() => {
            const el = navRefs.current.get(name);
            if (el && navContainerRef.current) {
                const containerRect = navContainerRef.current.getBoundingClientRect();
                const elRect = el.getBoundingClientRect();
                setPillStyle({
                    left: elRect.left - containerRect.left,
                    top: elRect.top - containerRect.top,
                    width: elRect.width,
                    height: elRect.height,
                    opacity: 1,
                });
            }
        });
    };

    const handleMouseEnter = (name: string) => {
        movePillTo(name);
    };

    const resetPill = () => {
        const activeItem = navigationStructure.find(item => isActive(item, location.pathname));
        if (activeItem) {
            movePillTo(activeItem.name);
        } else {
            setPillStyle((prev) => ({ ...prev, opacity: 0 }));
        }
    };

    React.useEffect(() => {
        setIsMounted(true);
        resetPill();
        // Recalculate on resize
        window.addEventListener('resize', resetPill);
        return () => window.removeEventListener('resize', resetPill);
    }, [location.pathname, visible]);

    return (
        <header
            className={`hidden md:block fixed top-0 z-40 w-full transition-all duration-300 ${visible ? "translate-y-0" : "-translate-y-full"}`}
        >
            {/* Top Contact Bar */}
            <div className="bg-neutral text-neutral-content py-1.5 px-4 text-xs lg:text-sm font-medium tracking-wide">
                <div className="container mx-auto flex justify-between items-center max-w-full">
                    <div className="flex items-center gap-6">
                        <a href="https://maps.google.com" target="_blank" rel="noopener noreferrer" className="hover:text-primary-foreground transition-colors flex items-center gap-1.5">
                            <MapPin size={14} /> 9621 S Dixie Hwy, Miami, FL 33156
                        </a>
                    </div>
                    <div className="flex items-center gap-6">
                        <a href={`mailto:${BRAND_EMAIL}`} className="hover:text-primary-foreground transition-colors flex items-center gap-1.5 hidden lg:flex">
                            {BRAND_EMAIL}
                        </a>
                        <a href="tel:3056663312" className="hover:text-primary-foreground transition-colors flex items-center gap-1.5 text-primary font-semibold">
                            <Phone size={14} /> (305) 666-3312
                        </a>
                    </div>
                </div>
            </div>

            <nav className="bg-primary/95 backdrop-blur-md shadow-md border-b border-white/10 text-primary-foreground relative">
                <div className="container mx-auto flex items-center justify-between py-4 px-4 max-w-full">
                    {/* Logo */}
                    <div className="flex-shrink-0">
                        <Link to="/" className="text-2xl font-bold tracking-tighter hover:opacity-80 transition-opacity">
                            <Logo />
                        </Link>
                    </div>

                    {/* Desktop Navigation */}
                    <div className="flex gap-1 relative" ref={navContainerRef} onMouseLeave={resetPill}>
                        {/* Wrapper for relative positioning of the pill */}
                        <div
                            className="absolute bg-accent rounded-md transition-all duration-300 ease-out -z-0 pointer-events-none"
                            style={{
                                left: pillStyle.left,
                                top: pillStyle.top,
                                width: pillStyle.width,
                                height: pillStyle.height,
                                opacity: pillStyle.opacity,
                            }}
                        />

                        {navigationStructure.map((item) => (
                            <div
                                key={item.name}
                                onMouseEnter={() => handleMouseEnter(item.name)}
                                className="group relative z-10 hover:z-50 flex items-center justify-center outline-none"
                            >
                                {item.subLinks && item.subLinks.length > 0 ? (
                                    <>
                                        <Link
                                            to={item.path || "#"}
                                            ref={(el) => {
                                                if (el) navRefs.current.set(item.name, el);
                                                else navRefs.current.delete(item.name);
                                            }}
                                            className={`peer relative z-50 flex items-center justify-center gap-1.5 px-4 py-2 transition-all duration-200 outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 tracking-wide group/trigger ${isActive(item, location.pathname) ? `${isMounted ? "bg-accent/50" : "bg-accent"} text-foreground rounded-md group-hover:bg-popover group-hover:rounded-b-none group-hover:rounded-t-[1.25rem]` : "text-primary-foreground group-hover:text-foreground group-hover:bg-popover group-hover:rounded-b-none group-hover:rounded-t-[1.25rem] rounded-md"}`}
                                        >
                                            {item.name}
                                            <div className="transition-transform duration-300 group-hover:-rotate-180 opacity-70">
                                                <svg width="10" height="6" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                                            </div>
                                        </Link>

                                        {/* Dropdown Encapsulating Card that entirely envelopes the trigger */}
                                        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-max opacity-0 invisible scale-[0.95] origin-top group-hover:opacity-100 group-hover:visible group-hover:scale-100 transition-all duration-200 ease-out z-40 pointer-events-none drop-shadow-2xl">

                                            {/* Visual Background (Solid Color) extending fully to envelop the button */}
                                            <div className="absolute inset-0 bg-popover rounded-[1.25rem] pointer-events-none border border-border"></div>

                                            {/* Content Layout */}
                                            <div className="relative z-10 flex flex-col min-w-[240px] mt-[40px] pointer-events-auto">
                                                {/* Divider */}
                                                <div className="w-full px-4">
                                                    <div className="w-full border-t border-border/40"></div>
                                                </div>

                                                {/* Top padding */}
                                                <div className="w-full px-2 pb-2 pt-2">
                                                    {item.subLinks.map(subLink => {
                                                        const active = isActive(subLink, location.pathname);
                                                        return (
                                                            <Link
                                                                key={subLink.name}
                                                                to={subLink.path!}
                                                                className="w-full text-left outline-none group/link focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 rounded-xl"
                                                            >
                                                                <div className={`transition-all duration-200 w-full px-4 py-2.5 text-sm rounded-xl flex items-center gap-3 ${active ? "text-primary font-medium bg-primary/10" : "text-popover-foreground/80 hover:text-foreground hover:bg-neutral/10"}`}>
                                                                    <div className={`w-1.5 h-1.5 rounded-full transition-colors ${active ? "bg-primary" : "bg-transparent group-hover/link:bg-primary/50"}`}></div>
                                                                    {subLink.name}
                                                                </div>
                                                            </Link>
                                                        );
                                                    })}
                                                </div>
                                            </div>
                                        </div>
                                    </>
                                ) : (
                                    <Link
                                        to={item.path!}
                                        ref={(el) => {
                                            if (el) navRefs.current.set(item.name, el);
                                            else navRefs.current.delete(item.name);
                                        }}
                                        className={`relative z-10 px-4 py-2 rounded-md transition-colors outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 tracking-wide text-center flex items-center justify-center ${isActive(item, location.pathname) ? `${isMounted ? "bg-accent/50" : "bg-accent"} text-foreground` : "text-primary-foreground hover:text-foreground"}`}
                                    >
                                        {item.name}
                                    </Link>
                                )}
                            </div>
                        ))}
                    </div>

                    <div className="flex items-center gap-2">
                        {/* Socials & Contact */}
                        <div className="hidden xl:flex gap-4 items-center pr-4 text-primary-foreground">
                            <a href="tel:+13056663312" className="hover:text-primary hover:underline flex items-center gap-1">
                                <Phone size={18} />
                                <span className="sr-only">Call Us</span>
                            </a>
                            <a href="#" className="hover:text-primary hover:scale-110 transition-transform">
                                <Facebook size={20} />
                                <span className="sr-only">Facebook</span>
                            </a>
                            <a href="https://www.instagram.com/miami_fireplaces_and_bbq" className="hover:text-primary hover:scale-110 transition-transform">
                                <Instagram size={20} />
                                <span className="sr-only">Instagram</span>
                            </a>
                        </div>

                        {/* Mode Toggle */}
                        <div className="hidden md:block">
                            <ModeToggle />
                        </div>
                    </div>
                </div>
            </nav>
        </header>
    );
};
