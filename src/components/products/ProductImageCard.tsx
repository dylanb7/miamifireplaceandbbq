import React from "react";
import type { Product, Promotion } from "../../data/types";
import { Link } from "@tanstack/react-router";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface ProductImageCardProps {
    product: Product;
    promotion?: Promotion;
    className?: string;
}

export const ProductImageCard: React.FC<ProductImageCardProps> = ({ product, promotion, className }) => {

    const CardInner = () => (
        <div className={cn("group card card-bordered relative w-full overflow-hidden bg-muted aspect-[4/3] border border-transparent hover:border-primary/50 hover:shadow-sm transition-all duration-300", className)}>
            {/* Full size image */}
            <img
                src={product.image}
                alt={product.name}
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
            />

            {/* Clickable Overlay Link */}
            <Link
                to="/product/$productId"
                params={{ productId: product.id }}
                className="absolute inset-0 z-20"
                aria-label={`View details for ${product.name}`}
            />

            {/* Top Badge Overlay */}
            <div className="absolute top-3 left-3 right-3 flex justify-between items-start z-10 pointer-events-none">
                <Badge variant="secondary" className="bg-white/90 text-black backdrop-blur-sm shadow-sm">
                    {product.brand}
                </Badge>

                {promotion && (
                    <Badge variant="destructive" className="shadow-sm">
                        {promotion.title}
                    </Badge>
                )}
            </div>


            {/* Bottom Gradient & Content Overlay */}
            <div className="absolute inset-x-0 bottom-0 z-10 p-4 pointer-events-none">
                {/* Dark Gradient for readability */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/80 to-transparent pointer-events-none" />

                <div className="relative text-white flex flex-col gap-1">
                    <h3 className="font-bold text-lg leading-tight text-shadow-sm line-clamp-2">{product.name}</h3>

                    {/* Hover-reveal content grid */}
                    <div className="grid grid-rows-[0fr] group-hover:grid-rows-[1fr] transition-[grid-template-rows] duration-500 ease-in-out">
                        <div className="overflow-hidden">
                            <div className="flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-500 ease-in-out pointer-events-auto">
                                {product.price > 0 && (
                                    <p className="font-medium text-white/90 pt-1">
                                        ${product.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                    </p>
                                )}

                                <p className="text-xs text-white/80 line-clamp-2 py-1">
                                    {product.description}
                                </p>
                                <div className="text-xs font-semibold underline decoration-white/50 underline-offset-4 pb-1">
                                    View Details
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );

    return <CardInner />;
};
