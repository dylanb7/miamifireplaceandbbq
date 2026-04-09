import { useState, useCallback, useRef } from 'react'
import { Upload, X, Loader2 } from 'lucide-react'
import { uploadAdminImage } from '../../server/upload'

interface ImageUploaderProps {
  value: string
  onChange: (value: string) => void
  folderPath: string // e.g., 'product/grills' or 'brand-logos'
  className?: string
}

export function ImageUploader({ value, onChange, folderPath, className = '' }: ImageUploaderProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }, [])

  const processFile = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      setError('Please upload a valid image file.')
      return
    }

    try {
      setIsUploading(true)
      setError(null)

      // Convert file to base64
      const reader = new FileReader()
      reader.onloadend = async () => {
        try {
          const base64Data = reader.result as string
          
          // Call our server function
          const uploadedUrl = await uploadAdminImage({
            data: {
              base64Data,
              fileName: file.name,
              folderPath
            }
          })

          onChange(uploadedUrl)
        } catch (err: any) {
          console.error("Upload error:", err)
          setError(err.message || 'Failed to upload image')
        } finally {
          setIsUploading(false)
        }
      }
      reader.readAsDataURL(file)
    } catch (err: any) {
      setIsUploading(false)
      setError(err.message || 'Failed to read file')
    }
  }

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    const file = e.dataTransfer.files?.[0]
    if (file) {
      processFile(file)
    }
  }, [folderPath])

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      processFile(file)
    }
  }

  const handleClear = () => {
    onChange('')
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {/* File Dropzone */}
      <div 
        className={`relative border-2 border-dashed rounded-xl transition-colors overflow-hidden ${
          isDragging ? 'border-primary bg-primary/10' : 'border-base-300 hover:border-base-content/30 bg-base-200/50'
        } ${value ? 'aspect-auto' : 'aspect-video flex items-center justify-center'}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <input 
          type="file" 
          ref={fileInputRef} 
          className="hidden" 
          accept="image/*"
          onChange={handleFileSelect}
        />

        {value ? (
          <div className="relative group w-full flex items-center justify-center bg-base-300/30 p-4">
               <img 
                 src={value} 
                 alt="Preview" 
                 className="max-h-64 object-contain rounded-lg"
               />
               <button
                 type="button"
                 onClick={handleClear}
                 className="btn btn-sm btn-circle btn-error absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
               >
                 <X className="w-4 h-4" />
               </button>
          </div>
        ) : (
          <div className="text-center p-8 cursor-pointer" onClick={() => fileInputRef.current?.click()}>
            {isUploading ? (
              <Loader2 className="w-10 h-10 text-primary animate-spin mx-auto mb-3" />
            ) : (
              <Upload className="w-10 h-10 text-base-content/30 mx-auto mb-3" />
            )}
            <p className="font-semibold text-base-content/80">
              {isUploading ? 'Uploading...' : 'Click or drag image to upload'}
            </p>
            <p className="text-sm text-base-content/50 mt-1">SVG, PNG, JPG or AVIF</p>
          </div>
        )}
        
        {/* Loading overlay for dragging new file over existing preview */}
        {value && isUploading && (
          <div className="absolute inset-0 bg-base-100/80 backdrop-blur flex items-center justify-center z-10">
            <Loader2 className="w-10 h-10 text-primary animate-spin" />
          </div>
        )}
      </div>

      {error && (
        <div className="text-error text-sm mt-1 font-medium">{error}</div>
      )}

      {/* Manual URL entry fallback */}
      <label className="form-control w-full">
        <div className="label pt-0 pb-1"><span className="label-text-alt opacity-70">Or provide image URL manually</span></div>
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="/images/example.jpg OR https://..."
            className="input input-bordered input-sm bg-base-100 w-full focus:input-primary flex-1"
            value={value}
            onChange={(e) => onChange(e.target.value)}
          />
        </div>
      </label>
    </div>
  )
}
