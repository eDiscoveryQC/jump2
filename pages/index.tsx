// pages/index.tsx — Meta-Grade Unicorn Home

import React from "react";
import Head from "next/head";
import styled, { keyframes } from "styled-components";
import { motion } from "framer-motion";

const pulseGlow = keyframes`
  0%, 100% { box-shadow: 0 0 0px #facc15; }
  50% { box-shadow: 0 0 16px #facc15aa; }
`;

const Hero = styled.section`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  padding: 6rem 2rem 4rem;
  background: linear-gradient(to right, #0f172a, #1e293b);
  color: #fff;
`;

const Logo = styled(motion.h1)`
  font-size: 4rem;
  font-weight: 900;
  letter-spacing: -1px;
  color: #facc15;
  animation: ${pulseGlow} 3s infinite;
  text-shadow: 0 3px 12px #0ea5e9;
`;

const Subtitle = styled.h2`
  font-size: 1.9rem;
  max-width: 780px;
  margin-top: 1.2rem;
  color: #fef08a;
`;

const CTAGroup = styled.div`
  margin-top: 2.8rem;
  display: flex;
  flex-wrap: wrap;
  gap: 1.2rem;

  a {
    padding: 1rem 2rem;
    font-weight: 700;
    font-size: 1.1rem;
    border-radius: 0.75rem;
    text-decoration: none;
    transition: 0.25s ease;
  }

  .primary {
    background: #facc15;
    color: #0f172a;
  }

  .primary:hover {
    background: #eab308;
  }

  .secondary {
    border: 2px solid #facc15;
    color: #facc15;
  }

  .secondary:hover {
    background: #facc15;
    color: #0f172a;
  }
`;

const Section = styled.section`
  padding: 4rem 2rem;
  max-width: 1200px;
  margin: 0 auto;
  text-align: center;
`;

const Heading = styled.h3`
  font-size: 2.5rem;
  font-weight: 800;
  margin-bottom: 1.6rem;
  color: #f8fafc;
`;

const Text = styled.p`
  font-size: 1.2rem;
  color: #cbd5e1;
  max-width: 800px;
  margin: 0 auto 2rem;
`;

const StatBar = styled.div`
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 2rem;
  color: #fef08a;
  font-weight: 600;
  margin-top: 2rem;
`;

const Footer = styled.footer`
  background: #0f172a;
  color: #cbd5e1;
  padding: 4rem 2rem;
  text-align: center;
  font-size: 1rem;
`;

export default function Home() {
  return (
    <>
      <Head>
        <title>Jump2 — The First Share-Tech Company</title>
        <meta name="description" content="Share the exact moment that matters. Jump2 lets you highlight, timestamp, or meme anything — and share it smarter." />
        <meta property="og:title" content="Jump2 — Share the Moment, Not the Mess" />
        <meta property="og:image" content="https://jump2.link/og-image.jpg" />
        <meta property="og:url" content="https://jump2.link" />
        <meta property="og:description" content="Create viral links from quotes, timestamps, and memes — Jump2 is your toolkit for sharing smarter." />
      </Head>

      <Hero>
        <Logo
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
        >
          Jump2
        </Logo>
        <Subtitle>
          Share the moment — not the mess. The new internet is precision-first.
        </Subtitle>
        <CTAGroup>
          <a href="/share" className="primary">Create Your First Jump2</a>
          <a href="/features" className="secondary">Explore Features</a>
        </CTAGroup>
      </Hero>

      <Section>
        <Heading>Built for Creators. Backed by Virality.</Heading>
        <Text>
          Jump2 pioneered Share-Tech: a smarter layer of sharing where precision meets performance. Highlight videos, quotes, or audio and instantly link to the moment that matters.
        </Text>
        <StatBar>
          <div>📈 1M+ Links Generated</div>
          <div>🌍 Used in 100+ Countries</div>
          <div>🚀 Trusted by Top Creators & Teams</div>
        </StatBar>
      </Section>

      <Section>
        <Heading>Why Share-Tech Wins</Heading>
        <Text>
          URLs weren’t made for storytelling. Jump2 transforms links into bite-sized context bombs — ready for X, Discord, Slack, TikTok, and more.
        </Text>
      </Section>

      <Section>
        <Heading>Join the Precision Internet</Heading>
        <Text>
          Whether you're a creator, strategist, or investor — Jump2 is building the new standard for content velocity. Clarity is the new currency.
        </Text>
        <CTAGroup>
          <a href="/contact" className="primary">Get Involved</a>
        </CTAGroup>
      </Section>

      <Footer>
        <div><strong>Jump2 — The First Share-Tech Company</strong></div>
        <div style={{ marginTop: "0.8rem" }}>Crafted for clarity. Designed to go viral.</div>
        <div style={{ marginTop: "0.5rem" }}>support@jump2.link | GitHub | Terms</div>
      </Footer>
    </>
  );
}
