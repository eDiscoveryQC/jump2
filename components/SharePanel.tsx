import React from "react";
import styled from "styled-components";

const Panel = styled.div`
  display: flex;
  gap: 0.6rem;
  background: #f1f5f9;
  padding: 0.6rem 1rem;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0,0,0,0.1);
  align-items: center;
  font-size: 0.95rem;
  margin-top: 0.5rem;
`;

const Button = styled.button`
  border: none;
  background: #1e293b;
  color: white;
  padding: 0.4rem 0.8rem;
  border-radius: 6px;
  font-weight: 600;
  cursor: pointer;
  font-size: 0.9rem;
  display: flex;
  align-items: center;
  gap: 0.4rem;
`;

type Props = {
  highlightText: string;
  articleUrl: string;
  onMeme: () => void;
  onCard: () => void;
  onVoice: () => void;
};

export default function SharePanel({
  highlightText,
  articleUrl,
  onMeme,
  onCard,
  onVoice,
}: Props) {
  const copyLink = () => {
    const link = `${articleUrl}#:~:text=${encodeURIComponent(highlightText)}`;
    navigator.clipboard.writeText(link);
  };

  return (
    <Panel>
      <Button onClick={copyLink}>🔗 Link</Button>
      <Button onClick={onMeme}>📸 Meme</Button>
      <Button onClick={onCard}>🪪 Card</Button>
      <Button onClick={onVoice}>🔊 Voice</Button>
    </Panel>
  );
}
