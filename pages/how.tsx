import React from "react";
import styled from "styled-components";

const PageWrapper = styled.div`
  max-width: 700px;
  margin: 3em auto 2em auto;
  padding: 2.4em 2em 2em 2em;
  background: rgba(16,23,45,0.97);
  border-radius: 1.15em;
  color: #eaf0fa;
  font-family: 'Inter', sans-serif;
  box-shadow: 0 8px 32px 0 #1e293b33, 0 0 0 2.5px #2563eb77;
`;

const Headline = styled.h1`
  color: #67b7fd;
  font-size: 2.2em;
  font-weight: 900;
  margin-bottom: 0.2em;
`;

const Subheading = styled.div`
  color: #ffe066;
  font-size: 1.22em;
  font-weight: 700;
  margin-bottom: 1.3em;
`;

const StepList = styled.ol`
  margin-left: 1.5em;
  margin-bottom: 2em;
  li {
    margin-bottom: 0.7em;
    font-size: 1.09em;
    font-weight: 500;
  }
`;

const WhyTitle = styled.h2`
  color: #60a5fa;
  font-size: 1.12em;
  font-weight: 800;
  margin: 1.5em 0 0.8em 0;
`;

const WhyList = styled.ul`
  margin-left: 1.2em;
  margin-bottom: 2.2em;
  li {
    margin-bottom: 0.6em;
    font-size: 1.06em;
  }
`;

const CTAButton = styled.a`
  display: inline-block;
  margin-top: 1.7em;
  padding: 0.78em 2.2em;
  background: linear-gradient(90deg, #3b82f6 10%, #2563eb 90%);
  color: #fff;
  font-weight: 800;
  border-radius: 0.7em;
  font-size: 1.14em;
  letter-spacing: 0.01em;
  box-shadow: 0 3px 16px #2563eb66;
  text-decoration: none;
  transition: background 0.13s, transform 0.12s;
  &:hover, &:focus {
    background: linear-gradient(90deg, #2563eb 10%, #3b82f6 90%);
    transform: scale(1.04);
    outline: none;
  }
`;

export default function HowItWorks() {
  return (
    <PageWrapper>
      <Headline>From Article to Action in Seconds</Headline>
      <Subheading>
        Smart sharing for the way you read, highlight, and engage.
      </Subheading>

      <StepList>
        <li><b>Paste a Link</b> – Start with any article or long-form content.</li>
        <li><b>Highlight Anything</b> – Select text that matters to you.</li>
        <li><b>Share Your Jump</b> – Generate a custom link that brings others straight to your highlight.</li>
      </StepList>

      <WhyTitle>Why People Use Jump2:</WhyTitle>
      <WhyList>
        <li>🔍 <b>Researchers:</b> Save exact quotes with context</li>
        <li>✍️ <b>Writers & Creators:</b> Let readers share your best lines</li>
        <li>🧠 <b>Learners & Teams:</b> Keep knowledge organized and precise</li>
      </WhyList>

      <CTAButton href="/">
        Try It Free
      </CTAButton>
    </PageWrapper>
  );
}