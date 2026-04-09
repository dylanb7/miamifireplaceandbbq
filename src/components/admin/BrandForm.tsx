import { useForm } from '@tanstack/react-form'
import { BrandData } from '../../data/brands'
import { useState } from 'react'
import { Save } from 'lucide-react'
import { ImageUploader } from './ImageUploader'

interface BrandFormProps {
  initialData?: BrandData | null
  onSave: (brand: BrandData & { originalName?: string }) => Promise<void>
}

export function BrandForm({ initialData, onSave }: BrandFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm({
    defaultValues: initialData || {
      name: '',
      brandName: '',
      logo: '',
      tagline: '',
      description: '',
      websiteUrl: '',
      invertInDarkMode: false,
      whiteBackgroundOnly: false
    } as BrandData,
    onSubmit: async ({ value }) => {
      setIsSubmitting(true)
      try {
        await onSave({
          ...value,
          originalName: initialData?.name
        })
      } finally {
        setIsSubmitting(false)
      }
    }
  })

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <form
        onSubmit={(e) => {
          e.preventDefault()
          e.stopPropagation()
          form.handleSubmit()
        }}
        className="space-y-8"
      >
        {/* Basic Information */}
        <section className="bg-base-100 p-6 sm:p-8 rounded-xl border border-base-300 shadow-sm space-y-6">
          <h3 className="text-lg font-bold border-b border-base-200 pb-3">Brand Identity</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <form.Field name="name">
              {(field) => (
                <label className="form-control w-full">
                  <div className="label"><span className="label-text font-semibold">Brand ID/Name *</span></div>
                  <input
                    type="text"
                    placeholder="e.g. Weber Grills"
                    className="input input-bordered border-2 border-base-300 shadow-sm bg-base-100 w-full focus:input-primary placeholder:text-base-content/40"
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    required
                  />
                  <div className="label"><span className="label-text-alt text-base-content/60">The primary unique identifier (matches taxonomy strings).</span></div>
                </label>
              )}
            </form.Field>

            <form.Field name="brandName">
              {(field) => (
                <label className="form-control w-full">
                  <div className="label"><span className="label-text font-semibold">Display Name (Short)</span></div>
                  <input
                    type="text"
                    placeholder="e.g. Weber"
                    className="input input-bordered border-2 border-base-300 shadow-sm bg-base-100 w-full focus:input-primary placeholder:text-base-content/40"
                    value={field.state.value || ''}
                    onChange={(e) => field.handleChange(e.target.value)}
                  />
                </label>
              )}
            </form.Field>

            <form.Field name="websiteUrl">
              {(field) => (
                <label className="form-control w-full">
                  <div className="label"><span className="label-text font-semibold">Website URL</span></div>
                  <input
                    type="text"
                    placeholder="https://..."
                    className="input input-bordered border-2 border-base-300 shadow-sm bg-base-100 w-full focus:input-primary placeholder:text-base-content/40"
                    value={field.state.value || ''}
                    onChange={(e) => field.handleChange(e.target.value)}
                  />
                </label>
              )}
            </form.Field>

            <form.Field name="logo">
              {(field) => (
                <div className="form-control w-full col-span-1 md:col-span-2 mt-4">
                  <div className="label"><span className="label-text font-semibold">Brand Logo</span></div>
                  <ImageUploader 
                    value={field.state.value || ''} 
                    onChange={field.handleChange} 
                    folderPath="brand-logos" 
                  />
                  <div className="label"><span className="label-text-alt text-base-content/60">Upload SVG, PNG, AVIF or WEBP. Transparent background preferred.</span></div>
                </div>
              )}
            </form.Field>
          </div>

          <form.Field name="tagline">
            {(field) => (
              <label className="form-control w-full">
                <div className="label"><span className="label-text font-semibold">Tagline</span></div>
                <input
                  type="text"
                  placeholder="e.g. Discover what's possible."
                  className="input input-bordered border-2 border-base-300 shadow-sm bg-base-100 w-full focus:input-primary placeholder:text-base-content/40"
                  value={field.state.value || ''}
                  onChange={(e) => field.handleChange(e.target.value)}
                />
              </label>
            )}
          </form.Field>

          <form.Field name="description">
            {(field) => (
              <label className="form-control w-full">
                <div className="label"><span className="label-text font-semibold">Description</span></div>
                <textarea
                  className="textarea textarea-bordered border-2 border-base-300 shadow-sm bg-base-100 w-full resize-y min-h-[120px] focus:textarea-primary placeholder:text-base-content/40"
                  placeholder="Long form brand description..."
                  value={field.state.value || ''}
                  onChange={(e) => field.handleChange(e.target.value)}
                />
              </label>
            )}
          </form.Field>
        </section>

        {/* Display Settings */}
        <section className="bg-base-100 p-6 sm:p-8 rounded-xl border border-base-300 shadow-sm space-y-6">
          <h3 className="text-lg font-bold border-b border-base-200 pb-3">Display Settings</h3>
          
          <div className="flex flex-col gap-4">
            <form.Field name="invertInDarkMode">
              {(field) => (
                <label className="cursor-pointer label justify-start gap-4 p-0">
                  <input 
                    type="checkbox" 
                    className="checkbox checkbox-primary border-2 border-base-300 shadow-sm" 
                    checked={field.state.value} 
                    onChange={(e) => field.handleChange(e.target.checked)} 
                  />
                  <div>
                    <span className="label-text font-semibold block">Invert in Dark Mode</span>
                    <span className="label-text-alt text-base-content/60">If the logo is pure black, checking this will invert it to white in dark themes.</span>
                  </div>
                </label>
              )}
            </form.Field>

            <form.Field name="whiteBackgroundOnly">
              {(field) => (
                <label className="cursor-pointer label justify-start gap-4 p-0 mt-4">
                  <input 
                    type="checkbox" 
                    className="checkbox checkbox-primary border-2 border-base-300 shadow-sm" 
                    checked={field.state.value} 
                    onChange={(e) => field.handleChange(e.target.checked)} 
                  />
                  <div>
                    <span className="label-text font-semibold block">Force White Background</span>
                    <span className="label-text-alt text-base-content/60">If the logo needs a solid white background card to be visible in dark themes.</span>
                  </div>
                </label>
              )}
            </form.Field>
          </div>
        </section>

        <div className="pt-4 flex justify-end">
          <form.Subscribe
            selector={(state) => [state.canSubmit, state.isSubmitting]}
            children={([canSubmit, isSubmittingForm]) => (
              <button
                type="submit"
                className="btn btn-primary"
                disabled={!canSubmit || isSubmitting || isSubmittingForm}
              >
                {isSubmitting ? (
                  <span className="loading loading-spinner loading-sm"></span>
                ) : (
                  <Save className="w-5 h-5 mr-1" />
                )}
                Save Brand Profile
              </button>
            )}
          />
        </div>
      </form>
    </div>
  )
}
