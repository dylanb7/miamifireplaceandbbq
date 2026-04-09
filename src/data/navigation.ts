export type NavigationItem = {
    name: string;
    path?: string;
    subLinks?: NavigationItem[];
};

// Helper to slugify text
const slugify = (text: string) => text.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '');

// Static base navigation
const baseNavigation: NavigationItem[] = [
    {
        name: "Home",
        path: "/",
    },
];

/**
 * Build navigation structure dynamically from taxonomy data.
 * Call this with fresh taxonomy data from a route loader.
 */
export function buildNavigationStructure(taxonomy: Record<string, string[]>): NavigationItem[] {
    const productNavigation: NavigationItem[] = Object.entries(taxonomy).map(([category, brands]) => {
        const validBrands = brands.filter(b => b !== 'Other');
        return {
            name: category,
            path: `/products/${slugify(category)}`,
            subLinks: validBrands.length > 1 ? validBrands.map(brand => ({
                name: brand,
                path: `/products/${slugify(category)}/${slugify(brand)}`
            })) : undefined
        };
    });

    return [
        ...baseNavigation,
        ...productNavigation
    ];
}

export const isActive = (item: NavigationItem, currentPath: string) => {
    if (item.path && currentPath === item.path) return true;
    if (item.subLinks) {
        return item.subLinks.some(sub => sub.path && currentPath === sub.path);
    }
    return false;
};
