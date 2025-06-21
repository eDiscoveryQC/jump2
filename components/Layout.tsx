import React from 'react';
import styled, { keyframes } from 'styled-components';

const fadeSlideInLeft = keyframes`
  from {
    opacity: 0;
    transform: translateX(-24px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
`;

const fadeSlideInRight = keyframes`
  from {
    opacity: 0;
    transform: translateX(24px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
`;

const LayoutWrapper = styled.div`
  display: flex;
  justify-content: center;
  gap: 3rem;
  padding: 4rem 2rem 6rem;
  min-height: 100vh;
  background: radial-gradient(circle at top, #0f172a, #1e293b);
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  color: #cbd5e1;

  @media (max-width: 900px) {
    flex-direction: column;
    padding: 2rem 1rem 3rem;
    gap: 2rem;
  }
`;

const LeftPanel = styled.section`
  flex: 0 0 480px;
  max-width: 480px;
  animation: ${fadeSlideInLeft} 0.6s ease forwards;

  @media (max-width: 900px) {
    flex: 1 1 auto;
    max-width: 100%;
  }
`;

const RightPanel = styled.section`
  flex: 1 1 640px;
  max-width: 720px;
  background: #1e293b;
  border-radius: 1rem;
  border: 1.5px solid #334155;
  padding: 2rem 3rem;
  box-shadow: 0 12px 20px rgba(0, 0, 0, 0.3);
  color: #f1f5f9;
  font-size: 1rem;
  line-height: 1.7;
  overflow-y: auto;
  animation: ${fadeSlideInRight} 0.6s ease forwards;

  h1, h2, h3, h4 {
    color: #60a5fa;
    margin-top: 1.5rem;
    margin-bottom: 1rem;
    font-weight: 700;
  }

  p {
    margin-bottom: 1.25rem;
  }

  a {
    color: #3b82f6;
    text-decoration: underline;
    word-break: break-word;
  }

  blockquote {
    border-left: 5px solid #3b82f6;
    padding-left: 1rem;
    color: #94a3b8;
    font-style: italic;
    margin: 1rem 0;
  }

  ul, ol {
    margin-left: 1.75rem;
    margin-bottom: 1.5rem;
  }

  img {
    max-width: 100%;
    border-radius: 0.5rem;
    margin: 1rem 0;
  }

  @media (max-width: 900px) {
    max-width: 100%;
    padding: 1.5rem 1.5rem;
  }
`;

interface LayoutProps {
  form: React.ReactNode;
  preview: React.ReactNode;
}

export default function Layout({ form, preview }: LayoutProps) {
  return (
    <LayoutWrapper role="main" aria-label="Jump2 main layout">
      <LeftPanel>{form}</LeftPanel>
      <RightPanel aria-live="polite" aria-atomic="true" tabIndex={-1}>
        {preview}
      </RightPanel>
    </LayoutWrapper>
  );
}
