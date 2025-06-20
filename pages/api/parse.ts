import type { NextApiRequest, NextApiResponse } from 'next';
import { chromium } from 'playwright';
import { Readability } from '@mozilla/readability';
import { JSDOM } from 'jsdom';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { url } = req.query;

  if (!url || typeof url !== 'string') {
    console.error('Invalid or missing URL param:', url);
    return res.status(400).json({ error: 'Missing or invalid URL parameter.' });
  }

  let browser;

  try {
    console.log('Launching Chromium...');
    browser = await chromium.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });

    console.log('Opening new page...');
    const page = await browser.newPage();

    console.log('Setting User-Agent...');
    await page.setExtraHTTPHeaders({
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/113.0.0.0 Safari/537.36'
    });

    console.log('Navigating to URL:', url);
    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 });

    console.log('Getting page content...');
    const html = await page.content();
    console.log(`Page content length: ${html.length}`);

    const dom = new JSDOM(html, { url });
    const reader = new Readability(dom.window.document);

    console.log('Parsing article content...');
    const article = reader.parse();

    if (!article) {
      console.error('Readability parse returned null.');
      throw new Error('Failed to parse article content.');
    }

    console.log('Closing browser...');
    await browser.close();

    console.log('Returning article...');
    return res.status(200).json({ article });

  } catch (error: any) {
    if (browser) {
      try {
        await browser.close();
      } catch (closeErr) {
        console.error('Error closing browser:', closeErr);
      }
    }
    console.error('API parse error:', error.stack || error.message || error);
    return res.status(500).json({ error: 'Internal server error while parsing URL.', details: error.message || error });
  }
}
