import { NextApiRequest, NextApiResponse } from 'next';
import { Readability } from '@mozilla/readability';
import { JSDOM } from 'jsdom';

const isVercel = !!process.env.VERCEL;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { url } = req.query;

  if (!url || typeof url !== 'string') {
    return res.status(400).json({ error: 'Missing or invalid URL parameter.' });
  }

  let browser: any = null;

  try {
    let puppeteer: any;
    let chromium: any;

    if (isVercel) {
      chromium = require('chrome-aws-lambda');
      puppeteer = require('puppeteer-core');
    } else {
      puppeteer = require('puppeteer');
    }

    browser = await puppeteer.launch(
      isVercel
        ? {
            args: chromium.args,
            defaultViewport: chromium.defaultViewport,
            executablePath: await chromium.executablePath,
            headless: chromium.headless,
          }
        : { headless: 'new' }
    );

    const page = await browser.newPage();

    // ✅ Spoof real browser headers
    await page.setUserAgent(
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/113.0.0.0 Safari/537.36'
    );

    // ✅ Block heavy requests
    await page.setRequestInterception(true);
    page.on('request', (request: any) => {
      const block = ['image', 'font', 'stylesheet', 'media'];
      if (block.includes(request.resourceType())) {
        request.abort();
      } else {
        request.continue();
      }
    });

    // ✅ Load the page
    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 45000 });

    // ✅ Extract HTML and parse
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
  } catch (err: any) {
    if (browser) await browser.close();
    console.error('🧨 Fatal parsing error for:', url, '|', err.message || err);
    return res.status(500).json({
      error: 'Internal server error while parsing URL.',
      details: err?.message || 'Unknown failure',
    });
  }
}
