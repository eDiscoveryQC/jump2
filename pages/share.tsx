import React, { useState, useEffect } from "react";
import styled from "styled-components";
import Head from "next/head";
import ArticlePreviewFull from "@/components/ArticlePreviewFull";
import { FaLink, FaUpload, FaTimes } from "react-icons/fa6";
import { motion } from "framer-motion";
import toast, { Toaster } from "react-hot-toast";

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
  font-size: 3.4rem;
  font-weight: 900;
  color: #facc15;
  margin-bottom: 1rem;
  text-shadow: 0 2px 8px #0ea5e9aa;
  text-align: center;
`;

const Subtitle = styled.h2`
  font-size: 1.6rem;
  font-weight: 500;
  max-width: 720px;
  text-align: center;
  color: #fef08a;
  margin-bottom: 2.4rem;
`;

const InputRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  justify-content: center;
  align-items: center;
  margin-bottom: 1.6rem;

  input[type="text"] {
    padding: 0.75rem 1rem;
    font-size: 1.05rem;
    border-radius: 0.5rem;
    border: 1px solid #334155;
    width: 320px;
    background: #1e293b;
    color: white;
    box-shadow: 0 0 14px rgba(14, 165, 233, 0.7);
  }

  input[type="file"] {
    display: none;
  }

  label {
    background-color: #0ea5e9;
    padding: 0.75rem 1.2rem;
    border-radius: 0.5rem;
    color: white;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  button {
    background-color: #16a34a;
    padding: 0.75rem 1.2rem;
    border: none;
    border-radius: 0.5rem;
    color: white;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }
`;

const AssistantBox = styled(motion.div)`
  background: #1e293b;
  border: 1px solid #334155;
  padding: 1.2rem 1.5rem;
  font-size: 1.05rem;
  max-width: 680px;
  text-align: center;
  border-radius: 0.75rem;
  color: #e2e8f0;
  margin-bottom: 2.2rem;
  box-shadow: 0 0 18px #0ea5e9cc;
`;

const Divider = styled.hr`
  width: 100%;
  max-width: 800px;
  border: none;
  border-top: 1px solid #334155;
  margin: 2rem 0;
`;

export default function Share() {
  const [url, setUrl] = useState("");
  const [submittedUrl, setSubmittedUrl] = useState<string | null>(null);
  const [fileName, setFileName] = useState("");
  const [isValid, setIsValid] = useState(false);
  const [tip, setTip] = useState("Paste a YouTube link to highlight or timestamp — or upload a document.");
  const [firstVisit, setFirstVisit] = useState(false);

  useEffect(() => {
    if (!localStorage.getItem("visitedShare")) {
      setFirstVisit(true);
      localStorage.setItem("visitedShare", "true");
      setTip("👋 First time? Paste a link or upload a file to begin.");
    }
  }, []);

  useEffect(() => {
    const timeout = setTimeout(() => {
      const urlRegex = /^(https?:\/\/)?([\w-]+\.)+[\w-]+(\/\S*)?$/i;
      const isUrlValid = urlRegex.test(url.trim());
      setIsValid(isUrlValid);
      if (url && isUrlValid) {
        setSubmittedUrl(url.trim());
        setTip("✅ Link detected! Scroll down to highlight, meme, or timestamp.");
      }
    }, 800);
    return () => clearTimeout(timeout);
  }, [url]);

  const handlePaste = () => {
    const urlRegex = /^(https?:\/\/)?([\w-]+\.)+[\w-]+(\/\S*)?$/i;
    if (urlRegex.test(url.trim())) {
      setSubmittedUrl(url.trim());
      setTip("🔗 URL loaded. Scroll down to begin highlighting or clipping.");
    } else {
      toast.error("Invalid URL — please double check.");
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setFileName(file.name);
    setSubmittedUrl(null);
    setTip("📄 File uploaded. Parsing support coming soon. ⏳");
    toast.success(`📁 ${file.name} uploaded`);
  };

  const clearInputs = () => {
    setUrl("");
    setFileName("");
    setSubmittedUrl(null);
    setTip("Paste a YouTube link to highlight or timestamp — or upload a document.");
  };

  return (
    <>
      <Head>
        <title>Jump2 – Share the Moment That Matters</title>
        <meta name="description" content="Highlight. Meme. Timestamp. Upload. Welcome to Share-Tech." />
        <meta property="og:title" content="Jump2 – Highlight Anything, Share Everything" />
        <meta property="og:image" content="https://jump2.link/assets/og/share-og.png" />
        <meta property="og:url" content="https://jump2.link/share" />
        <meta property="og:description" content="Built for creators and curators — Jump2 lets you clip, highlight, and share precise content from any source." />
      </Head>

      <Toaster position="top-right" />

      <PageWrapper>
        <Title>🔗 Create Your Jump2</Title>
        <Subtitle>
          Paste a link or upload a doc — then highlight key text, add a meme, or generate a shareable moment.
        </Subtitle>

        <InputRow>
          <input
            type="text"
            placeholder="Paste article or YouTube link..."
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handlePaste()}
          />
          <button onClick={handlePaste}>
            <FaLink /> Share URL
          </button>
          <label>
            <FaUpload /> Upload
            <input type="file" accept=".pdf,.doc,.docx,.txt" onChange={handleFileUpload} />
          </label>
          {fileName && <button onClick={clearInputs}><FaTimes /> Clear</button>}
        </InputRow>

        <AssistantBox
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          {tip}
        </AssistantBox>

        <Divider />

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
