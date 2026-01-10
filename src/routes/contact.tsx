import { createFileRoute } from '@tanstack/react-router'
import PageLayout from '@/components/PageLayout'
import { ContactUs } from '@/components/contact-us'
import { interestOptions, productOptions } from '@/data/contact-options'
import { generateSeo } from '@/lib/seo'
import { products } from '@/data/products'

type ContactSearchParams = {
    productId?: string
}

export const Route = createFileRoute('/contact')({
    validateSearch: (search: Record<string, unknown>): ContactSearchParams => {
        return {
            productId: search.productId as string,
        }
    },
    component: ContactPage,
    loaderDeps: ({ search }) => {
        return { productId: search.productId };
    },
    loader: async ({ deps: { productId } }) => {
        const product = await products.find(p => p.id === productId);
        return { product };
    },
    head: () => generateSeo({
        title: 'Contact Us | Miami Fireplace & BBQ',
        description: 'Get in touch with Miami Fireplace & BBQ. Visit our showrooms in Miami and Davie or send us a message.',
        type: 'website'
    })
})

function ContactPage() {
    const { product } = Route.useLoaderData();

    return (
        <PageLayout hideFooterContact>
            <div className="container mx-auto py-12 px-4 max-w-4xl">
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold tracking-tight mb-4 text-foreground">Contact Us</h1>
                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                        {product ? (
                            <span>
                                Complete the form below to get a quote, check availability, or schedule a consultation for the <span className="font-semibold text-foreground">{product.name}</span>.
                            </span>
                        ) : (
                            "Have questions about our products? Ready to start your outdoor project? Fill out the form below or visit one of our showrooms."
                        )}
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
                    {/* Showroom Info Cards could go here if we wanted to duplicate them or import Showrooms component */}
                    {/* For now, just centering the form */}
                </div>

                <div className="max-w-xl mx-auto">
                    <div className="bg-card rounded-xl border shadow-sm p-6 md:p-8">
                        <ContactUs
                            interestOptions={interestOptions}
                            productOptions={productOptions}
                            productInquiry={product}
                            hideTitle
                        />
                    </div>
                </div>
            </div>
        </PageLayout>
    )
}
