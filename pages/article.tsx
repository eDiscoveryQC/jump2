import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/router';
import styled from 'styled-components';
import HighlightEditor from '../components/HighlightEditor';

const PageContainer = styled.div`
  max-width: 960px;
  margin: 2rem auto;
  padding: 0 1rem;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
`;

const Title = styled.h1`
  margin-bottom: 1rem;
  color: #1e4268;
`;

const Message = styled.p<{ error?: boolean }>`
  color: ${({ error }) => (error ? '#e53e3e' : '#555')};
  font-size: 1.1rem;
  margin: 1rem 0;
`;

const ShareLinkContainer = styled.div`
  margin-bottom: 1rem;
  a {
    color: #3b82f6;
    word-break: break-all;
  }
`;

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
    setArticleHtml('');
    setShareLink(null);
    setShareError(null);

    fetch(`/api/parse?url=${encodeURIComponent(url)}`)
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch article');
        return res.json();
      })
      .then((data) => {
        if (data.article?.content) {
          setArticleHtml(data.article.content);
        } else {
          setError('Failed to load article content.');
        }
      })
      .catch(() => setError('Failed to load article content.'))
      .finally(() => setLoading(false));
  }, [url]);

  const handleShare = useCallback(
    async (highlights: any) => {
      if (!url) return;
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
    },
    [url]
  );

  return (
    <PageContainer>
      <Title>Article Highlights</Title>

      {loading && <Message>Loading article...</Message>}
      {error && <Message error>{error}</Message>}

      {shareLink && (
        <ShareLinkContainer>
          <strong>Share Link:</strong>{' '}
          <a href={shareLink} target="_blank" rel="noopener noreferrer">
            {shareLink}
          </a>
        </ShareLinkContainer>
      )}

      {shareError && <Message error>{shareError}</Message>}

      {!loading && !error && articleHtml && (
        <HighlightEditor
          htmlContent={articleHtml}
          onShare={handleShare}
          sharing={sharing}
        />
      )}

      {!loading && !error && !articleHtml && <Message>No preview available for this link.</Message>}
    </PageContainer>
  );
}
