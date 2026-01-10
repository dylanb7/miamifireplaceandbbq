import { useState } from "react";
import type { Product, Promotion } from "../../data/types";
import { ProductCarousel } from "./ProductCarousel";
import { ProductGrid } from "./ProductGrid";
import { PromotionBanner } from "../PromotionBanner";
import { Button } from "@/components/ui/button";
import { LayoutGrid, LayoutList } from "lucide-react";

interface BrandSectionProps {
    brandName: string;
    products: Product[];
    promotions: Promotion[];
    simpleLayout?: boolean;
}

export const BrandSection: React.FC<BrandSectionProps> = ({ brandName, products, promotions, simpleLayout }) => {
    const [isExpanded, setIsExpanded] = useState(false);

    // Filter Promotions for header
    const brandPromotion = promotions.find(p => p.eligibleBrands?.includes(brandName));

    // Heuristic: If more than 4 products, scrolling is likely needed, so show View All option
    const showViewAll = !simpleLayout && products.length > 4;

    if (products.length === 0) return null;

    return (
        <section className="py-6 space-y-4">
            <div className="flex items-center justify-between gap-3 px-1 md:px-0">
                <div className="flex items-center gap-3 flex-1">
                    <h3 className="text-2xl font-bold tracking-tight">{brandName}</h3>
                    {brandPromotion && <PromotionBanner promotion={brandPromotion} compact className="hidden md:flex" />}
                    <div className="h-px bg-border flex-1" />
                </div>

                {showViewAll && (
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setIsExpanded(!isExpanded)}
                        className="text-muted-foreground hover:text-primary transition-colors flex items-center gap-1"
                    >
                        {isExpanded ? (
                            <>
                                <LayoutList className="h-4 w-4" />
                                Show Less
                            </>
                        ) : (
                            <>
                                <LayoutGrid className="h-4 w-4" />
                                View All
                            </>
                        )}
                    </Button>
                )}
            </div>
            {/* Mobile Banner below header if present */}
            {brandPromotion && <div className="md:hidden px-1"><PromotionBanner promotion={brandPromotion} className="w-full" /></div>}

            {simpleLayout || isExpanded ? (
                <ProductGrid products={products} promotions={promotions} className="px-4 md:px-0" />
            ) : (
                <ProductCarousel products={products} promotions={promotions} />
            )}
        </section>
    );
};
