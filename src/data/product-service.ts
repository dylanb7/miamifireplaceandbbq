import { Product } from './types';
import { createServerFn } from '@tanstack/react-start';
import * as fs from 'fs/promises';
import * as path from 'path';

const dataDir = path.join(process.cwd(), 'src', 'data');
const productsDir = path.join(dataDir, 'products');

const readProductFile = async (filename: string): Promise<Product[]> => {
    try {
        const content = await fs.readFile(path.join(productsDir, filename), 'utf-8');
        return JSON.parse(content) as Product[];
    } catch {
        return [];
    }
};

/** List all .json files in the products directory (excludes subdirectories like archives/) */
const listProductFiles = async (): Promise<string[]> => {
    try {
        const entries = await fs.readdir(productsDir, { withFileTypes: true });
        return entries
            .filter(e => e.isFile() && e.name.endsWith('.json'))
            .map(e => e.name);
    } catch {
        return [];
    }
};

/** Resolve a category slug to a filename by checking what exists on disk */
const resolveFilename = async (categorySlug: string): Promise<string | null> => {
    const slug = categorySlug.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '');
    const files = await listProductFiles();

    // Try exact match first (e.g. "grills" -> "grills.json")
    const exact = files.find(f => f === `${slug}.json`);
    if (exact) return exact;

    // Try without trailing 's' for singular lookups (e.g. "grill" -> "grills.json")
    const withS = files.find(f => f === `${slug}s.json`);
    if (withS) return withS;

    // Try removing trailing 's' (e.g. "accessories" input, "accessorie.json" unlikely but just in case)
    if (slug.endsWith('s')) {
        const withoutS = files.find(f => f === `${slug.slice(0, -1)}.json`);
        if (withoutS) return withoutS;
    }

    return null;
};

const deduplicateProducts = (products: Product[]): Product[] => {
    const uniqueMap = new Map<string, Product>();
    for (const p of products) {
        if (p?.id && !uniqueMap.has(p.id)) {
            uniqueMap.set(p.id, p);
        }
    }
    return Array.from(uniqueMap.values());
};

const _getProductsByCategory = async (categorySlug: string): Promise<Product[]> => {
    const filename = await resolveFilename(categorySlug);
    if (!filename) {
        console.warn(`No products found for category: ${categorySlug}`);
        return [];
    }
    const data = await readProductFile(filename);
    return deduplicateProducts(data);
};

export const getProductsByCategory = createServerFn({ method: "GET" })
    .inputValidator((categorySlug: string) => categorySlug)
    .handler(async ({ data: categorySlug }): Promise<Product[]> => {
        return _getProductsByCategory(categorySlug);
    });

const _getAllProducts = async (): Promise<Product[]> => {
    const allFiles = await listProductFiles();
    const results = await Promise.all(allFiles.map(f => readProductFile(f)));
    return deduplicateProducts(results.flat());
};

export const getAllProducts = createServerFn({ method: "GET" })
    .handler(async (): Promise<Product[]> => {
        return _getAllProducts();
    });

export const minifyProducts = (products: Product[]): Product[] => {
    return products.map(p => ({
        id: p.id,
        name: p.name,
        brand: p.brand,
        model: p.model,
        category: p.category,
        subCategories: p.subCategories,
        image: p.image,
        price: p.price,
        description: p.description?.substring(0, 300) + (p.description?.length > 300 ? '...' : ''),
    })) as Product[];
};

export const getProductById = createServerFn({ method: "GET" })
    .inputValidator((data: { id: string, categorySlug?: string }) => data)
    .handler(async ({ data: { id, categorySlug } }): Promise<Product | undefined> => {
        const all = categorySlug ? await _getProductsByCategory(categorySlug) : await _getAllProducts();
        return all.find(p => p.id === id || p.name === id);
    });
