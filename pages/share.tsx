// pages/share.tsx
import React, { useEffect } from "react";
import styled from "styled-components";
import SmartInputPanel from "@/components/SmartInputPanel";
import LivePreview from "@/components/LivePreview";
import { useRouter } from "next/router";

const PageWrapper = styled.div`
  background: linear-gradient(135deg, #0f172a, #1e293b);
  color: #ffffff;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
`;

const Content = styled.main`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 5rem 2rem 3rem;

  @media (max-width: 768px) {
    padding: 3rem 1rem 2rem;
  }
`;

const Title = styled.h1`
  font-size: 3rem;
  font-weight: 800;
  margin-bottom: 1rem;
  color: #facc15;
  text-align: center;
  text-shadow: 0 0 20px #facc15aa;
`;

// Highlight glow styling
const GlobalStyle = styled.div`
  .highlighted-jump2 {
    background-color: #facc15;
    padding: 0 4px;
    border-radius: 4px;
    transition: box-shadow 0.3s ease;
  }

  .highlighted-active {
    box-shadow: 0 0 14px 4px #facc15aa;
  }
`;

export default function SharePage() {
  const router = useRouter();
  const { hl } = router.query;

  useEffect(() => {
    if (!hl) return;

    const highlightIds = String(hl).split(",").map(id => id.trim());

    const scrollToHighlights = () => {
      highlightIds.forEach(id => {
        const el = document.getElementById(`highlight-${id}`);
        if (el) {
          el.scrollIntoView({ behavior: "smooth", block: "center" });
          el.classList.add("highlighted-active");
        }
      });
    };

    // Wait a bit to ensure content is rendered
    const timeout = setTimeout(scrollToHighlights, 800);
    return () => clearTimeout(timeout);
  }, [hl]);

  return (
    <PageWrapper>
      <GlobalStyle />
      <Content>
        <Title>Smart Link Share</Title>
        <SmartInputPanel />
        <LivePreview />
      </Content>
    </PageWrapper>
  );
}
