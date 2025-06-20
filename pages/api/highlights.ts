import type { NextApiRequest, NextApiResponse } from 'next';
import { nanoid } from 'nanoid';

interface Highlight {
  id: string;
  text: string;
  start: number;
  end: number;
}

interface ShareData {
  url: string;
  highlights: Highlight[];
}

// Simple in-memory store for demo only. Replace with DB in production.
const store: Record<string, ShareData> = {};

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).end('Method Not Allowed');
  }

  const { url, highlights } = req.body;

  if (!url || !Array.isArray(highlights)) {
    return res.status(400).json({ error: 'Missing or invalid parameters' });
  }

  const id = nanoid(8);
  store[id] = { url, highlights };

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
  const shareUrl = `${baseUrl}/share/${id}`;

  return res.status(200).json({ shareUrl });
}
