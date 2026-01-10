import { Footer } from "./Footer";
import { Facebook, Instagram, Phone, Menu } from "lucide-react";
import { Logo } from "./Logo";
import { ModeToggle } from "./mode-toggle";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import {
    NavigationMenu,
    NavigationMenuContent,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    NavigationMenuTrigger,
    navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { Toaster } from "@/components/ui/sonner"
import { useIsMobile } from "@/hooks/use-mobile";
import { Link, useLocation } from "@tanstack/react-router";

// ... (existing imports)

import { products } from "@/data/products";

type NavigationItem = {
    name: string;
    path?: string;
    subLinks?: NavigationItem[];
};

// Start with static Home link
const baseNavigation: NavigationItem[] = [
    {
        name: "Home",
        path: "/",
    },
];

// Helper to slugify text
const slugify = (text: string) => text.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '');

// Generate product navigation dynamically
const productGroups = products.reduce((acc, product) => {
    if (!acc[product.category]) {
        acc[product.category] = new Set();
    }
    if (product.brand) {
        acc[product.category].add(product.brand);
    }
    return acc;
}, {} as Record<string, Set<string>>);

const productNavigation: NavigationItem[] = Object.entries(productGroups).map(([category, brands]) => ({
    name: category,
    path: `/products/${slugify(category)}`,
    subLinks: Array.from(brands).map(brand => ({
        name: brand,
        path: `/products/${slugify(category)}/${slugify(brand)}`
    }))
}));

const navigationStructure: NavigationItem[] = [
    ...baseNavigation,
    ...productNavigation
];

const PageLayout: React.FC<{ children: React.ReactNode, hideFooterContact?: boolean }> = ({ children, hideFooterContact = false }) => {
    const isMobile = useIsMobile();
    const location = useLocation();

    const isActive = (item: NavigationItem) => {
        if (item.path && location.pathname === item.path) return true;
        if (item.subLinks) {
            return item.subLinks.some(sub => sub.path && location.pathname === sub.path);
        }
        return false;
    };

    return (
        <div className="bg-background w-full relative z-10 flex min-h-svh flex-col overflow-x-hidden">
            <nav className="sticky top-0 z-50 w-full border-b backdrop-blur-sm bg-primary text-primary-foreground shadow-md">
                <div className="container mx-auto flex items-center justify-between py-2 px-4 max-w-full">
                    {/* Logo - Always Visible */}
                    <div className="flex-shrink-0">
                        <Logo />
                    </div>

                    {/* Desktop Navigation - Hidden on Mobile */}
                    <div className="hidden md:block">
                        <NavigationMenu className="transition-all duration-300" viewport={isMobile}>
                            <NavigationMenuList className="flex-wrap">
                                {navigationStructure.map((item) => (
                                    <NavigationMenuItem key={item.name}>
                                        {item.subLinks && item.subLinks.length > 1 ? (
                                            <>
                                                <NavigationMenuTrigger
                                                    className={`text-primary-foreground hover:text-white hover:bg-white/10 hover:underline hover:underline-offset-4 bg-transparent focus:bg-white/10 focus:text-white ${isActive(item) ? "bg-white/20 font-bold" : ""}`}
                                                    onClick={() => item.path && (window.location.href = item.path)}
                                                >
                                                    {item.path ? (
                                                        <Link to={item.path} className="text-inherit hover:no-underline">{item.name}</Link>
                                                    ) : item.name}
                                                </NavigationMenuTrigger>
                                                <NavigationMenuContent>
                                                    <ul className="flex flex-col w-[300px] gap-1 p-2">
                                                        {item.subLinks.map((subLink) => (
                                                            <li key={subLink.name}>
                                                                <NavigationMenuLink asChild>
                                                                    <Link
                                                                        to={subLink.path!}
                                                                        activeProps={{ className: "bg-accent text-accent-foreground font-medium" }}
                                                                        className="block select-none rounded-md p-2 text-sm leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                                                                    >
                                                                        {subLink.name}
                                                                    </Link>
                                                                </NavigationMenuLink>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </NavigationMenuContent>
                                            </>
                                        ) : item.path ? (
                                            <NavigationMenuLink asChild>
                                                <Link
                                                    to={item.path}
                                                    className={`group inline-flex h-9 w-max items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-[color,box-shadow] outline-none ${isActive(item) ? "bg-white/20 font-bold" : ""} text-primary-foreground hover:text-white hover:bg-white/10 hover:underline hover:underline-offset-4 bg-transparent focus:bg-white/10 focus:text-white`}
                                                >
                                                    {item.name}
                                                </Link>
                                            </NavigationMenuLink>
                                        ) : (
                                            <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                                                {item.name}
                                            </NavigationMenuLink>
                                        )}
                                    </NavigationMenuItem>
                                ))}
                            </NavigationMenuList>
                        </NavigationMenu>
                    </div>

                    <div className="flex items-center gap-2">
                        {/* Socials & Contact - Integrated (Desktop Only to save space on mobile) */}
                        <div className="hidden lg:flex gap-4 items-center pr-4 text-primary-foreground">
                            <a href="tel:+13056663312" className="hover:text-white hover:underline flex items-center gap-1">
                                <Phone size={18} />
                                <span className="inline text-sm">305-666-3312</span>
                            </a>
                            <a href="#" className="hover:text-white hover:scale-110 transition-transform">
                                <Facebook size={20} />
                                <span className="sr-only">Facebook</span>
                            </a>
                            <a href="https://www.instagram.com/miami_fireplaces_and_bbq" className="hover:text-white hover:scale-110 transition-transform">
                                <Instagram size={20} />
                                <span className="sr-only">Instagram</span>
                            </a>
                        </div>

                        {/* Mode Toggle */}
                        <div className="hidden md:block">
                            <ModeToggle />
                        </div>

                        {/* Mobile Menu Trigger - Visible on Mobile */}
                        <div className="md:hidden">
                            <Sheet>
                                <SheetTrigger asChild>
                                    <Button variant="ghost" size="icon" className="text-primary-foreground hover:bg-white/20 hover:text-white">
                                        <Menu size={24} />
                                        <span className="sr-only">Open Menu</span>
                                    </Button>
                                </SheetTrigger>
                                <SheetContent side="left" className="w-[300px] sm:w-[400px]">
                                    <SheetHeader className="mb-6">
                                        <SheetTitle className="text-left"><Logo variant="sheet" /></SheetTitle>
                                    </SheetHeader>
                                    <nav className="flex flex-col gap-4 flex-1">
                                        {navigationStructure.map((item) => (
                                            <div key={item.name} className="flex flex-col">
                                                {item.path ? (
                                                    <Link
                                                        to={item.path}
                                                        activeProps={{ className: "bg-secondary/10 text-secondary" }}
                                                        className="text-lg font-medium py-2 px-4 rounded-md transition-colors hover:bg-muted"
                                                    >
                                                        {item.name}
                                                    </Link>
                                                ) : (
                                                    <div className="flex flex-col">
                                                        <div className="text-lg font-medium py-2 px-4 text-muted-foreground">{item.name}</div>
                                                        <div className="pl-4 flex flex-col border-l ml-4 mt-1 gap-1">
                                                            {item.subLinks?.map(sub => (
                                                                <Link
                                                                    key={sub.name}
                                                                    to={sub.path!}
                                                                    activeProps={{ className: "text-secondary font-semibold" }}
                                                                    className="text-base py-1 px-4 rounded-md transition-colors text-muted-foreground hover:text-foreground"
                                                                >
                                                                    {sub.name}
                                                                </Link>
                                                            ))}
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </nav>
                                    <div className="mt-auto border-t pt-4">
                                        <div className="flex items-center justify-between px-4 pb-8 pt-2">
                                            <div className="flex gap-4">
                                                <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                                                    <Facebook size={20} />
                                                    <span className="sr-only">Facebook</span>
                                                </a>
                                                <a href="https://www.instagram.com/miami_fireplaces_and_bbq" className="text-muted-foreground hover:text-primary transition-colors">
                                                    <Instagram size={20} />
                                                    <span className="sr-only">Instagram</span>
                                                </a>
                                            </div>
                                            <ModeToggle />
                                        </div>
                                    </div>
                                </SheetContent>
                            </Sheet>
                        </div>
                    </div>
                </div>
            </nav>

            <main className="flex-1">
                {children}
            </main>
            <Footer showContactForm={!hideFooterContact} />
            <Toaster />
        </div>
    );
}

export default PageLayout;