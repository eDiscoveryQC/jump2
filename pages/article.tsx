import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/router';
import styled from 'styled-components';
import HighlightEditor from '../components/HighlightEditor';

const PageContainer = styled.div`
  max-width: 900px;
  margin: 2rem auto;
  padding: 0 1rem;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  color: #1e293b;
`;

const Title = styled.h1`
  font-size: 2.25rem;
  font-weight: 700;
  margin-bottom: 1rem;
  color: #1e4268;
`;

const StatusMessage = styled.p<{ error?: boolean }>`
  color: ${({ error }) => (error ? '#ef4444' : '#6b7280')};
  font-weight: ${({ error }) => (error ? 600 : 400)};
  margin-bottom: 1rem;
  font-size: 1rem;
`;

const ShareLinkWrapper = styled.div`
  margin: 1.5rem 0;
  padding: 1rem;
  background: #e0f2fe;
  border-radius: 6px;
  border: 1px solid #bae6fd;
  font-size: 1rem;
  word-break: break-all;

  a {
    color: #0284c7;
    font-weight: 600;
    text-decoration: underline;
  }
`;

const ErrorDetails = styled.pre`
  margin-top: 0.5rem;
  background: #fee2e2;
  padding: 1rem;
  border-radius: 6px;
  font-size: 0.875rem;
  white-space: pre-wrap;
  color: #b91c1c;
  overflow-x: auto;
`;

export default function ArticlePage() {
  const router = useRouter();
  const { url } = router.query;

  const [articleHtml, setArticleHtml] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [errorStack, setErrorStack] = useState<string | null>(null);
  const [shareLink, setShareLink] = useState<string | null>(null);
  const [sharing, setSharing] = useState(false);
  const [shareError, setShareError] = useState<string | null>(null);

  // Fetch article HTML content from backend API
  useEffect(() => {
    if (!url || typeof url !== 'string') return;

    setLoading(true);
    setError(null);
    setErrorStack(null);
    setArticleHtml('');
    setShareLink(null);
    setShareError(null);

    fetch(`/api/parse?url=${encodeURIComponent(url)}`)
      .then(async (res) => {
        const json = await res.json();
        if (!res.ok) {
          setError(json.error || 'Failed to load article content.');
          setErrorStack(json.stack || null);
          throw new Error(json.error);
        }
        if (json.article?.content) {
          setArticleHtml(json.article.content);
        } else {
          setError('No article content available.');
        }
      })
      .catch(() => {
        if (!error) {
          setError('Failed to load article content.');
        }
      })
      .finally(() => setLoading(false));
  }, [url]);

  // Handler to share highlights
  const handleShare = useCallback(
    async (highlights: any) => {
      if (!url) return;

      setSharing(true);
      setShareError(null);
      setShareLink(null);

      try {
        const res = await fetch('/api/highlights', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ url, highlights }),
        });
        const data = await res.json();

        if (res.ok && data.shareUrl) {
          setShareLink(data.shareUrl);
        } else {
          setShareError(data.error || 'Failed to generate share link.');
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

      {loading && <StatusMessage>Loading article content...</StatusMessage>}

      {error && (
        <>
          <StatusMessage error>{error}</StatusMessage>
          {errorStack && <ErrorDetails>{errorStack}</ErrorDetails>}
        </>
      )}

      {shareLink && (
        <ShareLinkWrapper>
          Share your highlights:{' '}
          <a href={shareLink} target="_blank" rel="noopener noreferrer">
            {shareLink}
          </a>
        </ShareLinkWrapper>
      )}

      {shareError && <StatusMessage error>{shareError}</StatusMessage>}

      {!loading && !error && articleHtml && (
        <HighlightEditor
          articleText={articleHtml.replace(/<[^>]+>/g, '')}
          onShare={handleShare}
          sharing={sharing}
        />
      )}

      {!loading && !error && !articleHtml && (
        <StatusMessage>No preview available for this link.</StatusMessage>
      )}
    </PageContainer>
  );
}
