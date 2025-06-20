import type { NextApiRequest, NextApiResponse } from 'next';

const store: Record<string, any> = {};

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;

  if (!id || typeof id !== 'string' || !store[id]) {
    return res.status(404).json({ error: 'Share not found' });
  }

  return res.status(200).json(store[id]);
}
