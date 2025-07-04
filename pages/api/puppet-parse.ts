import puppeteer from 'puppeteer-core';
import { Readability } from '@mozilla/readability';
import { JSDOM } from 'jsdom';

/**
 * Parses readable content from a given URL using Puppeteer and Readability.
 * Typically used as a fallback when API-based parsing fails.
 */
export async function puppetParse(
  targetUrl: string
): Promise<{
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
      headless: true,
      executablePath: process.env.CHROME_EXECUTABLE_PATH, // Must be set in serverless env
    });

    const page = await browser.newPage();
    await page.setUserAgent(
      process.env.JUMP2_USER_AGENT ||
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/114 Safari/537.36'
    );

    await page.goto(targetUrl, {
      waitUntil: 'domcontentloaded',
      timeout: 15000,
    });

    await page.waitForTimeout(1000); // Give page time to stabilize

    const html = await page.content();
    const dom = new JSDOM(html, { url: targetUrl });

    const reader = new Readability(dom.window.document);
    const article = reader.parse();

    const domain = new URL(targetUrl).hostname;

    if (article?.content?.trim()) {
      return {
        status: 'success',
        content: article.content,
        title: article.title || '',
        domain,
      };
    }

    // Attempt fallback using meta description
    const metaDesc =
      dom.window.document.querySelector('meta[name="description"]')?.getAttribute('content') || '';

    if (metaDesc) {
      return {
        status: 'success',
        content: `<p>${metaDesc}</p>`,
        title: article?.title || dom.window.document.title || '',
        domain,
      };
    }

    return {
      status: 'error',
      error: 'No readable content found.',
      domain,
    };
  } catch (err: any) {
    return {
      status: 'error',
      error: err.message || 'Failed to parse content',
    };
  } finally {
    if (browser) {
      try {
        await browser.close();
      } catch {
        // swallow silently
      }
    }
  }
}
