import React from "react";
import styled from "styled-components";
import Head from "next/head";

const PageBg = styled.div`
  min-height: 100vh;
  background: linear-gradient(to right, #0f172a, #1e293b);
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 4rem 1.5rem 6rem;
`;

const Wrapper = styled.div`
  background: rgba(16, 23, 45, 0.97);
  border-radius: 1.25rem;
  max-width: 800px;
  width: 100%;
  padding: 3rem 2rem;
  box-shadow: 0 8px 32px 0 #1e293b33, 0 0 0 2px #2563eb66;
`;

const Title = styled.h1`
  font-size: 2.5rem;
  color: #facc15;
  text-align: center;
  font-weight: 900;
  margin-bottom: 1.25rem;
  text-shadow: 0 2px 10px #0ea5e9aa;
`;

const Subtitle = styled.p`
  font-size: 1.2rem;
  text-align: center;
  color: #e2e8f0;
  margin-bottom: 2rem;
`;

const IconList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  align-items: center;
  a {
    display: flex;
    align-items: center;
    font-size: 1.1rem;
    color: #3b82f6;
    font-weight: 700;
    background: #1e293b;
    padding: 0.8rem 1.2rem;
    border-radius: 0.8rem;
    text-decoration: none;
    gap: 0.6rem;
    transition: background 0.2s, color 0.2s, box-shadow 0.2s;
    box-shadow: 0 1px 8px #0ea5e933;
    svg {
      width: 1.2rem;
      height: 1.2rem;
    }
    &:hover {
      background: #ffe066;
      color: #223050;
      box-shadow: 0 6px 22px #ffe06655;
    }
  }
`;

const FooterNote = styled.div`
  font-size: 1rem;
  color: #94a3b8;
  text-align: center;
  margin-top: 3rem;
`;

export default function Contact() {
  return (
    <>
      <Head>
        <title>Contact Us – Jump2</title>
        <meta name="description" content="Need help or want to connect with Jump2? Reach out to our team." />
      </Head>
      <PageBg>
        <Wrapper>
          <Title>Contact Jump2</Title>
          <Subtitle>
            Need support, business inquiries, or just want to say hi?
            We're fast to respond and happy to connect.
          </Subtitle>
          <IconList>
            <a href="mailto:support@jump2share.com" aria-label="Email">
              <svg viewBox="0 0 24 24" fill="none"><rect width="24" height="24" rx="5" fill="#67b7fd"/><path d="M6 8v8h12V8H6Zm10 0-4 3.5L8 8" stroke="#fff" strokeWidth="1.3" strokeLinejoin="round"/></svg>
              support@jump2share.com
            </a>
            <a href="https://www.linkedin.com/company/jump2share/" target="_blank" rel="noopener noreferrer">
              <svg viewBox="0 0 24 24" fill="none"><rect width="24" height="24" rx="5" fill="#67b7fd"/><path d="M7.75 8.25a1.25 1.25 0 1 1 0-2.5 1.25 1.25 0 0 1 0 2.5ZM7 10h1.5v6H7v-6Zm3.75 0h1.43v.82h.02c.2-.36.7-.82 1.47-.82 1.57 0 1.86.99 1.86 2.27V16H15V12.5c0-.84-.01-1.91-1.16-1.91-1.16 0-1.34.91-1.34 1.85V16h-1.5v-6Z" fill="#fff"/></svg>
              LinkedIn
            </a>
            <a href="https://x.com/jump2share" target="_blank" rel="noopener noreferrer">
              <svg viewBox="0 0 24 24" fill="none"><rect width="24" height="24" rx="5" fill="#67b7fd"/><path d="M17.8 7H15.6l-2.1 2.8L11.4 7H9.2l2.9 4.1L9 17h2.2l1.8-2.5 1.8 2.5H17l-3.1-4.3L17.8 7Zm-4.1 6.7-.6-.8-1.7-2.3h1.1l1.2 1.6 1.2-1.6h1.1l-1.7 2.3-.6.8Z" fill="#fff"/></svg>
              Twitter / X
            </a>
          </IconList>
          <FooterNote>
            🚀 Jump2 — Built for creators, curators, and content clarity.
          </FooterNote>
        </Wrapper>
      </PageBg>
    </>
  );
}
