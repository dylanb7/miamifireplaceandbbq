import puppeteer from 'puppeteer';

const URL = 'https://mail.eveningsdelight.com/built-in-grills3/24-nbl.html';

(async () => {
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    await page.goto(URL, { waitUntil: 'networkidle2' });

    const debug = await page.evaluate(() => {
        const tabs2 = document.querySelector('#tabs-2');
        const listItems = document.querySelectorAll('#tabs-2 li');
        return {
            hasTabs2: !!tabs2,
            tabs2HTML: tabs2 ? tabs2.innerHTML : null,
            liCount: listItems.length,
            liText: Array.from(listItems).map(li => li.textContent?.trim())
        };
    });

    console.log('Debug Info:', JSON.stringify(debug, null, 2));
    await browser.close();
})();
