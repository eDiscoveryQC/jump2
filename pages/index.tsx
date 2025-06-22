import React, { useState, useEffect, useCallback, useMemo, useRef } from "react";
import styled, { keyframes, css } from "styled-components";

// === Animations ===
const animatedGradient = keyframes`
  0% { background-position: 0% 50%; }
  100% { background-position: 100% 50%; }
`;
const funBounce = keyframes`
  0%, 100% { transform: translateY(0); }
  10% { transform: translateY(-18%); }
  20% { transform: translateY(0); }
  23% { transform: translateY(-10%);}
  28% { transform: translateY(0);}
  100% { transform: translateY(0);}
`;
const fadeInUp = keyframes`
  from { opacity: 0; transform: translateY(8px); }
  to { opacity: 1; transform: translateY(0); }
`;
const scaleIn = keyframes`
  from { opacity: 0; transform: scale(0.95);}
  to { opacity: 1; transform: scale(1);}
`;

// === Styled Components ===
const PageContainer = styled.main`
  min-height: 100vh;
  padding: 3rem 2rem 6rem;
  display: grid;
  grid-template-columns: 1fr 2fr;
  gap: 3rem;
  background: radial-gradient(circle at top, #0f172a, #1e293b);
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  color: #cbd5e1;

  @media (max-width: 980px) {
    grid-template-columns: 1fr;
    padding: 2rem 0.5rem 4rem;
    gap: 1.5rem;
  }
`;
const LeftColumn = styled.section`
  display: flex;
  flex-direction: column;
  max-width: 480px;
  margin: 0 auto;
  gap: 2.3rem;
  @media (max-width: 980px) { max-width: unset; }
`;
const GlassCard = styled.div`
  background: rgba(30,41,59,0.87);
  border-radius: 1.2rem;
  box-shadow: 0 8px 32px 0 rgba(31,38,135,0.2);
  backdrop-filter: blur(10px);
  border: 1.5px solid #3b82f6;
`;
const AnimatedLogoText = styled.span`
  background: linear-gradient(90deg, #60a5fa, #3b82f6, #60a5fa);
  background-size: 200% 200%;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  animation: ${animatedGradient} 2.8s linear infinite alternate;
  display: inline-block;
`;
const LogoWrapper = styled.div`
  display: flex;
  align-items: center;
  font-weight: 900;
  font-size: clamp(2.6rem, 7vw, 4.2rem);
  color: #60a5fa;
  user-select: text;
  filter: drop-shadow(0 0 6px #60a5faa) drop-shadow(0 0 10px #3b82f6aa);
`;
const TwoText = styled.span`
  color: #ffd100;
  font-size: 1.15em;
  margin-left: 0.05em;
  text-shadow: 0 0 12px #3b82f6aa;
  animation: ${funBounce} 3.5s cubic-bezier(0.32, 0.72, 0.52, 1.5) infinite;
`;
const Subtitle = styled.div`
  font-size: clamp(1.24rem, 2vw, 1.7rem);
  color: #94a3b8;
  font-weight: 600;
  line-height: 1.4;
  margin-bottom: 0.35em;
`;
const Description = styled.p`
  font-size: 1.12rem;
  line-height: 1.7;
  font-weight: 400;
  color: #cbd5e1;
  margin-bottom: 1.2em;
`;
const FormWrapper = styled.div`
  width: 100%;
  background: #131c2b;
  border-radius: 1.15em;
  box-shadow: 0 4px 24px #1e293b22;
  border: 1.5px solid #3b82f6;
  padding: 2.1em 1.7em 2.2em;
`;
const Input = styled.input`
  width: 100%;
  font-size: 1.13em;
  padding: 0.75em 1.1em;
  margin-bottom: 0.9em;
  border-radius: 0.58em;
  border: 1.5px solid #334155;
  background: #0f172a;
  color: #f1f5f9;
  font-weight: 500;
  outline: 0;
  transition: border-color 0.2s;
  &::placeholder { color: #64748b; }
  &:focus { border-color: #3b82f6; background: #1e293b; }
`;
const Button = styled.button`
  background: linear-gradient(90deg, #3b82f6, #2563eb);
  color: white;
  border: none;
  border-radius: 0.7em;
  font-size: 1.1em;
  font-weight: 700;
  padding: 1em 2em;
  margin-left: 0.3em;
  cursor: pointer;
  box-shadow: 0 2px 8px #2563eb55;
  transition: background 0.13s, box-shadow 0.13s;
  &:hover, &:focus { background: linear-gradient(90deg, #2563eb, #60a5fa); box-shadow: 0 4px 24px #60a5fa44; }
  &:disabled { background: #64748b; cursor: not-allowed; }
`;
const ExampleLinks = styled.div`
  margin: 0.8em 0 1.2em 0;
  a {
    color: #3b82f6;
    cursor: pointer;
    text-decoration: underline dotted;
    margin-right: 0.8em;
    font-size: 1em;
    &:hover { text-decoration: underline solid; }
  }
`;
const SupportedSites = styled.p`
  font-size: 0.97em;
  color: #a0aec0;
  margin-bottom: 0.5em;
`;
const HowItWorks = styled.div`
  font-size: 0.99em;
  color: #cbd5e1;
  ul { padding-left: 1.3em; margin: 0.5em 0 0 0; }
  li { margin-bottom: 0.15em; }
`;
const HR = styled.hr`
  border: none;
  border-top: 1.5px solid #233046;
  margin: 1.1em 0 1.2em 0;
`;

const PreviewWrapper = styled.section`
  background: rgba(23, 31, 47, 0.90);
  border-radius: 1rem;
  border: 1.5px solid #334155;
  padding: 2.2rem 2.5rem 2.5rem;
  color: #f1f5f9;
  font-size: 1rem;
  line-height: 1.7;
  box-shadow: 0 12px 20px #131c2b88;
  user-select: text;
  min-height: 440px;
  max-height: 82vh;
  overflow-y: auto;
  position: relative;
  @media (max-width: 980px) {
    margin-top: 2rem;
    padding: 1.2rem 0.6rem 2rem;
  }
`;
const VideoWrapper = styled.div`
  margin: 2rem auto 3rem;
  max-width: 640px;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 8px 20px #131c2b55;
  position: relative;
`;
const TimestampBadge = styled.div`
  position: absolute;
  top: 8px;
  right: 12px;
  background: rgba(0, 0, 0, 0.6);
  color: white;
  font-weight: 600;
  padding: 4px 10px;
  border-radius: 9999px;
  font-family: monospace;
  font-size: 0.85rem;
  user-select: none;
  pointer-events: none;
  text-shadow: 0 0 6px #000b;
`;

// === Lightbox ===
const LightboxBackdrop = styled.div<{ open: boolean }>`
  display: ${({ open }) => (open ? "flex" : "none")};
  position: fixed;
  inset: 0;
  background: rgba(13, 19, 31, 0.96);
  z-index: 1200;
  align-items: center;
  justify-content: center;
  animation: ${fadeInUp} 0.33s;
  padding: 2rem;
  backdrop-filter: blur(4px);
`;

const LightboxContent = styled.div`
  max-width: 420px;
  width: 100%;
  background: linear-gradient(120deg, rgba(30,41,59,0.97) 60%, rgba(37,56,99,0.88) 100%);
  border-radius: 1.3rem;
  padding: 2.7rem 2.5rem 2.2rem;
  box-shadow: 0 0 60px #14314dbb, 0 2px 8px #1e293b44;
  color: #e8edfa;
  font-size: 1.15rem;
  line-height: 1.65;
  user-select: text;
  text-align: center;
  animation: ${scaleIn} 0.34s;
  border: 2px solid #2563eb;
  position: relative;

  h2 {
    margin-top: 0;
    font-weight: 900;
    font-size: 2.4rem;
    color: #60a5fa;
    margin-bottom: 0.95rem;
    text-shadow: 0 2px 12px #1e2c51aa;
    letter-spacing: -1.5px;
  }
  p {
    margin-bottom: 1.15rem;
    color: #a7b9d8;
    font-size: 1.09em;
    font-weight: 500;
  }
  button, .close-btn {
    margin-top: 1.8rem;
    background: linear-gradient(90deg, #2563eb, #3b82f6 90%);
    color: #fff;
    border: none;
    border-radius: 0.6em;
    font-size: 1.15em;
    font-weight: 600;
    padding: 0.95em 2.1em;
    cursor: pointer;
    box-shadow: 0 3px 16px #2563eb55;
    transition: background 0.14s, box-shadow 0.13s;
    &:hover, &:focus {
      background: linear-gradient(90deg, #3b82f6, #2563eb 90%);
      box-shadow: 0 6px 24px #60a5fa44;
    }
  }
  @media (max-width: 600px) {
    padding: 1.2rem 0.5rem 1.3rem;
    font-size: 1rem;
  }
`;

// --- YouTube helpers ---
const isYouTubeUrl = (url: URL) =>
  ["www.youtube.com", "youtube.com", "youtu.be"].includes(url.hostname);
function parseTimestamp(input: string): number {
  if (!input) return 0;
  const parts = input.trim().split(":").map(Number);
  if (parts.some(isNaN)) return NaN;
  if (parts.length === 3) return parts[0] * 3600 + parts[1] * 60 + parts[2];
  if (parts.length === 2) return parts[0] * 60 + parts[1];
  if (parts.length === 1) return parts[0];
  return 0;
}
function formatTimestamp(seconds: number) {
  if (seconds < 0) return "";
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  if (h > 0) return `${h}:${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  return `${m}:${s.toString().padStart(2, "0")}`;
}
const YouTubePlayer = ({ url, startSeconds }: { url: string; startSeconds: number }) => {
  const videoId = useMemo(() => {
    try {
      const u = new URL(url);
      if (u.hostname === "youtu.be") return u.pathname.slice(1);
      return u.searchParams.get("v") || "";
    } catch {
      return "";
    }
  }, [url]);
  const src = useMemo(
    () =>
      `https://www.youtube.com/embed/${videoId}?start=${startSeconds}&autoplay=0&modestbranding=1&rel=0`,
    [videoId, startSeconds]
  );
  return (
    <VideoWrapper role="region" aria-label="YouTube video player">
      <iframe
        width="100%"
        height="360"
        src={src}
        title="YouTube video player"
        frameBorder={0}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
      {startSeconds > 0 && (
        <TimestampBadge>▶ {formatTimestamp(startSeconds)}</TimestampBadge>
      )}
    </VideoWrapper>
  );
};

// --- Main ---
export default function Home() {
  // State
  const [link, setLink] = useState("");
  const [highlightText, setHighlightText] = useState("");
  const [showPreview, setShowPreview] = useState(false);
  const [parsedSeconds, setParsedSeconds] = useState(0);
  const [error, setError] = useState("");
  const [articleContent, setArticleContent] = useState("");
  const [loadingPreview, setLoadingPreview] = useState(false);
  const [showLightbox, setShowLightbox] = useState(true);

  // For YouTube timestamp input
  useEffect(() => {
    if (!link) {
      setParsedSeconds(0);
      return;
    }
    try {
      const urlObj = new URL(link);
      if (isYouTubeUrl(urlObj)) {
        setParsedSeconds(parseTimestamp(highlightText));
      } else {
        setParsedSeconds(0);
      }
    } catch {
      setParsedSeconds(0);
    }
  }, [highlightText, link]);

  // Article preview fetcher (not for YouTube)
  useEffect(() => {
    if (!link) {
      setArticleContent("");
      setError("");
      return;
    }
    let url: URL;
    try {
      url = new URL(link);
      if (isYouTubeUrl(url)) {
        setArticleContent("");
        setError("");
        return;
      }
    } catch {
      setError("Invalid URL.");
      return;
    }
    setLoadingPreview(true);
    setError("");
    setArticleContent("");
    fetch(`/api/parse?url=${encodeURIComponent(link)}`)
      .then(async res => {
        if (!res.ok) throw new Error("Failed to fetch article preview.");
        const json = await res.json();
        if (json.article?.content) {
          setArticleContent(json.article.content);
        } else {
          setError("No preview available for this link.");
        }
      })
      .catch(() => setError("Failed to load preview. You can still create the jump link."))
      .finally(() => setLoadingPreview(false));
  }, [link, showPreview]);

  // Form actions
  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!link.trim()) {
      setError("Paste a valid link.");
      return;
    }
    setShowPreview(true);
  }

  // --- Demo links for onboarding
  const EXAMPLES = [
    { url: "https://www.bbc.com/news/world-us-canada-66159295", text: "democracy" },
    { url: "https://www.nytimes.com/2024/06/20/technology/ai-future.html", text: "artificial intelligence" },
    { url: "https://www.theguardian.com/environment/2025/jun/08/renewable-energy-breakthrough", text: "solar power" }
  ];

  return (
    <>
      <LightboxBackdrop
        open={showLightbox}
        role="dialog"
        aria-modal="true"
        aria-labelledby="welcomeTitle"
        aria-describedby="welcomeDesc"
      >
        <LightboxContent>
          <h2 id="welcomeTitle">Welcome to Jump2!</h2>
          <p id="welcomeDesc">
            Easily highlight the best parts of any article or video, generate a
            quick shareable link, and skip the fluff.<br /><br />
            Get started by pasting a link below!
          </p>
          <button
            type="button"
            onClick={() => setShowLightbox(false)}
            aria-label="Close welcome dialog"
          >
            Close
          </button>
        </LightboxContent>
      </LightboxBackdrop>

      <PageContainer>
        <LeftColumn>
          <LogoWrapper>
            <AnimatedLogoText>Jump</AnimatedLogoText>
            <TwoText>2</TwoText>
          </LogoWrapper>
          <Subtitle>Skip the fluff. Jump2 the good part.</Subtitle>
          <Description>
            Paste a link (article or video) and highlight the best part — timestamp, quote, or keyword.
          </Description>
          <FormWrapper>
            <form onSubmit={handleSubmit} autoComplete="off" spellCheck={false}>
              <Input
                type="url"
                required
                placeholder="Paste article or video URL..."
                value={link}
                onChange={e => setLink(e.target.value)}
                autoFocus
                aria-label="Paste article URL"
              />
              <Input
                type="text"
                placeholder={(() => {
                  try {
                    const urlObj = new URL(link);
                    if (isYouTubeUrl(urlObj)) return 'Jump to timestamp (e.g. 1:23)';
                  } catch {}
                  return 'Highlight (e.g. "key finding"; separate multiple with ;)';
                })()}
                value={highlightText}
                onChange={e => setHighlightText(e.target.value)}
                aria-label="Highlight text or timestamp"
              />
              <Button type="submit">Preview</Button>
            </form>
            <div style={{ fontSize: "0.99em", margin: "0.5em 0 1.2em 0", color: "#64748b" }}>
              <b>Tip:</b> Paste your link &amp; highlight, pick a color, then Preview!
            </div>
            <ExampleLinks>
              Try:&nbsp;
              {EXAMPLES.map(({ url, text }, i) => (
                <a key={i} onClick={() => { setLink(url); setHighlightText(text); setShowPreview(false); setTimeout(() => setShowPreview(true), 75); }}>
                  {url.replace(/^https?:\/\//, '').split("/")[0]}
                </a>
              ))}
            </ExampleLinks>
            <SupportedSites>
              <b>Works best with:</b> NYT, BBC, CNN, Yahoo, Wikipedia, Substack, most public news/blogs.
            </SupportedSites>
            <HR />
            <HowItWorks>
              <b>How it works:</b>
              <ul>
                <li>Paste a news/article/blog link above.</li>
                <li>Add a highlight (optionally use <b>;</b> to highlight multiple phrases).</li>
                <li>Pick a color (optional).</li>
                <li>Click <b>Preview</b> to see a live preview, highlight, and share instantly.</li>
                <li>Copy your unique share link and send it to anyone!</li>
              </ul>
            </HowItWorks>
          </FormWrapper>
        </LeftColumn>

        {/* --- Main Preview --- */}
        <PreviewWrapper as={GlassCard}>
          {loadingPreview && <div style={{ textAlign: "center", margin: "3em 0" }}>Loading preview...</div>}
          {!loadingPreview && (() => {
            try {
              const urlObj = new URL(link);
              if (isYouTubeUrl(urlObj)) {
                return (
                  <YouTubePlayer url={link} startSeconds={parsedSeconds} />
                );
              }
            } catch { /* not a URL or not YouTube */ }
            if (!articleContent && !error) {
              return <div style={{ color: "#64748b", textAlign: "center", marginTop: "2.5em" }}>No preview available for this link.</div>;
            }
            if (error) {
              return <div style={{ color: "#f87171", fontWeight: 600, marginTop: "2.1em" }}>{error}</div>;
            }
            if (articleContent) {
              return <div dangerouslySetInnerHTML={{ __html: articleContent }} />;
            }
            return null;
          })()}
        </PreviewWrapper>
      </PageContainer>
    </>
  );
}