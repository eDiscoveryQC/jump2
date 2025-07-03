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
  font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
`;

const MemeImage = styled.img`
  width: 100%;
  max-width: 100%;
  border-radius: 12px;
  margin: 1.5rem 0;
  border: 2px solid #e2e8f0;
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.08);
`;

const ButtonRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.8em;
  margin-top: 1.2rem;
  justify-content: center;
`;

const Button = styled.button`
  padding: 0.7em 1.4em;
  background-color: #0ea5e9;
  color: #ffffff;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 600;
  font-size: 1rem;
  transition: background-color 0.2s ease;

  &:hover {
    background-color: #0284c7;
  }

  &:disabled {
    background-color: #94a3b8;
    cursor: not-allowed;
  }
`;

const ErrorText = styled.p`
  color: #dc2626;
  font-weight: 500;
`;

const LoadingText = styled.p`
  color: #0ea5e9;
  font-weight: 600;
`;

const MemeGenerator = ({ highlightText, articleUrl, onClose }: MemeGeneratorProps) => {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const generate = async () => {
      setLoading(true);
      setError(null);
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
      } catch (err: any) {
        setError("Failed to generate meme. Please try again later.");
        console.error("Meme generation error:", err);
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
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
      tweet
    )}&url=${encodeURIComponent(articleUrl)}`;
    window.open(url, "_blank");
  };

  return (
    <Container>
      {loading && <LoadingText>🚧 Generating meme...</LoadingText>}
      {!loading && imageUrl && (
        <>
          <MemeImage src={imageUrl} alt="Jump2 Meme" />
          <ButtonRow>
            <Button onClick={handleDownload}>⬇️ Download Meme</Button>
            <Button onClick={handleShareToX}>🚀 Share to X</Button>
            <Button onClick={onClose}>❌ Close</Button>
          </ButtonRow>
        </>
      )}
      {!loading && error && <ErrorText>{error}</ErrorText>}
    </Container>
  );
};

export default MemeGenerator;
