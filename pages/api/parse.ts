import type { NextApiRequest, NextApiResponse } from 'next';
import { chromium, ChromiumBrowser, Page } from 'playwright';
import { Readability } from '@mozilla/readability';
import { JSDOM } from 'jsdom';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { url } = req.query;

  console.log('Received parse request for URL:', url);

  if (!url || typeof url !== 'string') {
    console.error('Invalid or missing URL parameter.');
    return res.status(400).json({ error: 'Missing or invalid URL parameter.' });
  }

  let browser: ChromiumBrowser | null = null;

  try {
    console.log('Launching Chromium browser...');
    browser = await chromium.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage'],
    });

    const pageRaw = await browser.newPage();
    const page = pageRaw as Page;

    console.log('Setting User-Agent...');
    await page.setExtraHTTPHeaders({
      'User-Agent':
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/113.0.0.0 Safari/537.36',
    });

    console.log('Setting route interception to block images/fonts/stylesheets/media...');
    await page.route('**/*', route => {
      const type = route.request().resourceType();
      if (['image', 'font', 'stylesheet', 'media'].includes(type)) {
        route.abort();
      } else {
        route.continue();
      }
    });

    console.log('Navigating to URL...');
    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 45000 });
    console.log('Page loaded.');

    const html = await page.content();
    console.log(`Got page content, length: ${html.length}`);

    console.log('Closing browser...');
    await browser.close();
    browser = null;

    console.log('Parsing content with Readability...');
    const dom = new JSDOM(html, { url });
    const reader = new Readability(dom.window.document);
    const article = reader.parse();

    if (!article) {
      console.error('Readability parse returned null.');
      return res.status(500).json({ error: 'Unable to extract article content.' });
    }

    console.log('Parse successful, returning article.');
    return res.status(200).json({ article });
  } catch (error: any) {
    console.error('Parse error:', error);
    if (browser) {
      console.log('Closing browser on error...');
      await browser.close();
    }
    return res.status(500).json({
      error: 'Internal server error while parsing URL.',
      details: error.message || 'Unknown error',
    });
  }
}
