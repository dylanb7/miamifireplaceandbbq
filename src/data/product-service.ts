import { Product } from './types';

// Dynamic import map
const categoryMap: Record<string, () => Promise<Product[]>> = {
    'grill': () => import('./products/grills.json').then(m => m.default as unknown as Product[]),
    'grills': () => import('./products/grills.json').then(m => m.default as unknown as Product[]),
    'fireplace': () => import('./products/fireplaces.json').then(m => m.default as unknown as Product[]),
    'fireplaces': () => import('./products/fireplaces.json').then(m => m.default as unknown as Product[]),
    'gas-log': () => import('./products/gas-logs.json').then(m => m.default as unknown as Product[]),
    'gas-logs': () => import('./products/gas-logs.json').then(m => m.default as unknown as Product[]),
    'outdoor-kitchen': () => import('./products/outdoor-kitchens.json').then(m => m.default as unknown as Product[]),
    'outdoor-kitchens': () => import('./products/outdoor-kitchens.json').then(m => m.default as unknown as Product[]),
};

export const getProductsByCategory = async (categorySlug: string): Promise<Product[]> => {
    // Normalize slug (e.g. 'grills' -> 'grills')
    // We accept singular or plural
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
    // Ideally we'd know the category, but if not we search all.
    // For performance, if the ID contains the category hint, use it.
    // But currently IDs are not standard. Titles are used as IDs often? 
    // In our scraped data, we don't have an ID field, we have titles. 
    // Let's assume we search all for now or the caller passes a category.

    const all = await getAllProducts();
    // Use title as ID match for now if no specific ID field
    return all.find(p => p.id === id || p.name === id);
};
