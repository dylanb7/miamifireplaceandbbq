import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowLeft, Check, ShoppingCart, Info, ListChecks, Settings2, Package, PlayCircle, Download as DownloadIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";


import type { Product, ProductInfo, Promotion } from "@/data/types";
import { BrandSection } from "@/components/products/BrandSection";
import { slugify } from "@/lib/utils";
import { PromotionBanner } from "../PromotionBanner";
import { OutdoorKitchen } from "./OutdoorKitchenView";
import { DownloadCard } from "./DownloadCard";

interface ProductViewProps {
    product: Product;
    info?: ProductInfo;
    relatedProducts: Product[];
    promotions: Promotion[];
}


export function ProductView({ product, info, relatedProducts, promotions }: ProductViewProps) {
    const [activeImage, /*setActiveImage*/] = useState(product.image);


    const relevantPromotions = promotions.filter(p => {
        const matchesProduct = !p.eligibleProducts?.length || p.eligibleProducts.includes(product.id);
        const matchesBrand = !p.eligibleBrands?.length || (product.brand && p.eligibleBrands.includes(product.brand));
        const matchesCategory = !p.eligibleCategories?.length || p.eligibleCategories.includes(product.category);

        const specifiesSomething = (p.eligibleProducts?.length ?? 0) > 0 ||
            (p.eligibleBrands?.length ?? 0) > 0 ||
            (p.eligibleCategories?.length ?? 0) > 0;

        return specifiesSomething && matchesProduct && matchesBrand && matchesCategory;
    });

    if (product.category === "Outdoor Kitchens") {
        return (
            <OutdoorKitchen
                product={product}
            />
        )
    }

    const productSpecsIsRecord = product.specs && !Array.isArray(product.specs) && typeof product.specs === 'object';
    const hasFeatures = (info?.features?.length ?? 0) > 0 || (product.features?.length ?? 0) > 0;
    const hasAccessories = (product.accessories?.length ?? 0) > 0;
    const hasSpecs = (info?.specifications && Object.keys(info.specifications).length > 0) || (productSpecsIsRecord && Object.keys(product.specs as Record<string, string>).length > 0) || (Array.isArray(product.specs) && product.specs.length > 0);
    const hasDetails = (product.misc?.length ?? 0) > 0;
    const hasVideo = !!info?.videoUrl;
    const hasDownloads = (info?.downloads?.length ?? 0) > 0 || (product.downloads?.length ?? 0) > 0;

    const hasAnyTabs = hasFeatures || hasAccessories || hasSpecs || hasDetails || hasVideo || hasDownloads;
    const defaultTab = hasFeatures ? "features" : hasSpecs ? "specs" : hasAccessories ? "accessories" : hasDetails ? "details" : hasVideo ? "video" : hasDownloads ? "downloads" : "";

    return (
        <div className="container mx-auto px-4 py-8 space-y-12 fade-in animate-in duration-500">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Link to="/products/$type" params={{ type: slugify(product.category) }} className="hover:text-primary transition-colors flex items-center gap-1">
                    <ArrowLeft size={14} /> Back to {product.category}
                </Link>
                <span className="text-muted-foreground/50">/</span>
                <span className="font-medium text-foreground">{product.name}</span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                <div className="space-y-4">
                    <div className="bg-base-100 rounded-box overflow-hidden border shadow-sm aspect-4/3 relative group">
                        <img
                            src={activeImage}
                            alt={product.name}
                            className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
                        />
                        {/* Overlay Promos */}
                        <div className="absolute top-4 left-4 flex flex-col gap-2">
                            {relevantPromotions.map(promo => (
                                <Badge key={promo.id} className="bg-accent text-accent-foreground border-accent-foreground/10 shadow-sm">
                                    {promo.title}
                                </Badge>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Right Column: Details */}
                <div className="space-y-8">
                    <div>
                        <div className="flex items-center gap-2 mb-2 flex-wrap">
                            <Badge variant="secondary" className="rounded-full px-3">{product.brand}</Badge>
                            {product.subCategories?.map(sub => (
                                <Badge key={sub} variant="outline" className="rounded-full px-3 text-xs">{sub}</Badge>
                            ))}
                            {product.model && <span className="text-sm text-muted-foreground">{product.model}</span>}
                        </div>
                        <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground mb-2">{product.name}</h1>
                        {product.shortDescription && (
                            <p className="text-lg text-muted-foreground mb-4">{product.shortDescription}</p>
                        )}

                    </div>

                    {/* Promotions Banner Stack */}
                    {relevantPromotions.length > 0 && (
                        <div className="flex flex-col gap-2">
                            {relevantPromotions.map(promo => (
                                <PromotionBanner key={promo.id} promotion={promo} className="w-full" />
                            ))}
                        </div>
                    )}

                    <div className="prose prose-stone dark:prose-invert max-w-none text-muted-foreground">
                        <p>{product.description}</p>
                    </div>

                    <div className="flex gap-4">
                        <Button size="lg" className="w-full md:w-auto gap-2" asChild>
                            <Link
                                to="/contact"
                                search={{
                                    productId: product.id,
                                }}
                            >
                                <ShoppingCart size={18} /> Inquire about this Product
                            </Link>
                        </Button>
                    </div>
                </div>
            </div>

            {/* Bottom Section: Tabs for Deep Dive */}
            {hasAnyTabs && (
                <Tabs key={product.id} defaultValue={defaultTab} className="w-full">
                    <div className="flex justify-center md:justify-start w-full mb-8 pb-2">
                        <TabsList className="inline-flex flex-wrap items-center justify-center md:justify-start h-auto p-1.5 bg-muted/50 rounded-2xl gap-1.5 border border-border/40 backdrop-blur-sm">
                            {hasFeatures && (
                                <TabsTrigger
                                    value="features"
                                    className="flex-1 md:flex-none justify-center rounded-xl px-4 md:px-6 py-2.5 text-sm font-semibold transition-all data-[state=active]:bg-background data-[state=active]:text-primary data-[state=active]:shadow-md hover:bg-background/40 flex items-center gap-2"
                                >
                                    <ListChecks className="w-4 h-4" />
                                    <span className="truncate">Features</span>
                                </TabsTrigger>
                            )}
                            {hasAccessories && (
                                <TabsTrigger
                                    value="accessories"
                                    className="flex-1 md:flex-none justify-center rounded-xl px-4 md:px-6 py-2.5 text-sm font-semibold transition-all data-[state=active]:bg-background data-[state=active]:text-primary data-[state=active]:shadow-md hover:bg-background/40 flex items-center gap-2"
                                >
                                    <Package className="w-4 h-4" />
                                    <span className="truncate">Accessories</span>
                                </TabsTrigger>
                            )}
                            {hasSpecs && (
                                <TabsTrigger
                                    value="specs"
                                    className="flex-1 md:flex-none justify-center rounded-xl px-4 md:px-6 py-2.5 text-sm font-semibold transition-all data-[state=active]:bg-background data-[state=active]:text-primary data-[state=active]:shadow-md hover:bg-background/40 flex items-center gap-2"
                                >
                                    <Settings2 className="w-4 h-4" />
                                    <span className="truncate">Specifications</span>
                                </TabsTrigger>
                            )}
                            {hasDetails && (
                                <TabsTrigger
                                    value="details"
                                    className="flex-1 md:flex-none justify-center rounded-xl px-4 md:px-6 py-2.5 text-sm font-semibold transition-all data-[state=active]:bg-background data-[state=active]:text-primary data-[state=active]:shadow-md hover:bg-background/40 flex items-center gap-2"
                                >
                                    <Info className="w-4 h-4" />
                                    <span className="truncate">Details</span>
                                </TabsTrigger>
                            )}
                            {hasVideo && (
                                <TabsTrigger
                                    value="video"
                                    className="flex-1 md:flex-none justify-center rounded-xl px-4 md:px-6 py-2.5 text-sm font-semibold transition-all data-[state=active]:bg-background data-[state=active]:text-primary data-[state=active]:shadow-md hover:bg-background/40 flex items-center gap-2"
                                >
                                    <PlayCircle className="w-4 h-4" />
                                    <span className="truncate">Video</span>
                                </TabsTrigger>
                            )}
                            {hasDownloads && (
                                <TabsTrigger
                                    value="downloads"
                                    className="flex-1 md:flex-none justify-center rounded-xl px-4 md:px-6 py-2.5 text-sm font-semibold transition-all data-[state=active]:bg-background data-[state=active]:text-primary data-[state=active]:shadow-md hover:bg-background/40 flex items-center gap-2"
                                >
                                    <DownloadIcon className="w-4 h-4" />
                                    <span className="truncate">Downloads</span>
                                </TabsTrigger>
                            )}
                        </TabsList>
                    </div>

                    <div className="py-8">

                        <TabsContent value="features" className="mt-0">
                            <div className="max-w-4xl">
                                <ul className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-3">
                                    {(info?.features || product.features || []).map((feature, idx) => (
                                        <li key={idx} className="flex items-start gap-2 group">
                                            <Check className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                                            <span className="text-muted-foreground group-hover:text-foreground transition-colors">{feature}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </TabsContent>

                        <TabsContent value="specs" className="mt-0">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-4 max-w-4xl">
                                {(() => {
                                    // Priority: info.specifications > product.specs (Record) > product.specs (array)
                                    if (info?.specifications && Object.keys(info.specifications).length > 0) {
                                        return Object.entries(info.specifications).map(([key, value]) => (
                                            <div key={key} className="flex justify-between py-3 border-b border-border/50">
                                                <span className="font-medium text-muted-foreground">{key}</span>
                                                <span className="font-medium text-foreground text-right">{value}</span>
                                            </div>
                                        ));
                                    }
                                    if (productSpecsIsRecord) {
                                        return Object.entries(product.specs as Record<string, string>).map(([key, value]) => (
                                            <div key={key} className="flex justify-between py-3 border-b border-border/50">
                                                <span className="font-medium text-muted-foreground">{key}</span>
                                                <span className="font-medium text-foreground text-right">{value}</span>
                                            </div>
                                        ));
                                    }
                                    return (product.specs as string[] || []).map((spec, idx) => (
                                        <div key={idx} className="flex justify-between py-3 border-b border-border/50">
                                            <span className="font-medium text-foreground">{spec}</span>
                                        </div>
                                    ));
                                })()}
                            </div>
                        </TabsContent>

                        <TabsContent value="accessories" className="mt-0">
                            <div className="max-w-4xl">
                                <ul className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-3">
                                    {(product.accessories || []).map((feature, idx) => (
                                        <li key={idx} className="flex items-start gap-2 group">
                                            <Check className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                                            <span className="text-muted-foreground group-hover:text-foreground transition-colors">{feature}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </TabsContent>

                        <TabsContent value="details" className="mt-0">
                            <div className="max-w-4xl space-y-8">
                                {(product.misc || []).map((section, idx) => (
                                    <div key={idx} className="space-y-4">
                                        {section.name && <h3 className="text-xl font-semibold text-foreground border-b pb-2">{section.name}</h3>}
                                        <ul className="space-y-3">
                                            {section.content.map((item, itemIdx) => (
                                                <li key={itemIdx} className="flex items-start gap-3 group">
                                                    <div className="min-w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                                                    <span className="text-muted-foreground group-hover:text-foreground transition-colors">{item}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                ))}
                            </div>
                        </TabsContent>

                        <TabsContent value="video" className="mt-0">
                            {info?.videoUrl && (
                                <div className="aspect-video max-w-4xl bg-black rounded-lg overflow-hidden shadow-lg">
                                    {/* Ideally parse embed URL or use a player component */}
                                    <iframe
                                        src={info.videoUrl}
                                        className="w-full h-full"
                                        title="Product Video"
                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                        allowFullScreen
                                    />
                                </div>
                            )}
                        </TabsContent>

                        <TabsContent value="downloads" className="mt-0">
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                                {(info?.downloads || product.downloads?.map(d => ({ title: d.name, url: '#' })) || []).map((dl, idx) => (
                                    <DownloadCard key={idx} name={dl.title} type="PDF" url={dl.url} />

                                ))}
                            </div>
                        </TabsContent>
                    </div>
                </Tabs>
            )}

            {/* Related Products */}
            {relatedProducts.length > 0 && (
                <div className="pt-8 border-t">
                    <BrandSection
                        brandName={`More from ${product.brand}`}
                        products={relatedProducts}
                        promotions={promotions}
                        layout="carousel"
                    />
                </div>
            )}
        </div>
    );
}


