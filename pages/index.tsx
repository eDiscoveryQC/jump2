import React from "react";
import styled, { keyframes } from "styled-components";
import Head from "next/head";

const pulseGlow = keyframes`
  0% { box-shadow: 0 0 0px #facc15; }
  50% { box-shadow: 0 0 12px #facc1588; }
  100% { box-shadow: 0 0 0px #facc15; }
`;

const HeroSection = styled.section`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 5rem 1.25rem 4rem;
  background: linear-gradient(to right, #0f172a, #1e293b);
  color: #ffffff;
`;

const Logo = styled.h1`
  font-size: 3.4rem;
  font-weight: 900;
  letter-spacing: -1.5px;
  margin-bottom: 1.4rem;
  animation: ${pulseGlow} 4s infinite;
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

const Section = styled.section`
  padding: 4.5rem 1.5rem;
  max-width: 1150px;
  margin: 0 auto;
  text-align: center;
`;

const SectionTitle = styled.h3`
  font-size: 2.4rem;
  font-weight: 800;
  color: #f8fafc;
  margin-bottom: 1.6rem;
`;

const Paragraph = styled.p`
  font-size: 1.25rem;
  color: #cbd5e1;
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
  background: #1e293b;
  border-radius: 0.95rem;
  padding: 2rem;
  box-shadow: 0 6px 20px #0f172a66;
  transition: all 0.3s ease;

  &:hover {
    box-shadow: 0 12px 28px #0f172a88;
    transform: translateY(-5px);
  }

  h4 {
    font-size: 1.4rem;
    font-weight: 700;
    margin-bottom: 0.8rem;
    color: #f8fafc;
  }

  p {
    font-size: 1.05rem;
    color: #cbd5e1;
  }
`;

const CredStats = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 2rem;
  margin: 3rem auto 2rem;
  font-size: 1.2rem;
  color: #fef08a;
  font-weight: 600;
`;

const JoinSection = styled.div`
  background: #1e293b;
  border-radius: 1.2rem;
  padding: 3rem 2rem;
  margin-top: 4rem;
  text-align: center;
  color: #fef08a;
`;

const JoinTitle = styled.h4`
  font-size: 1.9rem;
  font-weight: 800;
  margin-bottom: 1.2rem;
`;

const JoinDesc = styled.p`
  font-size: 1.15rem;
  color: #e2e8f0;
  max-width: 620px;
  margin: 0 auto 2rem;
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
        <meta name="description" content="Share the exact moment that matters from any content online. Jump2 lets you highlight, meme, or timestamp anything — and share it instantly." />
        <meta property="og:title" content="Jump2 — Share the Moment, Not the Mess" />
        <meta property="og:image" content="https://jump2.link/og-image.jpg" />
        <meta property="og:url" content="https://jump2.link" />
        <meta property="og:description" content="Create viral links from quotes, timestamps, and memes — Jump2 is your toolkit for sharing smarter." />
      </Head>

      <HeroSection>
        <Logo>Jump2</Logo>
        <Tagline>Share the moment — not the mess. Welcome to Share-Tech.</Tagline>
        <CTAButtons>
          <a href="/share" className="primary">Create a Jump2 Link</a>
        </CTAButtons>
      </HeroSection>

      <Section>
        <SectionTitle>What is Share-Tech?</SectionTitle>
        <Paragraph>
          Jump2 invented Share-Tech — a new layer of the internet built for clarity and virality. Highlight videos, quotes, or songs and share exactly what matters.
        </Paragraph>
        <CredStats>
          <div>📈 1M+ Jump2 Links Shared</div>
          <div>🌍 100+ Countries</div>
          <div>💼 Backed by Top Creators & Investors</div>
        </CredStats>
      </Section>

      <Section>
        <SectionTitle>Tools Powered by Jump2</SectionTitle>
        <ToolsGrid>
          <ToolCard>
            <h4>🖍️ Highlight Editor</h4>
            <p>Create precise links from articles with just a click.</p>
          </ToolCard>
          <ToolCard>
            <h4>🎯 Smart Timestamps</h4>
            <p>Generate deep links into YouTube, TikTok, or podcasts.</p>
          </ToolCard>
          <ToolCard>
            <h4>🖼️ Meme Generator</h4>
            <p>Turn quotes into viral branded images in seconds.</p>
          </ToolCard>
          <ToolCard>
            <h4>⚡ Chrome Extension</h4>
            <p>Highlight on any site and instantly Jump2 it.</p>
          </ToolCard>
          <ToolCard>
            <h4>📊 Creator Dashboard</h4>
            <p>Manage links, view engagement, and optimize shares.</p>
          </ToolCard>
          <ToolCard>
            <h4>🧪 Embed Toolkit</h4>
            <p>Drop previews into Substack, Webflow, Ghost, and more.</p>
          </ToolCard>
        </ToolsGrid>
      </Section>

      <Section>
        <SectionTitle>Built to Go Viral</SectionTitle>
        <Paragraph>
          Every Jump2 is a growth loop. Shareable. Visual. Preloaded with context. Works on X, Slack, Discord, LinkedIn, and more.
        </Paragraph>
      </Section>

      <JoinSection>
        <JoinTitle>Join or Back Jump2</JoinTitle>
        <JoinDesc>
          Whether you're a creator, developer, or investor — we’re building a movement around clarity and precision online. Get in touch.
        </JoinDesc>
        <CTAButtons>
          <a href="/contact" className="primary">Let’s Connect</a>
        </CTAButtons>
      </JoinSection>

      <Footer>
        <div><strong>Jump2 — The First Share-Tech Company</strong></div>
        <div style={{ marginTop: "0.8rem" }}>Crafted for clarity. Designed to go viral.</div>
        <div style={{ marginTop: "0.5rem" }}>support@jump2.link | GitHub | Terms</div>
      </Footer>
    </>
  );
}
