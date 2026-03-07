
import puppeteer from 'puppeteer';

const url = 'https://mail.eveningsdelight.com/big-green-eggs/large-big-green-egg.html';

(async () => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(url, { waitUntil: 'networkidle2' });

    const data = await page.evaluate(() => {
        const productOnes = Array.from(document.querySelectorAll('.product-image'));
        const images = Array.from(document.querySelectorAll('img'));
        const links = Array.from(document.querySelectorAll('a'));

        // Log potential grid containers
        const potentialGrids = Array.from(document.querySelectorAll('div')).filter(d => d.className.includes('grid') || d.className.includes('list') || d.className.includes('row'));

        return {
            productImageClasses: productOnes.map(e => e.className),
            imageParentClasses: images.slice(0, 10).map(i => i.parentElement?.className),
            gridClasses: potentialGrids.map(g => g.className),
            linkClasses: links.slice(0, 10).map(l => l.className)
        };
    });

    console.log(JSON.stringify(data, null, 2));
    await browser.close();
})();
