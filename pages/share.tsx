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

// --- Styled Components ---
const PageWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  background: linear-gradient(to right, #0f172a, #1e293b);
  color: #ffffff;
  min-height: 100vh;
  padding: 5rem 2rem;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
`;

const Title = styled.h1`
  font-size: 3.2rem;
  font-weight: bold;
  color: #facc15;
  margin-bottom: 1rem;
  text-align: center;
  text-shadow: 0 2px 6px rgba(14, 165, 233, 0.6);
`;

const Subtitle = styled.h2`
  font-size: 1.4rem;
  color: #e0e7ff;
  margin-bottom: 2.5rem;
  text-align: center;
  max-width: 720px;
`;

const InputRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  justify-content: center;
  align-items: center;
  margin-bottom: 2rem;

  input[type="text"] {
    padding: 0.75rem 1rem;
    font-size: 1rem;
    border-radius: 0.5rem;
    border: 1px solid #334155;
    background: #1e293b;
    color: white;
    width: 320px;
  }

  input::placeholder {
    color: #94a3b8;
  }

  label, button {
    background-color: #0ea5e9;
    padding: 0.7rem 1.2rem;
    border-radius: 0.5rem;
    color: white;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    border: none;
    transition: background 0.2s;
  }

  button {
    background-color: #16a34a;
  }

  button:hover {
    background-color: #15803d;
  }

  input[type="file"] {
    display: none;
  }

  @media (max-width: 600px) {
    flex-direction: column;
    input, button, label {
      width: 100%;
    }
  }
`;

const AssistantBox = styled(motion.div)<{ mode?: string }>`
  background: #1e293b;
  border: 1px solid #334155;
  padding: 1.2rem 1.5rem;
  font-size: 1rem;
  max-width: 680px;
  text-align: center;
  border-radius: 0.75rem;
  color: #e2e8f0;
  margin-bottom: 2rem;
  box-shadow: 0 0 22px ${({ mode }) => (mode === 'file' ? '#22c55eaa' : '#0ea5e9cc')};
`;

const ErrorMessage = styled.div`
  margin-top: 0.5rem;
  font-size: 0.95rem;
  color: #f87171;
`;

const Divider = styled.hr`
  width: 100%;
  max-width: 800px;
  border: none;
  border-top: 1px solid #334155;
  margin: 2rem 0;
`;

// --- Utilities ---
function isValidURL(str: string): boolean {
  try {
    const url = new URL(str);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

async function createJump2Link(originalUrl: string): Promise<string | null> {
  const code = await generateShortCode();
  const { error } = await supabase
    .from("links")
    .insert([{ code, url: originalUrl }]);
  if (error) {
    toast.error("Error creating short link.");
    return null;
  }
  await logEvent("create_link", { code, url: originalUrl });
  return `https://jump2.link/${code}`;
}

// --- Main Component ---
export default function Share() {
  const [url, setUrl] = useState("");
  const [submittedUrl, setSubmittedUrl] = useState<string | null>(null);
  const [fileName, setFileName] = useState("");
  const [isValid, setIsValid] = useState(false);
  const [tip, setTip] = useState("Paste a YouTube or article link to highlight or timestamp — or upload a document.");
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [mode, setMode] = useState<'url' | 'file'>('url');

  useEffect(() => {
    if (!localStorage.getItem("visitedShare")) {
      setShowOnboarding(true);
      localStorage.setItem("visitedShare", "true");
      toast("🚀 You can highlight, timestamp, and generate memes after sharing!");
    }
  }, []);

  useEffect(() => {
    const t = setTimeout(() => {
      const trimmed = url.trim();
      const valid = isValidURL(trimmed);
      setIsValid(valid);
      if (valid) {
        setSubmittedUrl(trimmed);
        setMode('url');
        setTip("✅ Link detected. Scroll down to highlight, meme, or timestamp.");
        setErrorMsg("");
        setFileName("");
      }
    }, 400);
    return () => clearTimeout(t);
  }, [url]);

  const handlePaste = useCallback(() => {
    const trimmed = url.trim();
    if (isValidURL(trimmed)) {
      setSubmittedUrl(trimmed);
      setMode('url');
      setTip("🔗 URL loaded. Scroll down to begin.");
      setFileName("");
      setErrorMsg("");
    } else {
      toast.error("Invalid URL");
      setErrorMsg("❌ Invalid URL — please double check.");
    }
  }, [url]);

  const handleFileUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setFileName(file.name);
    setSubmittedUrl(null);
    setMode('file');
    setTip("📄 File uploaded. Parsing support coming soon.");
    toast.success(`📁 ${file.name} uploaded`);
    setErrorMsg("");
  }, []);

  const clearInputs = useCallback(() => {
    setUrl("");
    setSubmittedUrl(null);
    setFileName("");
    setMode('url');
    setTip("Paste a YouTube or article link to highlight or timestamp — or upload a document.");
    setErrorMsg("");
  }, []);

  return (
    <>
      <Head>
        <title>Jump2 – Share the Moment That Matters</title>
        <meta name="description" content="Highlight. Meme. Timestamp. Upload. Welcome to Share-Tech." />
      </Head>

      <Toaster position="top-right" />

      <PageWrapper>
        <Title>🔗 Create Your Jump2</Title>
        <Subtitle>
          Paste a link or upload a document — highlight key text, add a meme, or generate a shareable moment.
        </Subtitle>

        {showOnboarding && (
          <AssistantBox
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            mode={mode}
          >
            👋 Welcome! Paste a URL or upload a file to begin. <br />
            <button onClick={() => setShowOnboarding(false)} style={{
              marginTop: '1rem',
              background: '#334155',
              color: '#fff',
              padding: '0.5rem 1rem',
              borderRadius: '0.4rem'
            }}>
              Got it
            </button>
          </AssistantBox>
        )}

        <InputRow>
          <input
            type="text"
            placeholder="Paste article or YouTube link..."
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handlePaste()}
            aria-label="Paste a link"
          />
          <button onClick={handlePaste} disabled={!isValid}>
            <FaLink /> Share URL
          </button>
          <label>
            <FaUpload /> Upload
            <input type="file" accept=".pdf,.doc,.docx,.txt" onChange={handleFileUpload} />
          </label>
          {fileName && (
            <button onClick={clearInputs}>
              <FaTimesCircle /> Clear
            </button>
          )}
        </InputRow>

        {errorMsg && <ErrorMessage>{errorMsg}</ErrorMessage>}

        <AssistantBox
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          mode={mode}
        >
          {tip}
        </AssistantBox>

        <Divider />

        {mode === 'file' && fileName && (
          <p style={{ color: "#fef08a" }}>
            ⏳ Parsing support for <strong>{fileName}</strong> coming soon…
          </p>
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
                toast.success(`🔗 Jump2 link created & copied!`);
                navigator.clipboard.writeText(shortLink);
              }
            }}
          />
        )}
      </PageWrapper>
    </>
  );
}
