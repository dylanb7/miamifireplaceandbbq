import puppeteer from 'puppeteer';
import fs from 'fs';
import path from 'path';

// Category URLs to scrape


const OUTPUT_FILE = path.join(process.cwd(), 'src/data/scraped_products.json');

const baseUrl = 'https://mail.eveningsdelight.com';


type ProductCategory = "Outdoor Kitchens" | "Grills" | "Fireplaces" | "Gas Logs";

// Category - Brand - Subtype - products url


interface UrlInfo {
    url: string;
    scrapeStyle: 'Gallery' | 'ProductGrid' | 'SingleProduct';
    subCategories?: string[];
}

type BrandConfig = UrlInfo[];

const scrapePaths: Record<ProductCategory, Record<string, BrandConfig>> = {
    'Outdoor Kitchens': {
        'Burnout': [
            { 'url': `${baseUrl}/lux.html`, 'scrapeStyle': 'Gallery', 'subCategories': ['Lux'] },
            { 'url': `${baseUrl}/bbq.html`, 'scrapeStyle': 'Gallery', 'subCategories': ['BBQ'] }
        ],
        'Robel Studio': [
            { 'url': `${baseUrl}/novara-outdoor-kitchen.html`, 'scrapeStyle': 'Gallery', 'subCategories': ['Novara Outdoor Kitchen'] },
            { 'url': `${baseUrl}/aghler-by-fogher.html`, 'scrapeStyle': 'Gallery', 'subCategories': ['Agher By Fogher'] },
            { 'url': `${baseUrl}/terrenere-outdoor-kitchen.html`, 'scrapeStyle': 'Gallery', 'subCategories': ['Terrenere Outdoor Kitchen'] },
        ]
    },
    'Grills': {
        'Profire Grills': [
            {
                'url': `${baseUrl}/profire-grills.html`,
                'scrapeStyle': 'ProductGrid'
            }
        ],
        'Big Green Eggs': [
            {
                'url': `${baseUrl}/big-green-eggs.html`,
                'scrapeStyle': 'ProductGrid',
                'subCategories': ['Portable']
            }
        ],
        'Fire Magic Grills': [
            { 'url': `${baseUrl}/firemagic-built-in-grills.html`, 'scrapeStyle': 'ProductGrid', 'subCategories': ['Built-in'] },
            { 'url': `${baseUrl}/firemagic-portable-grills.html`, 'scrapeStyle': 'ProductGrid', 'subCategories': ['Portable'] },
        ],
        'Bull Grills': [
            { 'url': `${baseUrl}/bull-built-in-grills.html`, 'scrapeStyle': 'ProductGrid', 'subCategories': ['Built-in'] },
            { 'url': `${baseUrl}/bull-grill-carts.html`, 'scrapeStyle': 'ProductGrid', 'subCategories': ['Portable'] },
        ],
        'MHP Grills': [
            {
                'url': `${baseUrl}/mhp-grills.html`,
                'scrapeStyle': 'ProductGrid',
                'subCategories': ['Portable']
            }
        ],
        'American Outdoor Grills': [
            { 'url': `${baseUrl}/american-outdoor-built-in-grills.html`, 'scrapeStyle': 'ProductGrid', 'subCategories': ['Built-in'] },
            { 'url': `${baseUrl}/american-outdoor-portable-grills.html`, 'scrapeStyle': 'ProductGrid', 'subCategories': ['Portable'] },
        ],
        'Traeger Pellet Grills': [
            {
                'url': `${baseUrl}/traeger-pellet-grills.html`,
                'scrapeStyle': 'ProductGrid',
                'subCategories': ['Portable']
            }
        ],
        'Louisiana Pellet Grills': [
            {
                'url': `${baseUrl}/louisiana-pellet-grills.html`,
                'scrapeStyle': 'ProductGrid'
            }
        ],
        'Weber Grills': [
            {
                'url': `${baseUrl}/weber-grills.html`,
                'scrapeStyle': 'ProductGrid',
                'subCategories': ['Portable']
            }
        ],

    },
    'Fireplaces': {
        'Dimplex': [
            { 'url': `${baseUrl}/linear-fireplaces.html`, 'scrapeStyle': 'ProductGrid', 'subCategories': ['Linear'] },
            { 'url': `${baseUrl}/fireboxes-inserts.html`, 'scrapeStyle': 'ProductGrid', 'subCategories': ['Fireboxes', 'Inserts'] },
            { 'url': `${baseUrl}/electric-log-sets.html`, 'scrapeStyle': 'ProductGrid', 'subCategories': ['Electric Log Sets'] }
        ],
        'Heat & Glo': [
            {
                'url': `${baseUrl}/insert-fireplaces.html`,
                'scrapeStyle': 'ProductGrid',
                'subCategories': ['Inserts']
            }
        ],
        'Heatilator': [
            {
                'url': `${baseUrl}/gas-fireplaces.html`,
                'scrapeStyle': 'ProductGrid',
                'subCategories': ['Gas']
            },
            {
                'url': `${baseUrl}/wood-fireplaces.html`,
                'scrapeStyle': 'ProductGrid',
                'subCategories': ['Wood']
            },
            {
                'url': `${baseUrl}/outdoor-fireplaces.html`,
                'scrapeStyle': 'ProductGrid',
                'subCategories': ['Outdoor']
            }
        ],
        'Regency': [
            {
                'url': `${baseUrl}/city-series-modern-gas-fireplaces.html`,
                'scrapeStyle': 'ProductGrid',
                'subCategories': ['Gas', 'Modern']
            },
            {
                'url': `${baseUrl}/contemporary-gas-fireplaces.html`,
                'scrapeStyle': 'ProductGrid',
                'subCategories': ['Gas', 'Contemporary']
            },
            {
                'url': `${baseUrl}/traditional-gas-fireplaces.html`,
                'scrapeStyle': 'ProductGrid',
                'subCategories': ['Gas', 'Traditional']
            },
            {
                'url': `${baseUrl}/outdoor-fireplaces2.html`,
                'scrapeStyle': 'ProductGrid',
                'subCategories': ['Outdoor']
            },
            {
                'url': `${baseUrl}/wood-fireplaces2.html`,
                'scrapeStyle': 'ProductGrid',
                'subCategories': ['Wood']
            }
        ],
        'Ortal': [
            {
                'url': `${baseUrl}/ortal-fireplaces.html`,
                'scrapeStyle': 'ProductGrid',
                'subCategories': []
            }
        ],
        'Town & Country': [
            {
                'url': `${baseUrl}/indoor-fireplaces.html`,
                'scrapeStyle': 'ProductGrid',
                'subCategories': ['Indoor']
            },
            {
                'url': `${baseUrl}/outdoor-fireplaces3.html`,
                'scrapeStyle': 'ProductGrid',
                'subCategories': ['Outdoor']
            }
        ],
        'Montigo': [
            {
                'url': `${baseUrl}/montigo-fireplaces.html`,
                'scrapeStyle': 'ProductGrid',
                'subCategories': []
            }
        ],
        'American Fyre Designs': [
            {
                'url': `${baseUrl}/american-fire-designs.html`,
                'scrapeStyle': 'ProductGrid',
                'subCategories': []
            }
        ]
    },
    'Gas Logs': {
        'Real Fyre': [
            {
                url: `${baseUrl}/gas-logs.html`,
                scrapeStyle: 'SingleProduct',
                subCategories: ['Vented']
            },
            {
                url: `${baseUrl}/vent-free-logs.html`,
                scrapeStyle: 'SingleProduct',
                subCategories: ['Vent-Free']
            }
        ]
    },

}

// const MAX_PRODUCTS = 10; // Uncomment for verification

const IGNORED_TEXT = [
    "Call or Visit Our Showrooms TODAY!",
    "Nest available for All Models."
];

function cleanText(text: string): string {
    let cleaned = text;
    // Remove specific ignored phrases (and surrounding whitespace/newlines usually attached)
    // We'll split by newlines, filter out lines containing the ignored phrases, then join.
    // Or just replace specific blocks if they vary. The user provided a specific block locally, 
    // but globally it might vary by whitespace.

    // Strategy: Remove lines containing the ignored key phrases.
    const lines = cleaned.split('\n');
    const filteredLines = lines.filter(line => {
        const trimmed = line.trim();
        return !IGNORED_TEXT.some(ignored => trimmed.includes(ignored));
    });

    cleaned = filteredLines.join('\n');

    // Collapse excessive whitespace
    cleaned = cleaned.replace(/\s+/g, ' ').trim();
    return cleaned;
}

const downloadImage = async (url: string, category: string, title: string): Promise<string> => {
    if (!url) return '';
    try {
        const categorySlug = category.toLowerCase().replace(/\s+/g, '-');
        const filename = `${title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}.jpg`; // Simple slug for filename
        const relativeDir = path.join('images', 'products', categorySlug);
        const outputDir = path.join(process.cwd(), 'public', relativeDir);
        const outputPath = path.join(outputDir, filename);

        if (!fs.existsSync(outputDir)) {
            fs.mkdirSync(outputDir, { recursive: true });
        }

        // Check if file exists to avoid redownload (optional, but good for speed)
        if (fs.existsSync(outputPath)) {
            return `/${relativeDir}/${filename}`;
        }

        const response = await fetch(url);
        if (!response.ok) throw new Error(`Failed to fetch ${url}`);

        const arrayBuffer = await response.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        fs.writeFileSync(outputPath, buffer);

        return `/${relativeDir}/${filename}`;
    } catch (e) {
        console.error(`Failed to download image ${url}:`, e);
        return url; // Fallback to remote URL
    }
};

async function scrape() {
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    const scrapedData: any[] = [];
    const globalVisited = new Set<string>();

    // Helper to get links from a page
    const getLinks = async (url: string) => {
        try {
            await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 });
            return await page.evaluate(() => {
                let container = document.querySelector('.shop') || document.querySelector('.products') || document.querySelector('.main-content') || document.querySelector('#content');
                if (!container) {
                    container = document.createElement('div');
                    container.innerHTML = document.body.innerHTML;
                    const navs = container.querySelectorAll('nav, header, footer, .sidebar, .widget, .elementor-location-header, .elementor-location-footer');
                    navs.forEach(n => n.remove());
                }

                return Array.from(container.querySelectorAll('a'))
                    .map(a => a.href)
                    .filter(href => {
                        if (!href || !href.includes('.html') || href.includes('#')) return false;
                        const lower = href.toLowerCase();
                        const badKeywords = ['index.html', 'contact-us', 'financing', 'about-us', 'shipping-returns', 'cart', 'checkout'];
                        const isBad = badKeywords.some(bk => lower.includes(bk));
                        if (isBad) return false;

                        // Exclude main category pages
                        const isCategory = lower.match(/\/(grills|fireplaces|outdoor-kitchens|gas-logs|accessories|specials)\.html$/);
                        return !isCategory;
                    });
            });
        } catch (e) {
            console.error(`Error visiting ${url}:`, e);
            return [];
        }
    };

    // Helper to scrape product data
    const scrapeProduct = async (url: string, category: string, brand: string, subCategories: string[] = [], forceSingle = false) => {
        if (globalVisited.has(url) && !forceSingle) return null;
        globalVisited.add(url);

        try {
            await page.goto(url, { waitUntil: 'networkidle2', timeout: 90000 });

            // Check if it's actually a product (must have tabs or be clearly a product page)
            const isProduct = await page.evaluate((forceSingle) => {
                const hasProductIndicators = !!document.querySelector('.product-desc') || !!document.querySelector('.ui-tabs-nav') || !!document.querySelector('#tabs') || !!document.querySelector('.tabs');
                const isCategoryGrid = document.querySelectorAll('.product-category').length > 0;
                return forceSingle || (hasProductIndicators && !isCategoryGrid);
            }, forceSingle);

            if (!isProduct) return null;

            console.log(`    -> Scraping Product: ${url}`);
            const rawData = await page.evaluate(() => {
                let title = document.querySelector('.product-desc h3, .product-desc h2, h1, .page-title h1, h1.elementor-heading-title')?.textContent?.trim() || '';
                // Clean city suffix from title
                title = title.replace(/\s*Miami,\s*(?:Fl|Florida|Fort Lauderdale)\s*.*$/i, '').replace(/,\s*$/, '').trim();

                // Description: distinct from title
                let description = '';
                const descEl = document.querySelector('.product-desc');
                if (descEl) {
                    const clone = descEl.cloneNode(true) as HTMLElement;
                    clone.querySelector('h3, h2, h1')?.remove();
                    description = clone.textContent?.trim() || '';
                }

                // Dynamic Tab Scraping
                const features: string[] = [];
                const specs: string[] = [];
                const accessories: string[] = [];
                const misc: { name: string; content: string[] }[] = [];

                // Improved helper to extract list items from raw text lines
                const cleanAndFilterItems = (lines: string[], strict: boolean): string[] => {
                    return lines
                        .map(line => line.trim())
                        .filter(line => {
                            if (!strict) return line.length > 2;
                            // Strict mode: MUST start with a marker.
                            return line.length > 2 && (/^[•\-–—*]/.test(line));
                        })
                        .map(line => line.replace(/^[•\-–—*]\s*/, ''));
                };

                // Wrapper for HTML string input
                const extractListItems = (html: string, strict = true): string[] => {
                    const temp = document.createElement('div');
                    temp.innerHTML = html.replace(/<br\s*\/?>/gi, '\n');
                    const text = temp.textContent || '';
                    // Use the improved splitting?
                    // Actually, if we just use textContent here without the specific traversal, we risk the "messy text" issue.
                    // But for simple tabs it might optionally be okay.
                    // Let's replicate the splitting logic:
                    return cleanAndFilterItems(text.split('\n'), strict);
                };

                const parseContentSections = (container: Element) => {
                    const sections: { [key: string]: string[] } = {
                        features: [],
                        specs: [],
                        accessories: [],
                        misc: []
                    };

                    let currentSection = 'misc';
                    let buffer: string[] = [];

                    const flush = () => {
                        if (buffer.length > 0) {
                            const text = buffer.join('').trim();
                            if (text.length > 0) {
                                // Split by our manually inserted newlines
                                const lines = text.split('\n');
                                const isStrict = currentSection === 'features' || currentSection === 'specs';
                                const items = cleanAndFilterItems(lines, isStrict);

                                if (items.length > 0) {
                                    if (currentSection === 'features') sections.features.push(...items);
                                    else if (currentSection === 'specs') sections.specs.push(...items);
                                    else if (currentSection === 'accessories') sections.accessories.push(...items);
                                    else sections.misc.push(...items);
                                } else if (!isStrict && text.length > 10) {
                                    // Capture prose for misc if it didn't look like a list but is substantial
                                    sections.misc.push(text);
                                }
                            }
                            buffer = [];
                        }
                    };

                    const traverse = (node: Node) => {
                        if (node.nodeType === 3) { // Text node
                            const txt = node.textContent || '';
                            // Don't modify buffer here, just push
                            buffer.push(txt);
                        } else if (node.nodeType === 1) { // Element
                            const el = node as Element;
                            const tagName = el.tagName.toLowerCase();

                            if (tagName === 'br') {
                                buffer.push('\n');
                            } else if (['h1', 'h2', 'h3', 'h4', 'h5', 'strong', 'b'].includes(tagName) || (tagName === 'p' && (el.textContent || '').trim().endsWith(':') && (el.textContent || '').length < 30)) {
                                flush(); // Flush previous content before switching section
                                const headerText = (el.textContent || '').toLowerCase();
                                if (headerText.includes('feature')) currentSection = 'features';
                                else if (headerText.includes('spec') || headerText.includes('dimen')) currentSection = 'specs';
                                else if (headerText.includes('access') || headerText.includes('option')) currentSection = 'accessories';
                                else currentSection = 'misc';
                            } else if (tagName === 'ul' || tagName === 'ol') {
                                flush();
                                // Handle lists explicitly
                                Array.from(el.children).forEach(li => {
                                    const txt = li.textContent?.trim() || '';
                                    if (txt) {
                                        if (currentSection === 'features') sections.features.push(txt);
                                        else if (currentSection === 'specs') sections.specs.push(txt);
                                        else if (currentSection === 'accessories') sections.accessories.push(txt);
                                        else sections.misc.push(txt);
                                    }
                                });
                                // Don't recurse into UL/OL since we handled it
                            } else if (tagName === 'p' || tagName === 'div') {
                                buffer.push('\n'); // Ensure block separation
                                el.childNodes.forEach(traverse);
                                buffer.push('\n');
                            } else {
                                el.childNodes.forEach(traverse);
                            }
                        }
                    };

                    // Initial check if we should even parse headers
                    const headers = container.querySelectorAll('h1, h2, h3, h4, h5, strong, b');
                    if (headers.length === 0) {
                        // Fallback: extract list-like items from the whole text
                        const temp = document.createElement('div');
                        temp.innerHTML = container.innerHTML.replace(/<br\s*\/?>/gi, '\n');
                        const text = temp.textContent || '';

                        const lines = text.split('\n');
                        lines.forEach(line => {
                            line = line.trim();
                            if (line.length <= 2) return;

                            if (/^[\-–—]/.test(line)) {
                                sections.specs.push(line.replace(/^[\-–—]\s*/, ''));
                            } else if (/^[•*]/.test(line)) {
                                sections.features.push(line.replace(/^[•*]\s*/, ''));
                            }
                        });
                        // Note: Description text is ignored here, correct.
                    } else {
                        traverse(container);
                        flush();
                    }

                    return sections;
                };

                const isTabbed = !!document.querySelector('.ui-tabs-nav') || !!document.querySelector('#tabs') || !!document.querySelector('.tabs');

                if (isTabbed) {
                    const tabLinks = Array.from(document.querySelectorAll('.ui-tabs-nav li a, #tabs > ul li a, #tabs > div > ul li a, .tabs .tab-nav li a'));
                    tabLinks.forEach(link => {
                        const tabName = link.textContent?.trim() || '';
                        const tabLower = tabName.toLowerCase();
                        const tabId = link.getAttribute('href');

                        if (tabId && tabId.startsWith('#')) {
                            const contentEl = document.querySelector(tabId);
                            if (!contentEl) return;

                            // If the tab NAME is explicit, trust it.
                            if (tabLower.includes('feature')) {
                                features.push(...extractListItems(contentEl.innerHTML));
                            } else if (tabLower.includes('spec')) {
                                specs.push(...extractListItems(contentEl.innerHTML));
                            } else if (tabLower.includes('accessories') || tabLower.includes('eggcessories')) {
                                const items = extractListItems(contentEl.innerHTML, false);
                                if (items.length > 0) accessories.push(...items);
                                else {
                                    // Fallback: Try getting images/links titles
                                    const links = Array.from(contentEl.querySelectorAll('a, .product-name')).map(el => el.textContent?.trim()).filter(t => t && t.length > 2);
                                    const unique = Array.from(new Set(links)) as string[];
                                    if (unique.length > 0) accessories.push(...unique);
                                }
                            } else if (tabLower.includes('details') || tabLower.includes('description') || tabLower === 'product') {
                                // "Product Details" tab often contains mixed content
                                const parsed = parseContentSections(contentEl);
                                features.push(...parsed.features);
                                specs.push(...parsed.specs);
                                accessories.push(...parsed.accessories);

                                // Push any leftover miscellaneous sections that were found
                                if (parsed.misc.length > 0) {
                                    misc.push({ name: tabName, content: parsed.misc });
                                }
                            } else {
                                // Capture miscellaneous tabs
                                const items = extractListItems(contentEl.innerHTML, false);
                                if (items.length > 0) {
                                    misc.push({ name: tabName, content: items });
                                }
                            }
                        }
                    });
                } else {
                    // Non-tabbed page (like Profire)
                    // Look for the main description container. 
                    const descEl = document.querySelector('.product-desc');
                    if (descEl) {
                        // First, separate the main description text (first paragraph usually) from the lists
                        // We'll traverse it.
                        const parsed = parseContentSections(descEl);
                        features.push(...parsed.features);
                        specs.push(...parsed.specs);
                        accessories.push(...parsed.accessories);

                        // If we didn't find anything structured, but there are list items, maybe it's just a features list?
                        if (features.length === 0 && specs.length === 0) {
                            const allItems = extractListItems(descEl.innerHTML);
                            // Heuristic: if it looks like a list, it's probably features
                            if (allItems.length > 2) features.push(...allItems);
                        }
                    } else {
                        // For generic "SingleProduct" pages (e.g. gas-logs.html)
                        const contentEl = document.querySelector('.col_three_fifth, main, #main, .elementor-widget-theme-post-content');
                        if (contentEl) {
                            const parsed = parseContentSections(contentEl);
                            features.push(...parsed.features);
                            specs.push(...parsed.specs);
                            accessories.push(...parsed.accessories);
                            if (parsed.misc.length > 0) misc.push({ name: 'Details', content: parsed.misc });
                        }
                    }
                }

                const imgEl = document.querySelector('.product-image img, a.lightbox img, img[alt*="Burnout"], img[src*="serie"], img[src*="gas-logs"], img[src*="gallery"]');
                let imageUrl = '';
                if (imgEl) {
                    if ((imgEl as HTMLImageElement).src) imageUrl = (imgEl as HTMLImageElement).src;
                    else if ((imgEl as HTMLAnchorElement).href) imageUrl = (imgEl as HTMLAnchorElement).href;
                }

                return { title, description, features, specs, accessories, misc, imageUrl };
            });

            // Post-processing
            const description = cleanText(rawData.description);
            const imageUrl = await downloadImage(rawData.imageUrl, category, rawData.title);

            return {
                ...rawData,
                description,
                imageUrl,
                category,
                brand,
                subCategories,
                sourceUrl: url,
                id: rawData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-')
            };
        } catch (e) {
            console.error(`    Error scraping product ${url}:`, e);
            return null;
        }
    };

    const scrapeGallery = async (url: string, category: string, brand: string, subCategories: string[] = []) => {
        try {
            await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 });
            console.log(`    -> Scraping Gallery: ${url}`);

            // Assuming gallery pages have images in a lightbox or grid
            const galleryItems = await page.evaluate(() => {
                // Look for common gallery structures + fallback to specific images
                const images = Array.from(document.querySelectorAll('.gallery-item img, .main-content img, img[src*="gallery"], img.img-product, img.jb_img_ccell'));

                return images.map((img, index) => {
                    const src = (img as HTMLImageElement).src;
                    // Try to find a caption or use alt text
                    const alt = (img as HTMLImageElement).alt || '';
                    const title = alt || `Gallery Item ${index + 1}`;
                    return { title, imageUrl: src };
                }).filter(item => item.imageUrl && !item.imageUrl.includes('logo') && !item.imageUrl.includes('icon') && !item.imageUrl.includes('button'));
            });

            const processedItems = [];
            for (const item of galleryItems) {
                const imageUrl = item.imageUrl ? await downloadImage(item.imageUrl, category, item.title) : '';
                processedItems.push({
                    id: item.title.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-' + Math.random().toString(36).substr(2, 5),
                    title: item.title,
                    description: 'Gallery Image',
                    category,
                    brand,
                    subCategories,
                    imageUrl,
                    features: [],
                    specs: [],
                    accessories: [],
                    sourceUrl: url
                });
            }
            return processedItems;
        } catch (e) {
            console.error(`    Error scraping gallery ${url}:`, e);
            return [];
        }
    };

    for (const [category, brands] of Object.entries(scrapePaths)) {
        console.log(`\nCategory: ${category}`);

        for (const [brandName, brandConfigs] of Object.entries(brands)) {
            console.log(`  Brand: ${brandName}`);

            for (const config of (brandConfigs as UrlInfo[])) {
                console.log(`    Processing Config: ${config.url} (${config.scrapeStyle}) [${config.subCategories?.join(', ') || ''}]`);

                if (config.scrapeStyle === 'Gallery') {
                    const galleryItems = await scrapeGallery(config.url, category, brandName, config.subCategories);
                    scrapedData.push(...galleryItems);
                } else if (config.scrapeStyle === 'SingleProduct') {
                    console.log(`    -> Scraping SingleProduct: ${config.url}`);
                    const product = await scrapeProduct(config.url, category, brandName, config.subCategories, true);
                    if (product) scrapedData.push(product);
                } else {
                    // ProductGrid strategy: Find product links first
                    const productLinks = await getLinks(config.url);
                    // Filter links to valid product pages
                    const uniqueLinks = [...new Set(productLinks)].filter(l => l !== config.url && !globalVisited.has(l));
                    console.log(`    Found ${uniqueLinks.length} potential product links.`);

                    for (const link of uniqueLinks) {
                        const product = await scrapeProduct(link, category, brandName, config.subCategories);
                        if (product) scrapedData.push(product);
                    }
                }
            }
        }
    }

    await browser.close();

    console.log(`\nScraping complete. Found ${scrapedData.length} products.`);
    fs.writeFileSync(OUTPUT_FILE, JSON.stringify(scrapedData, null, 2));
    console.log(`Saved to ${OUTPUT_FILE}`);
}

scrape().catch(console.error);
