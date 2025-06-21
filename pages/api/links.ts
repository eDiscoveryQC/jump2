import type { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '../../lib/supabase';
import { generateShortCode } from '../../lib/shortCode';

interface ShortLinkResponse {
  shortCode?: string;
  error?: string;
}

const MAX_ATTEMPTS = 5;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ShortLinkResponse>
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed. Use POST.' });
  }

  const { deepLink } = req.body;
  if (typeof deepLink !== 'string' || deepLink.trim() === '') {
    return res.status(400).json({ error: 'Missing or invalid deepLink.' });
  }

  try {
    const { data: existing, error: selectError } = await supabase
      .from('short_links')
      .select('short_code')
      .eq('deep_link', deepLink)
      .single();

    if (selectError && selectError.code !== 'PGRST116') {
      return res.status(500).json({ error: `DB error: ${selectError.message}` });
    }

    if (existing) {
      return res.status(200).json({ shortCode: existing.short_code });
    }

    let shortCode: string | undefined;
    let attempts = 0;

    while (attempts < MAX_ATTEMPTS) {
      attempts++;
      const candidate = generateShortCode();
      const { data: codeExists } = await supabase
        .from('short_links')
        .select('id')
        .eq('short_code', candidate)
        .single();

      if (!codeExists) {
        shortCode = candidate;
        break;
      }
    }

    if (!shortCode) {
      return res.status(500).json({ error: 'Failed to generate unique short code.' });
    }

    const { error: insertError } = await supabase
      .from('short_links')
      .insert({ short_code: shortCode, deep_link: deepLink });

    if (insertError) {
      return res.status(500).json({ error: `Insert error: ${insertError.message}` });
    }

    return res.status(201).json({ shortCode });
  } catch (err) {
    console.error('Unexpected error:', err);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}
