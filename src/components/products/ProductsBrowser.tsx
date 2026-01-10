import { useState, useMemo, useEffect } from 'react';
import type { Product, ProductType, Promotion } from "../../data/types";
import { BrandSection } from "./BrandSection";
import { useParams } from '@tanstack/react-router';
import { PromotionBanner } from "../PromotionBanner";

const PRODUCT_TYPES: (ProductType | "All")[] = ["All", "Hot Tubs", "Outdoor Kitchens", "Grills", "Fireplaces", "Gas Logs"];

import { slugify } from '../../lib/utils';

const deslugify = (slug: string): ProductType | "All" => {
    if (!slug || slug === 'all') return "All";
    const map: Record<string, ProductType> = {
        "hot-tubs": "Hot Tubs",
        "outdoor-kitchens": "Outdoor Kitchens",
        "grills": "Grills",
        "fireplaces": "Fireplaces",
        "gas-logs": "Gas Logs"
    };
    return map[slug] || "All";
}

interface ProductsBrowserProps {
    className?: string;
    products: Product[];
    promotions: Promotion[];
    initialType?: string;
    initialBrand?: string;
}

export const ProductsBrowser: React.FC<ProductsBrowserProps> = ({ className, products, promotions, initialType, initialBrand }) => {
    const [selectedType, setSelectedType] = useState<ProductType | "All">(initialType ? deslugify(initialType) : "All");

    useEffect(() => {
        if (initialType) {
            setSelectedType(deslugify(initialType));
        }
    }, [initialType]);

    const brandSlugMatch = (name: string, targetSlug: string) => name?.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '') === targetSlug;

    const params = useParams({ strict: false });

    const effectiveBrand = initialBrand || params.brand;

    const typeFilteredProducts = useMemo(() => {
        if (selectedType === "All") return products;
        return products.filter(p => p.category === selectedType);
    }, [selectedType, products]);


    const displayedProducts = useMemo(() => {
        if (!effectiveBrand || effectiveBrand === 'all') return typeFilteredProducts;
        return typeFilteredProducts.filter(p => p.brand && brandSlugMatch(p.brand, effectiveBrand));
    }, [typeFilteredProducts, effectiveBrand]);

    // Group logic
    const isAllMode = selectedType === "All";
    const isSingleBrandMode = !!effectiveBrand && effectiveBrand !== 'all';

    const displayGroups = useMemo(() => {
        if (isAllMode) {
            // Group by Type
            const typeGroups: Record<string, Product[]> = {};
            displayedProducts.forEach(p => {
                if (!typeGroups[p.category]) typeGroups[p.category] = [];
                typeGroups[p.category].push(p);
            });
            return PRODUCT_TYPES
                .filter(t => t !== "All")
                .map(type => ({
                    title: type as string,
                    products: typeGroups[type as string] || [],
                    isTypeGroup: true
                }))
                .filter(g => g.products.length > 0);
        } else {
            // Group by Brand
            const brandGroups: Record<string, Product[]> = {};
            displayedProducts.forEach(p => {
                const brand = p.brand || "Other";
                if (!brandGroups[brand]) brandGroups[brand] = [];
                brandGroups[brand].push(p);
            });

            if (isSingleBrandMode) {
                return Object.entries(brandGroups).map(([brand, prods]) => ({
                    title: brand,
                    products: prods,
                    isTypeGroup: false,
                    forceGrid: true
                }));
            }

            const denseGroups: { title: string, products: Product[], isTypeGroup: boolean, forceGrid?: boolean }[] = [];
            const sparseProducts: Product[] = [];

            Object.entries(brandGroups).forEach(([brand, prods]) => {
                if (prods.length >= 3) {
                    denseGroups.push({
                        title: brand,
                        products: prods,
                        isTypeGroup: false
                    });
                } else {
                    sparseProducts.push(...prods);
                }
            });

            denseGroups.sort((a, b) => a.title.localeCompare(b.title));

            if (sparseProducts.length > 0) {
                sparseProducts.sort((a, b) => (a.brand || "").localeCompare(b.brand || "") || a.name.localeCompare(b.name));

                const isOnlyGroup = denseGroups.length === 0;
                const title = isOnlyGroup ? "All Models" : "Other Premium Options";

                denseGroups.push({
                    title: title,
                    products: sparseProducts,
                    isTypeGroup: false,
                    forceGrid: true // Sparse/catch-all groups look better as grids
                });
            }

            return denseGroups;
        }
    }, [displayedProducts, isAllMode, isSingleBrandMode]);

    return (
        <div className={`space-y-8 px-4 md:px-0 ${className}`}>
            <div className="space-y-6">
                <div className="flex flex-col gap-4">
                    {/* Promotion Filtering Logic */}
                    {(() => {
                        const categoryPromotions = promotions.filter(p =>
                            selectedType === "All" || p.eligibleCategories.includes(selectedType) &&
                            !p.eligibleBrands &&
                            !p.eligibleProducts
                        );

                        return (
                            <>
                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                    <div>
                                        <h2 className="text-3xl font-bold tracking-tight">
                                            {isSingleBrandMode
                                                ? displayGroups[0]?.title
                                                : selectedType === "All" ? "Our Products" : selectedType
                                            }
                                        </h2>
                                        <p className="text-muted-foreground mt-1">
                                            {selectedType === "All"
                                                ? "Browse our complete collection of premium outdoor living products."
                                                : isSingleBrandMode
                                                    ? `Browse all ${displayGroups[0]?.title || selectedType} models.`
                                                    : `Explore our selection of ${selectedType.toLowerCase()}.`
                                            }
                                        </p>
                                    </div>
                                </div>

                                {/* Category Level Promotions */}
                                {categoryPromotions.length > 0 && (
                                    <div className="space-y-4">
                                        {categoryPromotions.map(promo => (
                                            <PromotionBanner key={promo.id} promotion={promo} />
                                        ))}
                                    </div>
                                )}
                            </>
                        );
                    })()}
                </div>
            </div>

            <div className={`space-y-16 animate-in fade-in slide-in-from-bottom-4 duration-500 min-h-[50vh]`}>
                {displayGroups.map((group) => (
                    <div key={group.title} id={slugify(group.title)} className="space-y-6 scroll-mt-24">
                        {isAllMode && (
                            <h3 className="text-xl font-semibold text-foreground border-b pb-2">{group.title}</h3>
                        )}

                        {isAllMode ? (
                            <TypeGroupView products={group.products} promotions={promotions} />
                        ) : (
                            <BrandSection
                                brandName={group.title}
                                products={group.products}
                                promotions={promotions}
                                simpleLayout={isSingleBrandMode || (group as any).forceGrid}
                            />
                        )}
                    </div>
                ))}

                {displayedProducts.length === 0 && (
                    <div className="text-center py-12 text-muted-foreground">
                        <p>No products found in this category.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

// Sub-component to handle grouping by brand WITHIN a type when in "All" mode
const TypeGroupView = ({ products, promotions }: { products: Product[], promotions: Promotion[] }) => {
    // Group by brand
    const brandGroups = useMemo(() => {
        const groups: Record<string, Product[]> = {};
        products.forEach(p => {
            const brand = p.brand || "Other";
            if (!groups[brand]) groups[brand] = [];
            groups[brand].push(p);
        });
        return groups;
    }, [products]);

    return (
        <div className="space-y-8 pl-0 md:pl-4 border-l-0 md:border-l-2 border-muted">
            {Object.entries(brandGroups).map(([brand, prods]) => (
                <BrandSection
                    key={brand}
                    brandName={brand}
                    products={prods}
                    promotions={promotions}
                />
            ))}
        </div>
    );
};
