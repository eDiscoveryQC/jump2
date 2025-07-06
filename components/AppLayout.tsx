// components/AppLayout.tsx
import React, { useEffect, useState } from "react";
import styled from "styled-components";
import SidebarNav from "./SidebarNav";
import TopNavBar from "./TopNavBar";

// Outer container: full viewport edge-to-edge layout
const Container = styled.div`
  display: flex;
  height: 100vh;
  width: 100vw;
  overflow: hidden;
  background-color: #0f172a;
  color: white;
`;

// Main content section, with optional sidebar
const Main = styled.main`
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
`;

// Fullscreen content region, no internal borders or boxy constraints
const Content = styled.section`
  flex: 1;
  overflow-y: auto;
  background: linear-gradient(to right, #0f172a, #1e293b);
  padding: 0;
  margin: 0;

  &::-webkit-scrollbar {
    width: 8px;
  }

  &::-webkit-scrollbar-thumb {
    background: #334155;
    border-radius: 4px;
  }
`;

interface Props {
  children: React.ReactNode;
}

export default function AppLayout({ children }: Props) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <Container className="app-layout" data-theme="dark">
      {!isMobile && <SidebarNav />}
      <Main>
        <TopNavBar />
        <Content role="region" aria-label="Main Content">
          {children}
        </Content>
      </Main>
    </Container>
  );
}
