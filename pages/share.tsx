import React from "react";
import Head from "next/head";
import styled from "styled-components";
import SmartInputPanel from "@/components/SmartInputPanel";
import Layout from "@/components/Layout";

const ShareHero = styled.section`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 4rem 1.5rem 3rem;
  background: linear-gradient(135deg, #0f172a 30%, #1e3a8a 100%);
  border-radius: 1.5rem;
  box-shadow: 0 8px 32px rgba(14, 165, 233, 0.25);

  h1 {
    font-size: 3.2rem;
    font-weight: 900;
    color: #facc15;
    margin-bottom: 1rem;
    text-shadow: 0 4px 20px #0ea5e9;
  }

  p {
    font-size: 1.25rem;
    max-width: 760px;
    color: #cbd5e1;
  }

  @media (max-width: 640px) {
    padding: 3rem 1rem;
    h1 {
      font-size: 2.4rem;
    }
    p {
      font-size: 1rem;
    }
  }
`;

const PanelWrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  width: 100%;
  gap: 2rem;
  margin-top: 3.5rem;

  @media (max-width: 960px) {
    flex-direction: column;
    align-items: center;
  }
`;

const InputBox = styled.div`
  flex: 1;
  padding: 2.2rem;
  border-radius: 1.5rem;
  background: #020617;
  border: 1px solid #334155;
  box-shadow: 0 8px 30px rgba(14, 165, 233, 0.2);
  transition: all 0.3s ease;

  &:hover {
    box-shadow: 0 12px 40px rgba(14, 165, 233, 0.35);
    transform: translateY(-2px);
  }
`;

const PreviewBox = styled.div`
  flex: 1;
  padding: 2.2rem;
  border-radius: 1.5rem;
  background: #1e293b;
  border: 1px solid #334155;
  color: #f1f5f9;
  box-shadow: inset 0 0 0 2px #1e3a8a55;
  transition: all 0.3s ease;

  h3 {
    font-size: 1.2rem;
    color: #7dd3fc;
    margin-top: 0;
    margin-bottom: 1.2rem;
  }

  p {
    font-size: 1rem;
    color: #cbd5e1;
  }

  &:hover {
    box-shadow: inset 0 0 0 3px #3b82f6aa;
  }
`;

export default function SharePage() {
  return (
    <Layout>
      <Head>
        <title>Jump2 — Share Smarter</title>
        <meta
          name="description"
          content="Jump2 makes sharing faster, smarter, and more beautiful. Paste a link or drop a file."
        />
      </Head>

      <ShareHero>
        <h1>Jump2: The Creator’s Drop Zone</h1>
        <p>
          Paste a URL, upload a file, or drop a doc. Jump2 instantly transforms it into a smart
          shareable link with previews, protection, and tracking — built for creators.
        </p>
      </ShareHero>

      <PanelWrapper>
        <InputBox>
          <SmartInputPanel />
        </InputBox>

        <PreviewBox>
          <h3>Live Smart Preview</h3>
          <p>
            See a visual preview of your shared content before generating your Jump2 link.
            Real-time, secure, and frictionless.
          </p>
        </PreviewBox>
      </PanelWrapper>
    </Layout>
  );
}
