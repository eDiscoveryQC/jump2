// /pages/api/parse.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import fetch from 'node-fetch';
import { JSDOM } from 'jsdom';
import { Readability } from '@mozilla/readability';

interface Article {
  title: string;
  content: string;
  excerpt?: string;
  byline?: string;
  dir?: string;
  length?: number;
  siteName?: string;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { url } = req.query;

  if (!url || typeof url !== 'string') {
    return res.status(400).json({ error: 'Missing or invalid URL parameter.' });
  }

  try {
    console.log(`Fetching article URL: ${url}`);
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; Jump2Bot/1.0; +https://jump2share.com)',
        Accept: 'text/html',
      },
      timeout: 15000,
    });

    if (!response.ok) {
      console.error(`Fetch failed with status ${response.status}`);
      return res.status(502).json({ error: `Failed to fetch URL. Status: ${response.status}` });
    }

    const html = await response.text();
    const dom = new JSDOM(html, { url });
    const reader = new Readability(dom.window.document);
    const article = reader.parse();

    if (!article) {
      console.error('Readability failed to parse article.');
      return res.status(500).json({ error: 'Failed to parse article content.' });
    }

    const result: Article = {
      title: article.title,
      content: article.content,
      excerpt: article.excerpt,
      byline: article.byline,
      dir: article.dir,
      length: article.length,
      siteName: article.siteName,
    };

    console.log(`Article parsed: "${result.title}" [${result.length} characters]`);
    return res.status(200).json({ article: result });
  } catch (err: any) {
    console.error('Internal server error in /api/parse:', err);
    return res.status(500).json({ error: 'Internal server error.', details: err.message });
  }
}
