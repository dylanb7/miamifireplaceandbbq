import { Product } from './types';
import { createServerFn } from '@tanstack/react-start';

export type DataSource = 'legacy' | 'scraped' | 'luxe';
export const ACTIVE_DATA_SOURCE: DataSource = 'scraped';

const parseRawJson = <T>(rawModule: { default: string }) => JSON.parse(rawModule.default) as T;

const fireplaceLoaders: Record<DataSource, () => Promise<Product[]>> = {
    legacy: () => Promise.resolve([]),
    scraped: () => import('./products/fireplaces-new.json?raw').then(parseRawJson<Product[]>),
    luxe: () => Promise.resolve([]),
};

const grillLoaders: Record<DataSource, () => Promise<Product[]>> = {
    legacy: () => import('./products/grills.json?raw').then(parseRawJson<Product[]>),
    scraped: () => import('./products/grills.json?raw').then(parseRawJson<Product[]>),
    luxe: () => Promise.resolve([]),
};

const gasLogLoaders: Record<DataSource, () => Promise<Product[]>> = {
    legacy: () => import('./products/gas-logs.json?raw').then(parseRawJson<Product[]>),
    scraped: () => import('./products/gas-logs.json?raw').then(parseRawJson<Product[]>),
    luxe: () => Promise.resolve([]),
};

const outdoorKitchenLoaders: Record<DataSource, () => Promise<Product[]>> = {
    legacy: () => Promise.resolve([]),
    scraped: () => import('./products/outdoor-kitchens-new.json?raw').then(parseRawJson<Product[]>),
    luxe: () => Promise.resolve([]),
};

const categoryMap: Record<string, () => Promise<Product[]>> = {
    'grill': () => grillLoaders[ACTIVE_DATA_SOURCE](),
    'grills': () => grillLoaders[ACTIVE_DATA_SOURCE](),
    'fireplace': () => fireplaceLoaders[ACTIVE_DATA_SOURCE](),
    'fireplaces': () => fireplaceLoaders[ACTIVE_DATA_SOURCE](),
    'gas-log': () => gasLogLoaders[ACTIVE_DATA_SOURCE](),
    'gas-logs': () => gasLogLoaders[ACTIVE_DATA_SOURCE](),
    'outdoor-kitchen': () => outdoorKitchenLoaders[ACTIVE_DATA_SOURCE](),
    'outdoor-kitchens': () => outdoorKitchenLoaders[ACTIVE_DATA_SOURCE](),
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
    const loader = categoryMap[categorySlug.toLowerCase()];
    if (!loader) {
        console.warn(`No products found for category: ${categorySlug}`);
        return [];
    }
    const data = await loader();
    return deduplicateProducts(data);
};

export const getProductsByCategory = createServerFn({ method: "GET" })
    .inputValidator((categorySlug: string) => categorySlug)
    .handler(async ({ data: categorySlug }): Promise<Product[]> => {
        return _getProductsByCategory(categorySlug);
    });

const _getAllProducts = async (): Promise<Product[]> => {
    const allLoaders = [
        categoryMap['grills'](),
        categoryMap['fireplaces'](),
        categoryMap['gas-logs'](),
        categoryMap['outdoor-kitchens'](),
    ];

    const results = await Promise.all(allLoaders);
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
        // Explicitly omitting gallery, features, specs, models, colorways
    })) as Product[];
};

export const getProductById = createServerFn({ method: "GET" })
    .inputValidator((id: string) => id)
    .handler(async ({ data: id }): Promise<Product | undefined> => {
        const all = await _getAllProducts();
        return all.find(p => p.id === id || p.name === id);
    });
