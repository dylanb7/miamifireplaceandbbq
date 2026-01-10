import { useState } from "react";
import { Link } from "@tanstack/react-router";
import ReactMarkdown from "react-markdown";
import { ArrowLeft, Check, Download, ShoppingCart } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";


import type { Product, ProductInfo, Promotion } from "@/data/types";
import { BrandSection } from "@/components/products/BrandSection";
import { PromotionBanner } from "@/components/PromotionBanner";
import { slugify } from "@/lib/utils";

interface ProductViewProps {
    product: Product;
    info?: ProductInfo;
    relatedProducts: Product[];
    promotions: Promotion[];
}

export function ProductView({ product, info, relatedProducts, promotions }: ProductViewProps) {
    const [activeImage, /*setActiveImage*/] = useState(product.image);

    const relevantPromotions = promotions.filter(p =>
        (p.eligibleProducts && p.eligibleProducts.includes(product.id)) ||
        (p.eligibleBrands && product.brand && p.eligibleBrands.includes(product.brand)) ||
        (p.eligibleCategories && p.eligibleCategories.includes(product.category))
    );

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
                    <div className="bg-white rounded-2xl overflow-hidden border shadow-sm aspect-4/3 relative group">
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
                        <div className="flex items-center gap-2 mb-2">
                            <Badge variant="secondary" className="rounded-full px-3">{product.brand}</Badge>
                            <span className="text-sm text-muted-foreground">{product.model}</span>
                        </div>
                        <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground mb-4">{product.name}</h1>
                        <p className="text-2xl font-semibold text-primary">
                            ${product.price.toLocaleString()}
                        </p>
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

                    {/* Key Features List (Quick View) */}
                    {info?.features && (
                        <div className="bg-muted/30 rounded-xl p-6 border">
                            <h3 className="font-semibold mb-4 flex items-center gap-2">
                                <Check className="text-primary h-4 w-4" /> Key Features
                            </h3>
                            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                                {info.features.map((feature, idx) => (
                                    <li key={idx} className="flex items-start gap-2">
                                        <div className="mt-1 h-1.5 w-1.5 rounded-full bg-primary shrink-0" />
                                        <span>{feature}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
            </div>

            {/* Bottom Section: Tabs for Deep Dive */}
            <Tabs defaultValue="details" className="w-full">
                <TabsList className="w-full justify-start border-b rounded-none bg-transparent p-0 h-auto">
                    <TabsTrigger value="details" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-4 py-3">Description</TabsTrigger>
                    {info?.specifications && <TabsTrigger value="specs" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-4 py-3">Specifications</TabsTrigger>}
                    {info?.videoUrl && <TabsTrigger value="video" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-4 py-3">Video</TabsTrigger>}
                    {info?.downloads && <TabsTrigger value="downloads" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-4 py-3">Downloads</TabsTrigger>}
                </TabsList>

                <div className="py-8">
                    <TabsContent value="details" className="mt-0">
                        {info?.description ? (
                            <div className="prose prose-stone dark:prose-invert max-w-4xl">
                                <ReactMarkdown>{info.description}</ReactMarkdown>
                            </div>
                        ) : (
                            <p className="text-muted-foreground">No detailed description available.</p>
                        )}
                    </TabsContent>

                    <TabsContent value="specs" className="mt-0">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-4 max-w-4xl">
                            {info?.specifications && Object.entries(info.specifications).map(([key, value]) => (
                                <div key={key} className="flex justify-between py-3 border-b border-border/50">
                                    <span className="font-medium text-muted-foreground">{key}</span>
                                    <span className="font-medium text-foreground text-right">{value}</span>
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
                            {info?.downloads?.map((dl, idx) => (
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

            {/* Related Products */}
            {relatedProducts.length > 0 && (
                <div className="pt-8 border-t">
                    <BrandSection
                        brandName={`More from ${product.brand}`}
                        products={relatedProducts}
                        promotions={promotions}
                        simpleLayout={false} // Use carousel
                    />
                </div>
            )}
        </div>
    );
}
