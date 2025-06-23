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
  margin-bottom: 0.7em;
`;

const SectionTitle = styled.h2`
  color: #ffe066;
  font-size: 1.1em;
  font-weight: 700;
  margin: 2em 0 0.7em 0;
`;

const ContactList = styled.ul`
  margin-left: 1.2em;
  margin-bottom: 1.8em;
  li {
    margin-bottom: 0.7em;
    font-size: 1.06em;
    b {
      color: #ffe066;
    }
  }
`;

const SocialLinks = styled.div`
  margin-top: 1.4em;
  font-size: 1.11em;
  a {
    color: #3b82f6;
    margin-right: 1.3em;
    font-weight: 700;
    text-decoration: none;
    &:hover { text-decoration: underline; }
  }
`;

export default function Contact() {
  return (
    <PageWrapper>
      <Headline>Let’s Build Something Better Together</Headline>
      <SectionTitle>General Inquiries:</SectionTitle>
      <ContactList>
        <li>
          Have feedback, ideas, or just want to say hi?<br />
          <b>📩</b> <a href="mailto:support@jump2share.com" style={{ color: "#3b82f6" }}>support@jump2share.com</a>
        </li>
      </ContactList>
      <SectionTitle>For Media & Press:</SectionTitle>
      <ContactList>
        <li>
          <b>📣</b> Reach out to share our story or request interviews.
        </li>
      </ContactList>
      <SectionTitle>For Partnerships & Creators:</SectionTitle>
      <ContactList>
        <li>
          <b>🤝</b> Whether you're a publisher or creator, we’d love to explore how Jump2 can enhance your audience's experience.
        </li>
      </ContactList>
      <SectionTitle>Want to invest in the future of smart sharing?</SectionTitle>
      <ContactList>
        <li>
          We're open to conversations with thoughtful partners.<br />
          <b>📥</b> Email: <a href="mailto:support@jump2share.com" style={{ color: "#3b82f6" }}>support@jump2share.com</a>
        </li>
      </ContactList>
      <SocialLinks>
        <a href="https://linkedin.com/company/jump2" target="_blank" rel="noopener noreferrer">LinkedIn</a>
        <a href="https://github.com/jump2" target="_blank" rel="noopener noreferrer">GitHub</a>
        <a href="https://twitter.com/Jump2Share" target="_blank" rel="noopener noreferrer">Twitter&nbsp;@Jump2Share</a>
      </SocialLinks>
    </PageWrapper>
  );
}