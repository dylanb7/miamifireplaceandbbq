import type { Product, Promotion } from "../../data/types";
import { ProductCard } from "./ProductCard";
import { SimpleCarousel } from "@/components/ui/simple-carousel";
import { cn } from "@/lib/utils";

interface ProductCarouselProps {
    products: Product[];
    promotions: Promotion[];
    className?: string;
}

export const ProductCarousel: React.FC<ProductCarouselProps> = ({ products, promotions, className }) => {
    // Helper to get promotion
    const getPromotionForProduct = (product: Product) => {
        return promotions.find(p => p.eligibleProducts?.includes(product.id));
    };

    if (products.length === 0) return null;

    return (
        <SimpleCarousel className={cn(className)}>
            {products.map(product => (
                <div key={product.id} className="snap-start shrink-0 first:pl-0 md:first:pl-0 w-[280px]">
                    <ProductCard
                        product={product}
                        promotion={getPromotionForProduct(product)}
                    />
                </div>
            ))}
        </SimpleCarousel>
    );
};
