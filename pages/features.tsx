import React from "react";
import styled, { keyframes } from "styled-components";
import Head from "next/head";

// Animation
const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

const PageBg = styled.div`
  min-height: 100vh;
  background: linear-gradient(to right, #0f172a, #1e293b);
  padding: 5rem 1.5rem;
  color: #f8fafc;
`;

const Wrapper = styled.div`
  background: rgba(15, 23, 42, 0.95);
  border-radius: 1.25em;
  max-width: 860px;
  margin: 0 auto;
  padding: 3.2em 2.4em;
  box-shadow: 0 10px 35px #1e293b88;
  animation: ${fadeIn} 0.8s ease forwards;
`;

const Headline = styled.h1`
  font-size: 2.75em;
  font-weight: 900;
  color: #facc15;
  margin-bottom: 0.8em;
  text-align: center;
`;

const Para = styled.p`
  font-size: 1.25em;
  line-height: 1.8;
  color: #cbd5e1;
  margin-bottom: 1.5em;
  text-align: center;
`;

const FeatureGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 2rem;
  margin: 3em 0;
`;

const FeatureCard = styled.div`
  background: #1e293b;
  padding: 2em;
  border-radius: 1em;
  border: 1px solid #334155;
  transition: transform 0.3s ease, box-shadow 0.3s ease;

  &:hover {
    transform: translateY(-6px);
    box-shadow: 0 8px 20px #1e40af55;
  }

  h3 {
    color: #facc15;
    font-size: 1.3em;
    margin-bottom: 0.4em;
  }

  p {
    color: #cbd5e1;
    font-size: 1.05em;
  }
`;

const CTA = styled.div`
  margin-top: 3em;
  text-align: center;

  a {
    background: #3b82f6;
    color: #fff;
    padding: 0.9em 1.8em;
    border-radius: 0.6em;
    text-decoration: none;
    font-weight: bold;

    &:hover {
      background: #2563eb;
    }
  }
`;

const Badge = styled.div`
  margin-top: 4em;
  text-align: center;
  font-size: 0.95em;
  background: #0f172a;
  border: 1px solid #334155;
  padding: 0.8em 1.2em;
  border-radius: 1em;
  color: #60a5fa;
  font-weight: bold;
`;

const SEOBlock = styled.div`
  margin-top: 3em;
  font-size: 0.92em;
  color: #64748b;
  line-height: 1.7;
`;

export default function Features() {
  return (
    <PageBg>
      <Head>
        <title>Jump2 Features — Smarter Sharing Tools</title>
        <meta name="description" content="Explore all the smart sharing tools offered by Jump2 — meme generator, highlight editor, timestamp links, and more." />
        <meta property="og:title" content="Jump2 Features" />
        <meta property="og:description" content="Smart tools built for creators, educators, and everyone who shares content online." />
      </Head>

      <Wrapper>
        <Headline>Smarter Sharing, Built In</Headline>
        <Para>
          Every Jump2 tool is crafted to help you share exactly what matters — faster, clearer, and more impactfully.
        </Para>

        <FeatureGrid>
          <FeatureCard>
            <h3>Meme Generator</h3>
            <p>Turn highlights into viral images with one click. Auto-styled, logo-ready, and built for shareability.</p>
          </FeatureCard>
          <FeatureCard>
            <h3>Timestamp Sharing</h3>
            <p>Point to the exact second in any YouTube, TikTok, Vimeo or podcast episode with a single smart link.</p>
          </FeatureCard>
          <FeatureCard>
            <h3>Highlight Editor</h3>
            <p>Extract only the most important line or quote from an article. No fluff — just signal.</p>
          </FeatureCard>
          <FeatureCard>
            <h3>Smart Link Dashboard</h3>
            <p>Track clicks, sort highlights, and organize everything into folders or campaigns (coming soon).</p>
          </FeatureCard>
        </FeatureGrid>

        <CTA>
          <a href="/share">Start Sharing Smarter</a>
        </CTA>

        <Badge>🔹 Powered by Jump2 — The First Share-Tech Platform</Badge>

        <SEOBlock>
          Jump2 is the first Share-Tech company, redefining how we extract and share online content. Whether you're quoting an article, linking to a podcast moment, or sharing a meme, Jump2 turns clutter into clarity. With smart timestamps, highlight links, and creator dashboards, Jump2 empowers you to amplify ideas — not just URLs.
        </SEOBlock>
      </Wrapper>
    </PageBg>
  );
}
