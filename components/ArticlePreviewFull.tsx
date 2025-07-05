// components/ArticlePreviewFull.tsx
import React, { useState, useEffect } from "react";
import styled, { keyframes } from "styled-components";
import DOMPurify from "isomorphic-dompurify";
import toast from "react-hot-toast";
import dynamic from "next/dynamic";
import ArticleError from "./ArticleError";
import HighlightEditor, { Highlight } from "./HighlightEditor";
import MemeModal from "./MemeModal";

const QRCode = dynamic(() => import("qrcode.react").then((mod) => mod.QRCodeSVG), { ssr: false });

const fadeIn = keyframes`from { opacity: 0 } to { opacity: 1 }`;
const pulse = keyframes`0%,100%{transform:scale(1)}50%{transform:scale(1.05)}`;

function extractYouTubeID(url: string): string {
  const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|v\/))([\w-]{11})/);
  return match?.[1] ?? "";
}

function parseTimeInput(input: string): number | null {
  if (/^\d+$/.test(input)) return parseInt(input, 10);
  const [m, s] = input.split(":" ).map(Number);
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

const Container = styled.div`
  display: flex;
  flex-direction: column;
  max-width: 1280px;
  margin: 2rem auto;
  padding: 1rem;
  gap: 2rem;
  animation: ${fadeIn} 0.6s ease-in;
  font-family: 'Segoe UI', sans-serif;
  color: #1e293b;
`;

const Title = styled.h2`
  font-size: 2rem;
  background: linear-gradient(90deg, #0ea5e9, #9333ea);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  font-weight: 800;
  margin-bottom: 1.25rem;
`;

const LayoutSplit = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 2rem;
  @media (max-width: 960px) {
    grid-template-columns: 1fr;
  }
`;

const ContentPanel = styled.div`
  background: #ffffff;
  padding: 2rem;
  border-radius: 1rem;
  box-shadow: 0 2px 24px rgba(0,0,0,0.05);
  overflow-y: auto;
  scrollbar-width: thin;
  scrollbar-color: #94a3b8 #f1f5f9;
`;

const SidePanel = styled.div`
  background: #f1f5f9;
  padding: 1.5rem;
  border-radius: 1rem;
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  box-shadow: 0 2px 16px rgba(0,0,0,0.04);
  @media (max-width: 640px) {
    padding: 1rem;
  }
`;

const Preview = styled.div`
  font-size: 1.1rem;
  line-height: 1.75;
  .jump2-highlight {
    animation: ${pulse} 1s ease;
    cursor: pointer;
    border-radius: 0.3rem;
    padding: 0.1rem 0.4rem;
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
  padding: 0.7rem;
  font-size: 1rem;
  border-radius: 0.6rem;
  border: 1px solid #94a3b8;
  background: #fff;
  color: #0f172a;
  width: 100%;
`;

const Button = styled.button`
  background: #0ea5e9;
  color: white;
  padding: 0.7rem 1.2rem;
  font-size: 1rem;
  border-radius: 0.6rem;
  border: none;
  cursor: pointer;
  width: 100%;
  transition: background 0.2s;
  &:hover {
    background: #0284c7;
  }
`;

const Row = styled.div`
  display: flex;
  gap: 0.75rem;
  flex-direction: column;
`;

const WarningPanel = styled.div`
  background: #fef2f2;
  color: #b91c1c;
  padding: 1rem;
  border: 1px solid #fca5a5;
  border-radius: 0.6rem;
  margin-top: 1rem;
`;

interface Props {
  url: string;
  initialHighlights?: Highlight[];
  onGenerateLink?: (link: string) => void;
  onAnchorEdit?: (anchor: string) => void;
  scrapeEngine?: string;
  enableYouTubeTimestamp?: boolean;
  supportArticles?: boolean;
  supportMemes?: boolean;
}

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
      <LayoutSplit>
        <ContentPanel>
          <Title>🔍 Jump2 Preview</Title>
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
              {loading && <p>Loading article preview...</p>}
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
          {shareUrl && (
            <small style={{ wordBreak: 'break-all', color: '#64748b', marginTop: '0.5rem' }}>
              🔗 {shareUrl}
            </small>
          )}
          {showQR && shareUrl && (
            <div style={{ textAlign: "center", marginTop: "1rem", padding: "1rem", background: "#fff", borderRadius: "0.75rem", boxShadow: "0 4px 20px rgba(0,0,0,0.1)" }}>
              <QRCode value={shareUrl} size={180} />
            </div>
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
      </LayoutSplit>
    </Container>
  );
}
