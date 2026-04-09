import { createServerFn } from '@tanstack/react-start'
import * as fs from 'fs/promises'
import * as path from 'path'
import { Product } from '../data/types'
import { BrandData } from '../data/brands'

const dataDir = path.join(process.cwd(), 'src', 'data')

export const getAdminProductsByCategory = createServerFn({ method: "GET" })
  .inputValidator((categoryId: string) => categoryId)
  .handler(async ({ data: categoryId }) => {
    // e.g. "grills" or "accessories" -> file name is usually lowercased/slugified
    // Wait, the taxonomy key is often "Grills", so we slugify it first.
    // We already have slugify, but we can just use simple lowercase replace here.
    const fileSlug = categoryId.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '')
    const targetPath = path.join(dataDir, 'products', `${fileSlug}.json`)
    
    try {
      const content = await fs.readFile(targetPath, 'utf-8')
      return JSON.parse(content) as Product[]
    } catch (e) {
      // If the file doesn't exist yet, return an empty array! This allows instant creation of new categories.
      return []
    }
  })

export const getAdminProductById = createServerFn({ method: "GET" })
  .inputValidator((params: { categoryId: string, productId: string }) => params)
  .handler(async ({ data: { categoryId, productId } }) => {
    const fileSlug = categoryId.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '')
    const targetPath = path.join(dataDir, 'products', `${fileSlug}.json`)
    
    try {
      const content = await fs.readFile(targetPath, 'utf-8')
      const products = JSON.parse(content) as Product[]
      return products.find(p => p.id === productId)
    } catch(e) {
      return undefined
    }
  })

export const saveProduct = createServerFn({ method: "POST" })
  .inputValidator((params: { categoryId: string, product: Product }) => params)
  .handler(async ({ data: { categoryId, product } }) => {
    // 1. Determine target file from product.category
    const targetSlug = (product.category || categoryId).toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '')
    const targetPath = path.join(dataDir, 'products', `${targetSlug}.json`)
    
    // 2. Determine source file (where it originated from)
    const sourceSlug = categoryId.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '')
    const sourcePath = path.join(dataDir, 'products', `${sourceSlug}.json`)

    // 3. Update/Add to target file
    let targetProducts: Product[] = []
    try {
      const content = await fs.readFile(targetPath, 'utf-8')
      targetProducts = JSON.parse(content)
    } catch(e) {}
    
    const existingIndex = targetProducts.findIndex(p => p.id === product.id)
    if (existingIndex > -1) {
      targetProducts[existingIndex] = product
    } else {
      targetProducts.push(product)
    }
    await fs.writeFile(targetPath, JSON.stringify(targetProducts, null, 2), 'utf-8')

    // 4. If we moved categories, remove from the source file
    if (targetSlug !== sourceSlug) {
      try {
        const sourceContent = await fs.readFile(sourcePath, 'utf-8')
        let sourceProducts = JSON.parse(sourceContent) as Product[]
        const newSourceProducts = sourceProducts.filter(p => p.id !== product.id)
        if (newSourceProducts.length !== sourceProducts.length) {
          await fs.writeFile(sourcePath, JSON.stringify(newSourceProducts, null, 2), 'utf-8')
        }
      } catch(e) {}
    }
    
    // Auto-update taxonomy.json if a new brand is introduced
    if (product.brand && product.category) {
      const taxonomyPath = path.join(dataDir, 'taxonomy.json')
      const taxonomyContent = await fs.readFile(taxonomyPath, 'utf-8')
      const taxonomy = JSON.parse(taxonomyContent) as Record<string, string[]>
      
      const categoryBrands = taxonomy[product.category] || []
      if (!categoryBrands.includes(product.brand)) {
        categoryBrands.push(product.brand)
        // Keep them sorted alphabetically
        categoryBrands.sort((a, b) => a.localeCompare(b))
        taxonomy[product.category] = categoryBrands
        
        await fs.writeFile(taxonomyPath, JSON.stringify(taxonomy, null, 2), 'utf-8')
      }
    }
    
    return { success: true }
  })

export const deleteProduct = createServerFn({ method: "POST" })
  .inputValidator((params: { categoryId: string, productId: string }) => params)
  .handler(async ({ data: { categoryId, productId } }) => {
    const fileSlug = categoryId.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '')
    const targetPath = path.join(dataDir, 'products', `${fileSlug}.json`)
    
    try {
      const content = await fs.readFile(targetPath, 'utf-8')
      const products = JSON.parse(content) as Product[]
      const newProducts = products.filter(p => p.id !== productId)
      
      if (newProducts.length !== products.length) {
        await fs.writeFile(targetPath, JSON.stringify(newProducts, null, 2), 'utf-8')
        return { success: true }
      }
      return { success: false, error: 'Product not found' }
    } catch(e) {
      return { success: false, error: 'File not found' }
    }
  })

export const getTaxonomy = createServerFn({ method: "GET" }).handler(async () => {
  const taxonomyPath = path.join(dataDir, 'taxonomy.json')
  const content = await fs.readFile(taxonomyPath, 'utf-8')
  return JSON.parse(content) as Record<string, string[]>
})

export const saveTaxonomy = createServerFn({ method: "POST" })
  .inputValidator((taxonomy: Record<string, string[]>) => taxonomy)
  .handler(async ({ data: taxonomy }) => {
    const taxonomyPath = path.join(dataDir, 'taxonomy.json')
    
    // Sort all arrays alphabetically to be nice
    for (const key in taxonomy) {
      if (Array.isArray(taxonomy[key])) {
        taxonomy[key].sort((a, b) => a.localeCompare(b))
      }
    }

    await fs.writeFile(taxonomyPath, JSON.stringify(taxonomy, null, 2), 'utf-8')
    return { success: true }
  })

export const getBrands = createServerFn({ method: "GET" }).handler(async () => {
  const brandsPath = path.join(dataDir, 'brands.json')
  const content = await fs.readFile(brandsPath, 'utf-8')
  return JSON.parse(content) as BrandData[]
})

export const getAdminBrandById = createServerFn({ method: "GET" })
  .inputValidator((name: string) => name)
  .handler(async ({ data: name }) => {
    const brandsPath = path.join(dataDir, 'brands.json')
    const content = await fs.readFile(brandsPath, 'utf-8')
    const brands = JSON.parse(content) as BrandData[]
    return brands.find(b => b.name === name)
  })

export const saveAdminBrand = createServerFn({ method: "POST" })
  .inputValidator((brand: BrandData & { originalName?: string }) => brand)
  .handler(async ({ data: brand }) => {
    const brandsPath = path.join(dataDir, 'brands.json')
    const content = await fs.readFile(brandsPath, 'utf-8')
    let brands = JSON.parse(content) as BrandData[]
    
    // We pass originalName incase the user edited the primary key "name"
    const targetName = brand.originalName || brand.name
    const existingIndex = brands.findIndex(b => b.name === targetName)
    
    // Clean up our internal property before saving
    const { originalName, ...brandToSave } = brand

    if (existingIndex > -1) {
      brands[existingIndex] = brandToSave
    } else {
      brands.push(brandToSave)
    }
    
    // Maintain a nice sort
    brands.sort((a, b) => a.name.localeCompare(b.name))
    
    await fs.writeFile(brandsPath, JSON.stringify(brands, null, 2), 'utf-8')
    return { success: true }
  })
