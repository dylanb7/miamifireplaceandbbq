import { createFileRoute } from '@tanstack/react-router'
import { getAllProducts, minifyProducts } from '@/data/product-service'
import { promotions } from '@/data/promotions'
import { ProductsBrowser } from '@/components/products/ProductsBrowser'
import PageLayout from '@/components/PageLayout'

export const Route = createFileRoute('/products/')({
    component: ProductsIndexPage,
    loader: async () => {
        const products = await getAllProducts();
        return {
            products: minifyProducts(products),
            promotions
        }
    }
})

function ProductsIndexPage() {
    const { products, promotions } = Route.useLoaderData()
    return (
        <PageLayout>
            <div className="container mx-auto py-8">
                <ProductsBrowser
                    products={products}
                    promotions={promotions}
                    initialType="All"
                />
            </div>
        </PageLayout>
    )
}
