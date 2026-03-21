import fs from 'fs';
import path from 'path';
import { getAllProducts } from '../src/data/product-service';
import { slugify } from '../src/lib/utils';
import { brands } from '../src/data/brands';

async function generateSitemap() {
    const domain = 'https://miamifireplaceandbbq.com';
    const sitemapPath = path.resolve(process.cwd(), 'public', 'sitemap.xml');

    console.log('Generating sitemap...');
    const products = await getAllProducts();

    const urls = new Set<string>();


    urls.add('');
    urls.add('/contact');
    urls.add('/products/all');
    urls.add('/products/outdoor-kitchens');
    urls.add('/products/grills');
    urls.add('/products/fireplaces');
    urls.add('/products/gas-logs');


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
