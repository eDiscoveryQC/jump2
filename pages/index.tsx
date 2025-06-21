import { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import { useRouter } from 'next/router';

// === Animations ===
const jumpOffP = keyframes`
  0%, 100% { transform: translate(0, 0) rotate(0); }
  50% { transform: translate(12px, -18px) rotate(-10deg); }
`;

const pulse = keyframes`
  0% { box-shadow: 0 0 0 0 rgba(96, 165, 250, 0.7); }
  70% { box-shadow: 0 0 0 15px rgba(96, 165, 250, 0); }
  100% { box-shadow: 0 0 0 0 rgba(96, 165, 250, 0); }
`;

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(8px);}
  to { opacity: 1; transform: translateY(0);}
`;

// === Styled Components ===
const Container = styled.main`
  min-height: 100vh;
  padding: 4rem 2rem 6rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  background: radial-gradient(circle at top, #0f172a, #1e293b);
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  color: #cbd5e1;
  user-select: none;
`;

const LogoWrapper = styled.div`
  position: relative;
  font-size: clamp(3rem, 7vw, 4.5rem);
  font-weight: 900;
  color: #60a5fa;
  margin-bottom: 0.75rem;
  user-select: text;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const JumpText = styled.span`
  position: relative;
  z-index: 2;
`;

const TwoText = styled.span`
  color: #3b82f6;
  font-weight: 900;
  font-size: 1.1em;
  position: absolute;
  left: 2.35em;
  top: 0.2em;
  z-index: 1;
  animation: ${jumpOffP} 2.5s ease-in-out infinite;
  user-select: none;
  pointer-events: none;
  filter: drop-shadow(0 2px 2px rgba(0,0,0,0.2));
`;

const Subtitle = styled.p`
  font-size: clamp(1.25rem, 2.5vw, 1.75rem);
  max-width: 640px;
  text-align: center;
  color: #94a3b8;
  margin: 0 0 3rem;
  font-weight: 600;
`;

const Description = styled.p`
  max-width: 720px;
  font-size: 1.125rem;
  line-height: 1.75;
  color: #cbd5e1;
  margin-bottom: 4rem;
  text-align: center;
  font-weight: 400;
  user-select: text;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  max-width: 480px;
  width: 100%;
`;

const Input = styled.input<{ disabled?: boolean }>`
  padding: 1rem 1.25rem;
  border-radius: 0.7rem;
  border: 1.5px solid #334155;
  background: ${({ disabled }) => (disabled ? '#64748b' : '#1e293b')};
  font-size: 1.125rem;
  font-weight: 500;
  color: #f1f5f9;
  transition: border-color 0.3s ease, background-color 0.3s ease;

  &::placeholder {
    color: #64748b;
  }

  &:focus {
    outline: none;
    border-color: #3b82f6;
    background: #334155;
    box-shadow: 0 0 10px #3b82f6aa;
  }

  cursor: ${({ disabled }) => (disabled ? 'not-allowed' : 'text')};
`;

const Hint = styled.small`
  color: #64748b;
  font-family: monospace;
  font-size: 0.9rem;
  margin-top: -1rem;
  margin-bottom: 1.5rem;
  user-select: none;
`;

const Button = styled.button<{ disabled?: boolean }>`
  padding: 1.15rem 2rem;
  border-radius: 9999px;
  border: none;
  background: linear-gradient(90deg, #3b82f6, #2563eb);
  color: white;
  font-size: 1.25rem;
  font-weight: 700;
  cursor: pointer;
  transition: transform 0.25s ease, background-color 0.25s ease;
  user-select: none;
  animation: ${pulse} 2.5s infinite;

  &:hover:not(:disabled) {
    transform: scale(1.07);
    background: linear-gradient(90deg, #2563eb, #3b82f6);
  }

  &:disabled {
    background-color: #64748b;
    cursor: not-allowed;
    animation: none;
  }
`;

const Feedback = styled.p`
  color: #f87171;
  font-weight: 600;
  margin-top: 0.75rem;
  text-align: center;
  user-select: text;
`;

const PreviewContainer = styled.section`
  margin-top: 3.5rem;
  width: 100%;
  max-width: 720px;
  background: #1e293b;
  border-radius: 1rem;
  border: 1.5px solid #334155;
  padding: 2rem 3rem;
  color: #f1f5f9;
  font-size: 1rem;
  line-height: 1.7;
  overflow-y: auto;
  box-shadow: 0 12px 20px rgba(0, 0, 0, 0.3);
  user-select: text;
  animation: ${fadeIn} 0.4s ease forwards;

  h1, h2, h3, h4 {
    color: #60a5fa;
    margin-top: 1.5rem;
    margin-bottom: 1rem;
    font-weight: 700;
  }

  p {
    margin-bottom: 1.25rem;
  }

  a {
    color: #3b82f6;
    text-decoration: underline;
    word-break: break-word;
  }

  blockquote {
    border-left: 5px solid #3b82f6;
    padding-left: 1rem;
    color: #94a3b8;
    font-style: italic;
    margin: 1rem 0;
  }

  ul, ol {
    margin-left: 1.75rem;
    margin-bottom: 1.5rem;
  }

  img {
    max-width: 100%;
    border-radius: 0.5rem;
    margin: 1rem 0;
  }
`;

const ShareWrapper = styled.div`
  margin-top: 2.5rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
`;

const ShortUrlInput = styled.input`
  width: 100%;
  max-width: 480px;
  font-size: 1.125rem;
  padding: 0.75rem 1rem;
  border-radius: 0.7rem;
  border: 1.5px solid #334155;
  background: #1e293b;
  color: #f1f5f9;
  font-weight: 500;
  user-select: all;

  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 10px #3b82f6aa;
  }
`;

const CopyButton = styled.button`
  background-color: #2563eb;
  color: white;
  border-radius: 0.5rem;
  padding: 0.6rem 1.5rem;
  font-weight: 700;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.25s ease;

  &:hover {
    background-color: #3b82f6;
  }

  &:active {
    background-color: #1e40af;
  }
`;

const VideoWrapper = styled.div`
  margin: 2rem auto 3rem;
  max-width: 640px;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 8px 20px rgba(0,0,0,0.3);
  position: relative;
`;

const TimestampBadge = styled.div`
  position: absolute;
  top: 8px;
  right: 12px;
  background: rgba(0,0,0,0.6);
  color: white;
  font-weight: 600;
  padding: 4px 10px;
  border-radius: 9999px;
  font-family: monospace;
  font-size: 0.85rem;
  user-select: none;
  pointer-events: none;
`;

// === Helper Functions ===
function useDebounce(value: string, delay: number) {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debouncedValue;
}

function isYouTubeUrl(url: URL) {
  return ['www.youtube.com', 'youtube.com', 'youtu.be'].includes(url.hostname);
}

function parseTimestamp(input: string) {
  if (!input) return 0;
  const parts = input.trim().split(':').map(Number);
  if (parts.length === 3) return parts[0] * 3600 + parts[1] * 60 + parts[2];
  if (parts.length === 2) return parts[0] * 60 + parts[1];
  if (parts.length === 1) return parts[0];
  return 0;
}

function formatTimestamp(seconds: number) {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  return h > 0
    ? `${h}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
    : `${m}:${s.toString().padStart(2, '0')}`;
}

// YouTube Player component
function YouTubePlayer({ url, startSeconds }: { url: string; startSeconds: number }) {
  const videoId = (() => {
    try {
      const u = new URL(url);
      if (u.hostname === 'youtu.be') return u.pathname.slice(1);
      return u.searchParams.get('v') || '';
    } catch {
      return '';
    }
  })();

  const formattedTimestamp = formatTimestamp(startSeconds);

  const src = `https://www.youtube.com/embed/${videoId}?start=${startSeconds}&autoplay=0&modestbranding=1&rel=0`;

  return (
    <VideoWrapper>
      <iframe
        width="100%"
        height="360"
        src={src}
        title="YouTube video player"
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
      {startSeconds > 0 && <TimestampBadge>▶ {formattedTimestamp}</TimestampBadge>}
    </VideoWrapper>
  );
}

// === Main Home Component ===
export default function Home() {
  const router = useRouter();
  const [link, setLink] = useState('');
  const [jumpTo, setJumpTo] = useState('');
  const [parsedSeconds, setParsedSeconds] = useState(0);
  const [articleContent, setArticleContent] = useState('');
  const [error, setError] = useState('');
  const [shortUrl, setShortUrl] = useState('');
  const [loadingShort, setLoadingShort] = useState(false);
  const [loadingPreview, setLoadingPreview] = useState(false);

  const debouncedLink = useDebounce(link, 500);

  // Parse timestamp input & validate
  useEffect(() => {
    if (jumpTo.trim() === '') {
      setParsedSeconds(0);
      return;
    }
    const secs = parseTimestamp(jumpTo);
    if (isNaN(secs) || secs < 0) {
      setError('Invalid timestamp format. Use MM:SS or HH:MM:SS.');
    } else {
      setError('');
      setParsedSeconds(secs);
    }
  }, [jumpTo]);

  // Fetch article preview if not YouTube
  useEffect(() => {
    if (!debouncedLink) {
      setArticleContent('');
      setError('');
      return;
    }
    try {
      const url = new URL(debouncedLink);
      if (isYouTubeUrl(url)) {
        setArticleContent('');
        return;
      }
    } catch {
      setError('Invalid URL.');
      return;
    }

    const fetchArticle = async () => {
      setLoadingPreview(true);
      setError('');
      setArticleContent('');
      setShortUrl('');
      try {
        const res = await fetch(`/api/parse?url=${encodeURIComponent(debouncedLink)}`);
        if (!res.ok) throw new Error('Failed to fetch article.');
        const json = await res.json();
        if (json.article?.content) {
          setArticleContent(json.article.content);
        } else {
          setError('No preview available for this link.');
        }
      } catch {
        setError('Failed to load preview. You can still create the jump link.');
      }
      setLoadingPreview(false);
    };
    fetchArticle();
  }, [debouncedLink]);

  // Generate short URL
  const generateShortUrl = async (fullUrl: string) => {
    setShortUrl('');
    setLoadingShort(true);
    setError('');
    try {
      const res = await fetch('/api/shorten', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fullUrl }),
      });
      const data = await res.json();
      if (res.ok) {
        setShortUrl(data.shortUrl);
      } else {
        setError(data.error || 'Failed to generate short URL');
      }
    } catch {
      setError('Failed to generate short URL');
    }
    setLoadingShort(false);
  };

  // Handle create Jump2 link
  const handleCreate = () => {
    setError('');
    setShortUrl('');
    if (!link) {
      setError('Please paste a valid link.');
      return;
    }

    try {
      const url = new URL(link);
      if (parsedSeconds > 0 && isYouTubeUrl(url)) {
        url.searchParams.set('t', parsedSeconds.toString());
      } else if (jumpTo.trim() !== '') {
        url.hash = `:~:text=${encodeURIComponent(jumpTo.trim())}`;
      }

      generateShortUrl(url.toString());
    } catch {
      setError('Invalid URL format.');
    }
  };

  return (
    <Container>
      <LogoWrapper>
        <JumpText>Jump</JumpText>
        <TwoText>2</TwoText>
      </LogoWrapper>

      <Subtitle>Skip the fluff. Jump2 the good part.</Subtitle>

      <Description>
        Paste a link (article or video) and highlight the best part — timestamp, quote, or keyword.
      </Description>

      <Form
        onSubmit={(e) => {
          e.preventDefault();
          handleCreate();
        }}
        noValidate
      >
        <Input
          type="url"
          placeholder="Paste a link (article or video)..."
          value={link}
          onChange={(e) => setLink(e.target.value)}
          spellCheck={false}
          autoComplete="off"
          required
          aria-label="Content link"
          aria-invalid={!!error}
          disabled={loadingPreview || loadingShort}
        />
        <Input
          type="text"
          placeholder="Jump to... (timestamp or highlight)"
          value={jumpTo}
          onChange={(e) => setJumpTo(e.target.value)}
          spellCheck={false}
          autoComplete="off"
          aria-label="Jump to position"
          disabled={!link || loadingPreview || loadingShort}
        />
        <Hint>
          For videos, enter timestamp like <code>1:23</code> or <code>0:02:15</code>
        </Hint>

        <Button
          type="submit"
          disabled={
            loadingPreview ||
            loadingShort ||
            !link ||
            (!!jumpTo && error !== '')
          }
          aria-disabled={
            loadingPreview ||
            loadingShort ||
            !link ||
            (!!jumpTo && error !== '')
          }
        >
          {loadingShort ? 'Generating...' : 'Make it a Jump2'}
        </Button>
      </Form>

      {error && <Feedback role="alert">{error}</Feedback>}

      {loadingPreview && (
        <PreviewContainer aria-live="polite" aria-busy="true">
          <em>Loading preview...</em>
        </PreviewContainer>
      )}

      {!loadingPreview && articleContent && (
        <PreviewContainer dangerouslySetInnerHTML={{ __html: articleContent }} />
      )}

      {link && (() => {
        try {
          const urlObj = new URL(link);
          return isYouTubeUrl(urlObj);
        } catch {
          return false;
        }
      })() && <YouTubePlayer url={link} startSeconds={parsedSeconds} />}

      <ShareWrapper>
        {shortUrl && (
          <>
            <ShortUrlInput
              type="text"
              readOnly
              value={shortUrl}
              onFocus={(e) => e.target.select()}
              aria-label="Short URL"
            />
            <CopyButton
              onClick={() => {
                navigator.clipboard.writeText(shortUrl);
                alert('Short URL copied to clipboard!');
              }}
              aria-label="Copy short URL"
            >
              Copy Short URL
            </CopyButton>
          </>
        )}
      </ShareWrapper>
    </Container>
  );
}
