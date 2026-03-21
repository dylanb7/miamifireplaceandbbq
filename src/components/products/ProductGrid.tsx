import { useState, useRef, useEffect } from "react";
import { cn } from "../../lib/utils";
import type { Product, Promotion } from "../../data/types";
import { ProductImageCard } from "./ProductImageCard";
import { Button } from "../ui/button";
import { Link } from "@tanstack/react-router";

interface ProductGridProps {
    products: Product[];
    promotions: Promotion[];
    className?: string;
    initialLimit?: number;
    viewAllParams?: { type: string; brand: string };
}

export const ProductGrid: React.FC<ProductGridProps> = ({ products, promotions, className, initialLimit = 12, viewAllParams }) => {
    const [limit, setLimit] = useState(initialLimit);
    const observerTarget = useRef<HTMLDivElement>(null);

    const getPromotionForProduct = (product: Product) => {
        return promotions.find(p => p.eligibleProducts?.includes(product.id));
    };

    // Auto-pagination intersection observer
    useEffect(() => {
        if (viewAllParams || products.length <= limit) return; // Don't auto-paginate if we navigate out or reached end
        
        const observer = new IntersectionObserver(
            entries => {
                if (entries[0].isIntersecting) {
                    setLimit(prev => Math.min(prev + 12, products.length));
                }
            },
            { threshold: 0.1, rootMargin: "200px" } 
        );

        if (observerTarget.current) {
            observer.observe(observerTarget.current);
        }

        return () => observer.disconnect();
    }, [limit, products.length, viewAllParams]);

    if (products.length === 0) return null;

    const displayedProducts = products.slice(0, limit);
    const hasMore = products.length > limit;

    return (
        <div className="flex flex-col space-y-6">
            <div className={cn(
                "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 animate-in px-2 fade-in duration-300",
                className
            )}>
                {displayedProducts.map(product => (
                    <div key={product.id} className="w-full">
                        <ProductImageCard
                            product={product}
                            promotion={getPromotionForProduct(product)}
                        />
                    </div>
                ))}
            </div>
            
            {hasMore && (
                viewAllParams ? (
                    <div className="flex justify-center pt-4 pb-2">
                        <Button 
                            variant="outline" 
                            size="lg" 
                            asChild
                            className="w-full max-w-sm rounded-full shadow-sm hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all"
                        >
                            <Link to="/products/$type/$brand" params={viewAllParams}>
                                View All {products.length} {viewAllParams.brand.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())} Models
                            </Link>
                        </Button>
                    </div>
                ) : (
                    <>
                        <div ref={observerTarget} className="flex justify-center py-6">
                            <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin opacity-50" />
                        </div>
                        <noscript>
                            <div className="w-full text-center p-4 mt-4 border border-dashed rounded-lg bg-muted/20 text-muted-foreground text-sm">
                                Please enable JavaScript to automatically load the remaining {products.length - initialLimit} products on this page.
                            </div>
                        </noscript>
                    </>
                )
            )}
        </div>
    );
};
