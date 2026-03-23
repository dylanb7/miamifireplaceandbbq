import { createFileRoute, notFound } from '@tanstack/react-router'
import { ProductView } from '@/components/products/ProductView'
import { getProductById, getProductsByCategory, minifyProducts } from '@/data/product-service'
import { promotions } from '@/data/promotions'
import { PRODUCT_INFO } from '@/data/product-info'
import PageLayout from '@/components/PageLayout'

import { generateSeo } from '@/lib/seo'

export const Route = createFileRoute('/product/$productId')({
    loader: async ({ params }) => {
        const product = await getProductById({ data: { id: params.productId } });

        if (!product) {
            throw notFound()
        }

        const info = PRODUCT_INFO[product.id]

        // Only load the products from its own category for related products
        let relatedProducts: any[] = [];
        if (product.category) {
            const categoryProducts = await getProductsByCategory({ data: product.category });
            relatedProducts = categoryProducts
                .filter(p => p.brand === product.brand && p.id !== product.id)
                .slice(0, 8);
        }

        return {
            product,
            info,
            relatedProducts: minifyProducts(relatedProducts),
            promotions
        }
    },
    head: ({ loaderData }) => {
        if (!loaderData) return { meta: [] };
        return generateSeo({
            title: `${loaderData.product.name} | ${loaderData.product.brand}`,
            description: loaderData.product.description,
            image: loaderData.product.image,
            type: 'product',
        })
    },
    component: ProductPage,
})

function ProductPage() {
    const loaderData = Route.useLoaderData()

    if (!loaderData || !loaderData.product) {
        return (
            <PageLayout>
                <div className="container mx-auto py-20 text-center">
                    <h1 className="text-2xl font-bold">Product Not Found</h1>
                </div>
            </PageLayout>
        )
    }

    const { product, info, relatedProducts, promotions } = loaderData

    return (
        <PageLayout noPadding={product.category === 'Outdoor Kitchens'}>
            <ProductView
                product={product}
                info={info}
                relatedProducts={relatedProducts}
                promotions={promotions}
            />
        </PageLayout>
    )
}
