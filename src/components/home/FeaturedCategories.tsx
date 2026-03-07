import { Link } from "@tanstack/react-router";
import { ArrowRight, ChefHat, Flame } from "lucide-react";

export function FeaturedCategories() {
    return (
        <section className="py-20 md:py-32 bg-background">
            <div className="container mx-auto px-4">
                <div className="text-center mb-16 space-y-4">
                    <h2 className="text-3xl md:text-4xl font-bold tracking-tight">The Collection</h2>
                    <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                        Curated essentials for the modern patio. Discover unparalleled quality and design.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
                    {/* Outdoor Kitchens / Grills */}
                    <Link to="/products/$type" params={{ type: "grills" }} className="group relative aspect-[3/4] overflow-hidden rounded-xl bg-muted isolate">
                        <img
                            src="https://images.unsplash.com/photo-1555041469-a586c61ea9bc?q=80&w=2070&auto=format&fit=crop" // Nice BBQ/Grill image
                            alt="Grills"
                            className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-stone-900/80 via-transparent to-transparent opacity-60 transition-opacity group-hover:opacity-80" />
                        <div className="absolute bottom-0 left-0 p-8 w-full transform transition-transform duration-300 translate-y-2 group-hover:translate-y-0">
                            <ChefHat className="w-10 h-10 text-white mb-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-100" />
                            <h3 className="text-2xl font-bold text-white mb-2">Culinary</h3>
                            <p className="text-stone-300 text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-150 transform translate-y-4 group-hover:translate-y-0">
                                Professional grade grills and outdoor kitchens.
                            </p>
                            <div className="mt-4 flex items-center text-primary font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-200">
                                Shop Grills <ArrowRight className="ml-2 w-4 h-4" />
                            </div>
                        </div>
                    </Link>

                    {/* Fireplaces */}
                    <Link to="/products/$type" params={{ type: "fireplaces" }} className="group relative aspect-[3/4] overflow-hidden rounded-xl bg-muted isolate">
                        <img
                            src="https://images.unsplash.com/photo-1542826438-bd32f43d626f?q=80&w=2192&auto=format&fit=crop"
                            alt="Fireplaces"
                            className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-stone-900/80 via-transparent to-transparent opacity-60 transition-opacity group-hover:opacity-80" />
                        <div className="absolute bottom-0 left-0 p-8 w-full transform transition-transform duration-300 translate-y-2 group-hover:translate-y-0">
                            <Flame className="w-10 h-10 text-white mb-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-100" />
                            <h3 className="text-2xl font-bold text-white mb-2">Ambiance</h3>
                            <p className="text-stone-300 text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-150 transform translate-y-4 group-hover:translate-y-0">
                                Indoor and outdoor fireplaces for any season.
                            </p>
                            <div className="mt-4 flex items-center text-primary font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-200">
                                Shop Fireplaces <ArrowRight className="ml-2 w-4 h-4" />
                            </div>
                        </div>
                    </Link>
                </div>
            </div>
        </section>
    );
}
