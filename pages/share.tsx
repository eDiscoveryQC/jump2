import React from "react";
import Head from "next/head";
import styled from "styled-components";
import SmartInputPanel from "@/components/SmartInputPanel";
import Layout from "@/components/Layout";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  padding: 4rem 1.5rem;
  background: linear-gradient(145deg, #0f172a 20%, #1e3a8a 100%);
  min-height: 100vh;
  width: 100vw;
  color: #fff;
  margin: 0;
`;

const Title = styled.h1`
  font-size: 3rem;
  font-weight: 800;
  margin-bottom: 1rem;
  color: #facc15;
  text-align: center;
  text-shadow: 0 0 10px rgba(250, 204, 21, 0.5);
`;

const Subtitle = styled.p`
  font-size: 1.25rem;
  max-width: 780px;
  margin: 0 auto;
  text-align: center;
  color: #cbd5e1;
`;

const Section = styled.section`
  display: flex;
  justify-content: space-between;
  margin-top: 4rem;
  gap: 2rem;

  @media (max-width: 960px) {
    flex-direction: column;
  }
`;

const LeftPane = styled.div`
  flex: 1;
  background: #020617;
  padding: 2.5rem;
  border-radius: 1.5rem;
  box-shadow: 0 0 30px rgba(14, 165, 233, 0.15);
  transition: 0.3s ease all;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 0 40px rgba(14, 165, 233, 0.3);
  }
`;

const RightPane = styled.div`
  flex: 1;
  background: #1e293b;
  padding: 2.5rem;
  border-radius: 1.5rem;
  box-shadow: inset 0 0 0 2px #3b82f6aa;

  h3 {
    font-size: 1.4rem;
    margin-bottom: 1rem;
    color: #7dd3fc;
  }

  p {
    color: #cbd5e1;
    line-height: 1.6;
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
    </Layout>
  );
}
