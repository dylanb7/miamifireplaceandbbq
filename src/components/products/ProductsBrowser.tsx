import { useState, useMemo, useEffect } from 'react';
import type { Product, ProductType, Promotion } from "../../data/types";
import { BrandSection } from "./BrandSection";
import { useParams } from '@tanstack/react-router';
import { PromotionBanner } from "../PromotionBanner";
import { BrandFilter } from "./BrandFilter";

const PRODUCT_TYPES: (ProductType | "All")[] = ["All", "Outdoor Kitchens", "Grills", "Fireplaces", "Gas Logs"];

import { slugify } from '../../lib/utils';

const deslugify = (slug: string): ProductType | "All" => {
    if (!slug || slug === 'all') return "All";
    const map: Record<string, ProductType> = {
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

import { FloatingToc } from './FloatingToc';

export const ProductsBrowser: React.FC<ProductsBrowserProps> = ({ className, products, promotions, initialType, initialBrand }) => {
    // ... (rest of the state setup)
    const [selectedType, setSelectedType] = useState<ProductType | "All">(initialType ? deslugify(initialType) : "All");

    useEffect(() => {
        if (initialType) {
            setSelectedType(deslugify(initialType));
        }
    }, [initialType]);

    const brandSlugMatch = (name: string, targetSlug: string) => name?.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '') === targetSlug;

    const params: any = useParams({ strict: false });


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

    const tocItems = useMemo(() => {
        if (isSingleBrandMode || displayGroups.length <= 1) return [];
        return displayGroups.map(g => ({
            id: slugify(g.title),
            title: g.title
        }));
    }, [displayGroups, isSingleBrandMode]);

    return (
        <div className={`px-4 md:px-0 relative ${className || ""}`}>

            <div className="w-full">
                <div className="space-y-8">
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
                                            {!isSingleBrandMode && (
                                                <div>
                                                    <h2 className="text-3xl font-bold tracking-tight">
                                                        {selectedType === "All" ? "Our Products" : selectedType}
                                                    </h2>
                                                    <p className="text-muted-foreground mt-1">
                                                        {selectedType === "All"
                                                            ? "Browse our complete collection of premium outdoor living products."
                                                            : `Explore our selection of ${selectedType.toLowerCase()}.`
                                                        }
                                                    </p>
                                                </div>
                                            )}
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

                            {/* Brand Filter Row - Always visible for quick switching/clearing */}
                            {(() => {
                                const availableBrands = Array.from(new Set(typeFilteredProducts.map(p => p.brand || "Other"))).filter(b => b !== "Other");
                                if (availableBrands.length <= 1) return null;

                                return (
                                    <BrandFilter
                                        availableBrands={availableBrands}
                                        selectedBrand={effectiveBrand && effectiveBrand !== 'all' ? displayedProducts[0]?.brand : undefined}
                                        getBrandLink={(brandName) => {
                                            if (brandName) {
                                                return {
                                                    to: '/products/$type/$brand',
                                                    params: {
                                                        type: selectedType === "All" ? "all" : slugify(selectedType),
                                                        brand: slugify(brandName)
                                                    }
                                                };
                                            } else {
                                                return {
                                                    to: '/products/$type',
                                                    params: { type: selectedType === "All" ? "all" : slugify(selectedType) }
                                                };
                                            }
                                        }}
                                    />
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
                                        hideHeader={isSingleBrandMode}
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
            </div>

            <FloatingToc items={tocItems} />
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
