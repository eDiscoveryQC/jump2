import puppeteer from 'puppeteer-core';
import { Readability } from '@mozilla/readability';
import { JSDOM } from 'jsdom';

export async function puppetParse(targetUrl: string): Promise<{
  status: 'success' | 'error';
  content?: string;
  title?: string;
  domain?: string;
  error?: string;
}> {
  let browser;
  try {
    browser = await puppeteer.launch({
      args: ['--no-sandbox'],
      headless: 'new',
      executablePath: process.env.CHROME_EXECUTABLE_PATH, // Set in Vercel env
    });

    const page = await browser.newPage();
    await page.setUserAgent(
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/114 Safari/537.36'
    );

    // Timeout if site doesn't load
    await page.goto(targetUrl, {
      waitUntil: 'domcontentloaded',
      timeout: 15000,
    });

    // Wait for readable content to stabilize
    await page.waitForTimeout(1000);

    const html = await page.content();
    const dom = new JSDOM(html, { url: targetUrl });
    const reader = new Readability(dom.window.document);
    const article = reader.parse();

    if (article?.content) {
      return {
        status: 'success',
        content: article.content,
        title: article.title || '',
        domain: new URL(targetUrl).hostname,
      };
    } else {
      return {
        status: 'error',
        error: 'No readable content found.',
        domain: new URL(targetUrl).hostname,
      };
    }
  } catch (err: any) {
    return {
      status: 'error',
      error: err.message || 'Failed to parse content',
    };
  } finally {
    if (browser) await browser.close();
  }
}
