import type { Product, Promotion } from "../../data/types";
import { SimpleCarousel } from "@/components/ui/simple-carousel";
import { cn } from "@/lib/utils";
import { ProductImageCard } from "./ProductImageCard";

interface ProductCarouselProps {
    products: Product[];
    promotions: Promotion[];
    className?: string;
    rows?: 1 | 2;
}

export const ProductCarousel: React.FC<ProductCarouselProps> = ({ products, promotions, className, rows = 1 }) => {
    const getPromotionForProduct = (product: Product) => {
        return promotions.find(p => p.eligibleProducts?.includes(product.id));
    };

    if (products.length === 0) return null;

    return (
        <SimpleCarousel className={cn(className)} rows={rows}>
            {products.map(product => (
                <div key={product.id} className="snap-center md:snap-start shrink-0 first:pl-0 md:first:pl-0 w-[75vw] md:w-[280px]">
                    <ProductImageCard
                        product={product}
                        promotion={getPromotionForProduct(product)}
                    />
                </div>
            ))}
        </SimpleCarousel>
    );
};
