import type { NextApiRequest, NextApiResponse } from 'next';
import { JSDOM } from 'jsdom';
import { Readability } from '@mozilla/readability';

type Article = {
  title: string;
  content: string;
  excerpt: string;
  byline: string;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { url } = req.body;

  if (!url || typeof url !== 'string') {
    return res.status(400).json({ error: 'Invalid or missing URL' });
  }

  try {
    const response = await fetch(url);
    if (!response.ok) {
      return res.status(500).json({ error: 'Failed to fetch the webpage' });
    }

    const html = await response.text();
    const dom = new JSDOM(html, { url });
    const reader = new Readability(dom.window.document);
    const article = reader.parse();

    if (!article || !article.title || !article.content) {
      return res.status(500).json({ error: 'Failed to extract article content' });
    }

    const result: Article = {
      title: article.title,
      content: article.content,
      excerpt: article.excerpt ?? '',
      byline: article.byline ?? '',
    };

    return res.status(200).json(result);
  } catch (err) {
    console.error('Error parsing article:', err);
    return res.status(500).json({ error: 'An unexpected error occurred while parsing the article' });
  }
}
