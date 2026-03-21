import { useState, useMemo, useEffect } from 'react';
import type { Product, ProductType, Promotion } from "../../data/types";
import { BrandSection } from "./BrandSection";
import { useParams } from '@tanstack/react-router';
import { PromotionBanner } from "../PromotionBanner";
import { BrandFilter } from "./BrandFilter";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const PRODUCT_TYPES: (ProductType | "All")[] = ["All", "Outdoor Kitchens", "Grills", "Fireplaces", "Gas Logs"];

import { slugify } from '../../lib/utils';
import { brands } from '@/data/brands';

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
    const [selectedSubCategories, setSelectedSubCategories] = useState<string[]>([]);

    useEffect(() => {
        if (initialType) {
            setSelectedType(deslugify(initialType));
        }
    }, [initialType]);

    const params: any = useParams({ strict: false });
    const effectiveBrand = initialBrand || params.brand;

    useEffect(() => {
        setSelectedSubCategories([]);
    }, [selectedType, effectiveBrand]);

    const brandSlugMatch = (name: string, targetSlug: string) => {
        if (!name) return false;
        const slug = (s: string) => s.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '');
        
        // Try matching against product brand name
        if (slug(name) === targetSlug) return true;
        
        // Also try matching against canonical brand data
        const brands_data = brands.find(b => b.brandName === name || b.name === name);
        if (brands_data) {
            if (slug(brands_data.name) === targetSlug) return true;
            if (brands_data.brandName && slug(brands_data.brandName) === targetSlug) return true;
        }
        
        return false;
    };



    const typeFilteredProducts = useMemo(() => {
        if (selectedType === "All") return products;
        return products.filter(p => p.category === selectedType);
    }, [selectedType, products]);

    const displayedProducts = useMemo(() => {
        let base = typeFilteredProducts;
        if (effectiveBrand && effectiveBrand !== 'all') {
            base = base.filter(p => p.brand && brandSlugMatch(p.brand, effectiveBrand));
        }
        if (selectedSubCategories.length > 0) {
            base = base.filter(p => 
                selectedSubCategories.every(cat => p.subCategories && p.subCategories.includes(cat))
            );
        }
        return base;
    }, [typeFilteredProducts, effectiveBrand, selectedSubCategories]);

    const availableSubCategories = useMemo(() => {
        const categories = new Set<string>();
        const baseForSubCats = effectiveBrand && effectiveBrand !== 'all' 
            ? typeFilteredProducts.filter(p => p.brand && brandSlugMatch(p.brand, effectiveBrand)) 
            : typeFilteredProducts;

        baseForSubCats.forEach(p => {
            if (p.subCategories) {
                p.subCategories.forEach(c => categories.add(c));
            }
        });
        return Array.from(categories).sort();
    }, [typeFilteredProducts, effectiveBrand]);

    const groupedSubCategories = useMemo(() => {
        const FUEL_TYPES = ['Gas', 'Electric', 'Charcoal', 'Wood', 'Pellet', 'Water Vapor'];
        const STYLES = ['Built-in', 'Cart', 'Portable', 'Inserts', 'Outdoor', 'Linear', 'Log Sets', 'See-Through', 'Traditional', 'Insert', 'Corner', 'Firebox', 'Three-Sided', 'Indoor/Outdoor', 'Vented'];

        const groups: { label: string, options: string[] }[] = [];
        const fuels = availableSubCategories.filter(c => FUEL_TYPES.includes(c));
        const styles = availableSubCategories.filter(c => STYLES.includes(c));
        const others = availableSubCategories.filter(c => !FUEL_TYPES.includes(c) && !STYLES.includes(c));

        if (fuels.length > 1) groups.push({ label: "Fuel Type", options: fuels });
        if (styles.length > 1) groups.push({ label: "Style", options: styles });
        if (others.length > 1) groups.push({ label: "Other", options: others });
        
        return groups;
    }, [availableSubCategories]);

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
                    isTypeGroup: false
                }));
            }

            const denseGroups: { title: string, products: Product[], isTypeGroup: boolean }[] = [];
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

            denseGroups.sort((a, b) => a.title.localeCompare(b.title, 'en-US'));

            if (sparseProducts.length > 0) {
                sparseProducts.sort((a, b) => (a.brand || "").localeCompare(b.brand || "", 'en-US') || a.name.localeCompare(b.name, 'en-US'));

                const isOnlyGroup = denseGroups.length === 0;
                const title = isOnlyGroup ? "All Models" : "Other Premium Options";

                denseGroups.push({
                    title: title,
                    products: sparseProducts,
                    isTypeGroup: false
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
                                        selectedBrand={effectiveBrand && effectiveBrand !== 'all' ? (typeFilteredProducts.find(p => p.brand && brandSlugMatch(p.brand, effectiveBrand))?.brand) : undefined}
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

                            {/* Subcategory Filter Row */}
                            {groupedSubCategories.length > 0 && (
                                <div className="w-full relative mb-4">
                                    <div className="flex items-center justify-between border-b pb-2 mb-4">
                                        <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Filter by:</h3>
                                        {selectedSubCategories.length > 0 && (
                                            <button 
                                                onClick={() => setSelectedSubCategories([])}
                                                className="text-sm font-medium text-muted-foreground hover:text-foreground hover:underline"
                                            >
                                                Clear All
                                            </button>
                                        )}
                                    </div>
                                    <div className="flex flex-wrap gap-2 items-center">
                                        {groupedSubCategories.map((group, index) => {
                                            const selectedInGroup = group.options.find(opt => selectedSubCategories.includes(opt));
                                            
                                            // Ensure dropdowns near the left edge align rightward ("start") to prevent going off-screen,
                                            // and align leftward ("end") if it's the last item and might overflow right edge.
                                            const alignStr = index === groupedSubCategories.length - 1 && index > 1 ? "end" : "start";

                                            return (
                                                <DropdownMenu key={group.label} align={alignStr}>
                                                    <DropdownMenuTrigger className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors border flex items-center gap-2 outline-none ${selectedInGroup ? 'bg-primary text-primary-foreground border-primary' : 'bg-background hover:bg-accent border-border text-foreground'}`}>
                                                        {selectedInGroup ? selectedInGroup : group.label}
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align={alignStr} className="w-48">
                                                        <DropdownMenuItem 
                                                            onClick={() => setSelectedSubCategories(prev => prev.filter(c => !group.options.includes(c)))}
                                                            className={!selectedInGroup ? "font-semibold" : ""}
                                                        >
                                                            All {group.label}{group.label === "Other" ? " Types" : "s"}
                                                        </DropdownMenuItem>
                                                        <DropdownMenuSeparator />
                                                        {group.options.map(cat => (
                                                            <DropdownMenuItem 
                                                                key={cat} 
                                                                onClick={() => setSelectedSubCategories(prev => {
                                                                    const newSelections = prev.filter(c => !group.options.includes(c));
                                                                    return [...newSelections, cat];
                                                                })}
                                                                className={selectedInGroup === cat ? "bg-accent font-semibold" : ""}
                                                            >
                                                                {cat}
                                                            </DropdownMenuItem>
                                                        ))}
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className={`space-y-16 animate-in fade-in slide-in-from-bottom-4 duration-500 min-h-[50vh]`}>
                        {displayGroups.map((group) => (
                            <div key={group.title} id={slugify(group.title)} className="space-y-6 scroll-mt-24">
                                {isAllMode && (
                                    <h3 className="text-xl font-semibold text-foreground border-b pb-2">{group.title}</h3>
                                )}

                                {isAllMode ? (
                                    <TypeGroupView 
                                        products={group.products} 
                                        promotions={promotions} 
                                        baseCategorySlug={slugify(group.title)}
                                    />
                                ) : (
                                    <BrandSection
                                        brandName={group.title}
                                        products={group.products}
                                        promotions={promotions}
                                        hideHeader={isSingleBrandMode}
                                        baseCategorySlug={slugify(selectedType)}
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
const TypeGroupView = ({ products, promotions, baseCategorySlug }: { products: Product[], promotions: Promotion[], baseCategorySlug: string }) => {
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
                    baseCategorySlug={baseCategorySlug}
                />
            ))}
        </div>
    );
};
