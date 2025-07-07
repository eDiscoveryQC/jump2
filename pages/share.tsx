import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useRouter } from "next/router";
import SmartInputPanel from "@/components/SmartInputPanel";
import ArticlePreviewFull from "@/components/ArticlePreviewFull";

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
  margin-bottom: 2rem;
  color: #facc15;
  text-align: center;
  text-shadow: 0 0 20px #facc15aa;
`;

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

  const [url, setUrl] = useState<string>("");

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

    const timeout = setTimeout(scrollToHighlights, 800);
    return () => clearTimeout(timeout);
  }, [hl]);

  return (
    <PageWrapper>
      <GlobalStyle />
      <Content>
        <Title>🔗 Create Your Jump2 Link</Title>

        {/* Input/drop panel */}
        <SmartInputPanel onSubmit={(link: string) => setUrl(link)} />

        {/* Conditional render of article preview */}
        {url && (
          <ArticlePreviewFull
            url={url}
            supportArticles
            supportMemes
            enableYouTubeTimestamp
          />
        )}
      </Content>
    </PageWrapper>
  );
}
