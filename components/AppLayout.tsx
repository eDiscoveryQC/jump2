// components/AppLayout.tsx
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import SidebarNav from './SidebarNav';
import TopNavBar from './TopNavBar';

const Container = styled.div`
  display: flex;
  height: 100vh;
  background-color: #0f172a;
  color: white;
  overflow: hidden;
`;

const Main = styled.main`
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
`;

const ContentWrapper = styled.section`
  flex: 1;
  overflow-y: auto;
  padding: 2rem 1.5rem;
  background: linear-gradient(to right, #0f172a, #1e293b);
  z-index: 1;

  @media (max-width: 768px) {
    padding: 1.2rem 1rem;
  }

  &::-webkit-scrollbar {
    width: 8px;
  }
  &::-webkit-scrollbar-thumb {
    background: #334155;
    border-radius: 4px;
  }
`;

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  return (
    <Container className="jump2-app-layout" data-theme="dark">
      {!isMobile && <SidebarNav />}
      <Main role="main">
        <TopNavBar />
        <ContentWrapper role="region" aria-label="Main Content">
          {children}
        </ContentWrapper>
      </Main>
    </Container>
  );
}
