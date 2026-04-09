import { createFileRoute, useNavigate, Link } from '@tanstack/react-router'
import { getAdminBrandById, saveAdminBrand } from '../../../server/admin'
import { BrandForm } from '../../../components/admin/BrandForm'
import { ArrowLeft } from 'lucide-react'
import { BrandData } from '../../../data/brands'

export const Route = createFileRoute('/admin/brands/$brandId')({
  component: BrandEditorPage,
  loader: async ({ params }) => {
    if (params.brandId === 'new') {
      return null
    }
    return await getAdminBrandById({ data: params.brandId })
  },
})

function BrandEditorPage() {
  const brand = Route.useLoaderData()
  const navigate = useNavigate()

  const handleSave = async (updatedBrand: BrandData & { originalName?: string }) => {
    await saveAdminBrand({ data: updatedBrand })
    // Return to the brands list
    navigate({ to: '/admin/brands' })
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex items-center gap-4 bg-base-100 p-4 sm:p-6 rounded-xl border border-base-300 shadow-sm">
        <Link 
          to="/admin/brands" 
          className="btn btn-ghost btn-circle btn-sm"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-xl sm:text-2xl font-bold">
            {brand ? `Edit Brand: ${brand.name}` : 'Create New Brand'}
          </h1>
          <p className="text-sm text-base-content/70 mt-1">
            Build out the rich profile used across the frontend.
          </p>
        </div>
      </div>

      <div className="bg-base-100 p-6 sm:p-8 rounded-xl border border-base-300 shadow-sm">
        {/* We cast brand to BrandData, if it's null the form handles it as creation */}
        <BrandForm initialData={brand as BrandData} onSave={handleSave} />
      </div>
    </div>
  )
}
