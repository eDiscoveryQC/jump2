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
  margin-bottom: 0.5em;
`;

const SectionTitle = styled.h2`
  color: #ffe066;
  font-size: 1.13em;
  font-weight: 800;
  margin: 2em 0 0.7em 0;
`;

const FounderNote = styled.div`
  background: #1e293b;
  border-radius: 1em;
  padding: 1.2em 1.3em;
  margin: 2em 0 1.4em 0;
  font-style: italic;
  font-size: 1.07em;
  color: #ffe066;
  border-left: 4px solid #ffe066;
`;

const SocialLinks = styled.div`
  margin-top: 1.8em;
  font-size: 1.09em;
  a {
    color: #3b82f6;
    margin-right: 1.3em;
    font-weight: 700;
    text-decoration: none;
    &:hover { text-decoration: underline; }
  }
`;

export default function About() {
  return (
    <PageWrapper>
      <Headline>We’re Building the Future of Smart Sharing</Headline>
      <p>
        Jump2 is a content sharing technology platform that helps people extract, highlight, and share exactly what matters — instantly.
      </p>
      <p>
        We believe in a more thoughtful internet. One where links take you to ideas, not just pages.
      </p>
      <SectionTitle>Our Mission:</SectionTitle>
      <p>
        To make sharing knowledge as easy as highlighting a word.
      </p>
      <SectionTitle>Built For:</SectionTitle>
      <ul>
        <li>Everyday readers</li>
        <li>Journalists & content creators</li>
        <li>Developers building with precision</li>
        <li>Educators, researchers, and lifelong learners</li>
      </ul>
      <FounderNote>
        <b>Founder’s Note:</b><br />
        We created Jump2 because we were tired of hunting through long pages just to find one line. Now, with smart links and shareable highlights, we hope to make every conversation clearer, faster, and more meaningful.<br /><br />
        Want to work with us?<br />
        Contact us or follow our journey on LinkedIn.
      </FounderNote>
      <SocialLinks>
        <a href="mailto:support@jump2share.com">Contact</a>
        <a href="https://linkedin.com/company/jump2" target="_blank" rel="noopener noreferrer">LinkedIn</a>
      </SocialLinks>
    </PageWrapper>
  );
}