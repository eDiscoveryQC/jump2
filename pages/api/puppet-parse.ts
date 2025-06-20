import type { NextApiRequest, NextApiResponse } from 'next';
import puppeteer from 'puppeteer';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { url } = req.query;

  if (!url || typeof url !== 'string') {
    return res.status(400).json({ error: 'No URL provided or invalid' });
  }

  try {
    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });

    const page = await browser.newPage();
    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 20000 });

    const html = await page.content();

    await browser.close();

    return res.status(200).json({ content: html });
  } catch (error) {
    console.error('Puppeteer error:', error);
    return res.status(500).json({ error: 'Failed to fetch content' });
  }
}
