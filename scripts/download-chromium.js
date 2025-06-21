const puppeteer = require('puppeteer-core');

(async () => {
  console.log('Downloading Chromium revision 884014...');
  await puppeteer.createBrowserFetcher().download('884014');
  console.log('Chromium downloaded successfully!');
})();
