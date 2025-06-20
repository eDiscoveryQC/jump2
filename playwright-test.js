const { chromium } = require('playwright');

(async () => {
  try {
    console.log('Launching Chromium...');
    const browser = await chromium.launch();
    const page = await browser.newPage();
    await page.goto('https://example.com');
    const title = await page.title();
    console.log('Page title:', title);
    await browser.close();
    console.log('Chromium launch test SUCCESS');
  } catch (err) {
    console.error('Chromium launch test FAILED:', err);
  }
})();
