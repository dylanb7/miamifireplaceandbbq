import PageLayout from '@/components/PageLayout'
import { FeaturedBrands } from '@/components/home/FeaturedBrands'
import { FinancingSection } from '@/components/home/FinancingSection'
import { Hero } from '@/components/home/Hero'
import { Showrooms } from '@/components/home/Showrooms'
import { Testimonials } from '@/components/home/Testimonials'
import { createFileRoute } from '@tanstack/react-router'

import { generateSeo } from '@/lib/seo'

export const Route = createFileRoute('/')({
  component: HomePage,
  head: () => generateSeo({
    title: 'Miami Fireplace & BBQ | Grills, Outdoor Kitchens & Fireplaces in Miami',
    description: 'Transform your backyard with our premium selection of outdoor kitchens, grills, and fireplaces. Visit our showroom today.',
    keywords: 'miami fireplace, bbq, outdoor kitchens, grills'
  })
})

function HomePage() {
  return (
    <PageLayout noPadding>
      <Hero />

      <FeaturedBrands />
      <FinancingSection />
      <Showrooms />
      <Testimonials />
    </PageLayout>
  )
}
