// components/MemeGenerator.tsx
import React, { useState } from "react";
import styled from "styled-components";

interface MemeModalProps {
  highlightText: string;
  articleUrl: string;
}

const MemeWrapper = styled.div`
  border: 2px dashed #ccc;
  padding: 1.2rem;
  border-radius: 10px;
  background: #fefefe;
  display: flex;
  flex-direction: column;
  align-items: center;
  max-width: 600px;
  margin: 0 auto;
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

const MemeGenerator = ({ highlightText, articleUrl }: MemeModalProps) => {
  const [generated, setGenerated] = useState(false);

  const handleGenerate = () => {
    setGenerated(true);
  };

  return (
    <MemeWrapper>
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
          <MemeImage>
            <div style={{
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
              boxShadow: "0 2px 8px rgba(0,0,0,0.1)"
            }}>
              “{highlightText}”
            </div>
          </MemeImage>
          <MemeText>Jumped from:</MemeText>
          <LinkBox>{articleUrl}</LinkBox>
        </>
      )}
    </MemeWrapper>
  );
};

export default MemeGenerator;
