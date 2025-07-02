import React, { useState } from "react";
import styled from "styled-components";
import Head from "next/head";
import ArticlePreviewFull from "@/components/ArticlePreviewFull";
import { FaLink, FaFileUpload } from "react-icons/fa";

const PageWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  background: linear-gradient(to right, #0f172a, #1e293b);
  color: #ffffff;
  min-height: 100vh;
  padding: 4rem 1.5rem 6rem;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
`;

const Title = styled.h1`
  font-size: 3.8rem;
  font-weight: 900;
  letter-spacing: -1px;
  color: #facc15;
  text-shadow: 0 2px 10px #0ea5e9cc;
  margin-bottom: 1rem;
`;

const Subtitle = styled.h2`
  font-size: 1.6rem;
  font-weight: 500;
  max-width: 860px;
  line-height: 1.7;
  text-align: center;
  color: #fef08a;
  margin-bottom: 2.4rem;
`;

const InputBox = styled.div`
  background: #1e293b;
  border: 1px solid #334155;
  border-radius: 1rem;
  padding: 2.2rem;
  width: 100%;
  max-width: 800px;
  box-shadow: 0 0 20px #0ea5e980;
  margin-bottom: 3rem;
`;

const InputRow = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.2rem;

  @media (min-width: 600px) {
    flex-direction: row;
    align-items: center;
  }
`;

const Input = styled.input`
  flex: 1;
  padding: 0.8rem 1rem;
  font-size: 1.15rem;
  border-radius: 0.6rem;
  border: none;
  outline: none;
  background: #0f172a;
  color: #e2e8f0;
  box-shadow: inset 0 0 0 1px #334155;
`;

const Button = styled.button`
  padding: 0.8rem 1.5rem;
  font-size: 1.05rem;
  background: #10b981;
  color: #fff;
  border: none;
  border-radius: 0.5rem;
  cursor: pointer;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 0.6rem;
  transition: all 0.2s ease;

  &:hover {
    background: #059669;
    transform: scale(1.03);
  }
`;

const Divider = styled.hr`
  width: 100%;
  max-width: 780px;
  border: none;
  border-top: 1px solid #334155;
  margin: 3rem 0;
`;

const FileLabel = styled.label`
  flex: 1;
  padding: 0.8rem 1rem;
  font-size: 1.1rem;
  border-radius: 0.5rem;
  background: #0f172a;
  color: #cbd5e1;
  box-shadow: inset 0 0 0 1px #334155;
  cursor: pointer;
  text-align: center;
`;

const FileInput = styled.input`
  display: none;
`;

const FileName = styled.p`
  margin-top: 1rem;
  color: #cbd5e1;
  font-style: italic;
`;

export default function Share() {
  const [url, setUrl] = useState("");
  const [submittedUrl, setSubmittedUrl] = useState<string | null>(null);
  const [fileName, setFileName] = useState("");

  const handlePaste = () => {
    if (url.trim()) setSubmittedUrl(url.trim());
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setFileName(file.name);
    alert(`📁 File selected: ${file.name}\n(Parsing support coming soon...)`);
  };

  return (
    <>
      <Head>
        <title>Jump2 – Share the Moment That Matters</title>
        <meta name="description" content="Highlight. Meme. Timestamp. Upload. Welcome to Share-Tech." />
        <meta property="og:title" content="Jump2 – Highlight Anything, Share Everything" />
        <meta property="og:image" content="https://jump2.link/share-og.jpg" />
        <meta property="og:url" content="https://jump2.link/share" />
        <meta property="og:description" content="Built for creators and curators — Jump2 lets you clip, highlight, and share precise content from any source." />
      </Head>

      <PageWrapper>
        <Title>🎯 Jump2 Smart Share</Title>
        <Subtitle>
          Paste a link or upload a file. Highlight, timestamp, meme — and generate a smart, shareable link.
        </Subtitle>

        <InputBox>
          <InputRow>
            <Input
              placeholder="Paste article or video link..."
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handlePaste()}
            />
            <Button onClick={handlePaste}><FaLink /> Share URL</Button>
          </InputRow>

          <Divider />

          <InputRow>
            <FileLabel htmlFor="fileUpload">Select a file to upload...</FileLabel>
            <FileInput id="fileUpload" type="file" accept=".pdf,.doc,.docx,.txt" onChange={handleFileUpload} />
            <Button as="label" htmlFor="fileUpload"><FaFileUpload /> Upload File</Button>
          </InputRow>

          {fileName && <FileName>📎 {fileName}</FileName>}
        </InputBox>

        {submittedUrl && (
          <ArticlePreviewFull
            url={submittedUrl}
            scrapeEngine="scrapingbee"
            enableYouTubeTimestamp
            supportArticles
            supportMemes
          />
        )}
      </PageWrapper>
    </>
  );
}
