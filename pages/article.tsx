import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/router';
import HighlightEditor from '../components/HighlightEditor';

export default function ArticlePage() {
  const router = useRouter();
  const { url } = router.query;

  const [articleHtml, setArticleHtml] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [shareLink, setShareLink] = useState<string | null>(null);
  const [sharing, setSharing] = useState(false);
  const [shareError, setShareError] = useState<string | null>(null);

  useEffect(() => {
    if (!url || typeof url !== 'string') return;

    setLoading(true);
    setError(null);

    fetch(`/api/parse?url=${encodeURIComponent(url)}`)
      .then(res => res.json())
      .then(data => {
        if (data.article?.content) {
          setArticleHtml(data.article.content);
        } else {
          setError('Failed to load article content.');
        }
      })
      .catch(() => setError('Failed to load article content.'))
      .finally(() => setLoading(false));
  }, [url]);

  // Fix: explicitly type `highlights` as any to avoid TS error
  const handleShare = useCallback(async (highlights: any) => {
    setSharing(true);
    setShareError(null);
    setShareLink(null);
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
        setShareError('Failed to generate share link.');
      }
    } catch {
      setShareError('Failed to generate share link.');
    } finally {
      setSharing(false);
    }
  }, [url]);

  return (
    <div style={{ maxWidth: 900, margin: '2rem auto', padding: '0 1rem' }}>
      <h1>Article Highlights</h1>
      {loading && <p>Loading article...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      {shareLink && (
        <div style={{ marginBottom: '1rem' }}>
          <strong>Share Link:</strong>{' '}
          <a href={shareLink} target="_blank" rel="noopener noreferrer">
            {shareLink}
          </a>
        </div>
      )}

      {shareError && (
        <p style={{ color: 'red' }}>
          <strong>{shareError}</strong>
        </p>
      )}

      {articleHtml ? (
        // Render article content stripped to text for highlight editor
        <HighlightEditor
          articleText={articleHtml.replace(/<[^>]+>/g, '')}
          onShare={handleShare}
          sharing={sharing}
        />
      ) : (
        !loading && <p>No preview available for this link.</p>
      )}
    </div>
  );
}
