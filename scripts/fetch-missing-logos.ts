import puppeteer from 'puppeteer';
import { brands } from '../src/data/brands';
import fs from 'fs';
import path from 'path';

async function fetchLogos() {
    const missingLogos = brands.filter(b => !b.logo);
    console.log(`Found ${missingLogos.length} missing logos.`);

    const browser = await puppeteer.launch({ headless: true });

    for (const brand of missingLogos) {
        if (!brand.websiteUrl) continue;
        console.log(`Fetching logo for ${brand.name}...`);
        try {
            const page = await browser.newPage();
            // Use desktop viewport
            await page.setViewport({ width: 1280, height: 800 });
            await page.goto(brand.websiteUrl, { waitUntil: 'domcontentloaded', timeout: 15000 });

            const logoUrl = await page.evaluate(() => {
                // Try to find an image in the header or nav, or a logo class
                const img = document.querySelector('header img, nav img, img.logo, img[alt*="logo" i], .header img, #header img');
                return img ? (img as HTMLImageElement).src : null;
            });

            if (logoUrl && (logoUrl.endsWith('.png') || logoUrl.endsWith('.svg') || logoUrl.endsWith('.jpg') || logoUrl.endsWith('.webp') || logoUrl.includes('logo'))) {
                console.log(`  Found logo url: ${logoUrl}`);
                // Simple download using fetch
                try {
                    const res = await fetch(logoUrl);
                    if (res.ok) {
                        const buffer = Buffer.from(await res.arrayBuffer());
                        // try to preserve extension, default to png if not found
                        const ext = logoUrl.split('.').pop()?.split('?')[0]?.substring(0, 4) || 'png';
                        // valid extension check
                        const finalExt = ['png', 'svg', 'jpg', 'jpeg', 'webp', 'avif'].includes(ext.toLowerCase()) ? ext.toLowerCase() : 'png';

                        const filename = `${brand.name.toLowerCase().replace(/[^a-z0-9]/g, '-')}-logo.${finalExt}`;
                        const outputPath = path.join(process.cwd(), 'public', 'brand-logos', filename);
                        fs.writeFileSync(outputPath, buffer);
                        console.log(`  Saved to ${outputPath}`);
                    }
                } catch (e) {
                    console.error(`  Fetch error for ${brand.name} logo from ${logoUrl}:`, e);
                }
            } else {
                console.log(`  No distinct logo image found for ${brand.name}.`);
            }
            await page.close();
        } catch (error) {
            console.error(`Error processing ${brand.name}:`, error.message);
        }
    }

    await browser.close();
}

fetchLogos();
