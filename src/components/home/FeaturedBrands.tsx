import { Card } from "@/components/ui/card";
import { Link } from "@tanstack/react-router";
import { SimpleCarousel } from "@/components/ui/simple-carousel";

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
                    scrollContainerClassName="grid grid-rows-2 grid-flow-col gap-4 auto-cols-[140px] md:grid-rows-none md:grid-flow-row md:grid-cols-3 lg:grid-cols-5 md:gap-8 md:items-center md:items-start md:flex md:w-full md:grid opacity-80"
                >
                    {brands.map((brand) => (
                        <Link
                            key={brand.name}
                            to="/brands/$brandId"
                            params={{ brandId: slugify(brand.brandName || brand.name) }}
                            className="w-full snap-start"
                        >
                            <Card className="w-full h-24 md:h-32 flex items-center justify-center p-4 md:p-6 grayscale hover:grayscale-0 transition-all duration-300 hover:shadow-md hover:scale-105 bg-white">
                                <img
                                    src={brand.logo}
                                    alt={brand.name}
                                    className="max-h-12 md:max-h-16 w-auto object-contain"
                                />
                            </Card>
                        </Link>
                    ))}
                </SimpleCarousel>
            </div>
        </section>
    );
}
