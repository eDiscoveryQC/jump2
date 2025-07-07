import React from "react";
import Head from "next/head";
import styled, { keyframes } from "styled-components";
import SmartInputPanel from "@/components/SmartInputPanel";

const pulseGlow = keyframes`
  0% { box-shadow: 0 0 20px rgba(250, 204, 21, 0.2); }
  50% { box-shadow: 0 0 40px rgba(250, 204, 21, 0.6); }
  100% { box-shadow: 0 0 20px rgba(250, 204, 21, 0.2); }
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  padding: 5rem 2rem;
  background: radial-gradient(circle at top left, #0f172a, #1e3a8a);
  min-height: 100vh;
  width: 100vw;
  color: #fff;
  margin: 0;
  overflow-x: hidden;
`;

const Title = styled.h1`
  font-size: 3.6rem;
  font-weight: 900;
  margin-bottom: 1rem;
  color: #facc15;
  text-align: center;
  text-shadow: 0 0 20px #fde68a;
  animation: ${pulseGlow} 3s infinite;
`;

const Subtitle = styled.p`
  font-size: 1.35rem;
  max-width: 820px;
  margin: 0 auto 3rem auto;
  text-align: center;
  color: #e2e8f0;
  line-height: 1.7;
`;

const Section = styled.section`
  display: flex;
  justify-content: space-between;
  align-items: stretch;
  margin-top: 2rem;
  gap: 2rem;

  @media (max-width: 960px) {
    flex-direction: column;
  }
`;

const LeftPane = styled.div`
  flex: 1;
  background: #0a0e1a;
  padding: 2.75rem;
  border-radius: 1.5rem;
  box-shadow: 0 0 40px rgba(14, 165, 233, 0.2);
  border: 1px solid #334155;
  transition: 0.3s ease all;
  backdrop-filter: blur(6px);

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 0 50px rgba(14, 165, 233, 0.4);
  }
`;

const RightPane = styled.div`
  flex: 1;
  background: #1e293b;
  padding: 2.75rem;
  border-radius: 1.5rem;
  border: 1px solid #334155;
  box-shadow: inset 0 0 0 2px #3b82f655;

  h3 {
    font-size: 1.5rem;
    margin-bottom: 1rem;
    color: #7dd3fc;
  }

  p {
    font-size: 1.1rem;
    color: #cbd5e1;
    line-height: 1.7;
  }
`;

export default function SharePage() {
  return (
    <>
      <Head>
        <title>Jump2 — Share Smarter</title>
        <meta
          name="description"
          content="Jump2 makes sharing faster, smarter, and more beautiful. Paste a link or drop a file."
        />
      </Head>

      <Container>
        <Title>Jump2: The Creator’s Drop Zone</Title>
        <Subtitle>
          Paste a link, upload a file, or drop a doc. Instantly generate a smart preview, protect
          your content, and track performance — built with creators in mind.
        </Subtitle>

        <Section>
          <LeftPane>
            <SmartInputPanel onShareGenerated={(url) => console.log("Generated:", url)} />
          </LeftPane>

          <RightPane>
            <h3>Live Smart Preview</h3>
            <p>
              Instantly preview your content before it goes live. Jump2 generates a real-time
              visualization so you always know exactly what your audience will see.
            </p>
          </RightPane>
        </Section>
      </Container>
    </>
  );
}
