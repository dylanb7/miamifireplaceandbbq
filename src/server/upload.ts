import { createServerFn } from '@tanstack/react-start'
import * as fs from 'fs/promises'
import * as path from 'path'

export interface UploadImageInput {
  base64Data: string
  fileName: string
  folderPath: string // Example: "product/grills" or "brand-logos"
}

export const uploadAdminImage = createServerFn({ method: 'POST' })
  .inputValidator((data: UploadImageInput) => data)
  .handler(async ({ data: { base64Data, fileName, folderPath } }) => {
    // 1. Validate inputs
    if (!base64Data || !fileName || !folderPath) {
      throw new Error("Missing required upload fields")
    }

    // Strip the "data:image/jpeg;base64," prefix if it exists
    const base64Content = base64Data.replace(/^data:image\/\w+;base64,/, "")
    const imageBuffer = Buffer.from(base64Content, 'base64')

    // 2. Resolve safe path inside public directory
    const publicDir = path.join(process.cwd(), 'public')
    const targetDir = path.join(publicDir, folderPath)

    // Ensure we aren't writing outside public (path traversal protection)
    if (!targetDir.startsWith(publicDir)) {
      throw new Error("Invalid folder path")
    }

    // 3. Ensure directory exists
    await fs.mkdir(targetDir, { recursive: true })

    // 4. Sanitize and ensure unique filename
    const safeFileName = fileName.replace(/[^a-zA-Z0-9.-]/g, '_')
    // Get extension and basename
    const ext = path.extname(safeFileName)
    const base = path.basename(safeFileName, ext)
    
    // Add timestamp to ensure uniqueness just in case
    const uniqueFileName = `${base}-${Date.now()}${ext}`
    
    // 5. Write the file
    const filePath = path.join(targetDir, uniqueFileName)
    await fs.writeFile(filePath, imageBuffer)

    // 6. Return the URL path relative to "public"
    // (e.g., "/product/grills/my-image-12345.jpg")
    // Note: ensure posix slashes for URLs
    const urlPath = `/${folderPath}/${uniqueFileName}`.replace(/\\/g, '/')
    
    return urlPath
  })
