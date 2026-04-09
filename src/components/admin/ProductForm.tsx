import { useState } from 'react'
import { useForm } from '@tanstack/react-form'
import { Product } from '../../data/types'
import { Plus, X, Save, Settings } from 'lucide-react'
import { Link } from '@tanstack/react-router'
import { ImageUploader } from './ImageUploader'
import { KitchenAdvancedFields } from './KitchenAdvancedFields'
import { AdvancedProductFields } from './AdvancedProductFields'
import { slugify } from '../../lib/utils'

interface ProductFormProps {
  initialData?: Product | null
  onSave: (product: Product) => Promise<void>
  defaultCategory: string
  taxonomy: Record<string, string[]>
}

export function ProductForm({ initialData, onSave, defaultCategory, taxonomy }: ProductFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const categories = Object.keys(taxonomy).sort()

  const form = useForm({
    defaultValues: initialData || {
      id: crypto.randomUUID(),
      name: '',
      description: '',
      price: 0,
      category: defaultCategory,
      brand: '',
      image: '',
      features: [],
      images: [],
    },
    onSubmit: async ({ value }) => {
      setIsSubmitting(true)
      try {
        await onSave(value as Product)
      } finally {
        setIsSubmitting(false)
      }
    },
  })

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        e.stopPropagation()
        form.handleSubmit()
      }}
      className="space-y-8"
    >
      <form.Subscribe
        selector={(state) => [state.values.category]}
        children={() => null}
      />
      {/* Basic Info Group */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium border-b border-base-300 pb-2">Basic Information</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <form.Field name="name">
            {(field) => (
              <label className="form-control w-full">
                <div className="label"><span className="label-text font-semibold">Product Name *</span></div>
                <input
                  type="text"
                  placeholder="e.g. Genesis E-325s Gas Grill"
                  className="input input-bordered border-2 border-base-300 shadow-sm bg-base-100 w-full focus:input-primary placeholder:text-base-content/40"
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  required
                />
              </label>
            )}
          </form.Field>

          <form.Field name="brand">
            {(field) => (
              <label className="form-control w-full">
                <div className="label">
                  <span className="label-text font-semibold">Brand *</span>
                  <Link to="/admin/brands/$brandId" params={{ brandId: 'new' }} className="label-text-alt link link-primary text-xs">(+ Create New Brand)</Link>
                </div>
                <form.Subscribe
                  selector={(state) => state.values.category}
                  children={(category) => {
                    const brandsForCat = taxonomy[category as string] || []
                    return (
                      <select
                        className="select select-bordered border-2 border-base-300 shadow-sm bg-base-100 w-full focus:select-primary"
                        value={field.state.value || ''}
                        onChange={(e) => field.handleChange(e.target.value)}
                        required
                      >
                        <option value="" disabled>Select a brand</option>
                        {brandsForCat.map(b => (
                          <option key={b} value={b}>{b}</option>
                        ))}
                        {field.state.value && !brandsForCat.includes(field.state.value) && (
                          <option value={field.state.value}>{field.state.value}</option>
                        )}
                      </select>
                    )
                  }}
                />
              </label>
            )}
          </form.Field>

          <form.Field name="price">
            {(field) => (
              <label className="form-control w-full">
                <div className="label"><span className="label-text font-semibold">Base Price ($)</span></div>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  className="input input-bordered border-2 border-base-300 shadow-sm bg-base-100 w-full focus:input-primary"
                  value={field.state.value}
                  onChange={(e) => field.handleChange(parseFloat(e.target.value) || 0)}
                  required
                />
              </label>
            )}
          </form.Field>

          <form.Field name="category">
            {(field) => (
              <label className="form-control w-full">
                <div className="label"><span className="label-text font-semibold">Category</span></div>
                <select
                  className="select select-bordered border-2 border-base-300 shadow-sm bg-base-100 w-full focus:select-primary"
                  value={field.state.value}
                  onChange={(e) => {
                    field.handleChange(e.target.value)
                    // Reset brand if it's not valid for the new category
                    const newBrands = taxonomy[e.target.value] || []
                    const currentBrand = form.getFieldValue('brand')
                    if (currentBrand && !newBrands.includes(currentBrand)) {
                       form.setFieldValue('brand', '')
                    }
                  }}
                >
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </label>
            )}
          </form.Field>
        </div>

        <form.Field name="description">
          {(field) => (
            <label className="form-control w-full">
              <div className="label"><span className="label-text font-semibold">Description</span></div>
              <textarea
                className="textarea textarea-bordered border-2 border-base-300 shadow-sm bg-base-100 w-full resize-y min-h-[120px] focus:textarea-primary placeholder:text-base-content/40"
                placeholder="Product description... (Supports markdown/HTML if your frontend handles it)"
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.value)}
              />
            </label>
          )}
        </form.Field>
      </div>

      {/* Main Image Group */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium border-b border-base-300 pb-2">Main Product Image</h3>
        <form.Subscribe
          selector={(state) => state.values.category}
          children={(category) => (
            <form.Field name="image">
              {(field) => (
                <div className="form-control w-full">
                  <div className="label"><span className="label-text">Hero Image *</span></div>
                  <ImageUploader 
                    value={field.state.value || ''} 
                    onChange={field.handleChange} 
                    folderPath={`product/${slugify(category)}`} 
                  />
                  <div className="label"><span className="label-text-alt opacity-70">Will be saved to public/product/{slugify(category)}</span></div>
                </div>
              )}
            </form.Field>
          )}
        />
      </div>

      {/* Features Array Group */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium border-b border-base-300 pb-2">Features</h3>
        <form.Field name="features" mode="array">
          {(field) => (
            <div className="space-y-3">
              {(field.state.value || []).map((_, i) => (
                <form.Field key={i} name={`features[${i}]`}>
                  {(subField) => (
                    <div className="flex items-center gap-2">
                      <div className="badge badge-neutral w-8 hidden sm:flex">{i + 1}</div>
                      <input
                        className="input input-bordered border-2 border-base-300 shadow-sm bg-base-100 input-sm flex-1 placeholder:text-base-content/40"
                        value={subField.state.value}
                        onChange={(e) => subField.handleChange(e.target.value)}
                        placeholder="Feature point..."
                      />
                      <button
                        type="button"
                        className="btn btn-sm btn-square btn-error btn-outline"
                        onClick={() => field.removeValue(i)}
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </form.Field>
              ))}
              <div className="pt-2">
                <button
                  type="button"
                  className="btn btn-sm btn-outline btn-primary gap-2"
                  onClick={() => field.pushValue('')}
                >
                  <Plus className="w-4 h-4" />
                  Add Feature
                </button>
              </div>
            </div>
          )}
        </form.Field>
      </div>

      {/* Additional Images Gallery */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium border-b border-base-300 pb-2">Additional Images (Gallery)</h3>
        <form.Field name="images" mode="array">
          {(field) => (
            <div className="space-y-3">
              {(field.state.value || []).map((_, i) => (
                <div key={i} className="flex flex-col gap-2 p-4 bg-base-200 rounded-lg border border-base-300 relative">
                  <button
                    type="button"
                    className="btn btn-xs btn-circle btn-error absolute -top-2 -right-2 z-10"
                    onClick={() => field.removeValue(i)}
                  >
                    <X className="w-3 h-3" />
                  </button>

                  <form.Field name={`images[${i}].url`}>
                    {(subField) => (
                      <form.Subscribe
                        selector={(state) => state.values.category}
                        children={(category) => (
                          <div className="form-control w-full">
                            <div className="label pt-0 pb-1"><span className="label-text text-xs font-semibold">Gallery Image</span></div>
                            <ImageUploader 
                              value={subField.state.value || ''} 
                              onChange={subField.handleChange} 
                              folderPath={`product/${slugify(category)}`} 
                            />
                          </div>
                        )}
                      />
                    )}
                  </form.Field>

                  <form.Field name={`images[${i}].alt`}>
                    {(subField) => (
                      <label className="form-control w-full">
                        <div className="label py-1"><span className="label-text text-xs font-semibold">Alt Text (Optional)</span></div>
                        <input
                          className="input input-bordered border-2 border-base-300 shadow-sm input-sm w-full bg-base-100"
                          value={subField.state.value || ''}
                          onChange={(e) => subField.handleChange(e.target.value)}
                        />
                      </label>
                    )}
                  </form.Field>
                </div>
              ))}
              <div className="pt-2">
                <button
                  type="button"
                  className="btn btn-sm btn-outline btn-primary gap-2"
                  onClick={() => field.pushValue({ url: '', alt: '' })}
                >
                  <Plus className="w-4 h-4" />
                  Add Gallery Image
                </button>
              </div>
            </div>
          )}
        </form.Field>
      </div>

      <form.Subscribe selector={(state) => state.values.category}>
        {(category) => (
          category === 'Outdoor Kitchens' ? (
            <KitchenAdvancedFields form={form} />
          ) : null
        )}
      </form.Subscribe>

      <AdvancedProductFields form={form} />

      <div className="pt-6 border-t border-base-300 sticky bottom-0 bg-base-100/90 backdrop-blur pb-6 z-20">
        <form.Subscribe
          selector={(state) => [state.canSubmit, state.isSubmitting]}
          children={([canSubmit, isHandling]) => (
            <button
              type="submit"
              disabled={!canSubmit || isSubmitting || isHandling}
              className="btn btn-primary w-full sm:w-auto min-w-[200px]"
            >
              {(isSubmitting || isHandling) ? (
                <span className="loading loading-spinner loading-sm"></span>
              ) : (
                <Save className="w-5 h-5 mr-1" />
              )}
              Save Product
            </button>
          )}
        />
      </div>
    </form>
  )
}
