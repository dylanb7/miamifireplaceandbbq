import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Link } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";

const HOOKS = [
    { text: "Outdoor Kitchen", image: "/images/products/outdoor-kitchens/Cascade-Group.jpg", link: "/products/$type", params: { type: "outdoor-kitchens" } },
    { text: "Living Space", image: "/images/products/fireplaces/tc-architectural-series.jpg", link: "/products/$type", params: { type: "fireplaces" } },
    { text: "Backyard", image: "/images/products/grills/2xl-big-green-egg.jpg", link: "/products/$type", params: { type: "grills" } },
    { text: "Patio", image: "/images/products/fireplaces/tc-tc42-outdoor.jpg", link: "/products/$type", params: { type: "fireplaces" } }
];

const CATEGORIES = [
    { name: "Fireplaces", type: "fireplaces" },
    { name: "Grills", type: "grills" },
    { name: "Outdoor Kitchens", type: "outdoor-kitchens" },
];

export function HeroOption2() {
    const [index, setIndex] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setIndex((prev) => (prev + 1) % HOOKS.length);
        }, 4000);
        return () => clearInterval(timer);
    }, []);

    const activeHook = HOOKS[index];

    return (
        <section className="relative min-h-[90vh] mt-[104px] w-full flex items-center justify-center overflow-hidden bg-zinc-950">

            <AnimatePresence mode="popLayout" initial={false}>
                <motion.div
                    key={index}
                    className="absolute inset-0 z-0 opacity-50"
                    initial={{ scale: 1.05, opacity: 0 }}
                    animate={{ scale: 1, opacity: 0.5 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 1.5, ease: "easeInOut" }}
                    style={{
                        backgroundImage: `url(${activeHook.image})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                    }}
                />
            </AnimatePresence>

            {/* Dark gradient overlay for text legibility */}
            <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/60 to-transparent z-10 pointer-events-none" />

            {/* Content */}
            <div className="relative z-20 container mx-auto px-4 flex flex-col items-center justify-center text-center">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    className="max-w-5xl space-y-8 flex flex-col items-center"
                >
                    <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight text-white leading-tight flex flex-col items-center justify-center">
                        <span className="block text-center w-full">Transform Your</span>
                        <div className="relative inline-block mt-2 text-center text-primary overflow-hidden">
                            {/* Invisible placeholder sets the max width dynamically, preventing cut-offs and layout shifts */}
                            <span className="opacity-0 italic pointer-events-none select-none block leading-[1.3] px-2" aria-hidden="true">Outdoor Kitchen</span>
                            <AnimatePresence mode="popLayout" initial={false}>
                                <motion.span
                                    key={index}
                                    initial={{ y: 80, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    exit={{ y: -80, opacity: 0 }}
                                    transition={{ duration: 0.6, ease: "anticipate" }}
                                    className="absolute inset-x-0 top-0 bottom-0 flex items-center justify-center italic text-center w-full"
                                >
                                    {activeHook.text}
                                </motion.span>
                            </AnimatePresence>
                        </div>
                    </h1>

                    <p className="text-lg md:text-2xl text-zinc-300 max-w-2xl mx-auto font-light leading-relaxed text-center">
                        Curated collections of high-end fireplaces, custom outdoor kitchens, and luxury grills for the modern home.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-6 justify-center items-center pt-8">
                        <Button size="lg" className="rounded-full px-8 h-14 text-lg bg-primary hover:bg-primary/90 text-primary-foreground shadow-[0_0_30px_-5px_hsl(var(--primary))] transition-shadow hover:shadow-[0_0_40px_0_hsl(var(--primary))]" asChild>
                            <a href="#showrooms">
                                Visit Showroom
                            </a>
                        </Button>
                    </div>

                    <div className="flex flex-wrap gap-4 sm:gap-6 justify-center items-center pt-12">
                        {CATEGORIES.map((cat) => (
                            <Link
                                key={cat.type}
                                to="/products/$type"
                                params={{ type: cat.type }}
                                className="group relative flex items-center justify-center gap-4 px-8 py-4 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all duration-300 w-64 backdrop-blur-sm overflow-hidden"
                            >
                                <div className="relative z-10 flex items-center justify-center gap-2">

                                    <span className="text-white/70 group-hover:text-primary transition-colors duration-300 uppercase tracking-widest text-[10px] sm:text-xs font-bold leading-none">
                                        {cat.name}
                                    </span>
                                </div>
                                <div className="absolute inset-x-0 bottom-0 h-0.5 bg-primary/50 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                                <div className="absolute inset-0 rounded-full bg-primary/10 opacity-0 group-hover:opacity-100 blur-xl transition-opacity pointer-events-none" />
                            </Link>
                        ))}
                    </div>
                </motion.div>
            </div>

            {/* Decorative bottom gradient */}
            <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-zinc-950 to-transparent z-10 pointer-events-none" />
        </section>
    );
}
