// pages/api/parse.ts

import { NextApiRequest, NextApiResponse } from 'next';
import { Readability } from '@mozilla/readability';
import { JSDOM } from 'jsdom';

const isVercel = !!process.env.VERCEL;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { url } = req.query;

  if (!url || typeof url !== 'string') {
    return res.status(400).json({ error: 'Missing or invalid URL parameter.' });
  }

  let browser = null;

  try {
    let puppeteer;
    if (isVercel) {
      const chromium = require('chrome-aws-lambda');
      puppeteer = require('puppeteer-core');
      browser = await puppeteer.launch({
        args: chromium.args,
        defaultViewport: chromium.defaultViewport,
        executablePath: await chromium.executablePath,
        headless: chromium.headless,
      });
    } else {
      puppeteer = require('puppeteer');
      browser = await puppeteer.launch({ headless: 'new' });
    }

    const page = await browser.newPage();

    // ✅ Spoof real browser user agent to avoid blocks
    await page.setUserAgent(
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/113.0.0.0 Safari/537.36'
    );

    // Optional: Block ads/trackers (you can remove this if issues arise)
    await page.setRequestInterception(true);
    page.on('request', (req) => {
      const blocked = ['image', 'stylesheet', 'font', 'script'];
      if (blocked.includes(req.resourceType())) {
        req.abort();
      } else {
        req.continue();
      }
    });

    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 45000 });

    const html = await page.content();
    const dom = new JSDOM(html, { url });
    const reader = new Readability(dom.window.document);
    const article = reader.parse();

    await browser.close();

    if (!article) {
      console.error('❌ Readability parse returned null');
      return res.status(500).json({ error: 'Failed to parse article content.' });
    }

    return res.status(200).json({ article });
  } catch (error: any) {
    if (browser) await browser.close();
    console.error('🧨 PARSER ERROR:', error.message);
    return res.status(500).json({
      error: 'Failed to load and parse page.',
      details: error.message || 'Unknown error',
    });
  }
}
