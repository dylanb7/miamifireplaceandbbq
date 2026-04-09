import { getAdminProductsByCategory, deleteProduct } from '../../../../server/admin'
import { Plus, Edit3, Trash2, Image as ImageIcon, Filter } from 'lucide-react'
import { useState, useMemo } from 'react'
import { useRouter, createFileRoute, Link } from '@tanstack/react-router'

export const Route = createFileRoute('/admin/products/$categoryId/')({
  component: CategoryAdminPage,
  loader: async ({ params }) => {
    return await getAdminProductsByCategory({ data: params.categoryId })
  },
})

function CategoryAdminPage() {
  const { categoryId } = Route.useParams()
  const products = Route.useLoaderData()
  const router = useRouter()
  const [selectedBrand, setSelectedBrand] = useState<string>('all')
  const [isDeleting, setIsDeleting] = useState<string | null>(null)

  const handleDelete = async (productId: string, productName: string) => {
    if (!window.confirm(`Are you sure you want to delete "${productName}"? This action cannot be undone.`)) {
      return
    }

    setIsDeleting(productId)
    try {
      const result = await deleteProduct({ data: { categoryId, productId } })
      if (result.success) {
        await router.invalidate()
      } else {
        alert(result.error || 'Failed to delete product')
      }
    } catch (e) {
      alert('An error occurred while deleting')
    } finally {
      setIsDeleting(null)
    }
  }

  const uniqueBrands = useMemo(() => {
    const brands = new Set(products.map(p => p.brand).filter(Boolean))
    return Array.from(brands).sort()
  }, [products])

  const filteredProducts = useMemo(() => {
    if (selectedBrand === 'all') return products
    return products.filter(p => p.brand === selectedBrand)
  }, [products, selectedBrand])

  return (
    <div key={categoryId} className="space-y-6">
      <div className="flex justify-between items-center bg-base-100 p-6 rounded-xl border border-base-300 shadow-sm">
        <div>
          <h1 className="text-2xl font-bold capitalize">{categoryId.replace(/-/g, ' ')} Management</h1>
          <p className="text-sm text-base-content/70 mt-1">Manage your {filteredProducts.length} items</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative flex items-center">
            <Filter className="w-4 h-4 absolute left-3 text-base-content/50" />
            <select
              className="select select-bordered select-sm pl-9 pr-8 focus:select-primary bg-base-100"
              value={selectedBrand}
              onChange={(e) => setSelectedBrand(e.target.value)}
            >
              <option value="all">All Brands</option>
              {uniqueBrands.map(brand => (
                <option key={brand as string} value={brand as string}>{brand}</option>
              ))}
            </select>
          </div>
          <Link
            to="/admin/products/$categoryId/$productId"
            params={{ categoryId, productId: 'new' }}
            className="btn btn-primary btn-sm h-9"
          >
            <Plus className="w-4 h-4 mr-1" />
            Add New Item
          </Link>
        </div>
      </div>
      <div className="overflow-x-auto bg-base-100 rounded-xl border border-base-300 shadow-sm">
        <table className="table w-full">
          <thead>
            <tr className="bg-base-200">
              <th>Preview</th>
              <th>Name</th>
              <th>Brand</th>
              <th>Price</th>
              <th className="text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.map((product) => (
              <tr key={product.id} className="hover:bg-base-200/50 transition-colors">
                <td className="w-24">
                  {product.image ? (
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-16 h-16 object-cover rounded-lg border border-base-300 bg-white"
                      loading="lazy"
                    />
                  ) : (
                    <div className="w-16 h-16 bg-base-300 flex items-center justify-center rounded-lg">
                      <ImageIcon className="w-6 h-6 text-base-content/40" />
                    </div>
                  )}
                </td>
                <td className="font-medium">{product.name}</td>
                <td>
                  <span className="badge badge-neutral bg-base-300 border-base-300 text-base-content font-medium px-3 py-3">
                    {product.brand || 'No Brand'}
                  </span>
                </td>
                <td className="font-monot font-medium">
                  ${product.price.toLocaleString()}
                </td>
                <td className="text-right">
                  <div className="flex justify-end gap-2">
                    <Link
                      to="/admin/products/$categoryId/$productId"
                      params={{ categoryId, productId: product.id }}
                      className="btn btn-sm btn-ghost gap-2"
                    >
                      <Edit3 className="w-4 h-4" />
                      Edit
                    </Link>
                    <button
                      onClick={() => handleDelete(product.id, product.name)}
                      disabled={isDeleting === product.id}
                      className="btn btn-sm btn-ghost text-error gap-2"
                    >
                      {isDeleting === product.id ? (
                        <span className="loading loading-spinner loading-xs"></span>
                      ) : (
                        <Trash2 className="w-4 h-4" />
                      )}
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {filteredProducts.length === 0 && (
              <tr>
                <td colSpan={5} className="text-center py-12">
                  <p className="text-base-content/60 text-lg">No items found.</p>
                  {selectedBrand !== 'all' && (
                    <button 
                      onClick={() => setSelectedBrand('all')}
                      className="btn btn-sm btn-ghost mt-2"
                    >
                      Clear Filter
                    </button>
                  )}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
