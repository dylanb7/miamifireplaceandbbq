import React from "react";
import type { Product, Promotion } from "../../data/types";
import { Link } from "@tanstack/react-router";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";
import { getOptimizedImage } from "@/lib/utils";

interface ProductCardProps {
    product: Product;
    promotion?: Promotion;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, promotion }) => {
    return (
        <Card className="flex flex-col h-full w-full snap-start hover:shadow-lg transition-shadow group relative">
            <Link
                to="/product/$productId"
                params={{ productId: product.id }}
                className="absolute inset-0 z-10"
            >
                <span className="sr-only">View {product.name} details</span>
            </Link>
            <CardHeader className="p-3">
                <div className="relative">
                    <img
                        src={getOptimizedImage(product.image, 600)}
                        alt={product.name}
                        loading="lazy"
                        className="w-full h-40 object-cover rounded-md bg-muted"
                    />
                    {promotion && product.brand && (
                        <Badge variant="destructive" className="absolute top-2 right-2 text-[10px] px-1.5 py-0.5 h-auto shadow-sm">
                            {promotion.title}
                        </Badge>
                    )}
                </div>
            </CardHeader>
            <CardContent className="flex-grow p-3 pt-0">
                <div className="mb-2">
                    <Badge variant="secondary" className="text-[10px] px-1.5 py-0 h-5 mb-1 mr-2">{product.brand}</Badge>
                    <span className="text-xs text-muted-foreground">{product.model}</span>
                </div>
                <CardTitle className="text-lg leading-tight mb-2 group-hover:text-primary transition-colors">
                    {product.name}
                </CardTitle>
                <div className="text-xs text-muted-foreground line-clamp-2">
                    {product.description}
                </div>
            </CardContent>
            <CardFooter className="p-3 pt-0 mt-auto flex items-center justify-between">
                <div className="font-semibold text-lg">
                    {product.price > 0 ? `$${product.price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : "Call for Price"}
                </div>
                <Button size="icon" variant="ghost" className="h-8 w-8 rounded-full text-muted-foreground hover:text-primary relative z-20">
                    <ChevronRight className="h-4 w-4" />
                </Button>
            </CardFooter>
        </Card>
    );
};
