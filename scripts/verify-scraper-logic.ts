
import puppeteer from 'puppeteer';

// Minimal verification script to check specific URLs with the new logic
const verifyUrls = async () => {
    const urls = [
        'https://mail.eveningsdelight.com/big-green-eggs/large-big-green-egg.html',
        'https://mail.eveningsdelight.com/profire-grills/pfdlx-series-48-stainless-steel-grill-head.html'
    ];

    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();

    for (const url of urls) {
        console.log(`\nTesting URL: ${url}`);
        await page.goto(url, { waitUntil: 'networkidle2', timeout: 60000 });

        const data = await page.evaluate(() => {
            // Improved helper to extract list items from raw text lines
            const cleanAndFilterItems = (lines: string[], strict: boolean): string[] => {
                return lines
                    .map(line => line.trim())
                    .filter(line => {
                        if (!strict) return line.length > 2;
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
                            const lines = text.split('\n');
                            const isStrict = currentSection === 'features' || currentSection === 'specs';
                            const items = cleanAndFilterItems(lines, isStrict);

                            if (items.length > 0) {
                                if (currentSection === 'features') sections.features.push(...items);
                                else if (currentSection === 'specs') sections.specs.push(...items);
                                else if (currentSection === 'accessories') sections.accessories.push(...items);
                                else sections.misc.push(...items);
                            } else if (!isStrict && text.length > 10) {
                                sections.misc.push(text);
                            }
                        }
                        buffer = [];
                    }
                };

                const traverse = (node: Node) => {
                    if (node.nodeType === 3) { // Text node
                        const txt = node.textContent || '';
                        buffer.push(txt);
                    } else if (node.nodeType === 1) { // Element
                        const el = node as Element;
                        const tagName = el.tagName.toLowerCase();

                        if (tagName === 'br') {
                            buffer.push('\n');
                        } else if (['h1', 'h2', 'h3', 'h4', 'h5', 'strong', 'b'].includes(tagName) || (tagName === 'p' && (el.textContent || '').trim().endsWith(':') && (el.textContent || '').length < 30)) {
                            flush();
                            const headerText = (el.textContent || '').toLowerCase();
                            if (headerText.includes('feature')) currentSection = 'features';
                            else if (headerText.includes('spec') || headerText.includes('dimen')) currentSection = 'specs';
                            else if (headerText.includes('access') || headerText.includes('option')) currentSection = 'accessories';
                            else currentSection = 'misc';
                        } else if (tagName === 'ul' || tagName === 'ol') {
                            flush();
                            Array.from(el.children).forEach(li => {
                                const txt = li.textContent?.trim() || '';
                                if (txt) {
                                    if (currentSection === 'features') sections.features.push(txt);
                                    else if (currentSection === 'specs') sections.specs.push(txt);
                                    else if (currentSection === 'accessories') sections.accessories.push(txt);
                                    else sections.misc.push(txt);
                                }
                            });
                        } else if (tagName === 'p' || tagName === 'div') {
                            buffer.push('\n');
                            el.childNodes.forEach(traverse);
                            buffer.push('\n');
                        } else {
                            el.childNodes.forEach(traverse);
                        }
                    }
                };

                const headers = container.querySelectorAll('h1, h2, h3, h4, h5, strong, b');
                if (headers.length === 0) {
                    const temp = document.createElement('div');
                    temp.innerHTML = container.innerHTML.replace(/<br\s*\/?>/gi, '\n');
                    const text = temp.textContent || '';

                    const lines = text.split('\n');
                    lines.forEach(line => {
                        line = line.trim();
                        if (line.length <= 2) return;
                        if (/^[\-–—]/.test(line)) sections.specs.push(line.replace(/^[\-–—]\s*/, ''));
                        else if (/^[•*]/.test(line)) sections.features.push(line.replace(/^[•*]\s*/, ''));
                    });
                } else {
                    traverse(container);
                    flush();
                }

                return sections;
            };

            const features: string[] = [];
            const specs: string[] = [];
            const accessories: string[] = [];
            const misc: { name: string; content: string[] }[] = [];

            const isTabbed = !!document.querySelector('.ui-tabs-nav');

            if (isTabbed) {
                const tabLinks = Array.from(document.querySelectorAll('.ui-tabs-nav li a'));
                tabLinks.forEach(link => {
                    const tabName = link.textContent?.trim() || '';
                    const tabLower = tabName.toLowerCase();
                    const tabId = link.getAttribute('href');

                    if (tabId && tabId.startsWith('#')) {
                        const contentEl = document.querySelector(tabId);
                        if (!contentEl) return;

                        // Log found tabs for debug
                        // console.log('DEBUG: Found tab:', tabName);

                        if (tabLower.includes('feature')) {
                            features.push(...extractListItems(contentEl.innerHTML));
                        } else if (tabLower.includes('spec')) {
                            specs.push(...extractListItems(contentEl.innerHTML));
                        } else if (tabLower.includes('accessories') || tabLower.includes('eggcessories')) {
                            const items = extractListItems(contentEl.innerHTML, false);
                            if (items.length > 0) accessories.push(...items);
                            else {
                                const links = Array.from(contentEl.querySelectorAll('a, .product-name')).map(el => el.textContent?.trim()).filter(t => t && t.length > 2);
                                const unique = Array.from(new Set(links)) as string[];
                                if (unique.length > 0) accessories.push(...unique);
                            }
                        } else if (tabLower.includes('details') || tabLower.includes('description') || tabLower === 'product') {
                            const parsed = parseContentSections(contentEl);
                            features.push(...parsed.features);
                            specs.push(...parsed.specs);
                            accessories.push(...parsed.accessories);
                            if (parsed.misc.length > 0) misc.push({ name: 'Details', content: parsed.misc });
                        } else {
                            const items = extractListItems(contentEl.innerHTML, false);
                            if (items.length > 0) {
                                misc.push({ name: tabName, content: items });
                            }
                        }
                    }
                });
            } else {
                const descEl = document.querySelector('.product-desc');
                if (descEl) {
                    const parsed = parseContentSections(descEl);
                    features.push(...parsed.features);
                    specs.push(...parsed.specs);
                    accessories.push(...parsed.accessories);
                    if (features.length === 0 && specs.length === 0) {
                        const allItems = extractListItems(descEl.innerHTML, true);
                        if (allItems.length > 2) features.push(...allItems);
                    }
                }
            }

            return { features, specs, accessories, misc };
        });

        console.log('Features:', data.features);
        console.log('Specs:', data.specs);
        console.log('Accessories:', data.accessories);
        console.log('Misc:', data.misc);
    }

    await browser.close();
};

verifyUrls().catch(console.error);
