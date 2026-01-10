import { createFileRoute } from '@tanstack/react-router'
import { generateSeo } from '@/lib/seo'
import { ProductsBrowser } from '@/components/products/ProductsBrowser'
import { products } from '@/data/products'
import { promotions } from '@/data/promotions'
import PageLayout from '@/components/PageLayout'

export const Route = createFileRoute('/products/$type/$brand')({
    component: BrandPage,
    loader: async ({ params }) => {
        const { type, brand } = params

        const typeMap: Record<string, string> = {
            "hot-tubs": "Hot Tubs",
            "outdoor-kitchens": "Outdoor Kitchens",
            "grills": "Grills",
            "fireplaces": "Fireplaces",
            "gas-logs": "Gas Logs"
        };

        const category = typeMap[type];

        const categoryProducts = category ? products.filter(p => p.category === category) : [];

        return {
            products: categoryProducts,
            promotions,
            initialType: type,
            initialBrand: brand,
            categoryName: category || "Products",
            brandName: brand.split('-').map(s => s.charAt(0).toUpperCase() + s.slice(1)).join(' ')
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
    const { products, promotions, initialType, initialBrand } = Route.useLoaderData()

    return (
        <PageLayout>
            <div className="container mx-auto py-8">
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
