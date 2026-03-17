import { Card } from "@/components/ui/card";
import { Link } from "@tanstack/react-router";
import { SimpleCarousel } from "@/components/ui/simple-carousel";
import { cn } from "@/lib/utils";

const slugify = (text: string) => text.toLowerCase().replace(/[^\w ]+/g, '').replace(/ +/g, '-');

import { brands } from "@/data/brands";

export function FeaturedBrands() {
    return (
        <section className="py-20 bg-background border-t">
            <div className="container mx-auto px-4">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-bold tracking-tight mb-4">Our Premium Partners</h2>
                    <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                        We work with the industry's leading brands to bring you the best in outdoor living.
                    </p>
                </div>

                <SimpleCarousel
                    rows={2}
                    scrollContainerClassName="auto-cols-[140px] md:auto-cols-[200px] opacity-80"
                >
                    {brands.map((brand) => (
                        <Link
                            key={brand.name}
                            to="/brands/$brandId"
                            params={{ brandId: slugify(brand.name) }}
                            className="w-full snap-start"
                        >
                            <Card className={cn(
                                "w-full h-24 md:h-32 flex items-center justify-center p-4 md:p-6 grayscale hover:grayscale-0 transition-all duration-300 hover:shadow-md hover:scale-105",
                                brand.whiteBackgroundOnly !== false && !brand.invertInDarkMode ? "bg-white" : "bg-card"
                            )}>
                                {brand.logo ? (
                                    <img
                                        src={brand.logo}
                                        alt={brand.name}
                                        className={cn(
                                            "max-h-12 md:max-h-16 w-auto object-contain transition-all",
                                            brand.invertInDarkMode && "dark:brightness-0 dark:invert"
                                        )}
                                    />
                                ) : (
                                    <span className="font-bold text-center text-sm md:text-base">
                                        {brand.name}
                                    </span>
                                )}
                            </Card>
                        </Link>
                    ))}
                </SimpleCarousel>
            </div>
        </section>
    );
}
