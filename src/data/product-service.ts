import { Product } from './types';

import fireplacesNewUrl from './products/fireplaces-new.json?url';
import grillsUrl from './products/grills.json?url';
import gasLogsUrl from './products/gas-logs.json?url';
import outdoorKitchensNewUrl from './products/outdoor-kitchens-new.json?url';

export type DataSource = 'legacy' | 'scraped' | 'luxe';
export const ACTIVE_DATA_SOURCE: DataSource = 'scraped';

const fetchJson = async <T>(url: string): Promise<T> => {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`Failed to fetch ${url}`);
    return res.json() as Promise<T>;
};

const fireplaceLoaders: Record<DataSource, () => Promise<Product[]>> = {
    legacy: () => Promise.resolve([]),
    scraped: () => fetchJson<Product[]>(fireplacesNewUrl),
    luxe: () => Promise.resolve([]),
};

const grillLoaders: Record<DataSource, () => Promise<Product[]>> = {
    legacy: () => fetchJson<Product[]>(grillsUrl),
    scraped: () => fetchJson<Product[]>(grillsUrl),
    luxe: () => Promise.resolve([]),
};

const gasLogLoaders: Record<DataSource, () => Promise<Product[]>> = {
    legacy: () => fetchJson<Product[]>(gasLogsUrl),
    scraped: () => fetchJson<Product[]>(gasLogsUrl),
    luxe: () => Promise.resolve([]),
};

const outdoorKitchenLoaders: Record<DataSource, () => Promise<Product[]>> = {
    legacy: () => Promise.resolve([]),
    scraped: () => fetchJson<Product[]>(outdoorKitchensNewUrl),
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

export const getProductsByCategory = async (categorySlug: string): Promise<Product[]> => {
    const loader = categoryMap[categorySlug.toLowerCase()];
    if (!loader) {
        console.warn(`No products found for category: ${categorySlug}`);
        return [];
    }
    const data = await loader();
    return deduplicateProducts(data);
};

export const getAllProducts = async (): Promise<Product[]> => {
    const allLoaders = [
        categoryMap['grills'](),
        categoryMap['fireplaces'](),
        categoryMap['gas-logs'](),
        categoryMap['outdoor-kitchens'](),
    ];

    const results = await Promise.all(allLoaders);
    return deduplicateProducts(results.flat());
};

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

export const getProductById = async (id: string): Promise<Product | undefined> => {
    const all = await getAllProducts();
    return all.find(p => p.id === id || p.name === id);
};
