import { NextApiRequest, NextApiResponse } from 'next';
import { chromium } from 'playwright';  // full playwright here
import { Readability } from '@mozilla/readability';
import { JSDOM } from 'jsdom';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { url } = req.query;

  if (!url || typeof url !== 'string') {
    return res.status(400).json({ error: 'Missing or invalid URL parameter.' });
  }

  let browser = null;

  try {
    browser = await chromium.launch({
      headless: true,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
      ],
    });

    const page = await browser.newPage();

    await page.setUserAgent(
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/113.0.0.0 Safari/537.36'
    );

    await page.route('**/*', (route) => {
      const resourceType = route.request().resourceType();
      if (['image', 'font', 'stylesheet', 'media'].includes(resourceType)) {
        route.abort();
      } else {
        route.continue();
      }
    });

    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 45000 });

    const html = await page.content();
    const dom = new JSDOM(html, { url });
    const reader = new Readability(dom.window.document);
    const article = reader.parse();

    await browser.close();

    if (!article) {
      console.error('❌ Readability returned null for:', url);
      return res.status(500).json({ error: 'Unable to extract article content.' });
    }

    return res.status(200).json({ article });
  } catch (error: any) {
    if (browser) await browser.close();
    console.error('🧨 PARSER ERROR:', error);
    return res.status(500).json({
      error: 'Internal server error while parsing URL.',
      details: error.message || 'Unknown error',
    });
  }
}
