import React, { useRef, useState, useEffect, useCallback, useLayoutEffect } from "react";
import styled, { keyframes } from "styled-components";

// --- Fonts: Inter, JetBrains Mono (ensure loaded in _document.tsx or via CDN) ---
const fontStack = `'Inter', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, 'JetBrains Mono', monospace, sans-serif`;

// --- Animations ---
const gradient = keyframes`
  0% { background-position: 0% 50%; }
  100% { background-position: 100% 50%; }
`;
const bounce = keyframes`
  0%, 100% { transform: translateY(0);}
  20% { transform: translateY(-18%);}
  40% { transform: translateY(0);}
  50% { transform: translateY(-11%);}
  60% { transform: translateY(0);}
`;
const pop = keyframes`
  0% { transform: scale(0.9);}
  70% { transform: scale(1.05);}
  100% { transform: scale(1);}
`;
const fadeIn = keyframes`
  from { opacity: 0;}
  to { opacity: 1;}
`;

// --- Layout ---
const Bg = styled.div`
  min-height: 100vh;
  background: linear-gradient(115deg, #101a2f 65%, #1c2c52 100%);
  font-family: ${fontStack};
  padding: 0;
  position: relative;
  animation: ${fadeIn} 1s;
`;

// --- Main layout grid ---
const WideGrid = styled.div`
  display: flex;
  max-width: 1100px;
  gap: 2.5rem;
  margin: 0 auto 2.7rem auto;
  align-items: flex-start;
  @media (max-width: 1100px) { padding: 0 1rem; }
  @media (max-width: 900px) { flex-direction: column; gap: 1.4rem; }
`;

const Card = styled.div<{ tight?: boolean }>`
  background: rgba(16,23,45,0.97);
  border-radius: 1.15em;
  box-shadow: 0 8px 32px 0 #1e293b33,0 0 0 2.5px #2563eb77;
  padding: ${({ tight }) => (tight ? "1.2em 1.2em 1em" : "2.1em 1.7em 2em")};
  animation: ${fadeIn} 0.7s;
  position: relative;
  flex: 1 1 0%;
  min-width: 0;
  @media (max-width: 900px) { margin-bottom: 1.5em; }
`;

const DividerHeader = styled.div`
  width: 100%;
  text-align: center;
  margin: 1.7em 0 1.1em 0;
  color: #93b4e9;
  font-size: 1.18em;
  font-weight: 900;
  letter-spacing: 0.03em;
  border-bottom: 2px solid #1e293b33;
  line-height: 1.1;
  padding-bottom: 0.1em;
`;

// --- Top Bar ---
const TopBar = styled.header`
  width: 100%;
  background: rgba(12,18,28,0.98);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.1rem 2.2rem 0.7rem 2.2rem;
  border-bottom: 2px solid #223050;
  box-shadow: 0 3px 16px #1e293b33;
  position: sticky;
  top: 0;
  z-index: 100;
  @media (max-width: 700px) { flex-direction: column; gap: .6em; padding: 1.1rem 0.5rem 0.7rem 0.5rem; }
`;
const Brand = styled.div`
  display: flex;
  align-items: center;
  gap: 0.32em;
  font-size: 1.75em;
  font-weight: 900;
  letter-spacing: -1px;
  color: #67b7fd;
  img { height: 32px; border-radius: 8px; margin-right: 0.7em;}
  text-shadow: 0 2px 12px #3b82f6cc;
  background: none;
  font-family: 'JetBrains Mono', monospace;
  animation: ${fadeIn} 0.7s;
`;

const TopNav = styled.nav`
  display: flex;
  gap: 2.2em;
  align-items: center;
  font-size: 1.06em;
  a, button {
    color: #b7d7ff;
    border: none;
    background: none;
    font-weight: 800;
    text-decoration: none;
    cursor: pointer;
    padding: 0.23em 1.1em;
    border-radius: 0.7em;
    transition: background 0.12s, color 0.12s;
    letter-spacing: 0.01em;
    &:hover {
      background: #1e293b;
      color: #fff;
    }
  }
  @media (max-width: 700px) { gap: 1.2em; }
`;

// --- Hero & Branding ---
const HeroRow = styled.div`
  max-width: 1020px;
  margin: 3.2em auto 2.3em auto;
  display: flex;
  align-items: flex-end;
  gap: 2.3em;
  @media (max-width: 900px) { flex-direction: column; align-items: center; margin-top: 2em; gap: 0.9em;}
`;
const HeroTextCol = styled.div`
  flex: 1.4;
  min-width: 0;
`;
const LogoRow = styled.h1`
  display: flex;
  align-items: center;
  gap: 0.22em;
  font-size: clamp(2.5rem, 7vw, 4.3rem);
  font-weight: 900;
  letter-spacing: -1.6px;
  user-select: none;
  margin: 0 0 0.13em;
  font-family: 'JetBrains Mono', monospace;
  background: none;
`;
const LogoText = styled.span`
  background: linear-gradient(90deg, #6ee7ff 10%, #3b82f6 90%, #60a5fa 100%);
  background-size: 200% 200%;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  animation: ${gradient} 3.9s alternate infinite, ${bounce} 3.3s cubic-bezier(0.32, 0.72, 0.52, 1.5) infinite;
  font-weight: 900;
  display: inline-block;
  letter-spacing: -0.07em;
`;
const LogoTwo = styled.span`
  color: #ffd100;
  font-size: 1.1em;
  font-weight: 900;
  margin-left: 0.08em;
  text-shadow: 0 0 18px #3b82f6aa;
  animation: ${bounce} 2.8s cubic-bezier(.46,1.58,.47,.86) infinite;
  display: inline-block;
`;
const Slogan = styled.div`
  font-size: 1.22em;
  color: #e6eaff;
  font-weight: 700;
  margin-bottom: 0.7em;
  text-shadow: 0 1px 10px #224, 0 0px 3px #2563eb33;
  font-family: 'Inter', sans-serif;
`;
const HeroDesc = styled.div`
  color: #b5c7e4;
  font-size: 1.09em;
  margin-bottom: 1.3em;
  font-weight: 500;
  max-width: 490px;
  font-family: 'Inter', sans-serif;
`;

const TrustBar = styled.div`
  display: flex;
  gap: 1.3em;
  align-items: center;
  margin-bottom: 2em;
  margin-top: 1.2em;
  font-size: 1.07em;
  color: #78bdfd;
  font-weight: 700;
  flex-wrap: wrap;
  svg {
    margin-right: 0.38em;
    color: #60a5fa;
    vertical-align: middle;
  }
`;

const TrustLogo = styled.img`
  height: 26px;
  margin-right: 0.35em;
  opacity: 0.82;
  filter: grayscale(0.33);
  vertical-align: middle;
  border-radius: 4px;
`;

// --- Input, ShareBar, Preview, etc. ---
const InputRow = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1em;
  margin-bottom: 1.5em;
  position: relative;
`;
const Input = styled.input`
  font-size: 1.12em;
  border-radius: 0.8em;
  padding: 0.77em 1.1em;
  border: 2px solid #223a5d;
  background: #101a2f;
  color: #eaf0fa;
  font-weight: 500;
  transition: border-color 0.15s, box-shadow 0.15s;
  font-family: 'Inter', sans-serif;
  &:focus { border-color: #3b82f6; background: #17233a; outline: none; box-shadow: 0 2px 16px #3b82f633;}
  &::placeholder { color: #86a2bb; }
`;
const Button = styled.button<{ primary?: boolean }>`
  font-size: 1.09em;
  border-radius: 0.6em;
  padding: 0.7em 2em;
  font-weight: 800;
  border: none;
  margin-top: 0.2em;
  color: #fff;
  background: ${({primary}) =>
    primary ? "linear-gradient(90deg, #3b82f6 10%, #2563eb 90%)" : "#1e293b"};
  box-shadow: ${({primary}) =>
    primary ? "0 3px 16px #2563eb66" : "none"};
  cursor: pointer;
  transition: background 0.13s, box-shadow 0.13s, transform 0.12s;
  letter-spacing: 0.01em;
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
  font-size: 0.96em;
  color: #8ba8d8;
  margin-bottom: 0.7em;
  margin-top: -0.4em;
`;
const HowItWorks = styled.div`
  margin-top: 1.5em;
  color: #b9d3ff;
  font-size: 1.02em;
  ul {
    margin: 0.7em 0 0 1.4em;
    padding: 0;
    li {margin-bottom: 0.2em;}
  }
`;

const ShareBarWrapper = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  margin: 0 auto 2.2em auto;
  @media (max-width: 900px) {
    margin-bottom: 1.5em;
    padding: 0 0.4em;
  }
`;
const ShareBar = styled.div`
  background: linear-gradient(90deg, #1b2336 70%, #25406a 100%);
  border-radius: 1em;
  box-shadow: 0 4px 18px #3b82f633;
  padding: 1em 2em;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 1.1em;
  min-height: 3.2em;
  width: 100%;
  max-width: 650px;
  position: relative;
  z-index: 20;
  @media (max-width: 600px) {
    padding: 0.95em 0.5em;
    border-radius: 0.7em;
    gap: 0.6em;
    min-height: 2.6em;
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
  font-family: 'JetBrains Mono', monospace;
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

// --- Lightbox/Welcome Modal ---
const LightboxOverlay = styled.div`
  position: fixed;
  z-index: 20000;
  top: 0; left: 0; right: 0; bottom: 0;
  width: 100vw; height: 100vh;
  background: rgba(17,24,39,0.92);
  display: flex;
  align-items: center;
  justify-content: center;
  animation: ${fadeIn} 0.25s;
`;
const LightboxCard = styled.div`
  background: #202940;
  border-radius: 1.2em;
  box-shadow: 0 8px 32px 0 #1e293b99;
  max-width: 98vw;
  width: 400px;
  padding: 2.3em 1.7em 2.1em;
  color: #eaf0fa;
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  @media (max-width: 500px) {
    width: 97vw;
    padding: 1.3em 0.7em 1.4em;
  }
`;
const LightboxLogo = styled.div`
  display: flex;
  align-items: center;
  gap: 0.19em;
  font-size: 2.5rem;
  font-weight: 900;
  margin-bottom: 0.35em;
  user-select: none;
`;
const LightboxSlogan = styled.div`
  font-size: 1.13em;
  color: #ffe066;
  font-weight: 700;
  margin-bottom: 0.6em;
  text-align: center;
`;
const LightboxDesc = styled.div`
  color: #c5d6fa;
  font-size: 1.09em;
  font-weight: 400;
  margin-bottom: 1.3em;
  text-align: center;
  line-height: 1.65;
`;
const LightboxButton = styled.button`
  font-size: 1.09em;
  border-radius: 0.6em;
  padding: 0.78em 2.1em;
  font-weight: 700;
  border: none;
  color: #fff;
  background: linear-gradient(90deg, #3b82f6 10%, #2563eb 90%);
  box-shadow: 0 3px 16px #2563eb66;
  cursor: pointer;
  transition: background 0.13s, box-shadow 0.13s, transform 0.12s;
  &:hover, &:focus {
    background: linear-gradient(90deg, #2563eb 10%, #3b82f6 90%);
    transform: scale(1.04);
    outline: none;
  }
`;
const LightboxContact = styled.a`
  color: #ffd100;
  font-size: 1.01em;
  font-weight: 600;
  margin-top: 1.15em;
  text-decoration: underline dotted;
  &:hover {text-decoration: underline solid;}
`;

// --- Footer ---
const Footer = styled.footer`
  margin: 4em auto 1.2em auto;
  color: #93b4e9;
  text-align: center;
  font-size: 1.08em;
  opacity: 0.97;
  @media (max-width: 600px) {
    margin: 2.1em auto 1.2em auto;
    font-size: 0.93em;
    padding: 0 0.7em;
  }
`;

// --- YouTube helpers and highlight utility ---
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
    <div style={{
      margin: "1.1rem auto 2rem",
      maxWidth: 420,
      borderRadius: 12,
      overflow: "hidden",
      boxShadow: "0 8px 20px #131c2b55",
      position: "relative"
    }}>
      <iframe
        width="100%"
        height="220"
        src={src}
        title="YouTube video player"
        frameBorder={0}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
      {startSeconds > 0 && (
        <div style={{
          position: "absolute",
          top: 8,
          right: 12,
          background: "rgba(0, 0, 0, 0.65)",
          color: "#fff",
          fontWeight: 600,
          padding: "4px 10px",
          borderRadius: 9999,
          fontFamily: "monospace",
          fontSize: "0.95em",
          userSelect: "none",
          pointerEvents: "none",
          textShadow: "0 0 8px #000c"
        }}>
          ▶ {formatTimestamp(startSeconds)}
        </div>
      )}
    </div>
  );
};
function highlightHtml(rawHtml: string, highlight: string): string {
  if (!rawHtml || !highlight) return rawHtml;
  const phrase = highlight.trim();
  if (!phrase) return rawHtml;
  const regex = new RegExp(
    "(" +
      phrase
        .replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
        .replace(/\s+/g, "\\s+")
      + ")",
    "gi"
  );
  let found = false;
  return rawHtml.replace(/(<[^>]+>)|([^<]+)/g, (m, tag, text) => {
    if (tag) return tag;
    if (text) {
      return text.replace(regex, matched => {
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

  // --- Lightbox (first-time visitor welcome) ---
  const [showLightbox, setShowLightbox] = useState(false);
  useEffect(() => {
    if (typeof window !== "undefined" && localStorage.getItem("jump2_welcomed") !== "yes") {
      setTimeout(() => setShowLightbox(true), 350);
    }
  }, []);
  const handleCloseLightbox = useCallback(() => {
    setShowLightbox(false);
    localStorage.setItem("jump2_welcomed", "yes");
  }, []);

  // --- Onboarding examples ---
  const EXAMPLES = [
    { url: "https://www.bbc.com/news/world-us-canada-66159295", text: "democracy" },
    { url: "https://www.nytimes.com/2024/06/20/technology/ai-future.html", text: "artificial intelligence" },
    { url: "https://www.theguardian.com/environment/2025/jun/08/renewable-energy-breakthrough", text: "solar power" }
  ];

  // --- Debounced anchor for smooth highlight ---
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

  // --- Clipboard (focus back to input after copy) ---
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

  // --- Keyboard shortcut for anchor clear/copy ---
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.ctrlKey && e.key === "l") {
        setAnchor("");
        setSearchPhrase("");
      }
      if (e.ctrlKey && e.key === "c" && shortUrl) {
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
          return;
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

  // --- Scroll highlight into view after render ---
  useLayoutEffect(() => {
    if (debouncedAnchor && previewRef.current) {
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
      <TopBar>
        <Brand>
          <img src="/favicon.ico" alt="Jump2" />
          Jump2
        </Brand>
        <TopNav>
          <a href="/about">About</a>
          <a href="/how">How it works</a>
          <a href="/api">API</a>
          <a href="/contact">Contact</a>
        </TopNav>
      </TopBar>
      <HeroRow>
        <HeroTextCol>
          <LogoRow>
            <LogoText>Jump</LogoText>
            <LogoTwo>2</LogoTwo>
          </LogoRow>
          <Slogan>
            The world’s crispest way to jump to the best.
          </Slogan>
          <HeroDesc>
            Instantly link anyone to the <strong>exact spot</strong> in any article or video.<br />
            <span style={{color:"#ffe066", fontWeight:600}}>No sign-ups. No friction. Just highlight. Just share.</span>
          </HeroDesc>
          <TrustBar>
            <span>
              <svg height="19" viewBox="0 0 20 20"><circle cx="10" cy="10" r="9" fill="#60a5fa" /><text x="10" y="15" textAnchor="middle" fontSize="12" fill="#fff">✓</text></svg>
              Trusted by teams & creators worldwide
            </span>
            <span>
              <TrustLogo src="/trusted-logo1.png" alt="Trusted brand 1" />
              <TrustLogo src="/trusted-logo2.png" alt="Trusted brand 2" />
              <TrustLogo src="/trusted-logo3.png" alt="Trusted brand 3" />
              <span style={{color:"#60a5fa", fontWeight:600}}>and more…</span>
            </span>
          </TrustBar>
        </HeroTextCol>
      </HeroRow>
      <DividerHeader>Jump2 in Action</DividerHeader>
      <WideGrid>
        {/* LEFT: Paste, anchor, how-to */}
        <Card tight>
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
            <b>Tip:</b> Works for news, blogs, Wikipedia, YouTube, and more!
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
              <li>Paste a link (“Paste” or drag & drop!)</li>
              <li>Preview loads. Highlight or search for a phrase.</li>
              <li>Click <b>Share</b> and copy your Jump2 link!</li>
            </ul>
          </HowItWorks>
        </Card>
        {/* RIGHT: Share bar, search/anchor, preview */}
        <div style={{flex: 1.6, minWidth:0}}>
          <ShareBarWrapper>
            <ShareBar>
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
                    background:"rgba(255,224,102,0.20)",
                    color:"#ffe066",
                    borderRadius:6,
                    padding:"0.15em 0.5em",
                    fontWeight:800,
                    marginLeft:"0.8em",
                    fontSize:"1.03em",
                    fontFamily: "'JetBrains Mono', monospace"
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
            </ShareBar>
          </ShareBarWrapper>
          <form
            onSubmit={e => {e.preventDefault(); setAnchor(searchPhrase.trim());}}
            style={{marginBottom:"1em", display:"flex", gap:"0.6em", alignItems:"center"}}
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
              style={{flex:"1 1 0%", fontSize:"0.95em"}}
            />
            {searchPhrase && (
              <Button type="button" onClick={handleClearAnchor}>
                Clear
              </Button>
            )}
          </form>
          <PreviewCard>
            {loadingPreview && <Loader />}
            {!loadingPreview && (() => {
              try {
                const urlObj = new URL(link);
                if (isYouTubeUrl(urlObj)) {
                  return (
                    <>
                      <YouTubePlayer url={link} startSeconds={parsedSeconds} />
                      <div style={{marginTop:"1em", color:"#b5c7e4", fontSize:"0.96em"}}>
                        Enter a timestamp (e.g. <b>1:23</b>) above to create a Jump2 link to that moment.
                      </div>
                    </>
                  );
                }
              } catch {}
              if (error) {
                return <div style={{ color: "#f87171", fontWeight: 600, marginTop: "1.3em" }}>{error}</div>;
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
      </WideGrid>
      {showToast && (
        <ShareToast>
          Link copied!
        </ShareToast>
      )}
      <Footer>
        <div>
          <b>Jump2</b> — The best way to jump to the best.<br />
          <span style={{color:"#3b82f6"}}>Open source. Privacy-first. No sign-ups.</span>
        </div>
        <div style={{marginTop:"0.5em"}}>
          <span>Questions or feedback? <a style={{color:"#3b82f6"}} href="mailto:support@jump2share.com">Contact us</a></span>
        </div>
      </Footer>
      {/* Highlight pulse effect */}
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
      `}</style>
      {showLightbox && (
        <LightboxOverlay>
          <LightboxCard>
            <LightboxLogo>
              <LogoText>Jump</LogoText>
              <LogoTwo>2</LogoTwo>
            </LightboxLogo>
            <LightboxSlogan>
              Welcome to Jump2!
            </LightboxSlogan>
            <LightboxDesc>
              Instantly share the <b>best part</b> of any article, blog, or video.<br/>
              <br/>
              <b>Jump2</b> lets you paste a link, <b>highlight a phrase or time</b>, and create a short link that lands others right there.<br/>
              <br/>
              No more scrolling, searching, or "where is it?" — just highlight, jump, and share.
              <br/><br/>
              <b>Save time. Guide your audience. Share better.</b>
            </LightboxDesc>
            <LightboxButton onClick={handleCloseLightbox}>Let's go!</LightboxButton>
            <LightboxContact href="mailto:support@jump2share.com">
              Contact us
            </LightboxContact>
          </LightboxCard>
        </LightboxOverlay>
      )}
    </Bg>
  );
}