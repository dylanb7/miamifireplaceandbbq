import PageLayout from '@/components/PageLayout'
import { FeaturedBrands } from '@/components/home/FeaturedBrands'
//import { FinancingSection } from '@/components/home/FinancingSection'
import { HeroOption2 } from '@/components/home/HeroOption2'
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
      {/* <div className="bg-destructive/10 text-destructive text-center py-2 font-bold uppercase tracking-wider text-xs border-b border-destructive/20 relative z-50">Original Hero (Option 1)</div>
      <Hero /> */}


      <HeroOption2 />

      {/* <div className="bg-blue-500/20 text-blue-500 text-center py-2 font-bold uppercase tracking-wider text-xs border-y border-blue-500/20 relative z-50">Option 3: Asymmetric Split Screen + Hover Reveal</div>
      <HeroOption3 /> */}

      <FeaturedBrands />
      {/*<FinancingSection />*/}
      <Showrooms />
      {/*<Testimonials />*/}
    </PageLayout>
  )
}
