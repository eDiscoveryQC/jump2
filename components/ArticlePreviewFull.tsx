// components/ArticlePreviewFull.tsx

import React, { useState, useEffect, useCallback, useRef } from "react";
import styled, { keyframes } from "styled-components";
import DOMPurify from "dompurify";

import ArticleError from "./ArticleError";
import HighlightEditor, { Highlight } from "./HighlightEditor";
import MemeGenerator from "./MemeGenerator";
import Footer from "./Footer";

// Emoji-based icons
const FaCopy = () => <span role="img" aria-label="Copy">📋</span>;
const FaRedo = () => <span role="img" aria-label="Redo">🔄</span>;
const FaCheckCircle = () => <span role="img" aria-label="Check" style={{ color: "#38a169" }}>✔️</span>;
const FaQr = () => <span role="img" aria-label="QR">🧾</span>;

// Animations
const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;
const highlightFlash = keyframes`
  0%, 100% { background: #ffe066; }
  40% { background: #ffb700; }
`;

// Styled Components
const PageContainer = styled.div`
  max-width: 980px;
  margin: 2.7rem auto 3rem;
  padding: 0 1.2rem;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  animation: ${fadeIn} 0.45s;
`;

const TitleRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  margin-bottom: 0.7rem;
`;

const Title = styled.h2`
  color: #14314d;
  font-size: 2rem;
  font-weight: 700;
  letter-spacing: -1.1px;
`;

const OnboardingHint = styled.div`
  background: #f3faff;
  color: #2274a5;
  border: 1.5px solid #bee3f8;
  border-radius: 0.6em;
  font-size: 1.07em;
  padding: 0.65em 1.2em;
  margin-bottom: 1.15em;
  font-weight: 500;
  box-shadow: 0 2px 12px #dbeafe44;
`;

const Message = styled.p<{ error?: boolean }>`
  color: ${({ error }) => (error ? "#e53e3e" : "#555")};
  font-size: 1.13rem;
  margin: 1.2rem 0;
  font-weight: ${({ error }) => (error ? 600 : 400)};
`;

const ShareLinkContainer = styled.div`
  margin-bottom: 1.25rem;
  display: flex;
  align-items: center;
  gap: 0.7em;
  a {
    color: #3578e5;
    word-break: break-word;
    font-weight: 500;
  }
  button {
    padding: 0.23em 0.7em;
    border-radius: 0.4em;
    font-size: 1em;
    background: #f8fafc;
    border: 1px solid #dbeafe;
    color: #3578e5;
    cursor: pointer;
    transition: background 0.13s;
    &:hover {
      background: #dbeafe;
    }
  }
`;

const PreviewContainer = styled.div`
  background: #f8fafc;
  border-radius: 0.8rem;
  padding: 2rem 1.5rem 1.3rem;
  margin-bottom: 2.1rem;
  color: #1e293b;
  font-size: 1.09rem;
  line-height: 1.72;
  min-height: 300px;
  overflow-x: auto;
  box-shadow: 0 2px 12px #cbd5e155;
  position: relative;

  .jump2-highlight {
    background: var(--highlight-color, #ffe066);
    color: #1e293b;
    padding: 0.11em 0.26em;
    border-radius: 0.35em;
    font-weight: 600;
    box-shadow: 0 0 2px #ffea70;
    transition: background 0.18s;
    animation: ${highlightFlash} 1.2s 1;
    cursor: pointer;
    outline: 0;
  }
`;

// Highlight rendering
function markHtmlWithHighlightsSafe(html: string, highlights: Highlight[]) {
  if (!highlights?.length) return DOMPurify.sanitize(html);
  const sorted = [...highlights]
    .filter((h) => h.start < h.end && h.start >= 0 && h.end <= html.length)
    .sort((a, b) => a.start - b.start);

  let result = "", pos = 0;
  for (const { start, end, color, id } of sorted) {
    if (start > pos) result += DOMPurify.sanitize(html.slice(pos, start));
    result += `<mark class="jump2-highlight" tabindex="0" data-highlight-id="${id}" style="--highlight-color:${color};background:${color};">${DOMPurify.sanitize(html.slice(start, end))}</mark>`;
    pos = end;
  }
  if (pos < html.length) result += DOMPurify.sanitize(html.slice(pos));
  return result;
}

// Context snippet utility
function getContextSnippet(text: string, anchor: string, n = 120) {
  if (!anchor) return { before: "", anchor: "", after: "" };
  const idx = text.toLowerCase().indexOf(anchor.toLowerCase());
  if (idx === -1) return { before: "", anchor: "", after: "" };
  const before = text.slice(Math.max(0, idx - n), idx).replace(/^.*?([.?!])\s/, "$1 ");
  const after = text.slice(idx + anchor.length, idx + anchor.length + n).replace(/([.?!]).*$/, "$1");
  return { before, anchor: text.substr(idx, anchor.length), after };
}

type ArticlePreviewFullProps = {
  url: string;
  initialHighlights?: Highlight[];
  onClose?: () => void;
  anchor?: string;
  onAnchorEdit?: (anchor: string) => void;
};

const KNOWN_SUPPORTED = [
  "nytimes.com", "bbc.co", "cnn.com", "yahoo.com", "npr.org",
  "reuters.com", "theguardian.com", "wikipedia.org",
  "substack.com", "medium.com",
];

export default function ArticlePreviewFull({
  url,
  initialHighlights = [],
  onClose,
  anchor = "",
  onAnchorEdit,
}: ArticlePreviewFullProps) {
  const [articleHtml, setArticleHtml] = useState("");
  const [articleText, setArticleText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [shareLink, setShareLink] = useState<string | null>(null);
  const [sharing, setSharing] = useState(false);
  const [shareError, setShareError] = useState<string | null>(null);
  const [copySuccess, setCopySuccess] = useState(false);
  const [feedback, setFeedback] = useState<"up" | "down" | "">("");
  const [editAnchor, setEditAnchor] = useState(anchor);
  const [highlights, setHighlights] = useState<Highlight[]>(initialHighlights);
  const [showHint, setShowHint] = useState(true);
  const [showQRCode, setShowQRCode] = useState(false);
  const [showMemeModal, setShowMemeModal] = useState(false);

  const previewRef = useRef<HTMLDivElement>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  // Fetch article content
  useEffect(() => {
    if (!url) return;
    setLoading(true);
    setError(null);
    setArticleHtml("");
    setShareLink(null);
    setShareError(null);

    abortControllerRef.current?.abort();
    const controller = new AbortController();
    abortControllerRef.current = controller;
    const timeout = setTimeout(() => controller.abort(), 13000);

    fetch(`/api/parse?url=${encodeURIComponent(url)}`, { signal: controller.signal })
      .then(async (res) => {
        clearTimeout(timeout);
        if (!res.ok) throw new Error(await res.text());
        return res.json();
      })
      .then((data) => {
        if (data.article?.content) {
          setArticleHtml(data.article.content);
          setArticleText(data.article.content.replace(/<[^>]+>/g, " "));
        } else setError(data.error || "No content found.");
      })
      .catch((e) => setError(e.name === "AbortError" ? "Timed out." : e.message))
      .finally(() => setLoading(false));

    return () => {
      clearTimeout(timeout);
      controller.abort();
    };
  }, [url]);

  // Scroll to highlight
  useEffect(() => {
    if (!articleHtml || !highlights.length) return;
    setTimeout(() => {
      const container = previewRef.current;
      if (!container) return;
      const mark = container.querySelector("mark.jump2-highlight");
      if (mark) {
        mark.scrollIntoView({ behavior: "smooth", block: "center" });
        mark.classList.add("jump2-highlight--flash");
        setTimeout(() => mark.classList.remove("jump2-highlight--flash"), 1600);
      }
    }, 140);
  }, [articleHtml, highlights]);

  useEffect(() => {
    if (highlights.length > 0) setShowHint(false);
  }, [highlights.length]);

  const snippet = getContextSnippet(articleText, anchor);

  const handleShare = useCallback(async (highlightsArr: Highlight[]) => {
    if (!url) return;
    setSharing(true);
    setShareError(null);
    setShareLink(null);

    try {
      const response = await fetch("/api/highlights", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          url,
          highlights: highlightsArr.map((h) => h.text),
          colors: highlightsArr.map((h) => h.color),
        }),
      });
      const data = await response.json();
      setShareLink(data.shareUrl ?? null);
      if (!data.shareUrl) setShareError("Failed to generate share link.");
    } catch {
      setShareError("Failed to generate share link.");
    } finally {
      setSharing(false);
    }
  }, [url]);

  const handleCopyLink = () => {
    if (!shareLink) return;
    navigator.clipboard?.writeText(shareLink).then(() => setCopySuccess(true));
    setTimeout(() => setCopySuccess(false), 1200);
  };

  const handleAnchorEdit = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newAnchor = e.target.value;
    setEditAnchor(newAnchor);
    onAnchorEdit?.(newAnchor);
  };

  const missingHighlights = highlights.length && articleHtml
    ? highlights.filter(h => !articleHtml.toLowerCase().includes(h.text.trim().toLowerCase()))
    : [];

  return (
    <PageContainer>
      <TitleRow>
        <Title>🖍️ Highlight & Share</Title>
        {onClose && <button onClick={onClose} style={{ fontSize: "1.3em", background: "none", border: "none", cursor: "pointer", color: "#888" }}>✕</button>}
      </TitleRow>

      {showHint && (
        <OnboardingHint>
          Paste an article link above, highlight any part below, pick a color, and click <b>Share</b>.<br />
          Works best for news, blogs, and Wikipedia.
        </OnboardingHint>
      )}

      {anchor && (
        <>
          <div style={{ background: "#f9fafb", padding: "0.7em 1.2em", borderRadius: 9, marginBottom: "1.1em", boxShadow: "0 1px 6px #dbeafe44" }}>
            <strong style={{ color: "#14314d" }}>Anchor:</strong>{" "}
            <input value={editAnchor} onChange={handleAnchorEdit}
              style={{ border: "1.2px solid #ffe066", background: "#fff8dc", padding: "0.2em 0.6em", borderRadius: 6, fontWeight: 600, color: "#17456b" }}
            />
            <button onClick={() => navigator.clipboard.writeText(editAnchor)}><FaCopy /> Copy</button>
            <button onClick={() => setShowQRCode(q => !q)}><FaQr /> {showQRCode ? "Hide" : "QR"}</button>
            {showQRCode && (
              <img src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(url + "#:~:text=" + encodeURIComponent(editAnchor))}`} alt="QR" style={{ background: "#fff", marginLeft: 10, borderRadius: 6 }} />
            )}
          </div>
          {snippet.anchor && (
            <div style={{ background: "#f9fafb", padding: "0.6em 1em", borderRadius: 8, marginBottom: "1em" }}>
              <span style={{ opacity: 0.6 }}>{snippet.before}</span>
              <mark style={{ background: "#ffe066", fontWeight: 700 }}>{snippet.anchor}</mark>
              <span style={{ opacity: 0.6 }}>{snippet.after}</span>
            </div>
          )}
        </>
      )}

      {loading && <Message>Loading article...</Message>}
      {error && <ArticleError error={error} url={url} />}
      {shareLink && (
        <ShareLinkContainer>
          <FaCheckCircle /> <strong>Share Link:</strong>{" "}
          <a href={shareLink} target="_blank" rel="noopener noreferrer">{shareLink}</a>
          <button onClick={handleCopyLink}><FaCopy /> Copy</button>
        </ShareLinkContainer>
      )}
      {copySuccess && <Message><FaCheckCircle /> Copied!</Message>}
      {shareError && <Message error>{shareError}</Message>}

      {!loading && !error && articleHtml && (
        <>
          <PreviewContainer ref={previewRef} dangerouslySetInnerHTML={{ __html: markHtmlWithHighlightsSafe(articleHtml, highlights) }} />
          {missingHighlights.length > 0 && (
            <Message error>
              Some highlights were not found:
              <ul>{missingHighlights.map((h) => <li key={h.id}><code>{h.text}</code></li>)}</ul>
              <button onClick={() => setHighlights([])}><FaRedo /> Try again</button>
            </Message>
          )}
          <HighlightEditor htmlContent={articleHtml} initialHighlights={highlights} onHighlightsChange={setHighlights} onShare={handleShare} sharing={sharing} readOnly={false} />

          {/* Meme Generator */}
          <div style={{ marginTop: "2.5rem" }}>
            <h3 style={{ fontSize: "1.4rem", fontWeight: 700 }}>🖼️ Auto Meme Generator</h3>
            <button onClick={() => setShowMemeModal(true)} style={{ background: "#ffe066", padding: "0.37em 1.25em", fontWeight: 700, borderRadius: 7 }}>
              Generate Meme from Highlight
            </button>
            {showMemeModal && (
              <MemeGenerator
                highlightText={anchor || (highlights[0]?.text ?? "")}
                articleUrl={url}
                onClose={() => setShowMemeModal(false)}
              />
            )}
          </div>
        </>
      )}

      {!loading && !error && !articleHtml && <Message>No preview available for this link.</Message>}

      <Footer />
      <footer style={{ marginTop: "2.2rem", textAlign: "center", color: "#a0aec0", fontSize: "0.99em" }}>
        <div><b>Jump2 works best with:</b> News articles, blogs, Wikipedia, and most public sites.</div>
        <div>Need help? <a href="mailto:support@jump2.link" style={{ color: "#3578e5" }}>Contact us</a></div>
      </footer>
    </PageContainer>
  );
}
