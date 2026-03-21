import fs from 'fs';
import path from 'path';

const SCRAPED_FILE = path.join(process.cwd(), 'src/data/scraped_products.json');
const OUTPUT_DIR = path.join(process.cwd(), 'src/data/products');

const scrapedProducts = JSON.parse(fs.readFileSync(SCRAPED_FILE, 'utf-8'));

console.log(`Read ${scrapedProducts.length} products from scraped_products.json`);


const processedProducts = scrapedProducts.map((p: any) => {
    const brand = p.brand || 'Other';

    return {
        id: p.id,
        name: p.title,
        description: p.description,
        price: 0,
        category: p.category,
        brand,
        image: p.imageUrl,
        features: p.features || [],
        specs: p.specs || [],
        accessories: p.accessories || [],
        subCategories: p.subCategories || [],
        misc: p.misc || [],
        sourceUrl: p.sourceUrl
    };
});


const productsByCategory: Record<string, any[]> = {
    'Grills': [],
    'Fireplaces': [],
    'Gas Logs': [],
    'Outdoor Kitchens': []
};

processedProducts.forEach((p: any) => {
    let catKey = p.category;

    if (catKey === 'Gas Grills' || catKey === 'Charcoal Grills') catKey = 'Grills';
    else if (catKey === 'Electric Fireplaces' || catKey === 'Gas Fireplaces') catKey = 'Fireplaces';

    if (productsByCategory[catKey]) {
        if (catKey === 'Outdoor Kitchens') {
            const subCat = (p.subCategories && p.subCategories.length > 0) ? p.subCategories[0] : (p.name || p.brand);
            const KitchenId = `${p.brand}-${subCat}`.toLowerCase().replace(/\s+/g, '-');


            let existingKitchen = productsByCategory[catKey].find(k => k.id === KitchenId);

            if (!existingKitchen) {

                existingKitchen = {
                    id: KitchenId,
                    name: `${p.brand} ${subCat}`,
                    description: `Explore the beautiful ${subCat} Outdoor Kitchen by ${p.brand}.`,
                    price: 0,
                    category: 'Outdoor Kitchens',
                    brand: p.brand,
                    image: p.image,
                    features: [],
                    specs: [],
                    accessories: [],
                    subCategories: p.subCategories,
                    misc: [],
                    gallery: [],
                    sourceUrl: p.sourceUrl
                };
                productsByCategory[catKey].push(existingKitchen);
            }


            if (p.image && !existingKitchen.gallery.includes(p.image)) {
                existingKitchen.gallery.push(p.image);
            }
        } else {
            productsByCategory[catKey].push(p);
        }
    } else {
        console.warn(`Unknown category: ${catKey} for product ${p.name}`);
    }
});


Object.entries(productsByCategory).forEach(([category, items]) => {
    const slug = category.toLowerCase().replace(/\s+/g, '-');
    const filePath = path.join(OUTPUT_DIR, `${slug}.json`);
    fs.writeFileSync(filePath, JSON.stringify(items, null, 2));
    console.log(`Updated ${slug}.json with ${items.length} items`);
});


const taxonomy: Record<string, string[]> = {};

Object.entries(productsByCategory).forEach(([category, items]) => {
    taxonomy[category] = [];
    items.forEach((p: any) => {
        if (p.brand && !taxonomy[category].includes(p.brand)) {
            taxonomy[category].push(p.brand);
        }
    });
    taxonomy[category].sort();
});

fs.writeFileSync(path.join(process.cwd(), 'src/data/taxonomy.json'), JSON.stringify(taxonomy, null, 2));
console.log('Generated taxonomy.json');
