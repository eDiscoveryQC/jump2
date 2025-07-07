import React from "react";
import styled from "styled-components";
import SmartInputPanel from "@/components/SmartInputPanel";
import LivePreview from "@/components/LivePreview"; // Optional – mocked preview component

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

const Subtitle = styled.p`
  font-size: 1.25rem;
  font-weight: 400;
  text-align: center;
  color: #cbd5e1;
  max-width: 720px;
  margin-bottom: 3rem;
`;

const FlexPanel = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  gap: 2rem;
  width: 100%;
  max-width: 1200px;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: center;
    gap: 2rem;
  }
`;

const PanelBox = styled.div`
  background: rgba(255, 255, 255, 0.05);
  border-radius: 16px;
  padding: 2rem;
  width: 100%;
  max-width: 500px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3);
`;

const Divider = styled.hr`
  border: none;
  height: 1px;
  margin: 2rem 0;
  background: linear-gradient(to right, transparent, #334155, transparent);
`;

export default function SharePage() {
  return (
    <PageWrapper>

      <Content>
        <Title>Jump2: The Creator’s Drop Zone</Title>
        <Subtitle>
          Paste a link, upload a file, or drop a doc. Instantly generate a smart preview,
          protect your content, and track performance — built with creators in mind.
        </Subtitle>

        <FlexPanel>
          <PanelBox>
            <SmartInputPanel
              onShareGenerated={(url) => {
                console.log("Generated:", url);
                // Future: route to /preview/[slug] or update global state
              }}
            />
          </PanelBox>

          <PanelBox>
            <LivePreview />
          </PanelBox>
        </FlexPanel>
      </Content>
    </PageWrapper>
  );
}
