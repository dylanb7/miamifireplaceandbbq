import { useState, useEffect } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowLeft, Check, Download, ShoppingCart, Expand, ChevronLeft, ChevronRight, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";


import type { Product, ProductInfo, Promotion } from "@/data/types";
import { BrandSection } from "@/components/products/BrandSection";
import { slugify } from "@/lib/utils";
import { PromotionBanner } from "../PromotionBanner";

interface ProductViewProps {
    product: Product;
    info?: ProductInfo;
    relatedProducts: Product[];
    promotions: Promotion[];
}

export function ProductView({ product, info, relatedProducts, promotions }: ProductViewProps) {
    const [activeImage, /*setActiveImage*/] = useState(product.image);
    const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

    const galleryImages = [product.image, ...(product.gallery || [])].filter((img, index, self) => self.indexOf(img) === index);

    useEffect(() => {
        if (lightboxIndex === null) return;

        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") setLightboxIndex(null);
            if (e.key === "ArrowLeft") setLightboxIndex(prev => prev === null ? null : (prev === 0 ? galleryImages.length - 1 : prev - 1));
            if (e.key === "ArrowRight") setLightboxIndex(prev => prev === null ? null : (prev === galleryImages.length - 1 ? 0 : prev + 1));
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [lightboxIndex, galleryImages.length]);

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
            <div className="flex flex-col w-full min-h-screen">
                {/* Hero Section */}
                <div className="relative w-full h-[60vh] md:h-[70vh] lg:h-[80vh] bg-black">
                    <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover opacity-80"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end pt-32 pb-16 px-6 md:px-12 lg:px-24">
                        <Badge className="w-fit mb-4 bg-white/20 hover:bg-white/30 text-white backdrop-blur-md border-0">{product.brand}</Badge>
                        <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 shadow-sm">{product.name}</h1>
                        <p className="text-lg md:text-xl text-white/90 max-w-3xl drop-shadow-md">
                            {product.description}
                        </p>
                        <div className="mt-8 flex gap-4">
                            <Button size="lg" className="bg-white text-black hover:bg-white/90 font-semibold shadow-xl" asChild>
                                <Link to="/contact" search={{ productId: product.id }}>
                                    Inquire Now
                                </Link>
                            </Button>
                        </div>
                    </div>
                    {/* Back button overlay */}
                    <div className="absolute top-[120px] md:top-[140px] left-6 md:left-12 z-10">
                        <Link to="/products/$type" params={{ type: slugify(product.category) }} className="flex items-center gap-2 text-white hover:text-white/80 bg-black/20 hover:bg-black/40 backdrop-blur-md px-4 py-2 rounded-full transition-all">
                            <ArrowLeft size={16} /> Outdoor Kitchens
                        </Link>
                    </div>
                </div>

                {/* Promotions Banner Stack */}
                {relevantPromotions.length > 0 && (
                    <div className="bg-accent/10 border-b">
                        <div className="container mx-auto px-4 py-4 flex flex-col gap-2">
                            {relevantPromotions.map(promo => (
                                <PromotionBanner key={promo.id} promotion={promo} className="w-full shadow-none border bg-white/50" />
                            ))}
                        </div>
                    </div>
                )}

                {/* Gallery Masonry Area */}
                <div className="container mx-auto px-4 py-16 md:py-24">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold mb-4 tracking-tight">Gallery</h2>
                        <div className="w-16 h-1 bg-primary mx-auto rounded-full"></div>
                    </div>

                    {galleryImages.length > 0 ? (
                        <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
                            {galleryImages.map((img, idx) => (
                                <div
                                    key={idx}
                                    onClick={() => setLightboxIndex(idx)}
                                    className="group relative break-inside-avoid overflow-hidden rounded-xl cursor-pointer bg-muted shadow-sm hover:shadow-xl transition-all duration-300"
                                >
                                    <img
                                        src={img}
                                        alt={`Gallery view ${idx + 1} of ${product.name}`}
                                        className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-105"
                                        loading="lazy"
                                    />
                                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center">
                                        <div className="bg-white/90 p-3 rounded-full opacity-0 group-hover:opacity-100 transform scale-50 group-hover:scale-100 transition-all duration-300 shadow-lg">
                                            <Expand className="w-5 h-5 text-black" />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-center text-muted-foreground w-full py-12">No additional images available for this model.</p>
                    )}
                </div>

                {/* Custom Navigable Lightbox Overlay */}
                {lightboxIndex !== null && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-sm animate-in fade-in duration-200">
                        {/* Close button */}
                        <button
                            onClick={() => setLightboxIndex(null)}
                            className="absolute top-6 right-6 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors z-50 cursor-pointer"
                        >
                            <X size={24} />
                        </button>

                        {/* Gallery Title */}
                        <div className="absolute top-6 left-6 md:left-10 text-white z-50 pointer-events-none drop-shadow-md">
                            <h3 className="text-2xl md:text-3xl font-bold tracking-tight">{product.name}</h3>
                            <p className="text-white/70 text-sm mt-1">{product.brand}</p>
                        </div>

                        {/* Prev button */}
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                setLightboxIndex(prev => prev === null ? null : (prev === 0 ? galleryImages.length - 1 : prev - 1));
                            }}
                            className="absolute left-4 md:left-8 p-3 rounded-full bg-black/50 hover:bg-black/80 text-white transition-colors z-50 ring-1 ring-white/10"
                        >
                            <ChevronLeft size={32} />
                        </button>

                        {/* Image */}
                        <div className="w-full h-full p-4 md:p-12 flex items-center justify-center" onClick={() => setLightboxIndex(null)}>
                            <img
                                src={galleryImages[lightboxIndex]}
                                alt={`Enlarged view of ${product.name}`}
                                className="max-w-full max-h-full object-contain drop-shadow-2xl"
                                onClick={(e) => e.stopPropagation()}
                            />
                        </div>

                        {/* Next button */}
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                setLightboxIndex(prev => prev === null ? null : (prev === galleryImages.length - 1 ? 0 : prev + 1));
                            }}
                            className="absolute right-4 md:right-8 p-3 rounded-full bg-black/50 hover:bg-black/80 text-white transition-colors z-50 ring-1 ring-white/10"
                        >
                            <ChevronRight size={32} />
                        </button>

                        {/* Image Counter */}
                        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 px-4 py-2 rounded-full bg-black/50 backdrop-blur-md text-white/90 text-sm font-medium tracking-wider">
                            {lightboxIndex + 1} / {galleryImages.length}
                        </div>
                    </div>
                )}
            </div>
        );
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
                        {product.price > 0 && (
                            <p className="text-2xl font-semibold text-primary">
                                <span className="text-base font-normal text-muted-foreground">Starting at </span>${product.price.toLocaleString()}
                            </p>
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
                <Tabs defaultValue={defaultTab} className="w-full">
                    <TabsList className="w-full justify-start border-b rounded-none bg-transparent p-0 h-auto gap-4 flex-wrap">
                        {hasFeatures && <TabsTrigger value="features" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-4 py-3">Features</TabsTrigger>}
                        {hasAccessories && <TabsTrigger value="accessories" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-4 py-3">Accessories</TabsTrigger>}
                        {hasSpecs && <TabsTrigger value="specs" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-4 py-3">Specifications</TabsTrigger>}
                        {hasDetails && <TabsTrigger value="details" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-4 py-3">Details</TabsTrigger>}
                        {hasVideo && <TabsTrigger value="video" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-4 py-3">Video</TabsTrigger>}
                        {hasDownloads && <TabsTrigger value="downloads" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-4 py-3">Downloads</TabsTrigger>}
                    </TabsList>

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
                                    <Button key={idx} variant="outline" className="justify-start h-auto py-4 px-6 gap-3" asChild>
                                        <a href={dl.url} target="_blank" rel="noopener noreferrer">
                                            <div className="bg-primary/10 p-2 rounded-full">
                                                <Download className="h-5 w-5 text-primary" />
                                            </div>
                                            <div className="text-left">
                                                <div className="font-semibold">{dl.title}</div>
                                                <div className="text-xs text-muted-foreground">PDF Download</div>
                                            </div>
                                        </a>
                                    </Button>
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
