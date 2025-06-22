import React, { useRef, useState, useEffect, useCallback } from "react";
import styled, { keyframes, css } from "styled-components";

// Animations
const gradient = keyframes`
  0% { background-position: 0% 50%; }
  100% { background-position: 100% 50%; }
`;
const fadeIn = keyframes`
  from { opacity: 0;}
  to { opacity: 1;}
`;
const bounce = keyframes`
  0%, 100% { transform: translateY(0);}
  13% { transform: translateY(-18%);}
  20% { transform: translateY(0);}
  23% { transform: translateY(-11%);}
  28% { transform: translateY(0);}
  100% { transform: translateY(0);}
`;
const pop = keyframes`
  0% { transform: scale(0.9);}
  70% { transform: scale(1.05);}
  100% { transform: scale(1);}
`;

// Layout
const Bg = styled.div`
  min-height: 100vh;
  background: radial-gradient(circle at 60% 20%, #25406a 0%, #0d1423 100%);
  padding: 0;
`;
const Grid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1.25fr;
  gap: 3.5rem;
  max-width: 1200px;
  margin: 0 auto;
  padding: 3rem 1.5rem 2.5rem;
  @media (max-width: 900px) {
    grid-template-columns: 1fr;
    gap: 2.2rem;
    padding: 1.2rem 0.2rem 2.8rem;
  }
`;

// Hero & Branding
const Hero = styled.section`
  display: flex;
  flex-direction: column;
  justify-content: center;
  min-height: 250px;
  margin-bottom: 2.5em;
`;
const LogoRow = styled.h1`
  display: flex;
  align-items: center;
  gap: 0.18em;
  font-size: clamp(2.5rem, 7vw, 4.2rem);
  font-weight: 900;
  letter-spacing: -1.6px;
  user-select: none;
  margin: 0 0 0.13em;
  background: none;
`;
const LogoText = styled.span`
  background: linear-gradient(90deg, #60a5fa 10%, #3b82f6 90%, #60a5fa 100%);
  background-size: 200% 200%;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  animation: ${gradient} 2.8s alternate infinite, ${bounce} 3.5s cubic-bezier(0.32, 0.72, 0.52, 1.5) infinite;
  font-weight: 900;
  display: inline-block;
`;
const LogoTwo = styled.span`
  color: #ffd100;
  font-size: 1.14em;
  font-weight: 900;
  margin-left: 0.08em;
  text-shadow: 0 0 18px #3b82f6aa;
  animation: ${bounce} 3.5s cubic-bezier(.46,1.58,.47,.86) infinite;
  display: inline-block;
`;
const Slogan = styled.div`
  font-size: 1.25em;
  color: #e6eaff;
  font-weight: 500;
  margin-bottom: 0.7em;
  text-shadow: 0 1px 10px #224, 0 0px 3px #2563eb33;
`;
const HeroDesc = styled.div`
  color: #b5c7e4;
  font-size: 1.13em;
  margin-bottom: 1.35em;
  font-weight: 400;
  max-width: 490px;
`;

// Card
const Card = styled.div`
  background: rgba(20,28,45,0.98);
  border-radius: 1.25em;
  box-shadow: 0 8px 32px 0 #1e293b33,0 0 0 1.5px #2563eb99;
  padding: 2.3em 1.6em 2.1em;
  animation: ${fadeIn} 0.5s;
  position: relative;
  margin-bottom: 2.1em;
  @media (max-width: 900px) { padding: 1.2em 0.6em 1.7em; }
`;
const InputRow = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1em;
  margin-bottom: 1.5em;
  position: relative;
`;
const Input = styled.input`
  font-size: 1.15em;
  border-radius: 0.8em;
  padding: 0.8em 1.1em;
  border: 1.7px solid #283755;
  background: #0d1423;
  color: #eaf0fa;
  font-weight: 500;
  transition: border-color 0.15s;
  &:focus { border-color: #3b82f6; background: #18243a; outline: none; }
  &::placeholder { color: #7b8ba9; }
`;
const Button = styled.button<{ primary?: boolean }>`
  font-size: 1.09em;
  border-radius: 0.6em;
  padding: 0.78em 2.1em;
  font-weight: 700;
  border: none;
  margin-top: 0.2em;
  color: #fff;
  background: ${({primary}) =>
    primary ? "linear-gradient(90deg, #3b82f6 10%, #2563eb 90%)" : "#1e293b"};
  box-shadow: ${({primary}) =>
    primary ? "0 3px 16px #2563eb66" : "none"};
  cursor: pointer;
  transition: background 0.13s, box-shadow 0.13s, transform 0.12s;
  &:hover, &:focus {
    background: ${({primary}) =>
      primary ? "linear-gradient(90deg, #2563eb 10%, #3b82f6 90%)" : "#334155"};
    transform: scale(1.04);
    outline: none;
  }
`;
const ExampleLinks = styled.div`
  margin: 0.1em 0 1.1em 0;
  display: flex;
  flex-wrap: wrap;
  gap: 0.8em;
  a {
    color: #3b82f6;
    cursor: pointer;
    text-decoration: underline dotted;
    font-size: 0.97em;
    font-weight: 500;
    &:hover { text-decoration: underline solid; }
  }
`;
const Tip = styled.div`
  font-size: 0.97em;
  color: #8ba8d8;
  margin-bottom: 0.6em;
  margin-top: -0.4em;
`;
const HowItWorks = styled.div`
  margin-top: 1.5em;
  color: #b9d3ff;
  font-size: 1.01em;
  ul {
    margin: 0.7em 0 0 1.4em;
    padding: 0;
    li {margin-bottom: 0.2em;}
  }
`;

const ShareBar = styled.div`
  background: linear-gradient(90deg, #1b2336 70%, #25406a 100%);
  border-radius: 1em;
  box-shadow: 0 4px 18px #3b82f633;
  padding: 1.3em 2em 1.2em;
  display: flex;
  align-items: center;
  gap: 1.2em;
  margin-top: 2.3em;
  font-size: 1.15em;
  @media (max-width: 600px) {
    flex-direction: column;
    gap: 0.7em;
    padding: 1em 0.6em 1.2em;
  }
`;

const ShareInput = styled.input`
  font-size: 1.11em;
  border-radius: 0.6em;
  border: 1.5px solid #334155;
  background: #0d1423;
  color: #eaf0fa;
  font-weight: 600;
  padding: 0.68em 1.2em;
  flex: 1 1 0%;
  outline: none;
  min-width: 0;
`;

const CopyBtn = styled(Button)`
  font-size: 1em;
  font-weight: 700;
  padding: 0.7em 1.5em;
  margin: 0;
  background: #2563eb;
  border-radius: 0.5em;
  &:hover {background: #3b82f6;}
`;

const ShareActions = styled.div`
  display: flex;
  gap: 0.7em;
  align-items: center;
`;

const ShareToast = styled.div`
  position: fixed;
  bottom: 2.6em;
  left: 50%;
  transform: translateX(-50%);
  background: #2563eb;
  color: #fff;
  font-size: 1.1em;
  font-weight: 700;
  border-radius: 0.6em;
  padding: 0.7em 2em;
  box-shadow: 0 4px 18px #2563eb44;
  z-index: 2000;
  animation: ${pop} 0.5s;
`;

// Loader & Skeletons
const Loader = styled.div`
  width: 32px; height: 32px;
  border-radius: 50%;
  border: 4px solid #3b82f688;
  border-top: 4px solid #3b82f6;
  animation: spin 0.85s linear infinite;
  margin: 3em auto 2em auto;
  @keyframes spin {to {transform: rotate(360deg);}}
`;
const Skeleton = styled.div`
  height: 18px;
  width: 80%;
  margin: 0.5em 0;
  background: linear-gradient(90deg, #24304a 40%, #334155 60%, #24304a 100%);
  background-size: 200% 100%;
  border-radius: 0.5em;
  animation: ${gradient} 1.3s linear infinite;
`;

// Preview
const PreviewCard = styled(Card)`
  min-height: 420px;
  max-height: 79vh;
  overflow-y: auto;
  font-size: 1rem;
  color: #eaf0fa;
  padding: 2.1em 2.3em 2em;
  position: relative;
  @media (max-width: 900px) { padding: 1.1em 0.6em 1.7em; }
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
  background: rgba(0, 0, 0, 0.65);
  color: #fff;
  font-weight: 600;
  padding: 4px 10px;
  border-radius: 9999px;
  font-family: monospace;
  font-size: 0.95em;
  user-select: none;
  pointer-events: none;
  text-shadow: 0 0 8px #000c;
`;

const Mark = styled.mark`
  background: linear-gradient(90deg, #ffe066 70%, #ffd100 100%);
  color: #334155;
  padding: 0 0.15em;
  border-radius: 0.33em;
  font-weight: 700;
  box-decoration-break: clone;
  box-shadow: 0 2px 10px #ffd10022;
`;


const Footer = styled.footer`
  margin: 3.5em auto 1.2em auto;
  color: #b5c7e4;
  text-align: center;
  font-size: 1em;
  opacity: 0.95;
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
  const videoId = React.useMemo(() => {
    try {
      const u = new URL(url);
      if (u.hostname === "youtu.be") return u.pathname.slice(1);
      return u.searchParams.get("v") || "";
    } catch {
      return "";
    }
  }, [url]);
  const src = React.useMemo(
    () =>
      `https://www.youtube.com/embed/${videoId}?start=${startSeconds}&autoplay=0&modestbranding=1&rel=0`,
    [videoId, startSeconds]
  );
  return (
    <VideoWrapper>
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

// === Highlighting utility ===
// Replace all highlight phrases in HTML with a <mark> tag (case-insensitive, works with HTML).
function highlightHtml(rawHtml: string, highlights: string[]): string {
  if (!rawHtml || !highlights.length) return rawHtml;
  // Sanitize highlights
  const phrases = highlights
    .map(p => p.trim())
    .filter(Boolean)
    .sort((a, b) => b.length - a.length); // longest first (avoid partial overlap)
  if (!phrases.length) return rawHtml;
  // Regex for all phrases, escaping special regex characters
  const regex = new RegExp(
    "(" +
      phrases
        .map(p =>
          p
            .replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
            .replace(/\s+/g, "\\s+")
        )
        .join("|") +
      ")",
    "gi"
  );
  // Replace in HTML (not inside tags)
  // Split by tags, only replace in text nodes
  return rawHtml.replace(/(<[^>]+>)|([^<]+)/g, (m, tag, text) => {
    if (tag) return tag;
    if (text) {
      return text.replace(regex, matched =>
        `<mark style="background: linear-gradient(90deg, #ffe066 70%, #ffd100 100%); color: #334155; padding: 0 0.15em; border-radius: 0.33em; font-weight: 700; box-decoration-break: clone;">${matched}</mark>`
      );
    }
    return m;
  });
}

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
  const [shortUrl, setShortUrl] = useState("");
  const [showToast, setShowToast] = useState(false);

  // --- Onboarding examples ---
  const EXAMPLES = [
    { url: "https://www.bbc.com/news/world-us-canada-66159295", text: "democracy" },
    { url: "https://www.nytimes.com/2024/06/20/technology/ai-future.html", text: "artificial intelligence" },
    { url: "https://www.theguardian.com/environment/2025/jun/08/renewable-energy-breakthrough", text: "solar power" }
  ];

  // --- Form/Preview Logic ---
  useEffect(() => {
    if (!link) {
      setArticleContent("");
      setError("");
      setShowPreview(false);
      setShortUrl("");
      return;
    }
    let url: URL;
    try {
      url = new URL(link);
      if (isYouTubeUrl(url)) {
        setArticleContent("");
        setError("");
        setShortUrl("");
        setShowPreview(true);
        return;
      }
    } catch {
      setError("Invalid URL.");
      setShowPreview(false);
      setShortUrl("");
      return;
    }
    setLoadingPreview(true);
    setError("");
    setArticleContent("");
    setShowPreview(true);
    setShortUrl("");
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

  // --- Short URL logic ---
  const handleShare = useCallback(async () => {
    setShortUrl("");
    setShowToast(false);
    try {
      let urlObj = new URL(link);
      // Add timestamp for YT
      if (isYouTubeUrl(urlObj) && parsedSeconds > 0) {
        urlObj.searchParams.set("t", parsedSeconds.toString());
      }
      // Add highlight as hash (for demo; you may want to persist on backend)
      if (highlightText && !isYouTubeUrl(urlObj)) {
        urlObj.hash = `:~:text=${encodeURIComponent(highlightText)}`;
      }
      // Simulate backend: returns a short code
      const res = await fetch("/api/links", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ deepLink: urlObj.toString() }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Short URL generation failed");
      setShortUrl(`${window.location.origin}/s/${data.shortCode || data.shortUrl || "demo"}`);
      setShowToast(true);
      setTimeout(() => setShowToast(false), 1800);
    } catch (e: any) {
      setError(e.message || "Failed to generate short URL");
    }
  }, [link, parsedSeconds, highlightText]);

  // --- Clipboard
  const handleCopy = useCallback(() => {
    if (!shortUrl) return;
    navigator.clipboard.writeText(shortUrl).then(() => {
      setShowToast(true);
      setTimeout(() => setShowToast(false), 1400);
    });
  }, [shortUrl]);

  // --- Form
  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!link.trim()) {
      setError("Paste a valid link.");
      return;
    }
    setShowPreview(true);
  }

  // --- Render
  return (
    <Bg>
      <Grid>
        {/* Left: Hero + Form */}
        <div>
          <Hero>
            <LogoRow>
              <LogoText>Jump</LogoText>
              <LogoTwo>2</LogoTwo>
            </LogoRow>
            <Slogan>Highlight. Jump. Share. Instantly.</Slogan>
            <HeroDesc>
              Paste any article, blog, or YouTube link below. Highlight the best part, generate a skip-to link, and share it with anyone.
            </HeroDesc>
          </Hero>
          <Card>
            <InputRow onSubmit={handleSubmit}>
              <Input
                type="url"
                required
                placeholder="Paste article or YouTube URL…"
                value={link}
                onChange={e => setLink(e.target.value)}
                autoFocus
                aria-label="Paste article or YouTube URL"
              />
              <Input
                type="text"
                placeholder={(() => {
                  try {
                    const urlObj = new URL(link);
                    if (isYouTubeUrl(urlObj)) return 'Timestamp (e.g. 1:23)';
                  } catch {}
                  return 'Highlight text (e.g. "best quote"; optional)';
                })()}
                value={highlightText}
                onChange={e => setHighlightText(e.target.value)}
                aria-label="Highlight text or timestamp"
              />
              <Button type="submit" primary>Preview</Button>
            </InputRow>
            <Tip>
              <b>Tip:</b> Try with any news, blog, or YouTube link. Paste, highlight, Preview!
            </Tip>
            <ExampleLinks>
              Examples:&nbsp;
              {EXAMPLES.map(({ url, text }, i) => (
                <a key={i} onClick={() => { setLink(url); setHighlightText(text); setShowPreview(false); setTimeout(() => setShowPreview(true), 75); }}>
                  {url.replace(/^https?:\/\//, '').split("/")[0]}
                </a>
              ))}
            </ExampleLinks>
            <HowItWorks>
              <b>How it works:</b>
              <ul>
                <li>Paste a link above (“Paste” or drag & drop!)</li>
                <li>Add a highlight or timestamp (optional)</li>
                <li>Click <b>Preview</b></li>
                <li>Copy and share your Jump2 link!</li>
              </ul>
            </HowItWorks>
          </Card>
        </div>

        {/* Right: Live Preview + Share */}
        <div>
          {showPreview && (
            <PreviewCard>
              {loadingPreview && <Loader />}
              {!loadingPreview && (() => {
                try {
                  const urlObj = new URL(link);
                  if (isYouTubeUrl(urlObj)) {
                    return (
                      <>
                        <YouTubePlayer url={link} startSeconds={parsedSeconds} />
                        <ShareBar>
                          <ShareInput type="text" readOnly value={shortUrl ? shortUrl : "Your Jump2 link will appear here…"} aria-label="Jump2 shareable link" />
                          <ShareActions>
                            <CopyBtn type="button" onClick={shortUrl ? handleCopy : handleShare}>
                              {shortUrl ? "Copy" : "Share"}
                            </CopyBtn>
                            {shortUrl &&
                              <a href={shortUrl} target="_blank" rel="noopener noreferrer" style={{color:"#3b82f6", fontWeight:700, textDecoration:"none"}}>
                                Open ↗
                              </a>
                            }
                          </ShareActions>
                        </ShareBar>
                      </>
                    );
                  }
                } catch {}
                if (error) {
                  return <div style={{ color: "#f87171", fontWeight: 600, marginTop: "2.1em" }}>{error}</div>;
                }
                if (!articleContent && !error) {
                  return (
                    <>
                      <Skeleton style={{width:"95%"}} />
                      <Skeleton style={{width:"85%"}} />
                      <Skeleton style={{width:"65%"}} />
                    </>
                  );
                }
                // --- Highlight phrases in preview ---
                let html = articleContent;
                const highlights = highlightText
                  .split(";")
                  .map(x => x.trim())
                  .filter(Boolean);
                if (html && highlights.length) {
                  html = highlightHtml(html, highlights);
                }
                if (html) {
                  return (
                    <>
                      <div dangerouslySetInnerHTML={{ __html: html }} />
                      <ShareBar>
                        <ShareInput type="text" readOnly value={shortUrl ? shortUrl : "Your Jump2 link will appear here…"} aria-label="Jump2 shareable link" />
                        <ShareActions>
                          <CopyBtn type="button" onClick={shortUrl ? handleCopy : handleShare}>
                            {shortUrl ? "Copy" : "Share"}
                          </CopyBtn>
                          {shortUrl &&
                            <a href={shortUrl} target="_blank" rel="noopener noreferrer" style={{color:"#3b82f6", fontWeight:700, textDecoration:"none"}}>
                              Open ↗
                            </a>
                          }
                        </ShareActions>
                      </ShareBar>
                    </>
                  );
                }
                return null;
              })()}
            </PreviewCard>
          )}
        </div>
      </Grid>
      {showToast && (
        <ShareToast>
          Link copied!
        </ShareToast>
      )}
      <Footer>
        <div>
          <b>Jump2</b> — Share the best, skip the rest.<br />
          Built for you. <span style={{color:"#3b82f6"}}>Open source. Privacy-first.</span>
        </div>
        <div style={{marginTop:"0.5em"}}>
          Questions or feedback? <a style={{color:"#3b82f6"}} href="mailto:support@jump2.link">Contact us</a>
        </div>
      </Footer>
    </Bg>
  );
}