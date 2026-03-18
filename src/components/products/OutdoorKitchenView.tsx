import { Product } from "@/data/types";
import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { Link } from "@tanstack/react-router";
import { ArrowLeft, Check, ChevronLeft, ChevronRight, Expand, X } from "lucide-react";
import { slugify } from "@/lib/utils";
import { DownloadCard } from "./DownloadCard";
import { Badge } from "../ui/badge";

export function OutdoorKitchen({ product }: { product: Product }) {

    const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

    const galleryFromImages = product.images?.map(img => img.url) || [];
    const galleryImages = [product.image, ...galleryFromImages, ...(product.gallery || [])]
        .filter((img, index, self) => img && self.indexOf(img) === index);

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
    return (
        <div className="flex flex-col w-full min-h-screen pt-[104px]">

            <div className="relative w-full h-[50vh] md:h-[60vh] lg:h-[70vh] bg-black">
                <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover opacity-80"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end pt-16 pb-16 px-6 md:px-12 lg:px-24">
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
                <div className="absolute top-6 left-6 md:left-12 z-10">
                    <Link to="/products/$type" params={{ type: slugify(product.category) }} className="flex items-center gap-2 text-white hover:text-white/80 bg-black/20 hover:bg-black/40 backdrop-blur-md px-4 py-2 rounded-full transition-all">
                        <ArrowLeft size={16} /> Outdoor Kitchens
                    </Link>
                </div>
            </div>

            {/* Features & Models Section */}
            <div className="container mx-auto px-4 py-16 space-y-24">
                {/* Series Features */}
                {product.features && product.features.length > 0 && (
                    <div className="max-w-4xl mx-auto">
                        <h2 className="text-3xl font-bold mb-8 text-center tracking-tight">Series Features</h2>
                        <ul className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-4">
                            {product.features.map((feature, idx) => (
                                <li key={idx} className="flex items-start gap-3 group">
                                    <Check className="h-6 w-6 text-primary shrink-0 mt-0.5" />
                                    <span className="text-lg text-muted-foreground group-hover:text-foreground transition-colors">{feature}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}

                {/* Models Grid */}
                {product.models && product.models.length > 0 && (
                    <div>
                        <div className="text-center mb-12">
                            <h2 className="text-3xl font-bold mb-4 tracking-tight">Models & Components</h2>
                            <div className="w-16 h-1 bg-primary mx-auto rounded-full"></div>
                            <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">
                                Explore the different configurations and components available for the {product.name}.
                            </p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {product.models.map((model) => (
                                <div key={model.id} className="bg-muted/30 rounded-2xl overflow-hidden border border-border/50 flex flex-col hover:shadow-lg transition-all duration-300">
                                    {model.image && (
                                        <div className="aspect-video relative overflow-hidden bg-white">
                                            <img
                                                src={model.image}
                                                alt={model.name}
                                                className="w-full h-full object-contain p-4"
                                            />
                                        </div>
                                    )}
                                    <div className="p-6 flex-1 flex flex-col">
                                        <h3 className="text-xl font-bold mb-2">{model.name}</h3>
                                        {model.description && <p className="text-sm text-muted-foreground mb-4">{model.description}</p>}
                                        {model.features && (
                                            <ul className="space-y-2 mt-auto">
                                                {model.features.slice(0, 4).map((f, i) => (
                                                    <li key={i} className="text-xs flex items-center gap-2">
                                                        <div className="w-1 h-1 rounded-full bg-primary" />
                                                        {f}
                                                    </li>
                                                ))}
                                                {model.features.length > 4 && (
                                                    <li className="text-xs text-primary font-medium">+{model.features.length - 4} more features</li>
                                                )}
                                            </ul>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Colorways Section */}
                {product.colorways && product.colorways.length > 0 && (
                    <div className="space-y-16">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl font-bold mb-4 tracking-tight">Color Options</h2>
                            <div className="w-16 h-1 bg-primary mx-auto rounded-full"></div>
                            <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">
                                Customize your kitchen with our premium finishes.
                            </p>
                        </div>
                        <div className="space-y-16">
                            {product.colorways.map((cw, idx) => (
                                <div key={idx} className="space-y-8">
                                    <h3 className="text-xl font-semibold text-center">{cw.name}</h3>
                                    <div className="flex flex-wrap gap-8 justify-center max-w-4xl mx-auto">
                                        {cw.options.map((opt, i) => (
                                            <div key={i} className="flex flex-col items-center gap-3 group">
                                                {opt.color ? (
                                                    <div
                                                        className="w-20 h-20 rounded-full border-2 border-white shadow-md transition-transform group-hover:scale-110 duration-300"
                                                        style={{ backgroundColor: opt.color }}
                                                    />
                                                ) : opt.image ? (
                                                    <div className="w-20 h-20 rounded-full border-2 border-white shadow-md overflow-hidden group-hover:scale-110 transition-transform duration-300">
                                                        <img src={opt.image} alt={opt.name} className="w-full h-full object-cover" />
                                                    </div>
                                                ) : (
                                                    <div className="w-20 h-20 rounded-full border-2 border-dashed border-muted-foreground/30 flex items-center justify-center bg-white group-hover:scale-110 transition-transform duration-300">
                                                        <span className="text-[10px] text-center px-1 font-medium">{opt.name}</span>
                                                    </div>
                                                )}
                                                <span className="text-sm font-medium text-center max-w-[100px]">{opt.name}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

            </div>

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

            {/* Downloads Section for Series */}
            {product.downloads && product.downloads.length > 0 && (
                <div className="bg-black/5 border-t">
                    <div className="container mx-auto px-4 py-16">
                        <h2 className="text-3xl font-bold mb-12 text-center">Resources & Downloads</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6 max-w-4xl mx-auto">
                            {product.downloads.map((dl, idx) => (
                                <DownloadCard key={idx} name={dl.name} type={dl.type} url={dl.url} />
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
