// pages/api/shorten.ts

import type { NextApiRequest, NextApiResponse } from 'next';

// Simple in-memory store (reset on server restart, for production use DB)
const store: Record<string, string> = {};

function generateId(length = 6) {
  const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for(let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  }

  const { fullUrl } = req.body;
  if (!fullUrl || typeof fullUrl !== 'string') {
    return res.status(400).json({ error: 'Missing or invalid fullUrl' });
  }

  // Basic validation
  try {
    new URL(fullUrl);
  } catch {
    return res.status(400).json({ error: 'Invalid URL format' });
  }

  // Generate unique short id
  let id = generateId();
  while (store[id]) {
    id = generateId(); // avoid collisions
  }
  store[id] = fullUrl;

  // Build short URL (adjust host for your deployment)
  const shortUrl = `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/s/${id}`;

  return res.status(200).json({ shortUrl, id });
}
