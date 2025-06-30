import React from "react";
import styled from "styled-components";
import Head from "next/head";
import ArticlePreviewFull from "@/components/ArticlePreviewFull";

const PageWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  background: linear-gradient(to right, #0f172a, #1e293b);
  color: #ffffff;
  min-height: 100vh;
  padding: 4rem 1.5rem 6rem;
`;

const Title = styled.h1`
  font-size: 3.6rem;
  font-weight: 900;
  letter-spacing: -1.4px;
  margin-bottom: 1.4rem;
  color: #facc15;
  text-shadow: 0 2px 6px #0ea5e9aa;
`;

const Subtitle = styled.h2`
  font-size: 1.75rem;
  font-weight: 500;
  max-width: 860px;
  line-height: 1.7;
  text-align: center;
  color: #fef08a;
  margin-bottom: 2.5rem;
`;

const CTA = styled.div`
  background: #1e293b;
  padding: 1.4rem 2rem;
  border: 1px solid #334155;
  border-radius: 0.8rem;
  font-size: 1.15rem;
  margin-bottom: 2.5rem;
  color: #e2e8f0;
  text-align: center;
  max-width: 740px;
  box-shadow: 0 0 14px #0ea5e970;
`;

const Divider = styled.hr`
  width: 100%;
  max-width: 780px;
  border: none;
  border-top: 1px solid #334155;
  margin: 3rem 0;
`;

const FooterNote = styled.div`
  font-size: 1rem;
  color: #94a3b8;
  text-align: center;
  margin-top: 4rem;
`;

export default function Share() {
  return (
    <>
      <Head>
        <title>Create & Share – Jump2</title>
        <meta name="description" content="Highlight. Meme. Timestamp. Share the moment that matters. Welcome to Share-Tech." />
        <meta property="og:title" content="Jump2 – Highlight Anything, Share Everything" />
        <meta property="og:image" content="https://jump2.link/share-og.jpg" />
        <meta property="og:url" content="https://jump2.link/share" />
        <meta property="og:description" content="Built for creators and curators — Jump2 lets you clip, highlight, and share precise content from any source." />
      </Head>

      <PageWrapper>
        <Title>🔗 Create Your Jump2</Title>
        <Subtitle>
          Paste any content. Clip the part that matters. Share it like a pro.
        </Subtitle>

        <CTA>
          🚀 Paste your link above, then highlight key content, add a meme, or timestamp — and we’ll generate a smart share link, ready to go viral.
        </CTA>

        <ArticlePreviewFull />

        <Divider />

        <FooterNote>
          Jump2 is the first Share-Tech platform — Built for viral clarity.
        </FooterNote>
      </PageWrapper>
    </>
  );
}
