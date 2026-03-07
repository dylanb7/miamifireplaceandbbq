const puppeteer = require('puppeteer');

async function run() {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto("https://mail.eveningsdelight.com/lux.html", { waitUntil: 'domcontentloaded' });
  
  const galleryItems = await page.evaluate(() => {
    const images = Array.from(document.querySelectorAll('.gallery-item img, .main-content img, img[src*="gallery"], img.img-product, img.jb_img_ccell'));
    return images.map((img, index) => {
      const src = img.src;
      const alt = img.alt || '';
      return { title: alt || `Gallery Item ${index + 1}`, imageUrl: src };
    }).filter(item => item.imageUrl && !item.imageUrl.includes('logo') && !item.imageUrl.includes('icon') && !item.imageUrl.includes('button'));
  });
  console.log("Found Gallery Items:", JSON.stringify(galleryItems, null, 2));
  await browser.close();
}
run();
