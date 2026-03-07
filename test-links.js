import puppeteer from 'puppeteer';

(async () => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto('https://mail.eveningsdelight.com/american-outdoor-built-in-grills.html', {waitUntil: 'networkidle0'});
    const links = await page.evaluate(() => {
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
    console.log("Found links:", new Set(links).size);
    console.log(Array.from(new Set(links)).slice(0, 5));
    await browser.close();
})();
