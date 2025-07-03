import React, { useRef } from "react";
import styled from "styled-components";
import { toPng } from "html-to-image";
import QRCode from "react-qr-code";

// --- Styled Components ---
const Wrapper = styled.div`
  text-align: center;
  margin-top: 2rem;
`;

const CardWrapper = styled.div`
  width: 1200px;
  height: 630px;
  padding: 60px 80px;
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 16px;
  color: #111827;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  box-shadow: 0 6px 36px rgba(0, 0, 0, 0.12);
  font-family: "Segoe UI", Roboto, sans-serif;
  position: relative;
`;

const Quote = styled.blockquote`
  font-size: 2.8rem;
  font-weight: 600;
  line-height: 1.45;
  max-height: 75%;
  overflow: hidden;
  text-overflow: ellipsis;
  color: #1e293b;
`;

const Footer = styled.footer`
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  font-size: 1.05rem;
  font-weight: 500;
  opacity: 0.85;
`;

const QR = styled.div`
  width: 80px;
  height: 80px;
`;

const ButtonGroup = styled.div`
  margin-top: 1.5rem;
  display: flex;
  gap: 1rem;
  justify-content: center;
`;

const Button = styled.button`
  background: #1e293b;
  color: white;
  padding: 0.65rem 1.4rem;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  transition: background 0.2s ease;

  &:hover {
    background: #334155;
  }

  &:focus {
    outline: 2px solid #3b82f6;
    outline-offset: 3px;
  }
`;

// --- Props Interface ---
type ShareCardGeneratorProps = {
  highlightText: string;
  articleUrl: string;
  source?: string;
  onClose: () => void;
};

// --- Component ---
export default function ShareCardGenerator({
  highlightText,
  articleUrl,
  source = "Jump2 Highlight",
  onClose,
}: ShareCardGeneratorProps) {
  const ref = useRef<HTMLDivElement>(null);

  const handleDownload = async () => {
    if (!ref.current) return;
    try {
      const dataUrl = await toPng(ref.current);
      const link = document.createElement("a");
      link.href = dataUrl;
      link.download = "highlight-card.png";
      link.click();
    } catch (error) {
      alert("Download failed. Please try again.");
      console.error("Error generating PNG:", error);
    }
  };

  return (
    <Wrapper>
      <CardWrapper ref={ref}>
        <Quote>“{highlightText}”</Quote>
        <Footer>
          <div>{source}</div>
          <div style={{ display: "flex", alignItems: "center", gap: "0.8rem" }}>
            <span>jump2.link</span>
            <QR>
              <QRCode value={articleUrl} size={80} />
            </QR>
          </div>
        </Footer>
      </CardWrapper>

      <ButtonGroup>
        <Button onClick={handleDownload}>📥 Download as PNG</Button>
        <Button onClick={onClose}>❌ Close</Button>
      </ButtonGroup>
    </Wrapper>
  );
}
