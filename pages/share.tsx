// pages/share.tsx
import React, { useState } from 'react';
import styled, { keyframes } from 'styled-components';
import Head from 'next/head';
import SmartInputPanel from '@/components/SmartInputPanel';
import ArticlePreviewFull from '@/components/ArticlePreviewFull';
import Footer from '@/components/Footer';

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
  background: linear-gradient(to right, #0f172a, #1e293b);
  color: #ffffff;
  animation: ${fadeIn} 0.6s ease-out;
`;

const Header = styled.header`
  padding: 2rem;
  text-align: center;
  animation: ${fadeIn} 0.8s ease forwards;
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

const Body = styled.main`
  flex: 1;
  padding: 2rem 1rem 4rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  animation: ${fadeIn} 1s ease forwards;
`;

const Divider = styled.hr`
  width: 100%;
  max-width: 800px;
  border: none;
  border-top: 1px solid #334155;
  margin: 3rem 0 2rem;
`;

const PreviewWrapper = styled.div`
  width: 100%;
  max-width: 1200px;
  margin-top: 2rem;
`;

export default function SharePage() {
  const [shareUrl, setShareUrl] = useState<string>('');

  return (
    <PageWrapper>
      <Head>
        <title>Jump2 Share — Smarter Sharing Starts Here</title>
        <meta name="description" content="Jump2 lets you create highlight-rich shareable links to videos, articles, and more." />
      </Head>
      <Header>
        <Title>Jump2 Share</Title>
        <Subtitle>
          Paste any article, YouTube link, or content URL. Highlight what matters. Create a shareable smart link. Welcome to the world's first ShareTech platform.
        </Subtitle>
      </Header>

      <Body>
        <SmartInputPanel onShareGenerated={(url) => setShareUrl(url)} />

        {shareUrl && (
          <>
            <Divider />
            <PreviewWrapper>
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
    </PageWrapper>
  );
}
