import {
  useState,
  useEffect,
  useCallback,
  useMemo,
  useRef,
} from "react";
import styled, { keyframes, css } from "styled-components";

// === Animations ===
const glowPulse = keyframes`
  0%, 100% {
    text-shadow: 0 0 6px #3b82f6, 0 0 15px #60a5fa;
  }
  50% {
    text-shadow: 0 0 10px #3b82f6, 0 0 25px #60a5fa;
  }
`;

const pulse = keyframes`
  0% {
    box-shadow: 0 0 0 0 rgba(59, 130, 246, 0.7);
  }
  70% {
    box-shadow: 0 0 0 15px rgba(59, 130, 246, 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(59, 130, 246, 0);
  }
`;

const fadeInUp = keyframes`
  from { opacity: 0; transform: translateY(8px); }
  to { opacity: 1; transform: translateY(0); }
`;

const highlightFade = keyframes`
  0% { background-color: #2563ebbb; }
  100% { background-color: #2563ebaa; }
`;

const fadeInUpMixin = css`
  animation: ${fadeInUp} 0.5s ease forwards;
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
  user-select: none;

  @media (max-width: 850px) {
    grid-template-columns: 1fr;
    padding: 2rem 1rem 4rem;
  }
`;

const LeftColumn = styled.section`
  display: flex;
  flex-direction: column;
  gap: 2.5rem;
  max-width: 480px;
  ${fadeInUpMixin};
  @media (max-width: 850px) {
    max-width: 100%;
  }
`;

const LogoWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: 0.15em;
  font-weight: 900;
  font-size: clamp(3rem, 7vw, 4.5rem);
  color: #60a5fa;
  -webkit-font-smoothing: antialiased;
  user-select: text;
  filter: drop-shadow(0 0 6px #60a5faa) drop-shadow(0 0 10px #3b82f6aa);
  cursor: default;

  &:hover span:nth-child(2) {
    animation: ${glowPulse} 3s infinite;
    transform: scale(1.25);
    filter: drop-shadow(0 0 15px #3b82f6);
  }
`;

const JumpText = styled.span`
  letter-spacing: -0.04em;
  text-shadow: 1px 1px 2px #1e293b, -1px -1px 2px #3b82f6;
`;

const TwoText = styled.span`
  color: #3b82f6;
  font-size: 1.2em;
  user-select: none;
  transition: transform 0.3s ease, filter 0.3s ease;
  transform-origin: left center;
  text-shadow: 0 0 12px #3b82f6aa;
`;

const Subtitle = styled.p`
  font-size: clamp(1.25rem, 2.5vw, 1.75rem);
  color: #94a3b8;
  font-weight: 600;
  line-height: 1.4;
`;

const Description = styled.p`
  font-size: 1.125rem;
  line-height: 1.7;
  font-weight: 400;
  user-select: text;
  color: #cbd5e1;
`;

const FormWrapper = styled.div`
  width: 100%;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
`;

const Input = styled.input<{ disabled?: boolean }>`
  padding: 1rem 1.25rem;
  border-radius: 0.7rem;
  border: 1.5px solid #334155;
  background: ${({ disabled }) => (disabled ? "#64748b" : "#1e293b")};
  font-size: 1.125rem;
  font-weight: 500;
  color: #f1f5f9;
  transition: border-color 0.3s ease, background-color 0.3s ease;
  caret-color: #3b82f6;

  &::placeholder {
    color: #64748b;
  }

  &:focus {
    outline: none;
    border-color: #3b82f6;
    background: #334155;
    box-shadow: 0 0 10px #3b82f6aa;
  }

  cursor: ${({ disabled }) => (disabled ? "not-allowed" : "text")};
`;

const Textarea = styled.textarea`
  width: 100%;
  border-radius: 0.5rem;
  border: 1.5px solid #334155;
  background-color: #1e293b;
  color: #f1f5f9;
  padding: 0.75rem;
  font-size: 1rem;
  margin-top: 0.25rem;
  margin-bottom: 1rem;
  resize: vertical;

  &:disabled {
    background-color: #64748b;
  }
`;

const Hint = styled.small`
  color: #64748b;
  font-family: monospace;
  font-size: 0.9rem;
  margin-top: -1rem;
  margin-bottom: 1.5rem;
  user-select: none;
  letter-spacing: 0.04em;
  font-variant-ligatures: none;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const InfoIcon = styled.span`
  display: inline-block;
  width: 18px;
  height: 18px;
  color: #3b82f6;
  cursor: help;
  user-select: none;
  font-weight: 700;
  font-size: 1.3rem;
  line-height: 1;
  position: relative;

  &:hover::after {
    content: attr(data-tooltip);
    position: absolute;
    top: -2.5rem;
    left: 50%;
    transform: translateX(-50%);
    background: #2563eb;
    color: white;
    padding: 0.3rem 0.5rem;
    border-radius: 0.25rem;
    white-space: nowrap;
    font-size: 0.8rem;
    pointer-events: none;
    z-index: 9999;
  }
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
  ${fadeInUpMixin};
`;

const PreviewWrapper = styled.section`
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
  min-height: 500px;
  max-height: 80vh;
  position: relative;

  h1,
  h2,
  h3,
  h4 {
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

  ul,
  ol {
    margin-left: 1.75rem;
    margin-bottom: 1.5rem;
  }

  img {
    max-width: 100%;
    border-radius: 0.5rem;
    margin: 1rem 0;
  }

  mark.highlight {
    animation: ${highlightFade} 0.8s ease forwards;
  }
`;

const PreviewSearch = styled.input`
  position: sticky;
  top: 1rem;
  z-index: 10;
  width: 100%;
  max-width: 480px;
  margin-bottom: 1rem;
  padding: 0.7rem 1rem;
  border-radius: 0.7rem;
  border: 1.5px solid #334155;
  background: #1e293b;
  color: #f1f5f9;
  font-weight: 500;
  font-size: 1rem;
  user-select: text;
  transition: border-color 0.3s ease;

  &::placeholder {
    color: #64748b;
  }

  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 10px #3b82f6aa;
  }
`;

const ShareWrapper = styled.div`
  margin-top: 2rem;
  padding: 1rem;
  background: #1e293b;
  border: 1.5px solid #3b82f6;
  border-radius: 0.75rem;
  display: flex;
  gap: 1rem;
  align-items: center;
  animation: ${fadeInUp} 0.5s ease forwards;
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
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.3);
  position: relative;
  will-change: transform;
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
  text-shadow: 0 0 6px rgba(0, 0, 0, 0.7);
`;

const HighlightChipsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-top: -0.5rem;
  margin-bottom: 1rem;
`;

const HighlightChip = styled.span`
  background: #2563ebaa;
  color: #e0e7ff;
  border-radius: 9999px;
  padding: 0.25rem 0.75rem;
  font-size: 0.875rem;
  user-select: none;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  animation: ${highlightFade} 0.8s ease forwards;
`;

const ChipRemoveButton = styled.button`
  background: transparent;
  border: none;
  color: #cbd5e1;
  font-weight: 700;
  cursor: pointer;
  font-size: 1rem;
  line-height: 1;
  padding: 0;
  user-select: none;

  &:hover {
    color: #f87171;
  }
`;

const HamburgerButton = styled.button`
  position: fixed;
  top: 1rem;
  left: 1rem;
  background: #2563eb;
  border: none;
  border-radius: 0.5rem;
  padding: 0.6rem 1rem;
  color: white;
  font-weight: 700;
  font-size: 1rem;
  cursor: pointer;
  z-index: 1100;
  user-select: none;

  &:hover {
    background: #3b82f6;
  }
`;

const MobileMenu = styled.nav<{ open: boolean }>`
  position: fixed;
  top: 0;
  left: ${({ open }) => (open ? "0" : "-100%")};
  width: 250px;
  height: 100vh;
  background: #1e293b;
  box-shadow: 4px 0 12px rgba(0, 0, 0, 0.6);
  padding: 3rem 1.5rem 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  transition: left 0.3s ease;
  z-index: 1099;
`;

const MobileMenuClose = styled.button`
  align-self: flex-end;
  background: transparent;
  border: none;
  font-size: 1.5rem;
  color: #60a5fa;
  cursor: pointer;
  user-select: none;
`;

const LightboxBackdrop = styled.div<{ open: boolean }>`
  display: ${({ open }) => (open ? "flex" : "none")};
  position: fixed;
  inset: 0;
  background: rgba(15, 23, 42, 0.9);
  z-index: 1200;
  align-items: center;
  justify-content: center;
  padding: 2rem;
`;

const LightboxContent = styled.div`
  max-width: 480px;
  background: #1e293b;
  border-radius: 1rem;
  padding: 2rem;
  box-shadow: 0 0 30px #2563ebaa;
  color: #cbd5e1;
  font-size: 1.125rem;
  line-height: 1.6;
  user-select: text;

  h2 {
    margin-top: 0;
  }

  p {
    margin-bottom: 1rem;
  }
`;

const ContactEmail = styled.a`
  color: #3b82f6;
  text-decoration: underline;
  cursor: pointer;
  font-weight: 600;

  &:hover {
    color: #60a5fa;
  }
`;

// === Helper hooks & utils ===
function useDebounce<T>(value: T, delay: number): T {
  const [debounced, setDebounced] = useState<T>(value);
  useEffect(() => {
    const timeout = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timeout);
  }, [value, delay]);
  return debounced;
}

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
  if (h > 0) {
    return `${h}:${m.toString().padStart(2, "0")}:${s
      .toString()
      .padStart(2, "0")}`;
  }
  return `${m}:${s.toString().padStart(2, "0")}`;
}

// === YouTube Player ===
const YouTubePlayer = ({
  url,
  startSeconds,
}: {
  url: string;
  startSeconds: number;
}) => {
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
        <TimestampBadge
          aria-live="polite"
          aria-atomic="true"
          aria-relevant="additions"
        >
          ▶ {formatTimestamp(startSeconds)}
        </TimestampBadge>
      )}
    </VideoWrapper>
  );
};

// === Main Component ===
export default function Home() {
  const [link, setLink] = useState("");
  const [jumpTo, setJumpTo] = useState("");
  const [parsedSeconds, setParsedSeconds] = useState(0);
  const [articleContent, setArticleContent] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [error, setError] = useState("");
  const [shortUrl, setShortUrl] = useState("");
  const [loadingShort, setLoadingShort] = useState(false);
  const [loadingPreview, setLoadingPreview] = useState(false);
  const [highlightList, setHighlightList] = useState<string[]>([]);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showLightbox, setShowLightbox] = useState(true);
  const [feedbackMessage, setFeedbackMessage] = useState("");
  const [feedbackEmail, setFeedbackEmail] = useState("");
  const [feedbackSubmitting, setFeedbackSubmitting] = useState(false);

  const previewRef = useRef<HTMLDivElement>(null);
  const debouncedLink = useDebounce(link, 600);
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  // Validate and parse jumpTo timestamp/text
  useEffect(() => {
    if (jumpTo.trim() === "") {
      setParsedSeconds(0);
      setError("");
      return;
    }
    const secs = parseTimestamp(jumpTo);
    if (isNaN(secs) || secs < 0) {
      setError("Invalid timestamp format. Use MM:SS or HH:MM:SS.");
    } else {
      setError("");
      setParsedSeconds(secs);
    }
  }, [jumpTo]);

  // Fetch article preview if link changes (excluding YouTube)
  useEffect(() => {
    if (!debouncedLink) {
      setArticleContent("");
      setError("");
      setShortUrl("");
      setHighlightList([]);
      return;
    }
    let url: URL;
    try {
      url = new URL(debouncedLink);
      if (isYouTubeUrl(url)) {
        setArticleContent("");
        setError("");
        setShortUrl("");
        setHighlightList([]);
        return;
      }
    } catch {
      setError("Invalid URL.");
      return;
    }

    const fetchArticle = async () => {
      setLoadingPreview(true);
      setError("");
      setArticleContent("");
      setShortUrl("");
      setHighlightList([]);
      try {
        const res = await fetch(`/api/parse?url=${encodeURIComponent(debouncedLink)}`, {
          headers: { Accept: "application/json" },
          method: "GET",
        });
        if (!res.ok) throw new Error("Failed to fetch article preview.");
        const json = await res.json();
        if (json.article?.content) {
          setArticleContent(json.article.content);
        } else {
          setError("No preview available for this link.");
        }
      } catch (e) {
        console.error("Fetch article error:", e);
        setError("Failed to load preview. You can still create the jump link.");
      }
      setLoadingPreview(false);
    };

    fetchArticle();
  }, [debouncedLink]);

  // Generate deep short URL for link + timestamp + highlights
  const generateShortUrl = useCallback(async () => {
    setShortUrl("");
    setLoadingShort(true);
    setError("");

    if (!link) {
      setError("Please paste a valid link.");
      setLoadingShort(false);
      return;
    }

    try {
      let url: URL;
      try {
        url = new URL(link);
      } catch (e) {
        console.error("Invalid URL input:", e);
        setError("Invalid URL format.");
        setLoadingShort(false);
        return;
      }

      if (parsedSeconds > 0 && isYouTubeUrl(url)) {
        url.searchParams.set("t", parsedSeconds.toString());
      }

      let highlightParam = highlightList.join(",");
      if (jumpTo.trim() && !highlightList.includes(jumpTo.trim())) {
        highlightParam = highlightParam ? highlightParam + "," + jumpTo.trim() : jumpTo.trim();
      }

      if (highlightParam) {
        url.hash = `:~:text=${encodeURIComponent(highlightParam)}`;
      } else if (jumpTo.trim()) {
        url.hash = `:~:text=${encodeURIComponent(jumpTo.trim())}`;
      } else {
        url.hash = "";
      }

      const res = await fetch("/api/links", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ deepLink: url.toString() }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Short URL generation failed");
      }

      const fullShortUrl = `${window.location.origin}/s/${data.shortCode || data.shortUrl}`;
      setShortUrl(fullShortUrl);
    } catch (e: any) {
      setError(e.message || "Failed to generate short URL");
    }
    setLoadingShort(false);
  }, [link, parsedSeconds, highlightList, jumpTo]);

  const handleCreate = useCallback(() => {
    generateShortUrl();
  }, [generateShortUrl]);

  const handleCopy = useCallback(() => {
    if (!shortUrl) return;
    navigator.clipboard.writeText(shortUrl).then(() => {
      alert("Short URL copied to clipboard!");
    });
  }, [shortUrl]);

  const handleTextSelect = () => {
    if (!window.getSelection) return;
    const selection = window.getSelection();
    if (!selection || selection.isCollapsed) return;
    const selectedText = selection.toString().trim();

    if (
      selectedText.length > 2 &&
      selectedText.length < 150 &&
      !highlightList.includes(selectedText)
    ) {
      setHighlightList((prev) => [...prev, selectedText]);
      setJumpTo("");
      selection.removeAllRanges();
    }
  };

  const removeHighlight = useCallback((text: string) => {
    setHighlightList((prev) => prev.filter((h) => h !== text));
  }, []);

  const isMediaFile = useMemo(() => {
    if (!link) return false;
    try {
      const urlObj = new URL(link);
      const mediaExts = ["mp3", "wav", "ogg", "m4a", "mp4", "webm", "mov", "avi"];
      const path = urlObj.pathname.toLowerCase();
      if (mediaExts.some((ext) => path.endsWith(`.${ext}`))) return true;
      const mediaHosts = ["youtube.com", "youtu.be", "soundcloud.com", "vimeo.com"];
      if (mediaHosts.some((h) => urlObj.hostname.includes(h))) return true;
      return false;
    } catch {
      return false;
    }
  }, [link]);

  useEffect(() => {
    if (!previewRef.current) return;
    const contentEl = previewRef.current;
    const search = debouncedSearchTerm.trim();

    const innerHTML = contentEl.innerHTML;
    const cleanedHTML = innerHTML.replace(/<mark class="highlight">([^<]*)<\/mark>/gi, "$1");
    contentEl.innerHTML = cleanedHTML;

    if (!search) return;

    const regex = new RegExp(`(${search.replace(/[-/\\^$*+?.()|[\]{}]/g, "\\$&")})`, "gi");
    contentEl.innerHTML = contentEl.innerHTML.replace(regex, '<mark class="highlight">$1</mark>');

    const firstMark = contentEl.querySelector("mark.highlight");
    if (firstMark) {
      firstMark.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, [debouncedSearchTerm, articleContent]);

  const toggleMobileMenu = () => setMobileMenuOpen((o) => !o);

  const submitFeedback = async () => {
    if (!feedbackMessage.trim()) return alert("Please enter your message.");
    setFeedbackSubmitting(true);
    try {
      await new Promise((res) => setTimeout(res, 1500));
      alert("Thanks for your feedback!");
      setFeedbackMessage("");
      setFeedbackEmail("");
      setShowLightbox(false);
    } catch {
      alert("Failed to send feedback.");
    }
    setFeedbackSubmitting(false);
  };

  return (
    <>
      <HamburgerButton aria-label="Toggle menu" onClick={toggleMobileMenu}>
        ☰ Menu
      </HamburgerButton>
      <MobileMenu open={mobileMenuOpen} aria-hidden={!mobileMenuOpen}>
        <MobileMenuClose
          aria-label="Close menu"
          onClick={() => setMobileMenuOpen(false)}
        >
          ×
        </MobileMenuClose>
        <Subtitle>Jump2 — Content Sharer</Subtitle>
        <Description>
          Paste any link (articles, videos) to highlight and share the best parts.
        </Description>
        <ContactEmail href="mailto:contact@jump2.com">Contact: contact@jump2.com</ContactEmail>
      </MobileMenu>

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
            quick shareable link, and skip the fluff.
          </p>
          <p>
            Have feedback or questions? Drop us a note below or email us anytime at{" "}
            <ContactEmail href="mailto:contact@jump2.com">contact@jump2.com</ContactEmail>.
          </p>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              submitFeedback();
            }}
          >
            <label htmlFor="feedbackMessage">Your Message</label>
            <Textarea
              id="feedbackMessage"
              value={feedbackMessage}
              onChange={(e) => setFeedbackMessage(e.target.value)}
              rows={4}
              disabled={feedbackSubmitting}
              required
            />
            <label htmlFor="feedbackEmail">Your Email (optional)</label>
            <Input
              id="feedbackEmail"
              type="email"
              value={feedbackEmail}
              onChange={(e) => setFeedbackEmail(e.target.value)}
              placeholder="you@example.com"
              disabled={feedbackSubmitting}
            />
            <Button type="submit" disabled={feedbackSubmitting} aria-busy={feedbackSubmitting}>
              {feedbackSubmitting ? "Sending..." : "Send Feedback"}
            </Button>
            <Button
              type="button"
              onClick={() => setShowLightbox(false)}
              style={{ marginLeft: "1rem", backgroundColor: "#64748b", animation: "none" }}
            >
              Close
            </Button>
          </form>
        </LightboxContent>
      </LightboxBackdrop>

      <PageContainer role="main" aria-label="Jump2 content sharer">
        <LeftColumn>
          <LogoWrapper aria-label="Jump2 logo" role="img" tabIndex={-1}>
            <JumpText>Jump</JumpText>
            <TwoText>2</TwoText>
          </LogoWrapper>

          <Subtitle>Skip the fluff. Jump2 the good part.</Subtitle>

          <Description>
            Paste a link (article or video) and highlight the best part — timestamp, quote, or keyword.
          </Description>

          <FormWrapper aria-live="polite" aria-atomic="true" aria-describedby="form-error">
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
                onChange={(e) => setLink(e.target.value.trim())}
                spellCheck={false}
                autoComplete="off"
                required
                aria-label="Content link"
                aria-invalid={!!error}
                disabled={loadingPreview || loadingShort}
                autoFocus
              />

              <Input
                type="text"
                placeholder={
                  isMediaFile
                    ? "Jump to timestamp like 1:23 or 0:02:15"
                    : "Jump to highlight text or timestamp"
                }
                value={jumpTo}
                onChange={(e) => setJumpTo(e.target.value)}
                spellCheck={false}
                autoComplete="off"
                aria-label="Jump to position"
                disabled={!link || loadingPreview || loadingShort}
              />

              {highlightList.length > 0 && (
                <HighlightChipsContainer aria-label="Selected highlights">
                  {highlightList.map((text) => (
                    <HighlightChip key={text}>
                      {text}
                      <ChipRemoveButton
                        onClick={() => removeHighlight(text)}
                        aria-label={`Remove highlight: ${text}`}
                        title="Remove highlight"
                      >
                        ×
                      </ChipRemoveButton>
                    </HighlightChip>
                  ))}
                </HighlightChipsContainer>
              )}

              <Hint>
                {isMediaFile ? (
                  <>
                    For videos/audio, enter timestamp like 1:23 or 0:02:15
                    <InfoIcon data-tooltip="Use MM:SS or HH:MM:SS formats for timestamps. Example: 1:23, 0:02:15">
                      ?
                    </InfoIcon>
                  </>
                ) : (
                  "For articles, paste a quote or keyword to highlight"
                )}
              </Hint>

              <Button
                type="submit"
                disabled={loadingPreview || loadingShort || !link || (!!jumpTo && error !== "")}
                aria-disabled={loadingPreview || loadingShort || !link || (!!jumpTo && error !== "")}
                aria-live="polite"
                aria-busy={loadingShort}
              >
                {loadingShort ? "Generating..." : "Make it a Jump2"}
              </Button>
            </Form>
            {error && (
              <Feedback id="form-error" role="alert" aria-live="assertive" aria-atomic="true">
                {error}
              </Feedback>
            )}

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
                    type="button"
                    onClick={handleCopy}
                    aria-label="Copy short URL to clipboard"
                  >
                    Copy Short URL
                  </CopyButton>
                </>
              )}
            </ShareWrapper>
          </FormWrapper>
        </LeftColumn>

        <PreviewWrapper
          aria-live="polite"
          aria-label="Article preview or video player"
          tabIndex={0}
          onMouseUp={handleTextSelect}
        >
          <PreviewSearch
            type="search"
            placeholder="Search preview text..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            aria-label="Search article preview"
            disabled={loadingPreview}
          />
          {searchTerm && (
            <CopyButton
              type="button"
              onClick={() => setSearchTerm("")}
              aria-label="Clear preview search"
              style={{ alignSelf: "flex-end", marginBottom: "1rem" }}
            >
              Clear Search
            </CopyButton>
          )}

          {loadingPreview && <em>Loading preview...</em>}

          {!loadingPreview && articleContent && (
            <div ref={previewRef} dangerouslySetInnerHTML={{ __html: articleContent }} />
          )}

          {link &&
            (() => {
              try {
                const urlObj = new URL(link);
                return isYouTubeUrl(urlObj);
              } catch {
                return false;
              }
            })() && <YouTubePlayer url={link} startSeconds={parsedSeconds} />}
        </PreviewWrapper>
      </PageContainer>
    </>
  );
}
