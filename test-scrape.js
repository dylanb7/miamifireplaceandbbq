import puppeteer from 'puppeteer';

(async () => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto('https://mail.eveningsdelight.com/built-in-grills3/24-nbl.html', {waitUntil: 'networkidle0'});
    const html = await page.evaluate(() => {
        return document.querySelector('.main-content')?.innerHTML || document.body.innerHTML;
    });
    console.log("length:", html.length);
    console.log("content start:");
    console.log(html.substring(0, 2000));
    await browser.close();
})();
