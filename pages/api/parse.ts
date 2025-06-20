import type { NextApiRequest, NextApiResponse } from 'next';
import { chromium } from 'playwright';
import { Readability } from '@mozilla/readability';
import { JSDOM } from 'jsdom';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { url } = req.query;

  if (!url || typeof url !== 'string') {
    return res.status(400).json({ error: 'Missing or invalid URL parameter.' });
  }

  let browser;

  try {
    console.log('Launching Chromium browser...');
    browser = await chromium.launch({ headless: true });
    const page = await browser.newPage();

    console.log('Setting User-Agent...');
    await page.setExtraHTTPHeaders({
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/113.0.0.0 Safari/537.36'
    });

    console.log('Navigating to URL...');
    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 });

    const html = await page.content();
    console.log(`Got page content, length: ${html.length}`);

    const dom = new JSDOM(html, { url });
    const reader = new Readability(dom.window.document);
    const article = reader.parse();

    await browser.close();

    if (!article) {
      return res.status(500).json({ error: 'Failed to parse article content.' });
    }

    console.log('Parse successful, returning article.');
    return res.status(200).json({ article });
  } catch (error: any) {
    if (browser) await browser.close();
    console.error('Parse error:', error);
    return res.status(500).json({ error: 'Internal server error while parsing URL.', details: error.message });
  }
}
