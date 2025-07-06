import React, { useEffect, useState } from "react";
import styled from "styled-components";
import SidebarNav from "./SidebarNav";
import TopNavBar from "./TopNavBar";

// Styled container: full-height, edge-to-edge layout
const Container = styled.div`
  display: flex;
  height: 100vh;
  width: 100vw;
  overflow: hidden;
  background-color: #0f172a;
  color: white;
`;

// Sidebar + Main split
const Main = styled.main`
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
`;

// Truly full-screen content with no boxy padding
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

// Responsive, edge-to-edge layout with top nav and sidebar
export default function WorkspaceLayout({ children }: Props) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  return (
    <Container className="workspace-layout" data-theme="dark">
      {!isMobile && <SidebarNav />}
      <Main>
        <TopNavBar />
        <Content role="region" aria-label="Main Workspace Content">
          {children}
        </Content>
      </Main>
    </Container>
  );
}
