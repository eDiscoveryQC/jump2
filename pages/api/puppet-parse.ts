// pages/api/puppet-parse.ts
import puppeteer from 'puppeteer';

export default async function handler(req, res) {
  const { url } = req.query;
  if (!url) return res.status(400).json({ error: 'No URL provided' });

  try {
    const browser = await puppeteer.launch({
      headless: 'new',
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });
    const page = await browser.newPage();
    await page.goto(url, { waitUntil: 'networkidle2', timeout: 15000 });
    const content = await page.content();
    await browser.close();

    // Optionally extract only article content here with DOM selectors
    res.status(200).json({ content });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to load via Puppeteer' });
  }
}
