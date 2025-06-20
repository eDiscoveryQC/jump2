import type { NextApiRequest, NextApiResponse } from 'next';
import puppeteer from 'puppeteer';
import { JSDOM } from 'jsdom';
import { Readability } from '@mozilla/readability';
import sanitizeHtml from 'sanitize-html';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { url } = req.query;

  if (!url || typeof url !== 'string') {
    return res.status(400).json({ error: 'Missing or invalid URL' });
  }

  try {
    const browser = await puppeteer.launch({
      headless: true, // Corrected: boolean, not string
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });

    const page = await browser.newPage();
    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 20000 });
    const html = await page.content();
    await browser.close();

    // Use JSDOM + Readability to extract main article content
    const dom = new JSDOM(html, { url });
    const reader = new Readability(dom.window.document);
    const article = reader.parse();

    if (!article) {
      return res.status(500).json({ error: 'Failed to parse article content' });
    }

    // Sanitize the article content HTML
    const cleanContent = sanitizeHtml(article.content, {
      allowedTags: [
        'h1','h2','h3','h4','h5','h6','blockquote','p','a','ul','ol','li','b','i','strong','em','strike',
        'code','hr','br','div','table','thead','caption','tbody','tr','th','td','pre','img'
      ],
      allowedAttributes: {
        a: ['href', 'name', 'target', 'rel'],
        img: ['src', 'alt', 'title', 'width', 'height'],
        '*': ['style'],
      },
      allowedSchemes: ['http', 'https', 'mailto', 'data'],
      allowedSchemesByTag: { img: ['http', 'https', 'data'] },
      transformTags: {
        'a': (tagName: string, attribs: Record<string, string>) => ({
          tagName: 'a',
          attribs: {
            ...attribs,
            target: '_blank',
            rel: 'noopener noreferrer'
          }
        })
      }
    });

    res.status(200).json({ content: cleanContent });
  } catch (error) {
    console.error('Puppeteer error:', error);
    res.status(500).json({ error: 'Failed to fetch and parse content' });
  }
}
