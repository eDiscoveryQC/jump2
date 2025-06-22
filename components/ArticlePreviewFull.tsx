import React, { useState, useEffect, useCallback, useRef } from "react";
import styled, { keyframes } from "styled-components";
import ArticleError from "./ArticleError";
import HighlightEditor, { Highlight } from "./HighlightEditor";
import DOMPurify from "dompurify";

// Emoji-based icons to avoid react-icons dependency
const FaCopy = () => (
  <span role="img" aria-label="Copy" style={{ fontSize: "1.1em" }}>
    📋
  </span>
);
const FaRedo = () => (
  <span role="img" aria-label="Redo" style={{ fontSize: "1.1em" }}>
    🔄
  </span>
);
const FaCheckCircle = () => (
  <span
    role="img"
    aria-label="Check"
    style={{ fontSize: "1.1em", color: "#38a169" }}
  >
    ✔️
  </span>
);

// --- Styles ---
const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;
const highlightFlash = keyframes`
    0%   { background: #ffe066; }
    40%  { background: #ffb700; }
    70%  { background: #ffe066; }
    100% { background: #ffe066; }
`;

const PageContainer = styled.div`
  max-width: 980px;
  margin: 2.5rem auto 3rem;
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
  margin-right: 1rem;
`;

const OnboardingHint = styled.div`
  background: #f3faff;
  color: #2274a5;
  border: 1.5px solid #bee3f8;
  border-radius: 0.6em;
  font-size: 1.06em;
  padding: 0.6em 1.1em;
  margin-bottom: 1.1em;
  font-weight: 500;
  box-shadow: 0 2px 12px #dbeafe44;
  display: inline-block;
`;

const Message = styled.p<{ error?: boolean }>`
  color: ${({ error }) => (error ? "#e53e3e" : "#555")};
  font-size: 1.13rem;
  margin: 1.2rem 0;
`;

const ShareLinkContainer = styled.div`
  margin-bottom: 1.25rem;
  display: flex;
  align-items: center;
  gap: 0.7em;
  a {
    color: #3578e5;
    word-break: break-all;
    font-weight: 500;
  }
  button {
    margin-left: 0.5em;
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

// --- Highlight Color Palette ---
const HIGHLIGHT_COLORS = [
  "#ffe066", // yellow
  "#a7f3d0", // green
  "#bae6fd", // blue
  "#fcd34d", // orange
  "#fca5a5", // red
  "#d8b4fe", // purple
  "#fbcfe8", // pink
];

// --- Utility for in-place highlighting (for visual preview only) ---
function markHtmlWithHighlightsSafe(html: string, highlights: Highlight[]) {
  if (!highlights?.length) return DOMPurify.sanitize(html);
  // Defensive: sort, avoid overlap, escape HTML
  const sorted = [...highlights]
    .filter((h) => h.start < h.end && h.start >= 0 && h.end <= html.length)
    .sort((a, b) => a.start - b.start);
  let result = "";
  let pos = 0;
  sorted.forEach(({ start, end, color, id }) => {
    if (start > pos) result += DOMPurify.sanitize(html.slice(pos, start));
    result += `<mark class="jump2-highlight" tabindex="0" data-highlight-id="${id}" style="--highlight-color:${color};background:${color};">${DOMPurify.sanitize(
      html.slice(start, end)
    )}</mark>`;
    pos = end;
  });
  if (pos < html.length) result += DOMPurify.sanitize(html.slice(pos));
  return result;
}

type ArticlePreviewFullProps = {
  url: string;
  initialHighlights?: Highlight[];
  onClose?: () => void;
};

const KNOWN_SUPPORTED = [
  "nytimes.com",
  "bbc.co",
  "cnn.com",
  "yahoo.com",
  "npr.org",
  "reuters.com",
  "theguardian.com",
  "wikipedia.org",
  "substack.com",
  "medium.com",
];

export default function ArticlePreviewFull({
  url,
  initialHighlights = [],
  onClose,
}: ArticlePreviewFullProps) {
  // --- State ---
  const [articleHtml, setArticleHtml] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [shareLink, setShareLink] = useState<string | null>(null);
  const [sharing, setSharing] = useState(false);
  const [shareError, setShareError] = useState<string | null>(null);
  const [copySuccess, setCopySuccess] = useState(false);

  // --- Highlight state ---
  const [highlights, setHighlights] = useState<Highlight[]>(initialHighlights);

  // --- Onboarding/first run hint ---
  const [showHint, setShowHint] = useState(true);

  const previewRef = useRef<HTMLDivElement>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  // --- Fetch Article with timeout, abort, and detailed error ---
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
        if (!res.ok) {
          const errMsg = (await res.text()) || "Failed to fetch article";
          throw new Error(`(${res.status}) ${errMsg}`);
        }
        return res.json();
      })
      .then((data) => {
        if (data.article?.content) {
          setArticleHtml(data.article.content);
        } else {
          setError(data.error || "Failed to load article content.");
        }
      })
      .catch((e) => {
        if (e.name === "AbortError") {
          setError("Loading timed out. Please try again.");
        } else {
          setError(e?.message || "Failed to load article content.");
        }
      })
      .finally(() => setLoading(false));
    return () => {
      clearTimeout(timeout);
      controller.abort();
    };
  }, [url]);

  // --- Scroll/flash to first highlight after content loads ---
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

  // --- Check for missing highlights ---
  const missingHighlights =
    highlights.length && articleHtml
      ? highlights.filter(
          (h) =>
            !articleHtml
              .toLowerCase()
              .includes(h.text.trim().toLowerCase())
        )
      : [];

  // --- Share Handler ---
  const handleShare = useCallback(
    async (highlightsArr: Highlight[]) => {
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
        if (data.shareUrl) {
          setShareLink(data.shareUrl);
        } else {
          setShareError("Failed to generate share link.");
        }
      } catch {
        setShareError("Failed to generate share link.");
      } finally {
        setSharing(false);
      }
    },
    [url]
  );

  // --- Copy Share Link ---
  const handleCopyLink = () => {
    if (!shareLink) return;
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(shareLink).then(() => setCopySuccess(true));
    } else {
      // fallback
      const textArea = document.createElement("textarea");
      textArea.value = shareLink;
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      try {
        document.execCommand("copy");
        setCopySuccess(true);
      } catch {
        // ignore
      }
      document.body.removeChild(textArea);
    }
    setTimeout(() => setCopySuccess(false), 1200);
  };

  // --- Onboarding: Hide hint after 1st highlight or scroll
  useEffect(() => {
    if (highlights.length > 0) setShowHint(false);
  }, [highlights.length]);

  // --- Domain guidance
  const domain = url ? new URL(url).hostname.replace(/^www\./, "") : "";
  const isKnownSupported = KNOWN_SUPPORTED.some((d) => domain.endsWith(d));

  return (
    <PageContainer>
      <TitleRow>
        <Title>
          <span role="img" aria-label="highlighter">
            🖍️
          </span>{" "}
          Highlight & Share
        </Title>
        {onClose && (
          <button
            onClick={onClose}
            aria-label="Close"
            style={{
              border: "none",
              background: "transparent",
              fontSize: "1.3em",
              color: "#888",
              cursor: "pointer",
              marginLeft: "auto",
            }}
          >
            ✕
          </button>
        )}
      </TitleRow>
      {showHint && (
        <OnboardingHint>
          Paste an article link above, highlight any part below, pick a color, and click <b>Share</b>.<br />
          Works best for news, blogs, and Wikipedia.
        </OnboardingHint>
      )}
      {loading && (
        <Message>
          <span role="status" aria-live="polite">
            Loading article...
          </span>
        </Message>
      )}
      {error && <ArticleError error={error} url={url} />}
      {shareLink && (
        <ShareLinkContainer>
          <FaCheckCircle /> <strong>Share Link:</strong>
          <a href={shareLink} target="_blank" rel="noopener noreferrer">
            {shareLink}
          </a>
          <button onClick={handleCopyLink} aria-label="Copy share link">
            <FaCopy /> Copy
          </button>
        </ShareLinkContainer>
      )}
      {copySuccess && (
        <Message>
          <FaCheckCircle /> Copied!
        </Message>
      )}
      {shareError && <Message error>{shareError}</Message>}
      {!loading && !error && articleHtml && (
        <>
          {/* Preview with color highlights */}
          <PreviewContainer ref={previewRef}>
            <div
              dangerouslySetInnerHTML={{
                __html: markHtmlWithHighlightsSafe(articleHtml, highlights),
              }}
              aria-label="Article preview with highlights"
              tabIndex={0}
            />
            {missingHighlights.length > 0 && (
              <Message error>
                <strong>Note:</strong> Could not find these highlight(s) in the article preview:
                <ul>
                  {missingHighlights.map((h) => (
                    <li key={h.id}>
                      <code>{h.text}</code>
                    </li>
                  ))}
                </ul>
                <button
                  onClick={() => setHighlights([])}
                  style={{
                    marginLeft: "0.5em",
                    fontWeight: 600,
                    color: "#3578e5",
                    border: "none",
                    background: "none",
                    cursor: "pointer",
                  }}
                  aria-label="Clear highlights and try again"
                >
                  <FaRedo /> Try again
                </button>
              </Message>
            )}
          </PreviewContainer>
          <HighlightEditor
            htmlContent={articleHtml}
            initialHighlights={highlights}
            onHighlightsChange={setHighlights}
            onShare={handleShare}
            sharing={sharing}
            readOnly={false}
          />
        </>
      )}
      {!loading && !error && !articleHtml && (
        <Message>No preview available for this link.</Message>
      )}
      <footer
        style={{
          marginTop: "2.2rem",
          textAlign: "center",
          color: "#a0aec0",
          fontSize: "0.99em",
        }}
      >
        <div>
          <b>Jump2 works best with:</b> News articles (NYT, BBC, Yahoo, blogs, Wikipedia, most public sites).
        </div>
        <div>
          Trouble?{" "}
          <a href="mailto:support@jump2.link" style={{ color: "#3578e5" }}>
            Contact us
          </a>
        </div>
      </footer>
    </PageContainer>
  );
}