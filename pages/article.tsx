import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import HighlightEditor from '../components/HighlightEditor';

export default function ArticlePage() {
  const router = useRouter();
  const { url } = router.query;

  const [articleText, setArticleText] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [shareLink, setShareLink] = useState<string | null>(null);

  useEffect(() => {
    if (!url || typeof url !== 'string') return;

    setLoading(true);
    setError(null);

    fetch(`/api/parse?url=${encodeURIComponent(url)}`)
      .then(res => res.json())
      .then(data => {
        if (data.article?.textContent) {
          setArticleText(data.article.textContent);
        } else {
          setError('Failed to load article content.');
        }
      })
      .catch(() => setError('Failed to load article content.'))
      .finally(() => setLoading(false));
  }, [url]);

  const handleShare = async (highlights) => {
    try {
      const response = await fetch('/api/highlights', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url, highlights }),
      });
      const data = await response.json();
      if (data.shareUrl) {
        setShareLink(data.shareUrl);
      } else {
        setError('Failed to generate share link.');
      }
    } catch {
      setError('Failed to generate share link.');
    }
  };

  return (
    <div style={{ maxWidth: 900, margin: '2rem auto', padding: '0 1rem' }}>
      <h1>Article Highlights</h1>
      {loading && <p>Loading article...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      {shareLink && (
        <div style={{ marginBottom: '1rem' }}>
          <strong>Share Link:</strong>{' '}
          <a href={shareLink} target="_blank" rel="noopener noreferrer">{shareLink}</a>
        </div>
      )}

      {articleText && (
        <HighlightEditor articleText={articleText} onShare={handleShare} />
      )}
    </div>
  );
}
