import { Product } from './types';

/**
 * DATA SOURCE SWITCHER
 * 
 * Change this value to swap the fireplace data displayed on the site:
 *   'legacy'  → Original fireplaces.json (Dimplex old catalog)
 *   'scraped' → fireplaces-new.json (Tier 1 scraped: Heat & Glo, Heatilator, Dimplex)
 *   'luxe'    → fireplaces-luxe.json (702 products from Hearth LuX: Ortal, Regency, Astria, etc.)
 */
export type DataSource = 'legacy' | 'scraped' | 'luxe';
export const ACTIVE_DATA_SOURCE: DataSource = 'scraped';

// ─── Loader Maps ────────────────────────────────────

const fireplaceLoaders: Record<DataSource, () => Promise<Product[]>> = {
    legacy: () => Promise.resolve([]),
    scraped: () => import('./products/fireplaces-new.json').then(m => m.default as unknown as Product[]),
    luxe: () => Promise.resolve([]),
};

const grillLoaders: Record<DataSource, () => Promise<Product[]>> = {
    legacy: () => import('./products/grills.json').then(m => m.default as unknown as Product[]),
    scraped: () => import('./products/grills.json').then(m => m.default as unknown as Product[]),
    luxe: () => Promise.resolve([]),
};

const gasLogLoaders: Record<DataSource, () => Promise<Product[]>> = {
    legacy: () => import('./products/gas-logs.json').then(m => m.default as unknown as Product[]),
    scraped: () => import('./products/gas-logs.json').then(m => m.default as unknown as Product[]),
    luxe: () => Promise.resolve([]),
};

const outdoorKitchenLoaders: Record<DataSource, () => Promise<Product[]>> = {
    legacy: () => Promise.resolve([]),
    scraped: () => import('./products/outdoor-kitchens-new.json').then(m => m.default as unknown as Product[]),
    luxe: () => Promise.resolve([]),
};

// ─── Category Router ────────────────────────────────

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

// ─── Public API (unchanged) ─────────────────────────

export const getProductsByCategory = async (categorySlug: string): Promise<Product[]> => {
    const loader = categoryMap[categorySlug.toLowerCase()];
    if (!loader) {
        console.warn(`No products found for category: ${categorySlug}`);
        return [];
    }
    return await loader();
};

export const getAllProducts = async (): Promise<Product[]> => {
    const allLoaders = [
        categoryMap['grills'](),
        categoryMap['fireplaces'](),
        categoryMap['gas-logs'](),
        categoryMap['outdoor-kitchens'](),
    ];

    const results = await Promise.all(allLoaders);
    return results.flat();
};

export const getProductById = async (id: string): Promise<Product | undefined> => {
    const all = await getAllProducts();
    return all.find(p => p.id === id || p.name === id);
};
