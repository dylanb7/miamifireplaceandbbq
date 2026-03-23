import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

const CAROUSEL_ITEMS = [
    {
        id: 1,
        title: "Modern Fireplaces",
        image: "/images/products/fireplaces/tc-architectural-series.jpg",
        type: "fireplaces"
    },
    {
        id: 2,
        title: "Luxury Grills",
        image: "/images/products/grills/2xl-big-green-egg.jpg",
        type: "grills"
    },
    {
        id: 3,
        title: "Outdoor Kitchens",
        image: "/images/products/outdoor-kitchens/terrenere-outdoor-kitchen.jpg",
        type: "outdoor-kitchens"
    }
];

export function HeroOption3() {
    const [hoveredIndex, setHoveredIndex] = useState(0);

    return (
        <section className="relative min-h-[85vh] w-full bg-zinc-950 flex flex-col lg:flex-row overflow-hidden border-b border-white/5">
            {/* Left Content (40%) */}
            <div className="w-full lg:w-[40%] flex flex-col justify-center p-8 lg:p-16 xl:p-24 relative z-20 bg-zinc-950 border-r border-white/10">
                <motion.div
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="space-y-8"
                >
                    <div className="w-16 h-1 bg-primary rounded-full" />
                    <h1 className="text-5xl lg:text-7xl font-bold text-white tracking-tight leading-[1.1]">
                        Master <br/> The Art Of <br/>
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-orange-400">
                            Fire & Smoke
                        </span>
                    </h1>
                    <p className="text-xl text-zinc-400 font-light max-w-md leading-relaxed">
                        Discover unparalleled craftsmanship with our premium selection of luxury grills, bespoke fireplaces, and custom outdoor kitchens.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 pt-4">
                        <Button size="lg" className="rounded-none px-8 h-14 text-lg bg-white text-black hover:bg-zinc-200" asChild>
                            <a href="#showrooms">Visit Showroom <ArrowRight className="ml-2 w-5 h-5"/></a>
                        </Button>
                    </div>
                </motion.div>
            </div>

            {/* Right Carousel (60%) */}
            <div className="w-full lg:w-[60%] flex h-[50vh] lg:h-auto bg-black">
                {CAROUSEL_ITEMS.map((item, index) => (
                    <motion.div
                        key={item.id}
                        onHoverStart={() => setHoveredIndex(index)}
                        className="relative h-full overflow-hidden cursor-pointer group border-r border-white/10 last:border-r-0"
                        animate={{
                            flexGrow: hoveredIndex === index ? 4 : 1,
                        }}
                        transition={{ duration: 0.5, ease: [0.33, 1, 0.68, 1] }}
                        style={{ flexBasis: 0 }}
                    >
                        {/* Background Image */}
                        <motion.img
                            src={item.image}
                            className="absolute inset-0 w-full h-full object-cover"
                            animate={{
                                scale: hoveredIndex === index ? 1.05 : 1,
                                filter: hoveredIndex === index ? "brightness(1.1)" : "brightness(0.4) saturate(0.5)",
                            }}
                            transition={{ duration: 0.7, ease: "easeOut" }}
                            fetchPriority={index === 0 ? "high" : "auto"}
                        />
                        
                        {/* Gradient Overlay for text */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                        {/* Text Content */}
                        <div className="absolute bottom-8 left-8 right-8 flex justify-between items-end">
                            <motion.div
                                animate={{
                                    opacity: hoveredIndex === index ? 1 : 0,
                                    y: hoveredIndex === index ? 0 : 20,
                                }}
                                transition={{ duration: 0.4, delay: 0.1 }}
                                className="pointer-events-none"
                            >
                                <h3 className="text-3xl font-bold text-white mb-2 whitespace-nowrap">{item.title}</h3>
                                <div className="flex items-center text-primary font-medium tracking-wide">
                                    <Link to="/products/$type" params={{ type: item.type }} className="flex items-center hover:underline pointer-events-auto">
                                        Explore Collection <ArrowRight className="ml-2 w-4 h-4"/>
                                    </Link>
                                </div>
                            </motion.div>
                            
                            {/* Vertical Text when collapsed */}
                            <motion.div
                                className="absolute bottom-0 left-1/2 -translate-x-1/2 pb-8 whitespace-nowrap"
                                style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}
                                animate={{
                                    opacity: hoveredIndex === index ? 0 : 1,
                                }}
                                transition={{ duration: 0.2 }}
                            >
                                <span className="text-white/60 tracking-[0.3em] uppercase text-sm font-semibold">{item.title}</span>
                            </motion.div>
                        </div>
                    </motion.div>
                ))}
            </div>
        </section>
    );
}
