import React, { useState } from "react";
import styled from "styled-components";
import SmartInputPanel from "@/components/SmartInputPanel";

const PageWrapper = styled.div`
  background: linear-gradient(135deg, #0f172a, #1e293b);
  color: #ffffff;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
`;

const Content = styled.main`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 5rem 2rem 3rem;

  @media (max-width: 768px) {
    padding: 3rem 1rem 2rem;
  }
`;

const Title = styled.h1`
  font-size: 2.8rem;
  font-weight: 800;
  margin-bottom: 1.5rem;
  color: #facc15;
  text-align: center;
  text-shadow: 0 0 20px #0ea5e977;
`;

const Description = styled.p`
  font-size: 1.1rem;
  color: #cbd5e1;
  text-align: center;
  max-width: 720px;
  margin-bottom: 3rem;
`;

const ShareCard = styled.div`
  background: #0f172a;
  border: 1px solid #334155;
  padding: 1.75rem;
  border-radius: 1rem;
  margin-top: 2.5rem;
  text-align: center;
  max-width: 720px;
  width: 100%;
  animation: fadeIn 0.6s ease;
`;

const ShareLink = styled.code`
  font-family: monospace;
  display: block;
  margin: 1rem 0;
  font-size: 1rem;
  word-break: break-all;
  color: #38bdf8;
`;

const CopyButton = styled.button`
  background: #0ea5e9;
  color: white;
  font-size: 1rem;
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 0.6rem;
  cursor: pointer;
  transition: background 0.2s;
  font-weight: 600;

  &:hover {
    background: #0284c7;
  }
`;

export default function SharePage() {
  const [generatedLink, setGeneratedLink] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const handleShareGenerated = (link: string) => {
    const fullLink = `${window.location.origin}${link}`;
    setGeneratedLink(fullLink);
    setCopied(false);
  };

  const handleCopy = () => {
    if (generatedLink) {
      navigator.clipboard.writeText(generatedLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    }
  };

  return (
    <PageWrapper>
      <Content>
        <Title>🔗 Create a Smart Jump2 Link</Title>
        <Description>
          Paste any article or video URL below. Instantly generate a smart, shareable link that highlights the exact quote or timestamp.
        </Description>

        <SmartInputPanel onShareGenerated={handleShareGenerated} />

        {generatedLink && (
          <ShareCard>
            <strong>✅ Your Jump2 Link is Ready:</strong>
            <ShareLink>{generatedLink}</ShareLink>
            <CopyButton onClick={handleCopy}>
              {copied ? "Copied!" : "📋 Copy Link"}
            </CopyButton>
          </ShareCard>
        )}
      </Content>
    </PageWrapper>
  );
}
