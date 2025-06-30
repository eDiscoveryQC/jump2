import React from "react";
import styled, { keyframes } from "styled-components";
import Head from "next/head";

// 🔥 Glow animation for the Jump2 logo
const pulseGlow = keyframes`
  0% { box-shadow: 0 0 0px #facc15; }
  50% { box-shadow: 0 0 20px #facc15aa; }
  100% { box-shadow: 0 0 0px #facc15; }
`;

// 🎯 Hero Styling
const HeroSection = styled.section`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 6rem 1.5rem 5rem;
  background: linear-gradient(to right, #111827, #1e293b);
  color: #ffffff;
`;

const Logo = styled.h1`
  font-size: 3.4rem;
  font-weight: 900;
  letter-spacing: -1.5px;
  margin-bottom: 1.4rem;
  animation: ${pulseGlow} 3s infinite;
  color: #facc15;
`;

const Tagline = styled.h2`
  font-size: 1.85rem;
  font-weight: 500;
  max-width: 720px;
  line-height: 1.6;
  margin-bottom: 2.2rem;
  color: #fef08a;
`;

const CTAButtons = styled.div`
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
  justify-content: center;
  margin-bottom: 3rem;

  a {
    padding: 1rem 2rem;
    font-size: 1.1rem;
    font-weight: 600;
    border-radius: 10px;
    text-decoration: none;
    transition: 0.25s ease;
  }

  .primary {
    background: #facc15;
    color: #1a1f36;
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
    color: #1a1f36;
  }
`;

// 🌐 Section Styling
const Section = styled.section`
  padding: 4.5rem 2rem;
  max-width: 1150px;
  margin: 0 auto;
  text-align: center;
`;

const SectionTitle = styled.h3`
  font-size: 2.4rem;
  font-weight: 800;
  color: #0f172a;
  margin-bottom: 1.6rem;
`;

const Paragraph = styled.p`
  font-size: 1.25rem;
  color: #475569;
  line-height: 1.8;
  max-width: 780px;
  margin: 0 auto;
`;

const ToolsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 2rem;
  margin-top: 2.4rem;
`;

const ToolCard = styled.div`
  background: #f8fafc;
  border-radius: 0.95rem;
  padding: 2rem;
  box-shadow: 0 6px 20px #e2e8f033;
  transition: all 0.3s ease;

  &:hover {
    box-shadow: 0 12px 28px #94a3b855;
    transform: translateY(-5px);
  }

  h4 {
    font-size: 1.4rem;
    font-weight: 700;
    margin-bottom: 0.8rem;
    color: #0f172a;
  }

  p {
    font-size: 1.05rem;
    color: #475569;
  }
`;

// 🦾 Footer
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
        <meta name="description" content="Share the exact moment that matters from any content online. Jump2 lets you highlight, meme, or timestamp anything — and share it instantly." />
      </Head>

      <HeroSection>
        <Logo>Jump2</Logo>
        <Tagline>Share the moment — not the mess. Welcome to Share-Tech.</Tagline>
        <CTAButtons>
          <a href="/share" className="primary">Create a Jump2 Link</a>
          <a href="/demo" className="secondary">See Demo</a>
        </CTAButtons>
      </HeroSection>

      <Section>
        <SectionTitle>🚀 What is Share-Tech?</SectionTitle>
        <Paragraph>
          Jump2 invented Share-Tech — a whole new layer of the internet designed to deliver context, clarity, and virality in every link. Whether it’s video, text, or sound, Jump2 lets you highlight what matters and share it precisely.
        </Paragraph>
      </Section>

      <Section>
        <SectionTitle>🧠 Tools Powered by Jump2</SectionTitle>
        <ToolsGrid>
          <ToolCard>
            <h4>🖍️ Highlight Editor</h4>
            <p>Select text, create highlights, and generate focused shareable links.</p>
          </ToolCard>
          <ToolCard>
            <h4>🎯 Smart Timestamps</h4>
            <p>Generate direct jumps into YouTube, TikTok, Spotify, and more.</p>
          </ToolCard>
          <ToolCard>
            <h4>🖼️ Meme Generator</h4>
            <p>One-click memes from quotes, with branded watermarking and style presets.</p>
          </ToolCard>
          <ToolCard>
            <h4>⚡ Chrome Extension</h4>
            <p>Highlight anything on any site → Right-click → Generate Jump2 link instantly.</p>
          </ToolCard>
          <ToolCard>
            <h4>📊 Creator Dashboard</h4>
            <p>Track engagement, organize links, optimize content strategy with insights.</p>
          </ToolCard>
          <ToolCard>
            <h4>🧪 Embed Toolkit</h4>
            <p>Drop Jump2 previews inside Substack, Ghost, Webflow, and more.</p>
          </ToolCard>
        </ToolsGrid>
      </Section>

      <Section>
        <SectionTitle>🔁 Built to Go Viral</SectionTitle>
        <Paragraph>
          Every Jump2 link is a growth loop. When your audience shares a Jump2, they amplify just the best part. Our smart links work on Slack, Discord, X, LinkedIn, and beyond — complete with previews, thumbnails, and reactions.
        </Paragraph>
      </Section>

      <Section>
        <SectionTitle>🌐 Start Sharing Like It’s 2025</SectionTitle>
        <CTAButtons>
          <a href="/share" className="primary">Try Jump2 Free</a>
          <a href="/contact" className="secondary">Become a Creator</a>
        </CTAButtons>
      </Section>

      <Footer>
        <div><strong>Jump2 — The First Share-Tech Company</strong></div>
        <div style={{ marginTop: "0.8rem" }}>Crafted for clarity. Designed to go viral.</div>
        <div style={{ marginTop: "0.5rem" }}>support@jump2.link | GitHub | Terms</div>
      </Footer>
    </>
  );
}
