// pages/share.tsx
import React, { useState, useEffect, useCallback } from "react";
import styled from "styled-components";
import Head from "next/head";
import ArticlePreviewFull from "@/components/ArticlePreviewFull";
import { FaLink, FaUpload, FaTimesCircle } from "react-icons/fa";
import { motion } from "framer-motion";
import toast, { Toaster } from "react-hot-toast";
import { supabase } from "@/lib/supabase";
import { logEvent } from "@/lib/log";
import { generateShortCode } from "@/lib/shortCode";

// ————————————————————————————
// Styled Components
// ————————————————————————————
const Page = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  background: linear-gradient(135deg, #0f172a, #1e293b);
  min-height: 100vh;
  padding: 5rem 2rem;
  font-family: 'Segoe UI', Tahoma, sans-serif;
`;

const Title = styled.h1`
  font-size: 3rem;
  font-weight: 900;
  color: #facc15;
  text-align: center;
  margin-bottom: 1rem;
  text-shadow: 0 2px 8px rgba(14, 165, 233, 0.5);
`;

const Subtitle = styled.h2`
  font-size: 1.3rem;
  color: #cbd5e1;
  text-align: center;
  max-width: 700px;
  margin-bottom: 2rem;
`;

const InputRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  justify-content: center;
  align-items: center;
  margin-bottom: 2rem;

  input[type="text"] {
    width: 320px;
    padding: 0.75rem 1rem;
    border-radius: 0.5rem;
    border: 1px solid #334155;
    background: #1e293b;
    color: #fff;
    font-size: 1rem;
  }
  input::placeholder {
    color: #94a3b8;
  }
  input[type="file"] {
    display: none;
  }
  button, label {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.75rem 1.2rem;
    border-radius: 0.5rem;
    border: none;
    font-size: 1rem;
    cursor: pointer;
    transition: background 0.2s;
  }
  button {
    background: #16a34a;
    color: #fff;
  }
  button:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
  button:hover:enabled {
    background: #15803d;
  }
  label {
    background: #0ea5e9;
    color: #fff;
  }
  @media (max-width: 600px) {
    flex-direction: column;
    input, button, label {
      width: 100%;
    }
  }
`;

const AssistantBox = styled(motion.div)<{ mode: 'url' | 'file' }>`
  max-width: 680px;
  width: 100%;
  padding: 1rem 1.5rem;
  border-radius: 0.75rem;
  background: #1e293b;
  border: 1px solid #334155;
  color: #e2e8f0;
  text-align: center;
  margin-bottom: 2rem;
  box-shadow: 0 0 22px ${({ mode }) => mode === 'file' ? "#22c55eaa" : "#0ea5e9cc"};
`;

const ErrorMsg = styled.div`
  color: #f87171;
  margin-bottom: 1rem;
`;

const Divider = styled.hr`
  width: 100%;
  max-width: 800px;
  border: none;
  border-top: 1px solid #334155;
  margin: 2rem 0;
`;

// ————————————————————————————
// Helpers
// ————————————————————————————
const validateUrl = (str: string): boolean => {
  try {
    const url = new URL(str);
    return ["http:", "https:"].includes(url.protocol);
  } catch {
    return false;
  }
};

async function createJump2Link(originalUrl: string): Promise<string | null> {
  const code = await generateShortCode();
  const { error } = await supabase.from("links").insert([{ code, url: originalUrl }]);
  if (error) {
    console.error("Supabase error:", error);
    toast.error("Server error creating link.");
    return null;
  }
  logEvent("create_link", { code, url: originalUrl }).catch(console.warn);
  return `https://jump2.link/${code}`;
}

// ————————————————————————————
// Main Component
// ————————————————————————————
export default function Share() {
  const [url, setUrl] = useState("");
  const [submittedUrl, setSubmittedUrl] = useState<string | null>(null);
  const [fileName, setFileName] = useState("");
  const [isValid, setIsValid] = useState(false);
  const [tipMsg, setTipMsg] = useState("Paste a link or upload a document.");
  const [showOnboard, setShowOnboard] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [mode, setMode] = useState<'url' | 'file'>('url');

  useEffect(() => {
    if (!localStorage.getItem("visitedShare")) {
      setShowOnboard(true);
      localStorage.setItem("visitedShare", "true");
    }
  }, []);

  useEffect(() => {
    const handle = setTimeout(() => {
      const trimmed = url.trim();
      setIsValid(validateUrl(trimmed));
      if (validateUrl(trimmed)) {
        setSubmittedUrl(trimmed);
        setMode('url');
        setTipMsg("✅ Link detected — start highlighting or clipping below!");
        setErrorMsg("");
        setFileName("");
      }
    }, 300);
    return () => clearTimeout(handle);
  }, [url]);

  const handleShare = useCallback(() => {
    const trimmed = url.trim();
    if (!validateUrl(trimmed)) {
      setErrorMsg("❌ Invalid URL");
      toast.error("Invalid URL");
      return;
    }
    setSubmittedUrl(trimmed);
    setMode('url');
    setErrorMsg("");
    setTipMsg("🔗 URL Loaded — scroll to highlight.");
  }, [url]);

  const handleUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.length) return;
    const f = e.target.files[0];
    setFileName(f.name);
    setSubmittedUrl(null);
    setMode('file');
    setTipMsg(`📄 ${f.name} uploaded — parsing soon...`);
    setErrorMsg("");
    toast.success(`Uploaded: ${f.name}`);
  }, []);

  const clearAll = useCallback(() => {
    setUrl("");
    setSubmittedUrl(null);
    setFileName("");
    setMode('url');
    setTipMsg("Paste a link or upload a document.");
    setErrorMsg("");
  }, []);

  return (
    <>
      <Head>
        <title>Jump2 – Share the Moment That Matters</title>
        <meta name="description" content="Jump2: highlight, meme, timestamp from any content." />
      </Head>

      <Toaster position="top-right" />

      <Page>
        <Title>🔗 Create Your Jump2</Title>
        <Subtitle>
          Highlight text, generate memes or timestamps — from articles, YouTube, or uploads.
        </Subtitle>

        {showOnboard && (
          <AssistantBox
            mode={mode}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            Welcome! Paste a URL or upload a file to begin.{" "}
            <button onClick={() => setShowOnboard(false)} style={{
              marginTop: '1rem',
              padding: '0.5rem 1rem',
              background: '#334155',
              color: '#fff',
              borderRadius: '0.4rem'
            }}>Got it</button>
          </AssistantBox>
        )}

        <InputRow>
          <input
            type="text"
            placeholder="Paste article or YouTube link..."
            aria-label="URL input"
            value={url}
            onChange={e => setUrl(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleShare()}
          />
          <button onClick={handleShare} disabled={!isValid}>
            <FaLink /> Share URL
          </button>
          <label>
            <FaUpload /> Upload File
            <input type="file" accept=".pdf,.doc,.docx,.txt" onChange={handleUpload} />
          </label>
          {fileName && (
            <button onClick={clearAll}>
              <FaTimesCircle /> Clear
            </button>
          )}
        </InputRow>

        {errorMsg && <ErrorMsg>{errorMsg}</ErrorMsg>}

        <AssistantBox
          mode={mode}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {tipMsg}
        </AssistantBox>

        <Divider />

        {mode === 'file' && fileName && (
          <p style={{ color: '#fef08a' }}>⏳ Parsing support coming soon for <strong>{fileName}</strong>.</p>
        )}

        {submittedUrl && (
          <ArticlePreviewFull
            url={submittedUrl}
            scrapeEngine="scrapingbee"
            enableYouTubeTimestamp
            supportArticles
            supportMemes
            onGenerateLink={async (link) => {
              const shortLink = await createJump2Link(link);
              if (shortLink) {
                toast.success("🔗 Jump2 link created & copied!");
                navigator.clipboard.writeText(shortLink);
              }
            }}
          />
        )}
      </Page>
    </>
  );
}
