import React, {
  useRef,
  useState,
  useEffect,
  useCallback,
  useLayoutEffect,
} from "react";
import styled, { keyframes, css } from "styled-components";

// --- Animations ---
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

// --- Layout ---
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

// --- Hero & Branding ---
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

// --- Card ---
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
  &:active {
    background: ${({primary}) =>
      primary ? "linear-gradient(90deg, #1e293b 10%, #2563eb 90%)" : "#1e293b"};
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

// --- Sticky Share Bar (trick: sticky on desktop, fixed on mobile) ---
const StickyBar = styled.div`
  position: sticky;
  top: 0;
  z-index: 20;
  background: linear-gradient(90deg, #1b2336 70%, #25406a 100%);
  border-radius: 1em 1em 0 0;
  box-shadow: 0 4px 18px #3b82f633;
  padding: 1.1em 2em 1em;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 1.1em;
  min-height: 3.5em;
  @media (max-width: 600px) {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    border-radius: 0;
    padding: 1em 0.6em 1.2em;
    z-index: 9900;
    gap: 0.6em;
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
  transition: background 0.13s, transform 0.11s;
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

// --- Loader & Skeletons ---
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

// --- Preview ---
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

const Footer = styled.footer`
  margin: 3.5em auto 1.2em auto;
  color: #b5c7e4;
  text-align: center;
  font-size: 1em;
  opacity: 0.95;
  @media (max-width: 600px) {
    margin: 2.1em auto 1.2em auto;
    font-size: 0.93em;
    padding: 0 0.7em;
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

// --- Highlighting utility (trick: scroll first highlight into view) ---
function highlightHtml(rawHtml: string, highlight: string): string {
  if (!rawHtml || !highlight) return rawHtml;
  const phrase = highlight.trim();
  if (!phrase) return rawHtml;
  // Regex for the phrase, escaping special regex characters
  const regex = new RegExp(
    "(" +
      phrase
        .replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
        .replace(/\s+/g, "\\s+")
      + ")",
    "gi"
  );
  // Replace in HTML (not inside tags)
  // Split by tags, only replace in text nodes
  let found = false;
  return rawHtml.replace(/(<[^>]+>)|([^<]+)/g, (m, tag, text) => {
    if (tag) return tag;
    if (text) {
      return text.replace(regex, matched => {
        // Competitive trick: mark first with special id for auto-scroll
        if (!found) {
          found = true;
          return `<mark id="jump2-highlight-anchor" style="background: linear-gradient(90deg, #ffe066 70%, #ffd100 100%); color: #334155; padding: 0 0.15em; border-radius: 0.33em; font-weight: 700; box-decoration-break: clone;">${matched}</mark>`;
        }
        return `<mark style="background: linear-gradient(90deg, #ffe066 70%, #ffd100 100%); color: #334155; padding: 0 0.15em; border-radius: 0.33em; font-weight: 700; box-decoration-break: clone;">${matched}</mark>`;
      });
    }
    return m;
  });
}

// --- Competitive coding: Smart debounce hook (no dependencies) ---
function useDebouncedValue<T>(value: T, delay: number): T {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const handle = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(handle);
  }, [value, delay]);
  return debounced;
}

// --- Main ---
export default function Home() {
  // --- State ---
  const [link, setLink] = useState("");
  const [anchor, setAnchor] = useState(""); // the anchor phrase
  const [showPreview, setShowPreview] = useState(false);
  const [parsedSeconds, setParsedSeconds] = useState(0);
  const [error, setError] = useState("");
  const [articleContent, setArticleContent] = useState("");
  const [loadingPreview, setLoadingPreview] = useState(false);
  const [shortUrl, setShortUrl] = useState("");
  const [showToast, setShowToast] = useState(false);
  const [searchPhrase, setSearchPhrase] = useState(""); // search bar above preview

  // --- Onboarding examples ---
  const EXAMPLES = [
    { url: "https://www.bbc.com/news/world-us-canada-66159295", text: "democracy" },
    { url: "https://www.nytimes.com/2024/06/20/technology/ai-future.html", text: "artificial intelligence" },
    { url: "https://www.theguardian.com/environment/2025/jun/08/renewable-energy-breakthrough", text: "solar power" }
  ];

  // --- Debounced anchor for smooth highlight (competitive coding trick) ---
  const debouncedAnchor = useDebouncedValue(anchor, 120);

  // --- Form/Preview Logic ---
  useEffect(() => {
    if (!link) {
      setArticleContent("");
      setError("");
      setShowPreview(false);
      setShortUrl("");
      setAnchor("");
      setSearchPhrase("");
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
      setAnchor("");
      setSearchPhrase("");
      return;
    }
    setLoadingPreview(true);
    setError("");
    setArticleContent("");
    setShowPreview(true);
    setShortUrl("");
    setAnchor("");
    setSearchPhrase("");
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
        setParsedSeconds(parseTimestamp(anchor));
      } else {
        setParsedSeconds(0);
      }
    } catch {
      setParsedSeconds(0);
    }
  }, [anchor, link]);

  // --- Short URL logic ---
  const handleShare = useCallback(async () => {
    setShortUrl("");
    setShowToast(false);
    try {
      let urlObj = new URL(link);
      if (isYouTubeUrl(urlObj) && parsedSeconds > 0) {
        urlObj.searchParams.set("t", parsedSeconds.toString());
      }
      if (debouncedAnchor && !isYouTubeUrl(urlObj)) {
        urlObj.hash = `:~:text=${encodeURIComponent(debouncedAnchor)}`;
      }
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
  }, [link, parsedSeconds, debouncedAnchor]);

  // --- Clipboard (competitive: focus back to input after copy) ---
  const copyBtnRef = useRef<HTMLButtonElement>(null);
  const handleCopy = useCallback(() => {
    if (!shortUrl) return;
    navigator.clipboard.writeText(shortUrl).then(() => {
      setShowToast(true);
      setTimeout(() => setShowToast(false), 1400);
      copyBtnRef.current?.focus();
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

  // --- Keyboard shortcut for anchor clear/copy (competitive coding) ---
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.ctrlKey && e.key === "l") {
        // Ctrl+L to clear anchor
        setAnchor("");
        setSearchPhrase("");
      }
      if (e.ctrlKey && e.key === "c" && shortUrl) {
        // Ctrl+C to copy link if bar focused
        handleCopy();
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [shortUrl, handleCopy]);

  // --- When user selects text in preview, set anchor ---
  const previewRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const ref = previewRef.current;
    if (!ref) return;
    function handleSelection() {
      const sel = window.getSelection();
      if (sel && sel.rangeCount > 0) {
        const range = sel.getRangeAt(0);
        if (!ref.contains(range.commonAncestorContainer)) {
          return; // Only react to selection inside preview
        }
        const selected = sel.toString().trim();
        if (selected.length > 0) {
          setAnchor(selected);
          setSearchPhrase(selected);
        }
      }
    }
    ref.addEventListener("mouseup", handleSelection);
    ref.addEventListener("touchend", handleSelection);
    return () => {
      ref.removeEventListener("mouseup", handleSelection);
      ref.removeEventListener("touchend", handleSelection);
    };
  }, [articleContent, showPreview]);

  // --- Competitive: scroll highlight into view after render ---
  useLayoutEffect(() => {
    if (debouncedAnchor && previewRef.current) {
      // Wait for DOM update
      setTimeout(() => {
        const el = document.getElementById("jump2-highlight-anchor");
        if (el) {
          el.scrollIntoView({ behavior: "smooth", block: "center" });
          el.classList.add("jump2-highlight-pulse");
          setTimeout(() => el.classList.remove("jump2-highlight-pulse"), 1100);
        }
      }, 90);
    }
  }, [debouncedAnchor, articleContent, showPreview]);

  // --- Clear Anchor ---
  const handleClearAnchor = useCallback(() => {
    setAnchor("");
    setSearchPhrase("");
  }, []);

  // --- Render ---
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
              Paste any article, blog, or YouTube link below. Drop an anchor where you want users to start, highlight it, and share your Jump2 link!
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
              <Button type="submit" primary>Preview</Button>
            </InputRow>
            <Tip>
              <b>Tip:</b> Try with any news, blog, or YouTube link. Paste, preview, and anchor!
            </Tip>
            <ExampleLinks>
              Examples:&nbsp;
              {EXAMPLES.map(({ url, text }, i) => (
                <a key={i} onClick={() => { setLink(url); setAnchor(text); setShowPreview(false); setTimeout(() => setShowPreview(true), 75); }}>
                  {url.replace(/^https?:\/\//, '').split("/")[0]}
                </a>
              ))}
            </ExampleLinks>
            <HowItWorks>
              <b>How it works:</b>
              <ul>
                <li>Paste a link above (“Paste” or drag & drop!)</li>
                <li>Preview loads. Find the spot to anchor: search a phrase, or select text.</li>
                <li>Click <b>Share</b> and copy your Jump2 link!</li>
              </ul>
            </HowItWorks>
          </Card>
        </div>
        {/* Right: Sticky Share/Anchor bar + Preview */}
        <div style={{position:"relative"}}>
          {/* Sticky Share/Anchor Bar */}
          <StickyBar role="region" aria-label="Jump2 sharing and anchor bar">
            <ShareInput
              type="text"
              readOnly
              tabIndex={0}
              value={shortUrl ? shortUrl : "Your Jump2 link appears here…"}
              aria-label="Jump2 shareable link"
              style={{minWidth: 200, flexBasis: "40%"}}
              onFocus={e => e.target.select()}
            />
            <ShareActions>
              <CopyBtn
                ref={copyBtnRef}
                type="button"
                onClick={shortUrl ? handleCopy : handleShare}
                aria-label={shortUrl ? "Copy jump link to clipboard" : "Generate jump link"}
              >
                {shortUrl ? "Copy" : "Share"}
              </CopyBtn>
              {shortUrl &&
                <a href={shortUrl} target="_blank" rel="noopener noreferrer" tabIndex={0}
                   style={{color:"#3b82f6", fontWeight:700, textDecoration:"none"}}>
                  Open ↗
                </a>
              }
            </ShareActions>
            {debouncedAnchor && (
              <>
                <span style={{
                  background:"rgba(255,224,102,0.17)",
                  color:"#ffe066",
                  borderRadius:6,
                  padding:"0.15em 0.5em",
                  fontWeight:800,
                  marginLeft:"0.8em",
                  fontSize:"1.03em"
                }}>
                  Anchor: {debouncedAnchor}
                </span>
                <Button style={{
                  marginLeft: "0.8em",
                  background: "#172554",
                  color: "#ffe066",
                  fontWeight: 700,
                  padding: "0.45em 1.1em",
                  borderRadius: "0.3em",
                  fontSize: "0.98em"
                }} onClick={handleClearAnchor} type="button" aria-label="Clear anchor">
                  Clear
                </Button>
              </>
            )}
          </StickyBar>
          {/* Space for sticky bar */}
          <div style={{height:"4.7em"}} aria-hidden />
          {/* Search-to-highlight (anchor set on change, no Set Anchor btn) */}
          <form
            onSubmit={e => {e.preventDefault(); setAnchor(searchPhrase.trim());}}
            style={{marginBottom:"1.2em", display:"flex", gap:"0.6em", alignItems:"center"}}
            aria-label="Anchor phrase search"
          >
            <Input
              type="text"
              placeholder="Search or type a phrase to anchor/highlight…"
              value={searchPhrase}
              onChange={e => {
                setSearchPhrase(e.target.value);
                setAnchor(e.target.value.trim());
              }}
              aria-label="Search phrase to anchor"
              style={{flex:"1 1 0%", fontSize:"1.07em"}}
            />
            {searchPhrase && (
              <Button type="button" onClick={handleClearAnchor}>
                Clear
              </Button>
            )}
          </form>
          <PreviewCard>
            {/* Article/video preview */}
            {loadingPreview && <Loader />}
            {!loadingPreview && (() => {
              try {
                const urlObj = new URL(link);
                if (isYouTubeUrl(urlObj)) {
                  return (
                    <>
                      <YouTubePlayer url={link} startSeconds={parsedSeconds} />
                      <div style={{marginTop:"1.5em", color:"#b5c7e4", fontSize:"1.08em"}}>
                        Enter a timestamp (e.g. <b>1:23</b>) above to create a Jump2 link to that moment.
                      </div>
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
              let html = articleContent;
              if (html && debouncedAnchor) {
                html = highlightHtml(html, debouncedAnchor);
              }
              if (html) {
                return (
                  <div
                    ref={previewRef}
                    tabIndex={0}
                    style={{outline:"none", cursor:"text", userSelect:"text"}}
                    dangerouslySetInnerHTML={{ __html: html }}
                    aria-label="Article preview"
                  />
                );
              }
              return null;
            })()}
          </PreviewCard>
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
      {/* Competitive-coding: highlight pulse effect */}
      <style>{`
        .jump2-highlight-pulse {
          animation: jump2-pulse 1.1s cubic-bezier(.4,1.7,.5,1.2) 1;
          outline: 2.5px solid #FFD100;
        }
        @keyframes jump2-pulse {
          0% { box-shadow: 0 0 0 0 rgba(255,209,0,0.7);}
          50% { box-shadow: 0 0 0 7px rgba(255,209,0,0.13);}
          100% { box-shadow: 0 0 0 0 rgba(255,209,0,0);}
        }
        @media (max-width: 900px) {
          .sc-bcXHqe, .sc-bcXHqe > div {
            max-width: 100vw !important;
            padding-left: 0.2em !important;
            padding-right: 0.2em !important;
          }
        }
      `}</style>
    </Bg>
  );
}