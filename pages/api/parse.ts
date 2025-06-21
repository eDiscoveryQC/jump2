import type { NextApiRequest, NextApiResponse } from 'next';
import { Browser, Page } from 'puppeteer-core';

interface Article {
  content: string;
}

interface ResponseData {
  article?: Article;
  error?: string;
}

let browser: Browser | null = null;

// Helper to get or launch a browser instance
async function getBrowser(): Promise<Browser> {
  if (browser) return browser;

  let puppeteer;
  let executablePath: string | undefined;
  let args: string[] = [];

  if (process.env.NODE_ENV === 'production') {
    const chromiumModule = await import('chrome-aws-lambda');
    puppeteer = await import('puppeteer-core');
    executablePath = await chromiumModule.default.executablePath;
    args = chromiumModule.default.args;
  } else {
    puppeteer = await import('puppeteer');
    executablePath = undefined;
    args = ['--no-sandbox', '--disable-setuid-sandbox'];
  }

  browser = await puppeteer.launch({
    args,
    executablePath,
    headless: true,
    ignoreHTTPSErrors: true,
    defaultViewport: { width: 1280, height: 800 },
  });

  return browser;
}

// Helper to create a new page with resource blocking enabled
async function newPageWithBlock(browser: Browser): Promise<Page> {
  const page = await browser.newPage();

  // Block images, fonts, stylesheets, media, etc.
  await page.setRequestInterception(true);
  page.on('request', (req) => {
    const resourceType = req.resourceType();
    const blockedResources = ['image', 'stylesheet', 'font', 'media', 'manifest', 'other'];
    if (blockedResources.includes(resourceType)) {
      req.abort();
    } else {
      req.continue();
    }
  });

  // Set consistent user agent to avoid bot detection
  await page.setUserAgent(
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) ' +
      'AppleWebKit/537.36 (KHTML, like Gecko) ' +
      'Chrome/114.0.0.0 Safari/537.36'
  );

  return page;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  const { url } = req.query;

  if (!url || typeof url !== 'string') {
    res.status(400).json({ error: 'Missing or invalid URL parameter' });
    return;
  }

  console.log(`[parse.ts] Starting parse for URL: ${url}`);

  let page: Page | null = null;

  try {
    const browserInstance = await getBrowser();

    page = await newPageWithBlock(browserInstance);

    const response = await page.goto(url, {
      waitUntil: 'networkidle2',
      timeout: 20000,
    });

    if (!response) throw new Error('No response when navigating to URL');

    if (!response.ok()) throw new Error(`Bad response status: ${response.status()}`);

    console.log('[parse.ts] Extracting article content...');
    const articleContent = await page.evaluate(() => {
      const selectors = [
        'article',
        'main',
        'section.article-body',
        '.article-content',
        '#article-body',
        '.content',
      ];

      let content = '';
      for (const sel of selectors) {
        const el = document.querySelector(sel);
        if (el) {
          content = el.innerHTML.trim();
          if (content.length > 50) break;
        }
      }

      if (!content) {
        content = document.body.innerHTML || '';
      }

      return content;
    });

    if (!articleContent || articleContent.length < 50) {
      console.warn('[parse.ts] Article content empty or too short.');
      res.status(204).json({ article: { content: '' } });
      return;
    }

    console.log('[parse.ts] Successfully extracted article content');
    res.status(200).json({ article: { content: articleContent } });
  } catch (error: any) {
    console.error('[parse.ts] Error:', error);
    res.status(500).json({ error: error.message || 'Internal Server Error' });
  } finally {
    if (page) {
      try {
        await page.close();
      } catch (closeError) {
        console.error('[parse.ts] Error closing page:', closeError);
      }
    }
  }
}
