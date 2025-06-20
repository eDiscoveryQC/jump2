import { useState, useEffect, useCallback, useMemo } from 'react';
import { useRouter } from 'next/router';
import styled, { keyframes, css } from 'styled-components';
import HighlightEditor from '../components/HighlightEditor';

// Animations
const fadeIn = keyframes`
  from {opacity: 0;}
  to {opacity: 1;}
`;

const pulse = keyframes`
  0% { box-shadow: 0 0 0 0 rgba(96, 165, 250, 0.7); }
  70% { box-shadow: 0 0 0 15px rgba(96, 165, 250, 0); }
  100% { box-shadow: 0 0 0 0 rgba(96, 165, 250, 0); }
`;

// Styled Components

const Container = styled.main`
  max-width: 900px;
  margin: 3rem auto;
  padding: 0 1rem;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  color: #e0e7ff;
  user-select: text;
  position: relative;
`;

const Title = styled.h1`
  font-size: clamp(2rem, 5vw, 3rem);
  font-weight: 900;
  color: #60a5fa;
  margin-bottom: 2rem;
  user-select: text;
  animation: ${fadeIn} 0.8s ease forwards;
`;

const Message = styled.p<{ error?: boolean }>`
  color: ${({ error }) => (error ? '#f87171' : '#94a3b8')};
  font-weight: 600;
  font-size: 1.125rem;
  margin: 1rem 0;
  text-align: center;
  user-select: text;
  animation: ${fadeIn} 0.6s ease forwards;
`;

const ShareSection = styled.section`
  margin-top: 2.5rem;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 1rem;
  justify-content: center;
  animation: ${fadeIn} 1s ease forwards;
`;

const ShareLink = styled.a`
  color: #3b82f6;
  font-weight: 700;
  font-size: 1.125rem;
  word-break: break-word;
  text-decoration: underline;
  cursor: pointer;

  &:hover,
  &:focus {
    color: #2563eb;
    outline: none;
  }
`;

const CopyButton = styled.button`
  background-color: #2563eb;
  border: none;
  border-radius: 0.5rem;
  padding: 0.5rem 1.25rem;
  color: white;
  font-weight: 700;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.25s ease, transform 0.2s ease;
  user-select: none;

  &:hover {
    background-color: #3b82f6;
    transform: scale(1.05);
  }

  &:focus {
    outline: 3px solid #60a5fa;
  }

  &:active {
    background-color: #1e40af;
    transform: scale(0.95);
  }
`;

const LoadingOverlay = styled.div<{ active: boolean }>`
  display: ${({ active }) => (active ? 'flex' : 'none')};
  position: fixed;
  inset: 0;
  background-color: rgba(15, 23, 42, 0.85);
  justify-content: center;
  align-items: center;
  z-index: 1000;
  user-select: none;
`;

const Spinner = styled.div`
  border: 6px solid #334155;
  border-top: 6px solid #3b82f6;
  border-radius: 50%;
  width: 60px;
  height: 60px;
  animation: spin 1s linear infinite;
  @keyframes spin {
    0% { transform: rotate(0deg);}
    100% { transform: rotate(360deg);}
  }
`;

const StyledHighlightEditor = styled(HighlightEditor)`
  margin-top: 2rem;
  box-shadow: 0 0 10px rgba(96, 165, 250, 0.3);
  border-radius: 1rem;
  overflow: hidden;
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

  // Fetch article content with memoized URL to avoid refetch on same url
  const fetchArticle = useCallback(async (targetUrl: string) => {
    setLoading(true);
    setError(null);
    setShareLink(null);
    setShareError(null);
    setArticleHtml('');

    try {
      const res = await fetch(`/api/parse?url=${encodeURIComponent(targetUrl)}`);
      if (!res.ok) throw new Error(`Failed to fetch article (status: ${res.status})`);
      const data = await res.json();
      if (data.article?.content) {
        setArticleHtml(data.article.content);
      } else {
        setError('No preview available for this link.');
      }
    } catch {
      setError('Failed to load article content.');
    } finally {
      setLoading(false);
    }
  }, []);

  // Trigger fetch on URL change
  useEffect(() => {
    if (url && typeof url === 'string') {
      fetchArticle(url);
    }
  }, [url, fetchArticle]);

  // Share highlights
  const handleShare = useCallback(async (highlights) => {
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
  }, [url]);

  // Memoized plain text for highlighting (strip html)
  const articleText = useMemo(() => {
    return articleHtml.replace(/<[^>]+>/g, '') || '';
  }, [articleHtml]);

  return (
    <>
      <LoadingOverlay active={loading}>
        <Spinner role="status" aria-label="Loading article content" />
      </LoadingOverlay>

      <Container role="main" aria-live="polite" aria-busy={loading}>
        <Title tabIndex={-1}>Article Highlights</Title>

        {error && <Message error role="alert">{error}</Message>}

        {!loading && !error && articleHtml && (
          <StyledHighlightEditor
            articleText={articleText}
            onShare={handleShare}
          />
        )}

        <ShareSection aria-live="assertive" aria-atomic="true">
          {sharing && <Message>Generating share link...</Message>}

          {shareError && <Message error role="alert">{shareError}</Message>}

          {shareLink && (
            <>
              <ShareLink
                href={shareLink}
                target="_blank"
                rel="noopener noreferrer"
                tabIndex={0}
              >
                {shareLink}
              </ShareLink>
              <CopyButton
                onClick={() => {
                  navigator.clipboard.writeText(shareLink);
                  alert('Share link copied to clipboard!');
                }}
                aria-label="Copy share link to clipboard"
              >
                Copy Link
              </CopyButton>
            </>
          )}
        </ShareSection>
      </Container>
    </>
  );
}
