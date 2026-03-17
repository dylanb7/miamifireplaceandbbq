import { createFileRoute, notFound } from '@tanstack/react-router'
import { BrandSection } from '@/components/products/BrandSection'
import { getAllProducts } from '@/data/product-service'
import { getBrandData } from '@/data/brands'
import { promotions } from '@/data/promotions'
import PageLayout from '@/components/PageLayout'
import { generateSeo } from '@/lib/seo'
import { cn } from "@/lib/utils"

const slugify = (text: string) => text.toLowerCase().replace(/[^\w ]+/g, '').replace(/ +/g, '-');

export const Route = createFileRoute('/brands/$brandId')({
    loader: async ({ params }) => {
        const products = await getAllProducts();

        const allBrands = Array.from(new Set(products.map(p => p.brand)));
        const brandName = allBrands.find(b => b && slugify(b) === params.brandId);

        if (!brandName) {
            throw notFound();
        }

        const brandMetadata = getBrandData(brandName);

        return {
            brandName,
            brandMetadata,
            brandProducts: products.filter(p => p.brand === brandName),
            promotions
        }
    },
    head: ({ loaderData }) => {
        if (!loaderData) return { meta: [] };
        const { brandName, brandProducts } = loaderData;
        const categories = Array.from(new Set(brandProducts.map(p => p.category)));

        return generateSeo({
            title: `${brandName} | Miami Fireplace & BBQ`,
            description: `Shop the best ${brandName} products including ${categories.join(', ')}.`,
            type: 'website'
        })
    },
    component: BrandPage,
})

function BrandPage() {
    const { brandName, brandMetadata, promotions, brandProducts } = Route.useLoaderData()

    const productsByCategory = brandProducts.reduce((acc, product) => {
        const category = product.category || 'Other';
        if (!acc[category]) acc[category] = [];
        acc[category].push(product);
        return acc;
    }, {} as Record<string, typeof brandProducts>);

    const sortedCategories = Object.keys(productsByCategory).sort();

    return (
        <PageLayout>
            <div className="container mx-auto py-12 px-4 md:px-0">
                <div className="mb-12 flex flex-col md:flex-row items-center md:items-start gap-8 border-b pb-12">
                    {/* Logo Graphic or Fallback Text */}
                    {brandMetadata?.logo ? (
                        <div className={cn(
                            "w-48 h-48 flex-shrink-0 rounded-2xl p-6 shadow-sm border border-border flex items-center justify-center",
                            brandMetadata.whiteBackgroundOnly !== false && !brandMetadata.invertInDarkMode ? "bg-white" : "bg-card"
                        )}>
                            <img
                                src={brandMetadata.logo}
                                alt={brandMetadata.name}
                                className={cn(
                                    "max-w-full max-h-full object-contain transition-all",
                                    brandMetadata.invertInDarkMode && "dark:brightness-0 dark:invert"
                                )}
                            />
                        </div>
                    ) : (
                        <div className="w-48 h-48 flex-shrink-0 bg-muted rounded-2xl flex items-center justify-center border border-border">
                            <h1 className="text-3xl font-black text-muted-foreground">{brandName}</h1>
                        </div>
                    )}

                    {/* Rich Brand Copy */}
                    <div className="flex-1 text-center md:text-left space-y-4">
                        <h1 className="text-4xl md:text-5xl font-black tracking-tighter text-foreground">
                            {brandMetadata?.brandName || brandMetadata?.name || brandName}
                        </h1>

                        {brandMetadata?.tagline && (
                            <p className="text-xl font-semibold tracking-wide text-foreground/80 uppercase">
                                {brandMetadata.tagline}
                            </p>
                        )}

                        <p className="text-lg text-muted-foreground leading-relaxed max-w-3xl">
                            {brandMetadata?.description || `Explore our premium collection of ${brandName} products and find the perfect addition to your outdoor living space.`}
                        </p>

                        {brandMetadata?.websiteUrl && (
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

                <div className="space-y-16">
                    {sortedCategories.map(category => (
                        <div key={category}>
                            <BrandSection
                                brandName={category}
                                products={productsByCategory[category]}
                                promotions={promotions}
                                layout="grid"
                            />

                        </div>
                    ))}

                    {sortedCategories.length === 0 && (
                        <div className="text-center py-12 text-muted-foreground">
                            No products found for {brandName}.
                        </div>
                    )}
                </div>
            </div>
        </PageLayout>
    )
}
