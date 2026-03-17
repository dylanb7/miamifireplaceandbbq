import puppeteer from 'puppeteer';
import fs from 'fs';
import path from 'path';

const brands = [
    { name: 'Weber Grills', domain: 'weber.com' },
    { name: 'Dimplex', domain: 'dimplex.com' },
    { name: 'Heat & Glo', domain: 'heatnglo.com' },
    { name: 'Heatilator', domain: 'heatilator.com' },
    { name: 'Ortal', domain: 'ortalheat.com' }
];

async function fetchLogos() {
    const browser = await puppeteer.launch({ headless: true });

    for (const brand of brands) {
        console.log(`Searching for ${brand.name}...`);
        try {
            const page = await browser.newPage();
            // DuckDuckGo lite version
            const searchUrl = `https://lite.duckduckgo.com/lite/`;
            await page.goto(searchUrl, { waitUntil: 'domcontentloaded' });
            
            await page.type('input[name="q"]', `${brand.name} logo wikipedia "upload.wikimedia.org"`);
            await page.click('input[type="submit"]');
            await page.waitForNavigation({ waitUntil: 'domcontentloaded' });

            const links = await page.evaluate(() => {
                return Array.from(document.querySelectorAll('.result-snippet')).map(e => e.textContent || '');
            });

            console.log(links);

            await page.close();
        } catch (error: any) {
            console.error(`Error processing ${brand.name}:`, error.message);
        }
    }

    await browser.close();
}

fetchLogos();
