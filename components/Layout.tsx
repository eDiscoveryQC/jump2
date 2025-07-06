import React from "react";
import Header from "./Header";
import Footer from "./Footer";
import styled from "styled-components";

const LayoutShell = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background: linear-gradient(180deg, #0f172a 0%, #1e293b 100%);
  color: #e2e8f0;
  font-family: "Inter", sans-serif;
`;

const HeaderSection = styled.header`
  position: sticky;
  top: 0;
  z-index: 100;
  backdrop-filter: blur(12px);
  background-color: rgba(15, 23, 42, 0.9);
  border-bottom: 1px solid #334155;
`;

const ContentWrapper = styled.main`
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: start;
  padding: 3rem 1.5rem 4rem;
  max-width: 1100px;
  width: 100%;
  margin: 0 auto;

  @media (max-width: 768px) {
    padding: 2rem 1rem;
  }
`;

const GradientDivider = styled.div`
  height: 1px;
  background: linear-gradient(to right, #334155, #64748b, #334155);
  width: 100%;
  opacity: 0.6;
`;

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <LayoutShell>
      <HeaderSection>
        <Header />
      </HeaderSection>

      <ContentWrapper>{children}</ContentWrapper>

      <GradientDivider />

      <Footer contactEmail="support@jump2share.com" />
    </LayoutShell>
  );
}
