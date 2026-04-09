import { Plus, X } from 'lucide-react'
import { ImageUploader } from './ImageUploader'

export function KitchenAdvancedFields({ form }: { form: any }) {
  // Using form: any here to avoid complex TanStack inference issues,
  // but it's bound strictly to FormApi<Product, any> in practice.

  return (
    <div className="space-y-6 pt-4 border-t border-base-300">
      <div className="flex items-center gap-2">
        <h3 className="text-xl font-bold">Outdoor Kitchen Settings</h3>
        <span className="badge badge-primary">Advanced</span>
      </div>

      <div className="bg-base-100 p-6 rounded-xl border-2 border-base-300 shadow-sm space-y-6">
        {/* Simple Top Level Additions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <form.Field name="shortDescription">
            {(field: any) => (
              <label className="form-control w-full">
                <div className="label"><span className="label-text font-semibold">Short Description</span></div>
                <input
                  type="text"
                  placeholder="e.g. Modular, weather-tight aluminum cabinetry..."
                  className="input input-bordered border-2 border-base-300 shadow-sm bg-base-100 w-full focus:input-primary placeholder:text-base-content/40"
                  value={field.state.value || ''}
                  onChange={(e) => field.handleChange(e.target.value)}
                />
              </label>
            )}
          </form.Field>

          <form.Field name="model">
            {(field: any) => (
              <label className="form-control w-full">
                <div className="label"><span className="label-text font-semibold">Base Model ID/Name</span></div>
                <input
                  type="text"
                  placeholder="e.g. CD-COASTAL-64"
                  className="input input-bordered border-2 border-base-300 shadow-sm bg-base-100 w-full focus:input-primary placeholder:text-base-content/40"
                  value={field.state.value || ''}
                  onChange={(e) => field.handleChange(e.target.value)}
                />
              </label>
            )}
          </form.Field>
        </div>

        {/* Accordions for deeply nested arrays */}
        <div className="join join-vertical w-full bg-base-200">
          
          {/* Models Accordion */}
          <div className="collapse collapse-arrow join-item border border-base-300">
            <input type="radio" name="kitchen-accordions" defaultChecked /> 
            <div className="collapse-title text-lg font-medium">Layout Models (Series Variations)</div>
            <div className="collapse-content space-y-4">
              <form.Field name="models" mode="array">
                {(field: any) => (
                  <div className="space-y-4 pt-2">
                    {(field.state.value || []).map((_: any, i: number) => (
                      <div key={i} className="bg-base-100 p-4 rounded-lg border border-base-300 relative">
                        <button
                          type="button"
                          className="btn btn-xs btn-circle btn-error absolute top-2 right-2 z-10"
                          onClick={() => field.removeValue(i)}
                        >
                          <X className="w-3 h-3" />
                        </button>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <form.Field name={`models[${i}].id`}>
                            {(subField: any) => (
                              <label className="form-control w-full">
                                <div className="label"><span className="label-text text-xs font-semibold">Model ID</span></div>
                                <input
                                  className="input input-bordered border-2 border-base-300 shadow-sm bg-base-100 input-sm w-full"
                                  value={subField.state.value || ''}
                                  onChange={(e) => subField.handleChange(e.target.value)}
                                  placeholder="e.g. cd-coastal-64-kddw"
                                />
                              </label>
                            )}
                          </form.Field>

                          <form.Field name={`models[${i}].name`}>
                            {(subField: any) => (
                              <label className="form-control w-full">
                                <div className="label"><span className="label-text text-xs font-semibold">Model Name</span></div>
                                <input
                                  className="input input-bordered border-2 border-base-300 shadow-sm bg-base-100 input-sm w-full"
                                  value={subField.state.value || ''}
                                  onChange={(e) => subField.handleChange(e.target.value)}
                                  placeholder="e.g. Coastal 64 KDDW"
                                />
                              </label>
                            )}
                          </form.Field>

                          <div className="col-span-1 sm:col-span-2">
                            <form.Field name={`models[${i}].description`}>
                              {(subField: any) => (
                                <label className="form-control w-full">
                                  <div className="label"><span className="label-text text-xs font-semibold">Description</span></div>
                                  <textarea
                                    className="textarea textarea-bordered border-2 border-base-300 shadow-sm bg-base-100 w-full"
                                    value={subField.state.value || ''}
                                    onChange={(e) => subField.handleChange(e.target.value)}
                                    placeholder="Model description..."
                                  />
                                </label>
                              )}
                            </form.Field>
                          </div>

                          <div className="col-span-1 sm:col-span-2">
                            <form.Field name={`models[${i}].image`}>
                              {(subField: any) => (
                                <div className="form-control w-full">
                                  <div className="label"><span className="label-text text-xs font-semibold">Model Image</span></div>
                                  <ImageUploader 
                                    value={subField.state.value || ''} 
                                    onChange={subField.handleChange} 
                                    folderPath={`product/outdoor-kitchens`} 
                                  />
                                </div>
                              )}
                            </form.Field>
                          </div>
                          
                          {/* We omit deeply mapping nested model.features in this basic view for sanity, but they can be supported similarly if needed */}
                        </div>
                      </div>
                    ))}
                    <button
                      type="button"
                      className="btn btn-sm btn-outline btn-primary gap-2"
                      onClick={() => field.pushValue({ id: '', name: '', description: '', features: [], specs: {}, image: '', images: [] })}
                    >
                      <Plus className="w-4 h-4" /> Add Model
                    </button>
                  </div>
                )}
              </form.Field>
            </div>
          </div>

          {/* Colorways Accordion */}
          <div className="collapse collapse-arrow join-item border border-base-300">
            <input type="radio" name="kitchen-accordions" /> 
            <div className="collapse-title text-lg font-medium">Colorways & Finishes</div>
            <div className="collapse-content space-y-4">
              <form.Field name="colorways" mode="array">
                {(field: any) => (
                  <div className="space-y-4 pt-2">
                    {(field.state.value || []).map((_: any, i: number) => (
                      <div key={i} className="bg-base-100 p-4 rounded-lg border border-base-300 mb-4">
                        <div className="flex items-center justify-between mb-2">
                            <form.Field name={`colorways[${i}].name`}>
                              {(subField: any) => (
                                <label className="form-control w-64">
                                  <div className="label py-1"><span className="label-text text-xs font-bold">Category Name</span></div>
                                  <input
                                    className="input input-bordered border-2 border-base-300 shadow-sm bg-base-100 input-sm w-full"
                                    value={subField.state.value || ''}
                                    onChange={(e) => subField.handleChange(e.target.value)}
                                    placeholder="e.g. Base Color Options"
                                  />
                                </label>
                              )}
                            </form.Field>
                            <button type="button" className="btn btn-xs btn-error btn-outline" onClick={() => field.removeValue(i)}>Remove Category</button>
                        </div>
                        
                        {/* Nested Options */}
                        <div className="pl-4 border-l-2 border-base-300">
                           <form.Field name={`colorways[${i}].options`} mode="array">
                               {(optionsField: any) => (
                                 <div className="space-y-2 mt-4">
                                   <div className="label py-0"><span className="label-text text-xs font-semibold">Options</span></div>
                                   {(optionsField.state.value || []).map((__: any, j: number) => (
                                      <div key={j} className="flex flex-wrap sm:flex-nowrap gap-2 items-center bg-base-200 p-2 rounded relative">
                                        <form.Field name={`colorways[${i}].options[${j}].name`}>
                                            {(optField: any) => (
                                              <input
                                                className="input input-bordered border-2 border-base-300 bg-base-100 input-xs w-32 sm:w-40"
                                                value={optField.state.value || ''}
                                                onChange={(e) => optField.handleChange(e.target.value)}
                                                placeholder="e.g. Bronze"
                                              />
                                            )}
                                        </form.Field>
                                        <form.Field name={`colorways[${i}].options[${j}].color`}>
                                            {(optField: any) => (
                                              <input
                                                type="color"
                                                className="w-8 h-8 rounded border-none cursor-pointer p-0 bg-transparent"
                                                value={optField.state.value || '#000000'}
                                                onChange={(e) => optField.handleChange(e.target.value)}
                                              />
                                            )}
                                        </form.Field>
                                        <form.Field name={`colorways[${i}].options[${j}].image`}>
                                            {(optField: any) => (
                                              <input
                                                className="input input-bordered border-2 border-base-300 bg-base-100 input-xs flex-1"
                                                value={optField.state.value || ''}
                                                onChange={(e) => optField.handleChange(e.target.value)}
                                                placeholder="Or provide texture URL..."
                                              />
                                            )}
                                        </form.Field>
                                        <button type="button" className="btn btn-xs btn-square btn-ghost text-error" onClick={() => optionsField.removeValue(j)}>
                                          <X className="w-3 h-3" />
                                        </button>
                                      </div>
                                   ))}
                                   <button type="button" className="btn btn-xs mt-2" onClick={() => optionsField.pushValue({ name: '', color: '#000000' })}>
                                     + Add Option
                                   </button>
                                 </div>
                               )}
                           </form.Field>
                        </div>
                      </div>
                    ))}
                    <button
                      type="button"
                      className="btn btn-sm btn-outline btn-primary gap-2"
                      onClick={() => field.pushValue({ name: '', options: [] })}
                    >
                      <Plus className="w-4 h-4" /> Add Colorway Category
                    </button>
                  </div>
                )}
              </form.Field>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}
