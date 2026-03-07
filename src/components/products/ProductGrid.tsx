import { cn } from "../../lib/utils";
import type { Product, Promotion } from "../../data/types";
import { ProductImageCard } from "./ProductImageCard";

interface ProductGridProps {
    products: Product[];
    promotions: Promotion[];
    className?: string;
}

export const ProductGrid: React.FC<ProductGridProps> = ({ products, promotions, className }) => {
    const getPromotionForProduct = (product: Product) => {
        return promotions.find(p => p.eligibleProducts?.includes(product.id));
    };

    if (products.length === 0) return null;

    return (
        <div className={cn(
            "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 animate-in px-2 fade-in duration-300",
            className
        )}>
            {products.map(product => (
                <div key={product.id} className="w-full">
                    <ProductImageCard
                        product={product}
                        promotion={getPromotionForProduct(product)}
                    />
                </div>
            ))}
        </div>
    );
};
