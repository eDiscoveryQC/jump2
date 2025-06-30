import React, { useEffect, useState } from "react";
import styled from "styled-components";

interface MemeGeneratorProps {
  highlightText: string;
  articleUrl: string;
  onClose: () => void;
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const MemeImage = styled.img`
  width: 100%;
  max-width: 100%;
  border-radius: 10px;
  margin: 1rem 0;
  border: 2px solid #eee;
`;

const ButtonRow = styled.div`
  display: flex;
  gap: 0.5em;
  margin-top: 1rem;
`;

const Button = styled.button`
  padding: 0.6em 1.2em;
  background-color: #1e4268;
  color: #fff;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 600;
  font-size: 0.95rem;

  &:hover {
    background-color: #173352;
  }
`;

const MemeGenerator = ({ highlightText, articleUrl, onClose }: MemeGeneratorProps) => {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const generate = async () => {
      setLoading(true);
      try {
        const res = await fetch("/api/meme", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            text: highlightText,
            sourceUrl: articleUrl,
            theme: "blue-yellow",
          }),
        });

        if (!res.ok) throw new Error("Image generation failed");
        const blob = await res.blob();
        setImageUrl(URL.createObjectURL(blob));
      } catch (err) {
        alert("Failed to generate meme.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    generate();
  }, [highlightText, articleUrl]);

  const handleDownload = () => {
    if (!imageUrl) return;
    const link = document.createElement("a");
    link.href = imageUrl;
    link.download = "jump2-meme.png";
    link.click();
  };

  const handleShareToX = () => {
    const tweet = `“${highlightText}”\n\nvia jump2.link`;
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(tweet)}&url=${encodeURIComponent(articleUrl)}`;
    window.open(url, "_blank");
  };

  return (
    <Container>
      {loading ? (
        <p>Generating meme...</p>
      ) : imageUrl ? (
        <>
          <MemeImage src={imageUrl} alt="Jump2 Meme" />
          <ButtonRow>
            <Button onClick={handleDownload}>⬇️ Download Meme</Button>
            <Button onClick={handleShareToX}>🚀 Share to X</Button>
          </ButtonRow>
        </>
      ) : (
        <p>Error loading image.</p>
      )}
    </Container>
  );
};

export default MemeGenerator;
