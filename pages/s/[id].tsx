// pages/s/[id].tsx

import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

const store: Record<string, string> = {}; // Same in-memory store, share properly in prod!

export default function RedirectPage() {
  const router = useRouter();
  const { id } = router.query;
  const [targetUrl, setTargetUrl] = useState<string | null>(null);

  useEffect(() => {
    if (!id || typeof id !== 'string') return;

    // Look up the full URL for this id
    const url = store[id];
    if (url) {
      setTargetUrl(url);
      // Redirect after short delay for UX smoothness
      setTimeout(() => {
        window.location.href = url;
      }, 500);
    } else {
      setTargetUrl(null);
    }
  }, [id]);

  if (targetUrl === null) {
    return <p style={{ padding: 20, textAlign: 'center' }}>Short link not found.</p>;
  }

  return <p style={{ padding: 20, textAlign: 'center' }}>Redirecting to <a href={targetUrl}>{targetUrl}</a>...</p>;
}
