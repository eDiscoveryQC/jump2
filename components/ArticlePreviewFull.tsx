import React, { useState, useEffect, useCallback, useRef } from "react";
import styled, { keyframes } from "styled-components";
import DOMPurify from "isomorphic-dompurify";
import toast from "react-hot-toast";
import ArticleError from "./ArticleError";
import HighlightEditor, { Highlight } from "./HighlightEditor";
import MemeModal from "./MemeModal";
import Footer from "./Footer";

// --- Utilities ---
function extractYouTubeID(url: string): string {
  const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|v\/))([\w-]{11})/);
  return match?.[1] ?? "";
}

function parseTimeInput(input: string): number | null {
  if (/^\d+$/.test(input)) return parseInt(input, 10);
  const parts = input.split(":").map(Number);
  if (parts.length === 2 && parts.every(n => !isNaN(n))) {
    return parts[0] * 60 + parts[1];
  }
  return null;
}

function sanitizeWithHighlights(html: string, highlights: Highlight[]): string {
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

// --- Styled Components ---
const fadeIn = keyframes`from { opacity: 0 } to { opacity: 1 }`;
const pulse = keyframes`0%,100%{transform:scale(1)}50%{transform:scale(1.05)}`;

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
  flex-wrap: wrap;
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

const Input = styled.input`
  padding: 0.5rem;
  margin-right: 0.5rem;
  border-radius: 0.4rem;
  border: 1px solid #ccc;
  flex: 1;
`;

// --- Main Component ---
type Props = {
  url: string;
  initialHighlights?: Highlight[];
  onGenerateLink?: (link: string) => void;
  onAnchorEdit?: (anchor: string) => void;
  scrapeEngine?: string;
  enableYouTubeTimestamp?: boolean;
  supportArticles?: boolean;
  supportMemes?: boolean;
};

export default function ArticlePreviewFull({
  url,
  initialHighlights = [],
  onGenerateLink,
  onAnchorEdit,
  scrapeEngine,
  enableYouTubeTimestamp,
  supportArticles,
  supportMemes,
}: Props) {
  const isYouTube = url.includes("youtube.com") || url.includes("youtu.be");
  const [html, setHtml] = useState("");
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [manualTime, setManualTime] = useState("");
  const [highlightData, setHighlightData] = useState<Highlight[]>(initialHighlights);
  const [anchorInput, setAnchorInput] = useState("");
  const [shareUrl, setShareUrl] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [showQR, setShowQR] = useState(false);
  const [showMemeModal, setShowMemeModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const previewRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isYouTube || !supportArticles) return;
    setLoading(true);
    fetch(`/api/parse?url=${encodeURIComponent(url)}${scrapeEngine ? `&engine=${scrapeEngine}` : ""}`)
      .then(res => res.json())
      .then(data => {
        setHtml(data.article?.content || "");
        setTitle(data.article?.title || "");
        setAuthor(data.article?.author || "");
        setError(null);
      })
      .catch(() => setError("❌ Failed to parse article."))
      .finally(() => setLoading(false));
  }, [url]);

  const handleManualTimestamp = () => {
    const seconds = parseTimeInput(manualTime);
    if (seconds === null) {
      toast.error("Invalid time format (e.g., 2:30 or 150)");
      return;
    }
    const jumpUrl = `${url.split("&")[0]}&t=${seconds}s`;
    navigator.clipboard.writeText(jumpUrl);
    toast.success("🕓 Manual timestamp copied!");
    onGenerateLink?.(jumpUrl);
  };

  const copyAnchorLink = () => {
    const anchorUrl = url + "#:~:text=" + encodeURIComponent(anchorInput);
    navigator.clipboard.writeText(anchorUrl);
    toast.success("🔗 Anchor link copied!");
    setShareUrl(anchorUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const sanitizedHtml = sanitizeWithHighlights(html, highlightData);
  const missingHighlights = highlightData.filter(h => !html.toLowerCase().includes(h.text.trim().toLowerCase()));

  return (
    <Container>
      <h2>🔍 Jump2 Preview</h2>

      {isYouTube && enableYouTubeTimestamp && (
        <Panel>
          <iframe
            width="100%"
            height="315"
            src={`https://www.youtube.com/embed/${extractYouTubeID(url)}`}
            title="YouTube video player"
            allowFullScreen
          />
          <Row style={{ marginTop: "1rem" }}>
            <Input
              type="text"
              placeholder="Enter timestamp (e.g. 1:30)"
              value={manualTime}
              onChange={(e) => setManualTime(e.target.value)}
            />
            <button onClick={handleManualTimestamp}>⏱️ Generate Timestamp</button>
          </Row>
        </Panel>
      )}

      {!isYouTube && supportArticles && (
        <>
          {loading && <p>Loading article...</p>}
          {error && <ArticleError error={error} url={url} />}
          {!loading && !error && (
            <>
              <Panel>
                <h3>{title}</h3>
                <p><em>{author}</em></p>
              </Panel>

              <Preview ref={previewRef} dangerouslySetInnerHTML={{ __html: sanitizedHtml }} />

              {missingHighlights.length > 0 && (
                <WarningPanel>
                  <p>⚠️ Some highlights were not found:</p>
                  <ul>{missingHighlights.map(h => <li key={h.id}><code>{h.text}</code></li>)}</ul>
                </WarningPanel>
              )}

              <HighlightEditor
                htmlContent={html}
                initialHighlights={highlightData}
                onHighlightsChange={setHighlightData}
                onShare={() => { toast.success("✅ Highlight ready to share."); return; }}
              />
            </>
          )}
        </>
      )}

      <Panel>
        <Row>
          <Input
            type="text"
            placeholder="Optional anchor text for sharing"
            value={anchorInput}
            onChange={(e) => {
              setAnchorInput(e.target.value);
              onAnchorEdit?.(e.target.value);
            }}
          />
          <button onClick={copyAnchorLink}>
            📋 {copied ? "Copied!" : "Copy Anchor"}
          </button>
          <button onClick={() => setShowQR(!showQR)}>🧾 {showQR ? "Hide QR" : "Show QR"}</button>
        </Row>
        {showQR && shareUrl && (
          <img
            src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(shareUrl)}`}
            alt="QR Code"
            style={{ marginTop: '0.8rem', borderRadius: '0.4rem' }}
          />
        )}
      </Panel>

      {supportMemes && (
        <Panel>
          <h3>🖼️ Auto Meme Generator</h3>
          <button onClick={() => setShowMemeModal(true)}>Generate Meme</button>
          {showMemeModal && (
            <MemeModal
              articleUrl={url}
              highlightText={highlightData[0]?.text || ""}
              onClose={() => setShowMemeModal(false)}
            />
          )}
        </Panel>
      )}

      <Footer />
    </Container>
  );
}
