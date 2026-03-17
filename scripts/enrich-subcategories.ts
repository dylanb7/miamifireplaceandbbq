import fs from 'fs';
import path from 'path';
import { Product } from '../src/data/types';

const grillsPath = path.join(process.cwd(), 'src/data/products/grills.json');
const fireplacesPath = path.join(process.cwd(), 'src/data/products/fireplaces.json');

const grillsData: Product[] = JSON.parse(fs.readFileSync(grillsPath, 'utf8'));
const fireplacesData: Product[] = JSON.parse(fs.readFileSync(fireplacesPath, 'utf8'));

// Helpful regexes
const hasKeyword = (text: string, keywords: string[]) => {
    if (!text) return false;
    const lowerText = text.toLowerCase();
    return keywords.some(kw => {
        // use word boundaries to avoid partial matches
        const regex = new RegExp(`\\b${kw.toLowerCase()}\\b`);
        return regex.test(lowerText);
    });
};

const enrichGrill = (product: Product) => {
    const subCategories = new Set<string>(product.subCategories || []);
    
    // Check name and description for clues
    const fullText = `${product.name} ${product.description || ''} ${product.features?.join(' ') || ''}`;

    if (hasKeyword(fullText, ['built-in', 'builtin', 'built in'])) subCategories.add('Built-in');
    if (hasKeyword(fullText, ['cart', 'freestanding'])) subCategories.add('Cart');
    if (hasKeyword(fullText, ['portable', 'table top', 'tabletop'])) subCategories.add('Portable');

    // Fuel types
    if (hasKeyword(fullText, ['gas', 'propane', 'natural gas', 'lp', 'ng'])) subCategories.add('Gas');
    if (hasKeyword(fullText, ['charcoal'])) subCategories.add('Charcoal');
    if (hasKeyword(fullText, ['electric'])) subCategories.add('Electric');
    if (hasKeyword(fullText, ['pellet', 'wood pellet'])) subCategories.add('Pellet');
    
    // Set default if none found?
    
    product.subCategories = Array.from(subCategories);
    return product;
};

const enrichFireplace = (product: Product) => {
    const subCategories = new Set<string>(product.subCategories || []);
    const fullText = `${product.name} ${product.description || ''} ${product.features?.join(' ') || ''}`;

    // Fuel types
    if (hasKeyword(fullText, ['gas'])) subCategories.add('Gas');
    if (hasKeyword(fullText, ['wood', 'wood burning', 'woodburning'])) subCategories.add('Wood');
    if (hasKeyword(fullText, ['electric', 'opti-myst', 'opti myst'])) subCategories.add('Electric');
    
    // Types
    if (hasKeyword(fullText, ['insert'])) subCategories.add('Inserts');
    if (hasKeyword(fullText, ['outdoor'])) subCategories.add('Outdoor');
    if (hasKeyword(fullText, ['linear'])) subCategories.add('Linear');
    if (hasKeyword(fullText, ['log set', 'logsets', 'gas logs', 'electric logs'])) subCategories.add('Log Sets');

    product.subCategories = Array.from(subCategories);
    return product;
};

const enrichedGrills = grillsData.map(enrichGrill);
const enrichedFireplaces = fireplacesData.map(enrichFireplace);

fs.writeFileSync(grillsPath, JSON.stringify(enrichedGrills, null, 2));
fs.writeFileSync(fireplacesPath, JSON.stringify(enrichedFireplaces, null, 2));

console.log(`Enriched ${enrichedGrills.length} grills and ${enrichedFireplaces.length} fireplaces.`);
