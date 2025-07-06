// pages/share.tsx
import React, { useState, useRef, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import Head from 'next/head';
import SmartInputPanel from '@/components/SmartInputPanel';
import ArticlePreviewFull from '@/components/ArticlePreviewFull';
import Footer from '@/components/Footer';
import { Toaster, toast } from 'react-hot-toast';

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
`;

const pulseGradient = keyframes`
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
`;

const PageWrapper = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background: radial-gradient(circle at top left, #1e293b, #0f172a);
  color: #ffffff;
  position: relative;
`;

const StickyNav = styled.div`
  width: 100%;
  padding: 1rem 2rem;
  background: #0f172a;
  border-bottom: 1px solid #1e293b;
  position: sticky;
  top: 0;
  z-index: 1000;
  font-weight: bold;
  font-size: 1.2rem;
`;

const Header = styled.header`
  padding: 3rem 2rem 2rem;
  text-align: center;
`;

const Title = styled.h1`
  font-size: 3.6rem;
  font-weight: 900;
  letter-spacing: -1.4px;
  background: linear-gradient(270deg, #22d3ee, #9333ea, #3b82f6);
  background-size: 600% 600%;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  animation: ${pulseGradient} 8s ease infinite;
`;

const Subtitle = styled.p`
  font-size: 1.25rem;
  margin-top: 1rem;
  color: #cbd5e1;
  max-width: 680px;
  margin-left: auto;
  margin-right: auto;
`;

const Callout = styled.div`
  margin-top: 2rem;
  background: #1e293b;
  padding: 1.5rem;
  border: 1px solid #334155;
  border-radius: 1rem;
  max-width: 680px;
  margin-left: auto;
  margin-right: auto;
  font-size: 1.05rem;
  color: #94a3b8;
  animation: ${fadeIn} 1s ease forwards;
`;

const Body = styled.main`
  flex: 1;
  padding: 3rem 1rem 5rem;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Divider = styled.hr`
  width: 100%;
  max-width: 800px;
  border: none;
  border-top: 1px solid #334155;
  margin: 4rem 0 2rem;
`;

const PreviewWrapper = styled.div`
  width: 100%;
  max-width: 1200px;
  margin-top: 2rem;
  animation: ${fadeIn} 1s ease-in-out;
`;

export default function SharePage() {
  const [shareUrl, setShareUrl] = useState<string>('');
  const previewRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (shareUrl && previewRef.current) {
      previewRef.current.scrollIntoView({ behavior: 'smooth' });
      toast.success('Preview loaded successfully!');
    }
  }, [shareUrl]);

  return (
    <PageWrapper>
      <Head>
        <title>Jump2 Share — Smarter Sharing Starts Here</title>
        <meta name="description" content="Jump2 lets you create highlight-rich shareable links to videos, articles, and more." />
      </Head>
      <StickyNav>🚀 Jump2</StickyNav>

      <Header>
        <Title>Jump2 Share</Title>
        <Subtitle>
          Paste any article, YouTube link, or content URL. Highlight what matters. Create a shareable smart link.
        </Subtitle>
        <Callout>
          ✨ Tip: After pasting a URL or uploading a file, your preview will appear automatically. Jump2 makes content sharing human again.
        </Callout>
      </Header>

      <Body>
        <SmartInputPanel onShareGenerated={(url) => setShareUrl(url)} />

        {shareUrl && (
          <>
            <Divider />
            <PreviewWrapper ref={previewRef}>
              <ArticlePreviewFull
                url={shareUrl}
                supportArticles
                enableYouTubeTimestamp
                supportMemes
              />
            </PreviewWrapper>
          </>
        )}
      </Body>

      <Footer contactEmail="support@jump2share.com" />
      <Toaster position="bottom-center" />
    </PageWrapper>
  );
}
