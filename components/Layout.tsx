import React from "react";
import Header from "./Header";
import Footer from "./Footer";
import styled from "styled-components";

const MainWrapper = styled.div`
  min-height: 100vh;
  background: radial-gradient(ellipse at top left, #16233b 70%, #020617 100%);
  color: #eaf0fa;
  font-family: 'Inter', sans-serif;
  display: flex;
  flex-direction: column;
`;

const Content = styled.main`
  flex: 1;
  width: 100%;
  max-width: 860px;
  margin: 0 auto;
  padding: 2.4em 1.2em 2em 1.2em;
`;

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <MainWrapper>
      <Header />
      <Content>{children}</Content>
      <Footer />
    </MainWrapper>
  );
}