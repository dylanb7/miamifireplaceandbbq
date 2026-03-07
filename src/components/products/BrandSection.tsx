import type { Product, Promotion } from "../../data/types";
import { ProductGrid } from "./ProductGrid";
import { PromotionBanner } from "../PromotionBanner";

interface BrandSectionProps {
    brandName: string;
    products: Product[];
    promotions: Promotion[];
    hideHeader?: boolean;
}

export const BrandSection: React.FC<BrandSectionProps> = ({ brandName, products, promotions, hideHeader }) => {
    // Filter Promotions for header
    const brandPromotion = promotions.find(p => p.eligibleBrands?.includes(brandName));

    if (products.length === 0) return null;

    return (
        <section className="py-6 space-y-4">
            {!hideHeader && (
                <div className="flex items-center justify-between gap-3 px-1 md:px-0">
                    <div className="flex items-center gap-3 flex-1">
                        <h3 className="text-2xl font-bold tracking-tight">{brandName}</h3>
                        {brandPromotion && <PromotionBanner promotion={brandPromotion} compact className="hidden md:flex" />}
                        <div className="h-px bg-border flex-1" />
                    </div>
                </div>
            )}
            {/* Mobile Banner below header if present */}
            {brandPromotion && <div className="md:hidden px-1"><PromotionBanner promotion={brandPromotion} className="w-full" /></div>}

            <ProductGrid products={products} promotions={promotions} className="px-4 md:px-0" />
        </section>
    );
};
