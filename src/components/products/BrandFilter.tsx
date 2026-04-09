import type { BrandData } from "@/data/brands";
import { cn } from "@/lib/utils";
import { SimpleCarousel } from "@/components/ui/simple-carousel";
import { Link, getRouteApi } from "@tanstack/react-router";

const rootRoute = getRouteApi('__root__');

interface BrandFilterProps {
    availableBrands: string[];
    selectedBrand: string | undefined;
    getBrandLink: (brand: string | undefined) => { to: string; params: any };
    className?: string;
}

export function BrandFilter({ availableBrands, selectedBrand, getBrandLink, className }: BrandFilterProps) {
    if (availableBrands.length === 0) return null;

    const { brands } = rootRoute.useLoaderData();

    const activeBrands = brands.filter((b: BrandData) =>
        availableBrands.includes(b.name) ||
        (b.brandName && availableBrands.includes(b.brandName))
    );

    const knownBrandNames = brands.flatMap((b: BrandData) => [b.name, b.brandName].filter(Boolean) as string[]);
    const unknownBrands = availableBrands.filter(b => !knownBrandNames.includes(b) && b !== "Other");

    if (activeBrands.length === 0 && unknownBrands.length === 0) return null;

    return (
        <div className={cn("w-full relative", className)}>
            <div className="flex w-full items-center justify-between border-b pb-2 mb-4">
                <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Filter by Brand</h3>
                {selectedBrand && (
                    <Link
                        {...getBrandLink(undefined)}
                        className="text-sm font-medium text-muted-foreground hover:text-foreground hover:underline"
                        aria-label="Clear brand filter"
                    >
                        Clear Filter
                    </Link>
                )}
            </div>

            <SimpleCarousel
                minimalArrows
                className="-mx-4 md:mx-0 w-[calc(100%+2rem)] md:w-full"
                scrollContainerClassName="px-4 md:px-0 gap-3 pb-2"
            >
                {/* Known brands with logos */}
                {activeBrands.map((brand: BrandData) => {
                    const isSelected = selectedBrand === brand.name;
                    return (
                        <Link
                            key={brand.name}
                            {...getBrandLink(isSelected ? undefined : brand.name)}
                            aria-label={`Filter by ${brand.name}${isSelected ? ' (Currently selected)' : ''}`}
                            aria-current={isSelected ? "true" : undefined}
                            className={cn(
                                "group shrink-0 flex items-center justify-center p-1 rounded-xl border-2 transition-all w-[120px] h-[72px] overflow-hidden snap-start",
                                isSelected
                                    ? "border-primary shadow-sm ring-1 ring-primary/20"
                                    : "border-transparent hover:border-primary/30",
                                brand.whiteBackgroundOnly !== false && !brand.invertInDarkMode ? "bg-white" : "bg-card hover:bg-accent"
                            )}
                        >
                            <div className="w-full h-full flex items-center justify-center p-1">
                                <img
                                    src={brand.logo}
                                    alt={brand.name}
                                    className={cn(
                                        "max-w-full max-h-full object-contain transition-all",
                                        isSelected ? "grayscale-0 opacity-100" : "grayscale opacity-70 group-hover:grayscale-0 group-hover:opacity-100",
                                        brand.invertInDarkMode && "dark:brightness-0 dark:invert"
                                    )}
                                />
                            </div>
                        </Link>
                    )
                })}

                {/* Fallback text buttons for unknown brands */}
                {unknownBrands.map((brandName) => {
                    const isSelected = selectedBrand === brandName;
                    return (
                        <Link
                            key={brandName}
                            {...getBrandLink(isSelected ? undefined : brandName)}
                            aria-label={`Filter by ${brandName}${isSelected ? ' (Currently selected)' : ''}`}
                            aria-current={isSelected ? "true" : undefined}
                            className={cn(
                                "shrink-0 flex items-center justify-center px-4 py-2 rounded-xl border-2 transition-all font-medium whitespace-nowrap h-[72px] snap-start",
                                isSelected
                                    ? "border-primary bg-primary/10 text-primary"
                                    : "border-border hover:border-primary/50 bg-card text-foreground"
                            )}
                        >
                            {brandName}
                        </Link>
                    )
                })}
            </SimpleCarousel>
        </div>
    );
}
