import type { Product, Promotion } from "../../data/types";
import { ProductCard } from "./ProductCard";

interface ProductGridProps {
    products: Product[];
    promotions: Promotion[];
    className?: string;
}

export const ProductGrid: React.FC<ProductGridProps> = ({ products, promotions, className }) => {
    // Helper to get promotion
    const getPromotionForProduct = (product: Product) => {
        return promotions.find(p => p.eligibleProducts?.includes(product.id));
    };

    if (products.length === 0) return null;

    return (
        <div className={`flex flex-wrap gap-4 animate-in fade-in duration-300 ${className}`}>
            {products.map(product => (
                <div key={product.id} className="w-[280px]">
                    <ProductCard
                        product={product}
                        promotion={getPromotionForProduct(product)}
                    />
                </div>
            ))}
        </div>
    );
};
