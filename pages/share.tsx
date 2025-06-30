import React from "react";
import styled, { keyframes } from "styled-components";
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
  font-size: 3.4rem;
  font-weight: 900;
  letter-spacing: -1.2px;
  margin-bottom: 1.6rem;
  color: #facc15;
`;

const Subtitle = styled.h2`
  font-size: 1.7rem;
  font-weight: 500;
  max-width: 820px;
  line-height: 1.65;
  text-align: center;
  color: #fef08a;
`;

const Divider = styled.hr`
  width: 100%;
  max-width: 780px;
  border: none;
  border-top: 1px solid #334155;
  margin: 3.2rem 0;
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

        <Divider />

        <ArticlePreviewFull />

        <FooterNote>
          Jump2 is the first Share-Tech platform — Built for viral clarity.
        </FooterNote>
      </PageWrapper>
    </>
  );
}
