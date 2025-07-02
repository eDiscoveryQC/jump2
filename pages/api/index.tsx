import React from "react";
import styled from "styled-components";

const PageWrapper = styled.div`
  max-width: 700px;
  margin: 3em auto 2em auto;
  padding: 2.4em 2em 2em 2em;
  background: rgba(16,23,45,0.97);
  border-radius: 1.15em;
  color: #eaf0fa;
  font-family: 'Inter', sans-serif;
  box-shadow: 0 8px 32px 0 #1e293b33, 0 0 0 2.5px #2563eb77;
`;

const Headline = styled.h1`
  color: #67b7fd;
  font-size: 2.2em;
  font-weight: 900;
  margin-bottom: 0.5em;
`;

const SectionTitle = styled.h2`
  color: #ffe066;
  font-size: 1.17em;
  font-weight: 800;
  margin: 2em 0 0.7em 0;
`;

const List = styled.ul`
  margin-left: 1.3em;
  margin-bottom: 1.2em;
  li {
    margin-bottom: 0.5em;
    font-size: 1.05em;
  }
`;

const CTAButton = styled.a`
  display: inline-block;
  margin-top: 2.1em;
  padding: 0.78em 2.2em;
  background: linear-gradient(90deg, #3b82f6 10%, #2563eb 90%);
  color: #fff;
  font-weight: 800;
  border-radius: 0.7em;
  font-size: 1.14em;
  letter-spacing: 0.01em;
  box-shadow: 0 3px 16px #2563eb66;
  text-decoration: none;
  transition: background 0.13s, transform 0.12s;
  &:hover, &:focus {
    background: linear-gradient(90deg, #2563eb 10%, #3b82f6 90%);
    transform: scale(1.04);
    outline: none;
  }
`;

export default function ApiPage() {
  return (
    <PageWrapper>
      <Headline>Power Your Platform with Smart Sharing</Headline>
      <p>
        Jump2’s API lets you integrate intelligent content highlights directly into your platform. Enable users to select key moments, generate jumpable links, and share insights with precision.
      </p>
      <SectionTitle>For Developers:</SectionTitle>
      <List>
        <li>Extract highlights and generate shareable links via REST</li>
        <li>Retrieve user-generated clips from any article</li>
        <li>Integrate seamlessly with blogs, learning platforms, news sites</li>
      </List>
      <SectionTitle>Use Cases:</SectionTitle>
      <List>
        <li>Add <b>“Jump To This”</b> buttons in educational content</li>
        <li>Let creators embed jumpable excerpts on their own pages</li>
        <li>Power internal research tools with smart bookmarks</li>
      </List>
      <CTAButton href="mailto:support@jump2share.com?subject=Request%20Early%20API%20Access">
        Request Early API Access
      </CTAButton>
    </PageWrapper>
  );
}