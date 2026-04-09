import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { getAdminProductById, saveProduct, getTaxonomy, deleteProduct } from '../../../../server/admin'
import { ProductForm } from '../../../../components/admin/ProductForm'
import { ArrowLeft, Trash2 } from 'lucide-react'
import { useState } from 'react'
import { Product } from '../../../../data/types'

export const Route = createFileRoute('/admin/products/$categoryId/$productId')({
  component: ProductEditorPage,
  loader: async ({ params }) => {
    const taxonomy = await getTaxonomy()
    
    if (params.productId === 'new') {
      return { product: null, taxonomy }
    }
    
    const product = await getAdminProductById({ data: { categoryId: params.categoryId, productId: params.productId } })
    return { product, taxonomy }
  },
})

function ProductEditorPage() {
  const { product, taxonomy } = Route.useLoaderData()
  const { categoryId } = Route.useParams()
  const navigate = useNavigate()
  const [isDeleting, setIsDeleting] = useState(false)

  const handleSave = async (updatedProduct: Product) => {
    await saveProduct({ data: { categoryId, product: updatedProduct } })
    navigate({ to: '/admin/products/$categoryId', params: { categoryId } })
  }

  const handleDelete = async () => {
    if (!product) return
    if (!window.confirm(`Are you sure you want to delete "${product.name}"? This action cannot be undone.`)) {
      return
    }

    setIsDeleting(true)
    try {
      const result = await deleteProduct({ data: { categoryId, productId: product.id } })
      if (result.success) {
        navigate({ to: '/admin/products/$categoryId', params: { categoryId } })
      } else {
        alert(result.error || 'Failed to delete product')
      }
    } catch (e) {
      alert('An error occurred while deleting')
    } finally {
      setIsDeleting(false)
    }
  }

  // Find the exact taxonomy key (since categoryId might be "outdoor-kitchens" but taxonomy key is "Outdoor Kitchens")
  // We'll guess the key by finding a match, or just use category raw
  const taxonomyKey = Object.keys(taxonomy).find(k => k.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '') === categoryId) || categoryId

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate({ to: '/admin/products/$categoryId', params: { categoryId } })}
            className="btn btn-circle btn-ghost"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold capitalize">{product ? `Edit ${categoryId.replace(/-/g, ' ')}` : `New ${categoryId.replace(/-/g, ' ')}`}</h1>
            <p className="text-sm text-base-content/70">
              {product ? `Editing ${product.name}` : 'Create a new product listing'}
            </p>
          </div>
        </div>

        {product && (
          <button
            onClick={handleDelete}
            disabled={isDeleting}
            className="btn btn-ghost text-error gap-2"
          >
            {isDeleting ? (
              <span className="loading loading-spinner loading-xs"></span>
            ) : (
              <Trash2 className="w-5 h-5" />
            )}
            Delete Product
          </button>
        )}
      </div>

      <div className="bg-base-100 p-6 sm:p-8 rounded-xl border border-base-300 shadow-sm">
        <ProductForm 
          initialData={product as Product} 
          onSave={handleSave} 
          defaultCategory={taxonomyKey as string} 
          taxonomy={taxonomy}
        />
      </div>
    </div>
  )
}
