import React, { useRef, useState } from "react";
import styled from "styled-components";
import { toPng } from "html-to-image";

interface MemeModalProps {
  highlightText: string;
  articleUrl: string;
  onClose: () => void;
}

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 999;
`;

const MemeWrapper = styled.div`
  border: 2px dashed #ccc;
  padding: 1.2rem;
  border-radius: 10px;
  background: #fefefe;
  display: flex;
  flex-direction: column;
  align-items: center;
  max-width: 600px;
  min-width: 320px;
  margin: 0 auto;
  position: relative;
`;

const MemeImage = styled.div`
  width: 100%;
  padding-top: 56.25%;
  background: #e0e0e0;
  position: relative;
  border-radius: 8px;
  margin-bottom: 1rem;
`;

const MemeText = styled.div`
  font-size: 1.1rem;
  font-weight: 600;
  text-align: center;
  margin-bottom: 0.5rem;
  color: #222;
`;

const LinkBox = styled.div`
  font-size: 0.9rem;
  color: #555;
  background: #f4f4f4;
  padding: 0.4em 0.8em;
  border-radius: 6px;
  word-break: break-all;
`;

const CloseBtn = styled.button`
  position: absolute;
  top: 0.7em;
  right: 0.7em;
  background: none;
  border: none;
  font-size: 1.7rem;
  color: #888;
  cursor: pointer;
`;

const MemeGenerator = ({ highlightText, articleUrl, onClose }: MemeModalProps) => {
  const [generated, setGenerated] = useState(false);
  const memeRef = useRef<HTMLDivElement>(null);

  const handleGenerate = () => {
    setGenerated(true);
  };

  const handleExport = async () => {
    if (!memeRef.current) return;

    try {
      const dataUrl = await toPng(memeRef.current, { cacheBust: true });
      const link = document.createElement("a");
      link.download = "jump2-meme.png";
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error("Failed to export meme:", err);
    }
  };

  return (
    <Overlay>
      <MemeWrapper>
        <CloseBtn onClick={onClose} title="Close" aria-label="Close">×</CloseBtn>
        {!generated ? (
          <button
            onClick={handleGenerate}
            style={{
              padding: "0.6em 1.2em",
              fontSize: "1rem",
              background: "#1e3af2",
              color: "#fff",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer",
            }}
          >
            🚀 Generate Meme
          </button>
        ) : (
          <>
            <div ref={memeRef} style={{ width: "100%" }}>
              <MemeImage>
                <div
                  style={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    fontSize: "1.2rem",
                    color: "#333",
                    padding: "1em",
                    background: "rgba(255,255,255,0.85)",
                    borderRadius: "8px",
                    textAlign: "center",
                    maxWidth: "90%",
                    fontWeight: 500,
                    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                  }}
                >
                  “{highlightText}”
                </div>
              </MemeImage>
              <MemeText>Jumped from:</MemeText>
              <LinkBox>{articleUrl}</LinkBox>
            </div>

            <button
              onClick={handleExport}
              style={{
                marginTop: "1rem",
                padding: "0.6em 1.2em",
                background: "#10b981",
                color: "#fff",
                border: "none",
                borderRadius: "6px",
                cursor: "pointer",
                fontWeight: 600,
              }}
            >
              ⬇️ Download Meme
            </button>
          </>
        )}
      </MemeWrapper>
    </Overlay>
  );
};

export default MemeGenerator;