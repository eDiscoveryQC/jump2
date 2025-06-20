import type { NextApiRequest, NextApiResponse } from 'next';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).end('Method Not Allowed');
  }

  const { articleText } = req.body;
  if (!articleText || typeof articleText !== 'string') {
    return res.status(400).json({ error: 'Invalid or missing articleText' });
  }

  try {
    const prompt = `
Extract 5 concise, insightful highlight sentences from the following article text. Each highlight should be self-contained and meaningful:

${articleText}

Highlights:
1.
`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.3,
      max_tokens: 250,
    });

    const raw = completion.choices[0]?.message?.content || '';
    // Parse highlights separated by newlines or numbering
    const highlights = raw
      .split(/\n/)
      .map((line) => line.trim().replace(/^\d+\.?\s*/, ''))
      .filter((line) => line.length > 0);

    return res.status(200).json({ highlights });
  } catch (error: any) {
    console.error('OpenAI highlight suggest error:', error);
    return res.status(500).json({ error: 'Failed to generate highlights' });
  }
}
