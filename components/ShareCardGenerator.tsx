import React, { useRef } from "react";
import styled from "styled-components";
import { toPng } from "html-to-image";
import QRCode from "qrcode.react";

// Styled card wrapper
const CardWrapper = styled.div`
  width: 1200px;
  height: 630px;
  padding: 60px 80px;
  box-sizing: border-box;
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 16px;
  font-family: "Segoe UI", Roboto, sans-serif;
  color: #111827;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  position: relative;
  box-shadow: 0 4px 24px rgba(0,0,0,0.08);
`;

// Quote text
const Quote = styled.blockquote`
  font-size: 2.8rem;
  font-weight: 600;
  line-height: 1.4;
  max-height: 70%;
  overflow: hidden;
  text-overflow: ellipsis;
`;

// Footer branding
const Footer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  font-size: 1rem;
  font-weight: 500;
  opacity: 0.85;
`;

const QR = styled.div`
  width: 80px;
  height: 80px;
`;

// Download button
const Button = styled.button`
  margin-top: 1rem;
  background: #1e293b;
  color: white;
  padding: 0.5rem 1.2rem;
  border: none;
  border-radius: 6px;
  font-weight: 600;
  cursor: pointer;
  font-size: 1rem;
`;

type Props = {
  highlightText: string;
  articleUrl: string;
  source?: string;
  onClose: () => void;
};

export default function ShareCardGenerator({
  highlightText,
  articleUrl,
  source = "Jump2 Highlight",
  onClose,
}: Props) {
  const ref = useRef<HTMLDivElement>(null);

  const handleDownload = async () => {
    if (!ref.current) return;
    const dataUrl = await toPng(ref.current);
    const a = document.createElement("a");
    a.href = dataUrl;
    a.download = "highlight-card.png";
    a.click();
  };

  return (
    <div style={{ textAlign: "center", marginTop: "2rem" }}>
      <CardWrapper ref={ref}>
        <Quote>“{highlightText}”</Quote>
        <Footer>
          <div>{source}</div>
          <div style={{ display: "flex", alignItems: "center", gap: "0.8rem" }}>
            <span>jump2.link</span>
            <QR>
              <QRCode value={articleUrl} size={80} includeMargin />
            </QR>
          </div>
        </Footer>
      </CardWrapper>

      <Button onClick={handleDownload}>📥 Download as PNG</Button>
      <Button style={{ marginLeft: 12 }} onClick={onClose}>❌ Close</Button>
    </div>
  );
}
