import { createFileRoute } from '@tanstack/react-router'
import { ProductsBrowser } from '@/components/products/ProductsBrowser'
import { products } from '@/data/products'
import { promotions } from '@/data/promotions'
import PageLayout from '@/components/PageLayout'

import { generateSeo } from '@/lib/seo'

export const Route = createFileRoute('/products/$type')({
    component: ProductTypePage,
    loader: async ({ params }) => {

        const typeSlug = params.type;

        const typeMap: Record<string, string> = {
            "hot-tubs": "Hot Tubs",
            "outdoor-kitchens": "Outdoor Kitchens",
            "grills": "Grills",
            "fireplaces": "Fireplaces",
            "gas-logs": "Gas Logs"
        };
        const category = typeMap[typeSlug];

        return {
            products: category ? products.filter(p => p.category === category) : [],
            promotions,
            typeSlug,
            categoryName: category || "Products"
        }
    },
    head: ({ loaderData }) => {
        if (!loaderData) return { meta: [] };
        return generateSeo({
            title: `${loaderData.categoryName} in Miami | Miami Fireplace & BBQ`,
            description: `Explore our premium selection of ${loaderData.categoryName.toLowerCase()} in Miami. Best brands, best prices.`,
            type: 'website'
        })
    }
})

function ProductTypePage() {
    const { products, promotions, typeSlug } = Route.useLoaderData()

    return (
        <PageLayout>
            <div className="container mx-auto py-8">
                <ProductsBrowser
                    products={products}
                    promotions={promotions}
                    initialType={typeSlug}
                />
            </div>
        </PageLayout>
    )
}
