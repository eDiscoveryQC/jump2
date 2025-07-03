import React, { useState, useEffect, useRef } from "react";
import styled, { keyframes } from "styled-components";
import DOMPurify from "isomorphic-dompurify";
import toast from "react-hot-toast";
import ArticleError from "./ArticleError";
import HighlightEditor, { Highlight } from "./HighlightEditor";
import MemeModal from "./MemeModal";
import Footer from "./Footer";

// Animations
const fadeIn = keyframes`from { opacity: 0 } to { opacity: 1 }`;
const pulse = keyframes`0%,100%{transform:scale(1)}50%{transform:scale(1.05)}`;

// Utils
function extractYouTubeID(url: string): string {
  const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|v\/))([\w-]{11})/);
  return match?.[1] ?? "";
}

function parseTimeInput(input: string): number | null {
  if (/^\d+$/.test(input)) return parseInt(input, 10);
  const [m, s] = input.split(":").map(Number);
  return m >= 0 && !isNaN(s) ? m * 60 + s : null;
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

// Styled components
const Container = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr;
  max-width: 1200px;
  margin: 2rem auto;
  gap: 1.5rem;
  animation: ${fadeIn} 0.6s ease-in;
  font-family: 'Segoe UI', sans-serif;
  color: #1e293b;
`;

const ContentPanel = styled.div`
  background: #ffffff;
  padding: 2rem;
  border-radius: 0.75rem;
  box-shadow: 0 2px 20px rgba(0,0,0,0.05);
  overflow-y: auto;
  max-height: 85vh;
`;

const SidePanel = styled.div`
  background: #f1f5f9;
  padding: 1.5rem;
  border-radius: 0.75rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  box-shadow: 0 2px 16px rgba(0,0,0,0.05);
`;

const Preview = styled.div`
  font-size: 1.05rem;
  line-height: 1.7;
  .jump2-highlight {
    animation: ${pulse} 1s ease;
    cursor: pointer;
    border-radius: 0.25rem;
    padding: 0.05rem 0.3rem;
  }
`;

const FrameWrapper = styled.div`
  position: relative;
  padding-bottom: 56.25%;
  height: 0;
  margin-bottom: 1rem;
  iframe {
    position: absolute;
    width: 100%;
    height: 100%;
    border: none;
  }
`;

const Input = styled.input`
  padding: 0.6rem;
  font-size: 0.95rem;
  border-radius: 0.5rem;
  border: 1px solid #94a3b8;
  flex: 1;
  background: #fff;
  color: #0f172a;
`;

const Button = styled.button`
  background: #0ea5e9;
  color: white;
  padding: 0.6rem 1rem;
  font-size: 0.95rem;
  border-radius: 0.5rem;
  border: none;
  cursor: pointer;
  &:hover {
    background: #0284c7;
  }
`;

const Row = styled.div<{ justify?: string }>`
  display: flex;
  justify-content: ${({ justify }) => justify || "space-between"};
  align-items: center;
  flex-wrap: wrap;
  gap: 0.5rem;
`;

const WarningPanel = styled.div`
  background: #fef2f2;
  color: #b91c1c;
  padding: 1rem;
  border: 1px solid #fca5a5;
  border-radius: 0.5rem;
  margin-top: 1rem;
`;

// Props
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
  const isYouTube = /youtu/.test(url);
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

  const sanitizedHtml = sanitizeWithHighlights(html, highlightData);
  const missingHighlights = highlightData.filter(h => !html.toLowerCase().includes(h.text.trim().toLowerCase()));

  useEffect(() => {
    if (isYouTube || !supportArticles) return;
    setLoading(true);
    fetch(`/api/parse?url=${encodeURIComponent(url)}&engine=${scrapeEngine}`)
      .then(res => res.json())
      .then((data) => {
        setHtml(data.article?.content ?? "");
        setTitle(data.article?.title ?? "");
        setAuthor(data.article?.author ?? "");
        setError(null);
      })
      .catch(() => setError("Failed to parse article."))
      .finally(() => setLoading(false));
  }, [url]);

  const handleGenerateTimestamp = () => {
    const secs = parseTimeInput(manualTime);
    if (secs === null) return toast.error("Invalid time format");
    const link = `${url.split("&")[0]}&t=${secs}s`;
    navigator.clipboard.writeText(link);
    toast.success("📍 Timestamp copied!");
    onGenerateLink?.(link);
  };

  const handleCopyAnchor = () => {
    const anchor = `${url}#:~:text=${encodeURIComponent(anchorInput)}`;
    navigator.clipboard.writeText(anchor);
    toast.success("🔗 Anchor copied!");
    setShareUrl(anchor);
    setCopied(true);
    onAnchorEdit?.(anchorInput);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <Container>
      <ContentPanel>
        <h2>🔍 Jump2 Preview</h2>
        {isYouTube && enableYouTubeTimestamp && (
          <FrameWrapper>
            <iframe
              src={`https://www.youtube.com/embed/${extractYouTubeID(url)}`}
              title="YouTube Video"
              allowFullScreen
            />
          </FrameWrapper>
        )}
        {!isYouTube && supportArticles && (
          <>
            {loading && <p>Loading...</p>}
            {error && <ArticleError error={error} url={url} />}
            {!loading && !error && (
              <>
                <h3>{title}</h3>
                <em>{author}</em>
                <Preview dangerouslySetInnerHTML={{ __html: sanitizedHtml }} />
                {missingHighlights.length > 0 && (
                  <WarningPanel>
                    ⚠️ Some highlights may not be visible — try scrolling or re-highlighting.
                  </WarningPanel>
                )}
              </>
            )}
          </>
        )}
      </ContentPanel>

      <SidePanel>
        {isYouTube && enableYouTubeTimestamp && (
          <>
            <Input
              type="text"
              placeholder="e.g. 1:30"
              value={manualTime}
              onChange={(e) => setManualTime(e.target.value)}
            />
            <Button onClick={handleGenerateTimestamp}>⏱ Generate Timestamp</Button>
          </>
        )}

        {!isYouTube && supportArticles && (
          <HighlightEditor
            htmlContent={html}
            initialHighlights={highlightData}
            onHighlightsChange={setHighlightData}
            onShare={() => toast.success("✅ Highlights updated!")}
          />
        )}

        <Input
          type="text"
          placeholder="Anchor text"
          value={anchorInput}
          onChange={(e) => setAnchorInput(e.target.value)}
        />
        <Row>
          <Button onClick={handleCopyAnchor}>{copied ? "Copied!" : "📋 Copy Anchor"}</Button>
          <Button onClick={() => setShowQR(prev => !prev)}>🧾 {showQR ? "Hide QR" : "Show QR"}</Button>
        </Row>
        {showQR && shareUrl && (
          <img
            src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(shareUrl)}`}
            alt="QR Code"
            style={{ alignSelf: "center", marginTop: "1rem" }}
          />
        )}

        {supportMemes && (
          <>
            <Button onClick={() => setShowMemeModal(true)}>🖼 Generate Meme</Button>
            {showMemeModal && (
              <MemeModal
                articleUrl={url}
                highlightText={highlightData[0]?.text ?? ""}
                onClose={() => setShowMemeModal(false)}
              />
            )}
          </>
        )}
      </SidePanel>

      <Footer />
    </Container>
  );
}
