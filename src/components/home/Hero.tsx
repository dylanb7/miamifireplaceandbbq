import { Button } from "@/components/ui/button";
import { Link } from "@tanstack/react-router";
import { ChefHat, Flame } from "lucide-react";

export function Hero() {
    return (
        <section className="relative min-h-[85vh] pt-32 pb-16 w-full flex items-center justify-center overflow-hidden bg-black">
            <div
                className="absolute inset-0 z-0 opacity-70"
                style={{
                    backgroundImage: 'url("https://images.unsplash.com/photo-1596489392276-88d447a195d8?q=80&w=2974&auto=format&fit=crop")',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center'
                }}
            />
            {/* Neutral overlay */}
            <div className="absolute inset-0 bg-black/30 z-10" />

            <div className="relative z-20 container mx-auto px-4 text-center animate-in fade-in slide-in-from-bottom-8 duration-1000 flex flex-col items-center">
                {/* Glassmorphic Container */}
                <div className="max-w-4xl p-8 md:p-12 rounded-3xl bg-black/20 backdrop-blur-md border border-white/10 shadow-2xl space-y-8">
                    <div className="space-y-4">
                        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tighter text-white drop-shadow-lg">
                            Elevate Your <span className="text-primary italic">Outdoor Living</span>
                        </h1>
                        <p className="text-lg md:text-2xl text-white/90 max-w-2xl mx-auto drop-shadow-md font-light leading-relaxed">
                            The ultimate destination for premium hot tubs, outdoor kitchens, and custom fireplaces.
                        </p>
                    </div>

                    {/* Main CTA */}
                    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                        <Button size="lg" className="rounded-full px-8 text-lg h-12 shadow-lg shadow-primary/20" asChild>
                            <a href="#showrooms">Visit Showroom</a>
                        </Button>
                        <Button size="lg" variant="outline" className="rounded-full px-8 text-lg h-12 text-white border-white/20 hover:bg-white/10 hover:text-white" asChild>
                            <a href="tel:3055550123">Call Us Today</a>
                        </Button>
                    </div>

                    {/* Quick Shop Grid */}
                    <div className="pt-8 border-t border-white/10 w-full">
                        <p className="text-sm uppercase tracking-widest text-white/60 mb-6 font-semibold">Explore Collections</p>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {[
                                { name: "Grills", link: "/products/$type", params: { type: "grills" }, icon: ChefHat },
                                { name: "Fireplaces", link: "/products/$type", params: { type: "fireplaces" }, icon: Flame },
                                { name: "Kitchens", link: "/products/outdoor-kitchens", params: { type: "outdoor-kitchens" }, icon: ChefHat }
                            ].map((item) => (
                                <Link
                                    key={item.name}
                                    to={item.link}
                                    params={item.params}
                                    className="group flex flex-col items-center justify-center p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-colors border border-white/5 hover:border-white/20"
                                >
                                    <item.icon className="w-6 h-6 text-white mb-2 opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all" />
                                    <span className="text-sm font-medium text-white group-hover:text-primary transition-colors">{item.name}</span>
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
