import { createFileRoute } from '@tanstack/react-router'
import { generateSeo } from '@/lib/seo'
import { ProductsBrowser } from '@/components/products/ProductsBrowser'
import { getProductsByCategory, minifyProducts } from '@/data/product-service'
import { getBrandData } from '@/data/brands'
import { promotions } from '@/data/promotions'
import PageLayout from '@/components/PageLayout'
import { cn } from '@/lib/utils'

export const Route = createFileRoute('/products/$type/$brand')({
    component: BrandPage,
    loader: async ({ params }) => {
        const { type, brand } = params as { type: string, brand: string }

        const typeMap: Record<string, string> = {
            "hot-tubs": "Hot Tubs",
            "outdoor-kitchens": "Outdoor Kitchens",
            "fireplaces": "Fireplaces",
            "gas-logs": "Gas Logs"
        };

        const category = typeMap[type];

        const categoryProducts = await getProductsByCategory({ data: type });
        const resolvedBrandName = brand.split('-').map(s => s.charAt(0).toUpperCase() + s.slice(1)).join(' ');


        const realBrandName = categoryProducts.find(p => p.brand && p.brand.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '') === brand)?.brand || resolvedBrandName;

        const brandMetadata = getBrandData(realBrandName);

        return {
            products: minifyProducts(categoryProducts),
            promotions,
            initialType: type,
            initialBrand: brand,
            categoryName: category || "Products",
            brandName: realBrandName,
            brandMetadata
        }
    },
    head: ({ loaderData }) => {
        if (!loaderData) return { meta: [] };
        return generateSeo({
            title: `${loaderData.brandName} ${loaderData.categoryName} | Miami Fireplace & BBQ`,
            description: `Shop the best ${loaderData.brandName} ${loaderData.categoryName.toLowerCase()} at Miami Fireplace & BBQ.`,
            type: 'website'
        })
    }
})

function BrandPage() {
    const { products, promotions, initialType, initialBrand, brandMetadata } = Route.useLoaderData()

    return (
        <PageLayout>
            <div className="container mx-auto py-8 px-4 md:px-0">
                {/* Unified Rich Brand Hero Injection */}
                {brandMetadata && (
                    <div className="mb-12 flex flex-col md:flex-row items-center md:items-start gap-8 border-b pb-12 w-full mt-4 animate-in fade-in duration-500">
                        {/* Logo Graphic */}
                        {brandMetadata.logo && (
                            <div className={cn(
                                "w-48 h-48 flex-shrink-0 rounded-2xl p-6 shadow-sm border border-border flex items-center justify-center",
                                brandMetadata.whiteBackgroundOnly !== false && !brandMetadata.invertInDarkMode ? "bg-white" : "bg-card"
                            )}>
                                <img
                                    src={brandMetadata.logo}
                                    alt={brandMetadata.name}
                                    className={cn(
                                        "max-w-full max-h-full object-contain",
                                        brandMetadata.invertInDarkMode && "dark:brightness-0 dark:invert"
                                    )}
                                />
                            </div>
                        )}

                        {/* Rich Brand Copy */}
                        <div className="flex-1 text-center md:text-left space-y-4">
                            <h1 className="text-4xl md:text-5xl font-black tracking-tighter text-foreground">
                                {brandMetadata.brandName || brandMetadata.name}
                            </h1>

                            {brandMetadata.tagline && (
                                <p className="text-xl font-semibold tracking-wide text-foreground/80 uppercase">
                                    {brandMetadata.tagline}
                                </p>
                            )}

                            {brandMetadata.description && (
                                <p className="text-lg text-muted-foreground leading-relaxed max-w-3xl">
                                    {brandMetadata.description}
                                </p>
                            )}

                            {brandMetadata.websiteUrl && (
                                <div className="pt-4">
                                    <a
                                        href={brandMetadata.websiteUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-primary transition-colors hover:underline hover:underline-offset-4"
                                    >
                                        Visit Official Website
                                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>
                                    </a>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                <ProductsBrowser
                    products={products}
                    promotions={promotions}
                    initialType={initialType}
                    initialBrand={initialBrand}
                />
            </div>
        </PageLayout>
    )
}
