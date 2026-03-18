import { brands } from "@/data/brands";
import { cn } from "@/lib/utils";

import { Link } from "@tanstack/react-router";

interface BrandFilterProps {
    availableBrands: string[];
    selectedBrand: string | undefined;
    getBrandLink: (brand: string | undefined) => { to: string; params: any };
    className?: string;
}

export function BrandFilter({ availableBrands, selectedBrand, getBrandLink, className }: BrandFilterProps) {
    if (availableBrands.length === 0) return null;

    // Filter our known brands to only those available in the current category
    const activeBrands = brands.filter(b => 
        availableBrands.includes(b.name) || 
        (b.brandName && availableBrands.includes(b.brandName))
    );

    // Some brands might be in the products data but not in our featured brands list with logos.
    // We should include them as text-only buttons.
    const knownBrandNames = brands.flatMap(b => [b.name, b.brandName].filter(Boolean) as string[]);
    const unknownBrands = availableBrands.filter(b => !knownBrandNames.includes(b) && b !== "Other");

    if (activeBrands.length === 0 && unknownBrands.length === 0) return null;


    return (
        <div className={cn("w-full overflow-hidden relative", className)}>
            <div className="flex w-full items-center mb-3">
                <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Filter by Brand</h3>
                {selectedBrand && (
                    <Link
                        {...getBrandLink(undefined)}
                        className="ml-auto text-sm text-primary hover:underline"
                    >
                        Clear Filter
                    </Link>
                )}
            </div>

            <div className="flex overflow-x-auto pb-4 -mx-4 px-4 sm:mx-0 sm:px-0 hide-scrollbar gap-3">
                {/* Known brands with logos */}
                {activeBrands.map((brand) => {
                    const isSelected = selectedBrand === brand.name;
                    return (
                        <Link
                            key={brand.name}
                            {...getBrandLink(isSelected ? undefined : brand.name)}
                            className={cn(
                                "group flex-shrink-0 flex items-center justify-center p-1 rounded-xl border-2 transition-all w-[120px] h-[72px] overflow-hidden",
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
                            className={cn(
                                "flex-shrink-0 flex items-center justify-center px-4 py-2 rounded-xl border-2 transition-all font-medium whitespace-nowrap h-[72px]",
                                isSelected
                                    ? "border-primary bg-primary/10 text-primary"
                                    : "border-border hover:border-primary/50 bg-card text-foreground"
                            )}
                        >
                            {brandName}
                        </Link>
                    )
                })}
            </div>
        </div>
    );
}
