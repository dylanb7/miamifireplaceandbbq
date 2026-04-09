import * as fs from 'fs/promises';
import * as path from 'path';
import { createServerFn } from '@tanstack/react-start';

export interface BrandData {
    name: string;
    brandName?: string;
    logo?: string;
    tagline?: string;
    description?: string;
    websiteUrl?: string;
    invertInDarkMode?: boolean;
    whiteBackgroundOnly?: boolean;
}

const brandsPath = path.join(process.cwd(), 'src', 'data', 'brands.json');

/**
 * Server function to load all brand data at runtime from brands.json.
 * Call this from route loaders to get fresh brand data.
 */
export const getBrandsData = createServerFn({ method: "GET" }).handler(async (): Promise<BrandData[]> => {
    const content = await fs.readFile(brandsPath, 'utf-8');
    return JSON.parse(content) as BrandData[];
});

/**
 * Helper to reliably match a product brand string onto rich brand data.
 * Accepts a pre-loaded brands array so this can run on client or server.
 */
export function getBrandData(brandIdentifier: string | undefined, brandsArray: BrandData[]): BrandData | undefined {
    if (!brandIdentifier) return undefined;

    const normalizedTarget = brandIdentifier.toLowerCase().trim();

    return brandsArray.find(b =>
        b.name.toLowerCase() === normalizedTarget ||
        (b.brandName && b.brandName.toLowerCase() === normalizedTarget)
    );
}
