import React, { useState, useEffect, useCallback, useRef } from "react";
import styled, { keyframes } from "styled-components";
import DOMPurify from "dompurify";
import ArticleError from "./ArticleError";
import HighlightEditor, { Highlight } from "./HighlightEditor";
import MemeModal from "./MemeModal";
import Footer from "./Footer";

// Icons
const Icon = styled.span`
  font-size: 1.2em;
  vertical-align: middle;
`;
const CopyIcon = () => <Icon aria-label="Copy">📋</Icon>;
const RedoIcon = () => <Icon aria-label="Redo">🔄</Icon>;
const CheckIcon = () => <Icon aria-label="Check" style={{ color: "#38a169" }}>✔️</Icon>;
const Qricon = () => <Icon aria-label="QR">🧾</Icon>;

// Animations
const fadeIn = keyframes`from { opacity: 0 } to { opacity: 1 }`;
const pulse = keyframes`0%,100%{transform:scale(1)}50%{transform:scale(1.05)}`;

// Styled Components
const Container = styled.div`
  max-width: 850px;
  margin: 2rem auto;
  padding: 1rem 1.2rem;
  animation: ${fadeIn} 0.5s ease;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  display: grid;
  gap: 1.5rem;
`;

const Row = styled.div<{ justify?: string }>`
  display: flex;
  justify-content: ${({ justify }) => justify || "space-between"};
  align-items: center;
`;

const Panel = styled.div`
  background: #f9fafb;
  padding: 1rem;
  border-radius: 0.6rem;
  box-shadow: 0 2px 12px rgba(203, 213, 225, 0.34);
`;

const Preview = styled.div`
  background: #fff;
  padding: 1.5rem;
  border-radius: 0.6rem;
  box-shadow: 0 2px 12px rgba(203, 213, 225, 0.22);
  line-height: 1.6;
  font-size: 1rem;
  position: relative;
  .jump2-highlight {
    background: var(--highlight-color, #ffe066);
    transition: background 0.4s;
    animation: ${pulse} 1s ease;
    cursor: pointer;
  }
`;

const WarningPanel = styled(Panel)`
  border: 1px solid #e53e3e;
  color: #e53e3e;
`;

function sanitizeWithHighlights(html: string, highlights: Highlight[]) {
  if (!highlights.length) return DOMPurify.sanitize(html);
  const sorted = [...highlights].sort((a, b) => a.start - b.start);
  let result = "", pos = 0;
  for (const { start, end, color, id } of sorted) {
    if (start > pos) result += DOMPurify.sanitize(html.slice(pos, start));
    result += `<mark class="jump2-highlight" style="--highlight-color:${color};background:${color}" data-id="${id}" tabindex="0">${DOMPurify.sanitize(html.slice(start, end))}</mark>`;
    pos = end;
  }
  if (pos < html.length) result += DOMPurify.sanitize(html.slice(pos));
  return result;
}

type ArticlePreviewFullProps = {
  url: string;
  initialHighlights?: Highlight[];
  onClose?: () => void;
  anchor?: string;
  onAnchorEdit?: (anchor: string) => void;
  scrapeEngine?: string;
  enableYouTubeTimestamp?: boolean;
  supportArticles?: boolean;
  supportMemes?: boolean;
};

export default function ArticlePreviewFull({
  url,
  initialHighlights = [],
  onClose,
  anchor = "",
  onAnchorEdit,
  scrapeEngine,
  enableYouTubeTimestamp,
  supportArticles,
  supportMemes,
}: ArticlePreviewFullProps) {
  const [html, setHtml] = useState<string>("");
  const [text, setText] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [shareUrl, setShareUrl] = useState<string | null>(null);
  const [sharing, setSharing] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);
  const [anchorInput, setAnchorInput] = useState<string>(anchor);
  const [highlights, setHighlights] = useState<Highlight[]>(initialHighlights);
  const [showQR, setShowQR] = useState<boolean>(false);
  const [showMemeModal, setShowMemeModal] = useState<boolean>(false);

  const previewRef = useRef<HTMLDivElement>(null);
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    if (!url) return;
    setLoading(true);
    setError(null);
    const controller = new AbortController();
    abortRef.current = controller;
    const t = setTimeout(() => controller.abort(), 13000);
    const fetchUrl = `/api/parse?url=${encodeURIComponent(url)}${scrapeEngine ? `&engine=${encodeURIComponent(scrapeEngine)}` : ""}`;

    fetch(fetchUrl, { signal: controller.signal })
      .then(async (res) => {
        clearTimeout(t);
        if (!res.ok) throw new Error(await res.text());
        return res.json();
      })
      .then((data) => {
        if (data.article?.content) {
          setHtml(data.article.content);
          setText(data.article.content.replace(/<[^>]+>/g, " "));
        } else {
          throw new Error(data.error || "No content found.");
        }
      })
      .catch((e) => setError(e.name === "AbortError" ? "Request timed out." : e.message))
      .finally(() => setLoading(false));

    return () => {
      clearTimeout(t);
      controller.abort();
    };
  }, [url, scrapeEngine]);

  useEffect(() => {
    if (!html || !highlights.length) return;
    setTimeout(() => {
      const mark = previewRef.current?.querySelector(".jump2-highlight");
      if (mark) (mark as HTMLElement).scrollIntoView({ behavior: "smooth", block: "center" });
    }, 200);
  }, [html, highlights]);

  const missingHighlights = highlights.filter((h) =>
    !html.toLowerCase().includes(h.text.trim().toLowerCase())
  );

  const shareHighlights = useCallback(
    async (arr: Highlight[]) => {
      setSharing(true);
      try {
        const res = await fetch("/api/highlights", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ url, highlights: arr.map(h => h.text), colors: arr.map(h => h.color) }),
        });
        const data = await res.json();
        if (!data.shareUrl) throw new Error("No share link returned");
        setShareUrl(data.shareUrl);
      } catch {
        setError("Can't generate share link.");
      } finally {
        setSharing(false);
      }
    },
    [url]
  );

  const copyToClipboard = () => {
    if (!shareUrl) return;
    navigator.clipboard.writeText(shareUrl).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    });
  };

  return (
    <Container>
      <Row>
        <h2>🖍️ Share‑Ready Highlights</h2>
        {onClose && (
          <button onClick={onClose} aria-label="Close" style={{ background: 'none', border: 'none', fontSize: '1.4em', cursor: 'pointer' }}>
            ✕
          </button>
        )}
      </Row>

      {loading && <p>Loading content…</p>}
      {error && <ArticleError error={error} url={url} />}

      {!loading && !error && (
        <>
          {anchor && (
            <Panel>
              <label><strong>Anchor:</strong></label>
              <Row>
                <input
                  type="text"
                  value={anchorInput}
                  onChange={e => {
                    setAnchorInput(e.target.value);
                    onAnchorEdit?.(e.target.value);
                  }}
                  style={{ flex: 1, marginRight: '0.5rem', padding: '0.4rem' }}
                />
                <button onClick={copyToClipboard}><CopyIcon /> Copy</button>
                <button onClick={() => setShowQR(v => !v)}><Qricon /> {showQR ? "Hide QR" : "Show QR"}</button>
              </Row>
              {showQR && (
                <img
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(url + "#:~:text=" + encodeURIComponent(anchorInput))}`}
                  alt="Anchor QR Code"
                  style={{ marginTop: '0.8rem', borderRadius: '0.4rem' }}
                />
              )}
            </Panel>
          )}

          <Preview ref={previewRef} dangerouslySetInnerHTML={{ __html: sanitizeWithHighlights(html, highlights) }} />

          {missingHighlights.length > 0 && (
            <WarningPanel>
              <p>⚠️ Some highlights were not found:</p>
              <ul>{missingHighlights.map(h => <li key={h.id}><code>{h.text}</code></li>)}</ul>
              <button onClick={() => setHighlights([])}><RedoIcon /> Reset highlights</button>
            </WarningPanel>
          )}

          <HighlightEditor
            htmlContent={html}
            initialHighlights={highlights}
            onHighlightsChange={setHighlights}
            onShare={shareHighlights}
            sharing={sharing}
            readOnly={!supportArticles}
            enableYouTubeTimestamp={enableYouTubeTimestamp}
          />

          {shareUrl && (
            <Panel>
              <Row justify="start">
                <CheckIcon /> <strong>Share link:</strong>
              </Row>
              <Row>
                <a href={shareUrl} target="_blank" rel="noopener noreferrer">{shareUrl}</a>
                <button onClick={copyToClipboard}><CopyIcon /> {copied ? "Copied!" : "Copy"}</button>
              </Row>
            </Panel>
          )}

          {supportMemes && (
            <Panel>
              <h3>Auto‑Meme Generator</h3>
              <button onClick={() => setShowMemeModal(true)} style={{ padding: '0.6rem 1.2rem', fontWeight: 600 }}>
                Generate Meme
              </button>
              {showMemeModal && (
                <MemeModal
                  highlightText={anchorInput || highlights[0]?.text || ""}
                  articleUrl={url}
                  onClose={() => setShowMemeModal(false)}
                />
              )}
            </Panel>
          )}

          <Footer />
        </>
      )}
    </Container>
  );
}
