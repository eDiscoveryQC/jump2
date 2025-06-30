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

const SectionTitle = styled.h2`
  color: #ffe066;
  font-size: 1.45em;
  font-weight: 800;
  margin: 2.8em 0 1em 0;
  text-align: center;
`;

const List = styled.ul`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  list-style: none;
  padding: 0;
  gap: 1rem;
  margin-bottom: 2em;

  li {
    background: #1e293b;
    padding: 0.75em 1.3em;
    border-radius: 1em;
    font-size: 1.1em;
    font-weight: 600;
    color: #f1f5f9;
  }
`;

const FounderNote = styled.blockquote`
  background: #1e293b;
  border-left: 6px solid #facc15;
  border-radius: 0.75em;
  padding: 1.5em 1.8em;
  font-style: italic;
  font-size: 1.1em;
  color: #ffe066;
  margin: 3em 0 2em 0;
`;

const SocialLinks = styled.div`
  text-align: center;
  margin-top: 2.5em;
  font-size: 1.1em;

  a {
    color: #3b82f6;
    margin: 0 1.2em;
    font-weight: 700;
    text-decoration: none;

    &:hover {
      color: #facc15;
      text-decoration: underline;
    }
  }
`;

const JoinUs = styled.div`
  background: #0f172a;
  border: 2px dashed #3b82f6;
  padding: 2em;
  border-radius: 1em;
  margin-top: 3em;
  text-align: center;

  h3 {
    font-size: 1.5em;
    margin-bottom: 0.6em;
    color: #facc15;
  }

  p {
    font-size: 1.1em;
    margin-bottom: 1.2em;
    color: #cbd5e1;
  }

  a {
    display: inline-block;
    padding: 0.7em 1.4em;
    background: #3b82f6;
    color: #fff;
    border-radius: 0.6em;
    font-weight: bold;
    text-decoration: none;

    &:hover {
      background: #2563eb;
    }
  }
`;

const InvestorNote = styled.div`
  margin-top: 4em;
  background: #1e293b;
  border-left: 4px solid #60a5fa;
  padding: 1.6em;
  border-radius: 1em;
  color: #f8fafc;
  font-size: 1.1em;
  text-align: center;

  strong {
    color: #3b82f6;
  }
`;

export default function About() {
  return (
    <PageBg>
      <Head>
        <title>About Jump2 — The First Share-Tech Company</title>
        <meta name="description" content="Jump2 is building the Share-Tech future — helping people share the exact moment that matters." />
        <meta property="og:title" content="About Jump2 — Share the Moment, Not the Mess" />
        <meta property="og:url" content="https://jump2.link/about" />
        <meta property="og:description" content="Learn the story behind Jump2, the world's first Share-Tech company. Meet our mission, our values, and our vision." />
      </Head>

      <Wrapper>
        <Headline>We’re Building the Future of Smart Sharing</Headline>
        <Para>
          Jump2 is the world’s first Share-Tech company — a new internet layer designed for context, clarity, and virality.
        </Para>
        <Para>
          We believe links should be smarter. Instead of sharing noise, Jump2 lets you share the signal — the exact quote, timestamp, or idea that matters.
        </Para>

        <SectionTitle>Our Mission</SectionTitle>
        <Para>
          Make sharing knowledge as seamless and powerful as a highlight.
        </Para>

        <SectionTitle>Built For</SectionTitle>
        <List>
          <li>Readers & Creators</li>
          <li>Researchers & Journalists</li>
          <li>Developers & Designers</li>
          <li>Educators & Knowledge Workers</li>
        </List>

        <FounderNote>
          "We built Jump2 because we were tired of scrolling through noise to find the moment that mattered. Smart links, viral highlights, precise timestamps — this is the new standard for content sharing."
          <br /><br />
          — The Jump2 Founders
        </FounderNote>

        <JoinUs>
          <h3>We’re Hiring</h3>
          <p>We're building the future of Share-Tech — and we need visionary engineers, designers, and builders. Want in?</p>
          <a href="mailto:hello@jump2.sh?subject=Join%20the%20Jump2%20Team">Join the Team</a>
        </JoinUs>

        <InvestorNote>
          <strong>Investor & Partnership Opportunities:</strong><br />
          We’re building something category-defining. If you want to shape the Share-Tech movement, let’s talk.
        </InvestorNote>

        <SocialLinks>
          <a href="mailto:hello@jump2.sh">Contact</a>
          <a href="https://linkedin.com/company/jump2share" target="_blank" rel="noopener noreferrer">LinkedIn</a>
          <a href="https://x.com/jump2share" target="_blank" rel="noopener noreferrer">Twitter</a>
        </SocialLinks>
      </Wrapper>
    </PageBg>
  );
}