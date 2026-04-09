import { createFileRoute, Link } from '@tanstack/react-router'
import { getTaxonomy, saveTaxonomy, getBrands } from '../../../server/admin'
import { useState } from 'react'
import { X, Plus, Save, Tag } from 'lucide-react'

export const Route = createFileRoute('/admin/brands/')({
  component: BrandsAdminPage,
  loader: async () => {
    const [taxonomy, brands] = await Promise.all([
      getTaxonomy(),
      getBrands()
    ])
    return { taxonomy, brands }
  },
})

function BrandsAdminPage() {
  const { taxonomy: initialTaxonomy, brands } = Route.useLoaderData()
  
  // We manage the entire object in state to allow batch edits before saving.
  const [taxonomy, setTaxonomy] = useState<Record<string, string[]>>(initialTaxonomy)
  const [newBrandValues, setNewBrandValues] = useState<Record<string, string>>({})
  const [newCategoryName, setNewCategoryName] = useState('')
  const [isSaving, setIsSaving] = useState(false)

  const handleAddCategory = () => {
    const cat = newCategoryName.trim()
    if (!cat || taxonomy[cat]) return
    setTaxonomy(prev => ({ ...prev, [cat]: [] }))
    setNewCategoryName('')
  }

  const handleAddBrand = (category: string) => {
    const val = newBrandValues[category]?.trim()
    if (!val) return

    setTaxonomy(prev => {
      const existing = prev[category] || []
      if (existing.includes(val)) return prev
      
      return {
        ...prev,
        [category]: [...existing, val].sort((a, b) => a.localeCompare(b))
      }
    })

    setNewBrandValues(prev => ({ ...prev, [category]: '' }))
  }

  const handleRemoveBrand = (category: string, brandToRemove: string) => {
    setTaxonomy(prev => ({
      ...prev,
      [category]: (prev[category] || []).filter(b => b !== brandToRemove)
    }))
  }

  const handleSave = async () => {
    setIsSaving(true)
    try {
      await saveTaxonomy({ data: taxonomy })
      // Optionally fire a toast notification here
    } finally {
      setIsSaving(false)
    }
  }

  // Categories are dynamically pulled from taxonomy keys
  const categories = Object.keys(taxonomy).sort((a, b) => a.localeCompare(b))

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-base-100 p-6 rounded-xl border border-base-300 shadow-sm gap-4">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Tag className="w-6 h-6 text-primary" />
            Brand Manager
          </h1>
          <p className="text-sm text-base-content/70 mt-1">Manage Rich Brands and assign them to categories.</p>
        </div>
      </div>

      {/* Rich Brands Table */}
      <div className="bg-base-100 rounded-xl border border-base-300 shadow-sm overflow-hidden">
        <div className="flex justify-between items-center p-6 border-b border-base-200">
          <h2 className="text-lg font-bold">Rich Brand Profiles</h2>
          <Link
            to="/admin/brands/$brandId"
            params={{ brandId: 'new' }}
            className="btn btn-primary btn-sm h-9"
          >
            <Plus className="w-4 h-4 mr-1" />
            Add New Brand
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="table w-full">
            <thead>
              <tr className="bg-base-200">
                <th>Brand ID / Name</th>
                <th>Display Name</th>
                <th>Website URL</th>
                <th className="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {brands.map((brand) => (
                <tr key={brand.name} className="hover:bg-base-200/50 transition-colors">
                  <td className="font-medium">{brand.name}</td>
                  <td>{brand.brandName || <span className="opacity-50">N/A</span>}</td>
                  <td>
                    {brand.websiteUrl ? (
                      <a href={brand.websiteUrl} target="_blank" rel="noreferrer" className="link link-hover text-primary">{brand.websiteUrl}</a>
                    ) : (
                      <span className="opacity-50">N/A</span>
                    )}
                  </td>
                  <td className="text-right">
                    <Link
                      to="/admin/brands/$brandId"
                      params={{ brandId: brand.name }}
                      className="btn btn-sm btn-ghost"
                    >
                      Edit
                    </Link>
                  </td>
                </tr>
              ))}
              {brands.length === 0 && (
                <tr>
                  <td colSpan={4} className="text-center py-8 text-base-content/50">
                    No rich brands found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Taxonomy Manager */}
      <div className="bg-base-100 p-6 rounded-xl border border-base-300 shadow-sm space-y-4">
        <div className="flex justify-between items-center border-b border-base-200 pb-4">
          <div>
            <h2 className="text-lg font-bold">Taxonomy Assignments</h2>
            <p className="text-sm text-base-content/70 mt-1">Which brands show up under which main categories.</p>
          </div>
          <button 
            onClick={handleSave} 
            disabled={isSaving}
            className="btn btn-primary min-w-[120px]"
          >
            {isSaving ? <span className="loading loading-spinner loading-sm"></span> : <Save className="w-4 h-4 mr-1" />}
            Save Assignments
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
          {categories.map(category => (
          <div key={category} className="bg-base-100 p-6 rounded-xl border border-base-300 shadow-sm flex flex-col">
            <h3 className="text-lg font-bold border-b border-base-200 pb-3 mb-4">{category}</h3>
            
            <div className="flex-1 overflow-y-auto max-h-64 pr-2 space-y-2">
              {(taxonomy[category] || []).length === 0 ? (
                <p className="text-sm text-base-content/50 italic py-2">No brands added.</p>
              ) : (
                (taxonomy[category] || []).map(brand => (
                  <div key={brand} className="flex justify-between items-center bg-base-200 px-3 py-2 rounded-lg group">
                    <span className="font-medium text-sm">{brand}</span>
                    <button
                      onClick={() => handleRemoveBrand(category, brand)}
                      className="btn btn-ghost btn-xs btn-circle text-base-content/40 hover:text-error hover:bg-error/10 opacity-0 group-hover:opacity-100 transition-opacity"
                      title="Remove Brand"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))
              )}
            </div>

            <div className="mt-4 pt-4 border-t border-base-200 flex gap-2">
              <select
                className="select select-bordered border-2 border-base-300 shadow-sm select-sm flex-1 bg-base-100"
                value={newBrandValues[category] || ''}
                onChange={(e) => setNewBrandValues(prev => ({ ...prev, [category]: e.target.value }))}
              >
                <option value="" disabled>Select brand to add...</option>
                {brands
                  .map(b => b.name)
                  .filter(name => !(taxonomy[category] || []).includes(name))
                  .sort((a,b) => a.localeCompare(b))
                  .map(name => (
                    <option key={name} value={name}>{name}</option>
                  ))
                }
              </select>
              <button 
                onClick={() => handleAddBrand(category)}
                className="btn btn-primary btn-sm btn-square"
                disabled={!newBrandValues[category]?.trim()}
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}

          {/* Create New Category Card */}
          <div className="bg-base-200/50 p-6 rounded-xl border-2 border-dashed border-base-300 flex flex-col items-center justify-center text-center space-y-4">
            <h3 className="font-bold text-base-content/70">Create New Category</h3>
            <p className="text-xs text-base-content/50 max-w-xs">Adding a category instantly creates it across the admin interface allowing you to map products to it.</p>
            <div className="flex gap-2 w-full max-w-xs">
              <input
                type="text"
                placeholder="e.g. Pizza Ovens"
                className="input input-bordered border-2 border-base-300 shadow-sm input-sm flex-1 bg-base-100"
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleAddCategory()
                }}
              />
              <button 
                onClick={handleAddCategory}
                className="btn btn-primary btn-sm"
                disabled={!newCategoryName.trim() || !!taxonomy[newCategoryName.trim()]}
              >
                Add
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}
