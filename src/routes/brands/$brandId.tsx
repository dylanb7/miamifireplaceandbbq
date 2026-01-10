import { createFileRoute, notFound } from '@tanstack/react-router'
import { BrandSection } from '@/components/products/BrandSection'
import { products } from '@/data/products'
import { promotions } from '@/data/promotions'
import PageLayout from '@/components/PageLayout'
import { generateSeo } from '@/lib/seo'

const slugify = (text: string) => text.toLowerCase().replace(/[^\w ]+/g, '').replace(/ +/g, '-');

const getBrandNameFromSlug = (slug: string) => {
    const allBrands = Array.from(new Set(products.map(p => p.brand)));
    return allBrands.find(b => b && slugify(b) === slug);
}

export const Route = createFileRoute('/brands/$brandId')({
    loader: ({ params }) => {
        const brandName = getBrandNameFromSlug(params.brandId);
        if (!brandName) {
            throw notFound();
        }
        return {
            brandName,
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
    const { brandName, promotions, brandProducts } = Route.useLoaderData()

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
                <div className="mb-12 text-center md:text-left">
                    <h1 className="text-4xl font-bold tracking-tight mb-4">{brandName}</h1>
                    <p className="text-muted-foreground text-lg max-w-2xl">
                        Explore our premium collection of {brandName} products.
                    </p>
                </div>

                <div className="space-y-16">
                    {sortedCategories.map(category => (
                        <div key={category}>
                            <BrandSection
                                brandName={category}
                                products={productsByCategory[category]}
                                promotions={promotions}
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
