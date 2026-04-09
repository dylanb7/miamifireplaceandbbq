import { Plus, X, FileText, Settings, ListPlus, BadgePlus } from 'lucide-react'

export function AdvancedProductFields({ form }: { form: any }) {
  return (
    <div className="collapse collapse-arrow bg-base-200 border border-base-300 rounded-xl">
      <input type="checkbox" name="advanced-settings-accordion" /> 
      <div className="collapse-title text-lg font-bold flex items-center gap-2 py-4">
        <Settings className="w-5 h-5 text-primary" />
        Advanced Product Settings (Specs, Downloads, Misc)
      </div>
      <div className="collapse-content space-y-8 pt-4 border-t border-base-300/50">
        
        {/* Specifications Section */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-primary font-semibold border-b border-base-300 pb-2">
            <Settings className="w-4 h-4" />
            Specifications (Key : Value)
          </div>
          <form.Field name="specs">
            {(field: any) => {
              const specs = field.state.value || {}
              const specKeys = Object.keys(specs)
              
              const updateSpecKey = (oldKey: string, newKey: string) => {
                const val = specs[oldKey]
                const newSpecs = { ...specs }
                delete newSpecs[oldKey]
                newSpecs[newKey] = val
                field.handleChange(newSpecs)
              }

              const updateSpecValue = (key: string, newVal: string) => {
                field.handleChange({ ...specs, [key]: newVal })
              }

              const removeSpec = (key: string) => {
                const newSpecs = { ...specs }
                delete newSpecs[key]
                field.handleChange(newSpecs)
              }

              const addSpec = () => {
                field.handleChange({ ...specs, '': '' })
              }

              return (
                <div className="space-y-2">
                  {specKeys.map((key) => (
                    <div key={key} className="flex gap-2 items-center bg-base-100 p-2 rounded-lg border border-base-300 shadow-sm">
                      <input
                        className="input input-bordered input-sm w-1/3 bg-base-200"
                        placeholder="Label (e.g. BTU)"
                        value={key}
                        onChange={(e) => updateSpecKey(key, e.target.value)}
                      />
                      <input
                        className="input input-bordered input-sm flex-1 bg-base-100"
                        placeholder="Value (e.g. 30,000)"
                        value={specs[key]}
                        onChange={(e) => updateSpecValue(key, e.target.value)}
                      />
                      <button type="button" className="btn btn-sm btn-square btn-ghost text-error" onClick={() => removeSpec(key)}>
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                  <button type="button" className="btn btn-xs btn-outline btn-primary mt-2" onClick={addSpec}>
                    <Plus className="w-3 h-3 mr-1" /> Add Spec Line
                  </button>
                </div>
              )
            }}
          </form.Field>
        </div>

        {/* Downloads Section */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-primary font-semibold border-b border-base-300 pb-2">
            <FileText className="w-4 h-4" />
            Downloads (Manuals, Specs, Brochures)
          </div>
          <form.Field name="downloads" mode="array">
            {(field: any) => (
              <div className="space-y-3">
                {(field.state.value || []).map((_: any, i: number) => (
                  <div key={i} className="flex flex-wrap sm:flex-nowrap gap-2 items-end bg-base-100 p-4 rounded-lg border border-base-300 relative shadow-sm">
                    <button
                      type="button"
                      className="btn btn-xs btn-circle btn-error absolute -top-2 -right-2 z-10"
                      onClick={() => field.removeValue(i)}
                    >
                      <X className="w-3 h-3" />
                    </button>
                    <form.Field name={`downloads[${i}].type`}>
                      {(subField: any) => (
                        <label className="form-control w-24">
                          <span className="label-text-alt font-bold mb-1 pl-1">Type</span>
                          <input className="input input-bordered input-xs bg-base-200" placeholder="PDF" value={subField.state.value || ''} onChange={(e) => subField.handleChange(e.target.value)} />
                        </label>
                      )}
                    </form.Field>
                    <form.Field name={`downloads[${i}].name`}>
                      {(subField: any) => (
                        <label className="form-control flex-1">
                          <span className="label-text-alt font-bold mb-1 pl-1">Display Name</span>
                          <input className="input input-bordered input-xs" placeholder="Owner's Manual" value={subField.state.value || ''} onChange={(e) => subField.handleChange(e.target.value)} />
                        </label>
                      )}
                    </form.Field>
                    <form.Field name={`downloads[${i}].url`}>
                      {(subField: any) => (
                        <label className="form-control flex-1">
                          <span className="label-text-alt font-bold mb-1 pl-1">External URL</span>
                          <input className="input input-bordered input-xs" placeholder="https://..." value={subField.state.value || ''} onChange={(e) => subField.handleChange(e.target.value)} />
                        </label>
                      )}
                    </form.Field>
                  </div>
                ))}
                <button type="button" className="btn btn-xs btn-outline btn-primary mt-2" onClick={() => field.pushValue({ type: 'PDF', name: '', url: '' })}>
                  <Plus className="w-3 h-3 mr-1" /> Add Download
                </button>
              </div>
            )}
          </form.Field>
        </div>

        {/* Categories / Accessories (Simple String Array) */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-primary font-semibold border-b border-base-300 pb-2">
            <BadgePlus className="w-4 h-4" />
            Accessories (ID or Name)
          </div>
          <form.Field name="accessories" mode="array">
            {(field: any) => (
              <div className="space-y-2">
                {(field.state.value || []).map((_: any, i: number) => (
                  <form.Field key={i} name={`accessories[${i}]`}>
                    {(subField: any) => (
                      <div className="flex gap-2 items-center">
                        <input
                          className="input input-bordered input-sm flex-1"
                          value={subField.state.value || ''}
                          onChange={(e) => subField.handleChange(e.target.value)}
                          placeholder="Accessory ID..."
                        />
                        <button type="button" className="btn btn-sm btn-square btn-ghost text-error" onClick={() => field.removeValue(i)}>
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </form.Field>
                ))}
                <button type="button" className="btn btn-xs btn-outline btn-primary mt-2" onClick={() => field.pushValue('')}>
                  <Plus className="w-3 h-3 mr-1" /> Add Accessory
                </button>
              </div>
            )}
          </form.Field>
        </div>

        {/* Misc Blocks Section (Universal) */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-primary font-semibold border-b border-base-300 pb-2">
            <ListPlus className="w-4 h-4" />
            Misc Blocks (Custom Info Lists)
          </div>
          <form.Field name="misc" mode="array">
            {(field: any) => (
              <div className="space-y-4">
                {(field.state.value || []).map((_: any, i: number) => (
                  <div key={i} className="bg-base-100 p-4 rounded-xl border border-base-300 shadow-sm relative">
                    <button
                      type="button"
                      className="btn btn-xs btn-circle btn-error absolute top-4 right-4 z-10"
                      onClick={() => field.removeValue(i)}
                    >
                      <X className="w-3 h-3" />
                    </button>
                    
                    <form.Field name={`misc[${i}].name`}>
                      {(subField: any) => (
                        <label className="form-control w-full sm:w-64 mb-4">
                          <span className="label-text-alt font-bold mb-1">Block Title</span>
                          <input
                            className="input input-bordered input-sm bg-base-200"
                            value={subField.state.value || ''}
                            onChange={(e) => subField.handleChange(e.target.value)}
                            placeholder="e.g. Options"
                          />
                        </label>
                      )}
                    </form.Field>
                    
                    <form.Field name={`misc[${i}].content`} mode="array">
                      {(contentField: any) => (
                        <div className="space-y-2 mt-2 pl-4 border-l-2 border-primary/30">
                          {(contentField.state.value || []).map((__: any, j: number) => (
                            <div key={j} className="flex gap-2">
                              <form.Field name={`misc[${i}].content[${j}]`}>
                                {(strField: any) => (
                                  <input
                                    className="input input-bordered input-xs flex-1"
                                    value={strField.state.value || ''}
                                    onChange={(e) => strField.handleChange(e.target.value)}
                                    placeholder="e.g. Shaker Door Style"
                                  />
                                )}
                              </form.Field>
                              <button type="button" className="btn btn-xs btn-square btn-ghost text-error" onClick={() => contentField.removeValue(j)}>
                                <X className="w-3 h-3" />
                              </button>
                            </div>
                          ))}
                          <button type="button" className="btn btn-xs btn-ghost btn-primary mt-1" onClick={() => contentField.pushValue('')}>
                            + Add Item
                          </button>
                        </div>
                      )}
                    </form.Field>
                  </div>
                ))}
                <button type="button" className="btn btn-sm btn-outline btn-primary mt-2" onClick={() => field.pushValue({ name: '', content: [] })}>
                  <Plus className="w-4 h-4 mr-1" /> Add Custom Misc Block
                </button>
              </div>
            )}
          </form.Field>
        </div>

      </div>
    </div>
  )
}
