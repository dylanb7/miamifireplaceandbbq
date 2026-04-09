import fs from 'fs';
import path from 'path';
import { slugify } from '../src/lib/utils';
import type { Product } from '../src/data/types';
import type { BrandData } from '../src/data/brands';

// Direct file reads for the build script (not running in TanStack Start context)
const dataDir = path.join(process.cwd(), 'src', 'data');

async function loadAllProducts(): Promise<Product[]> {
    const productsDir = path.join(dataDir, 'products');
    const entries = fs.readdirSync(productsDir, { withFileTypes: true });
    const jsonFiles = entries
        .filter(e => e.isFile() && e.name.endsWith('.json'))
        .map(e => e.name);

    const results = jsonFiles.map((f) => {
        try {
            const content = fs.readFileSync(path.join(productsDir, f), 'utf-8');
            return JSON.parse(content) as Product[];
        } catch {
            return [];
        }
    });
    return results.flat();
}

/** Get category slugs from all product JSON filenames */
function getCategorySlugs(): string[] {
    const productsDir = path.join(dataDir, 'products');
    const entries = fs.readdirSync(productsDir, { withFileTypes: true });
    return entries
        .filter(e => e.isFile() && e.name.endsWith('.json'))
        .map(e => e.name.replace('.json', ''));
}

function loadBrands(): BrandData[] {
    const content = fs.readFileSync(path.join(dataDir, 'brands.json'), 'utf-8');
    return JSON.parse(content) as BrandData[];
}

async function generateSitemap() {
    const domain = 'https://miamifireplaceandbbq.com';
    const sitemapPath = path.resolve(process.cwd(), 'public', 'sitemap.xml');

    console.log('Generating sitemap...');
    const products = await loadAllProducts();
    const brands = loadBrands();
    const categorySlugs = getCategorySlugs();

    const urls = new Set<string>();

    urls.add('');
    urls.add('/contact');
    urls.add('/products/all');

    // Add category pages dynamically from the files on disk
    for (const slug of categorySlugs) {
        urls.add(`/products/${slug}`);
    }


    const categoriesWithBrands = new Map<string, Set<string>>();
    categoriesWithBrands.set('all', new Set<string>());

    for (const product of products) {
        if (!product.category || !product.id) continue;

        const catSlug = slugify(product.category);
        urls.add(`/product/${product.id}`);

        if (product.brand) {
            const brandSlug = slugify(product.brand);

            if (!categoriesWithBrands.has(catSlug)) {
                categoriesWithBrands.set(catSlug, new Set());
            }
            categoriesWithBrands.get(catSlug)!.add(brandSlug);

            categoriesWithBrands.get('all')!.add(brandSlug);
        }
    }


    for (const [catSlug, brandSet] of categoriesWithBrands.entries()) {
        for (const brandSlug of brandSet) {
            urls.add(`/products/${catSlug}/${brandSlug}`);
        }
    }


    for (const brand of brands) {
        if (brand.name) {
            urls.add(`/brands/${slugify(brand.name)}`);
        }
    }

    const today = new Date().toISOString().split('T')[0];

    const sitemapContent = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${Array.from(urls)
            .sort()
            .map((urlPath) => `  <url>
    <loc>${domain}${urlPath}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>${urlPath === '' ? '1.0' : urlPath.includes('/product/') ? '0.8' : '0.9'}</priority>
  </url>`)
            .join('\n')}
</urlset>`;

    fs.writeFileSync(sitemapPath, sitemapContent);
    console.log(`Successfully generated sitemap.xml with ${urls.size} URLs!`);
}

generateSitemap().catch(console.error);
