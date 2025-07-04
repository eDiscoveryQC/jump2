// pages/share.tsx
import React, { useState, useEffect, useCallback, useRef } from "react";
import styled from "styled-components";
import Head from "next/head";
import ArticlePreviewFull from "@/components/ArticlePreviewFull";
import { FaLink, FaUpload, FaTimesCircle } from "react-icons/fa";
import { motion } from "framer-motion";
import toast, { Toaster } from "react-hot-toast";
import { supabase } from "@/lib/supabase";
import { logEvent } from "@/lib/log";
import { generateShortCode } from "@/lib/shortCode";
import AppLayout from "@/components/AppLayout";

const Container = styled.div`
  max-width: 1280px;
  margin: 0 auto;
  padding: 3rem 1rem;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const HeaderBlock = styled.div`
  margin-bottom: 2.5rem;
  text-align: center;
`;

const Title = styled.h1`
  font-size: 2.6rem;
  font-weight: 800;
  color: #facc15;
  text-shadow: 0 2px 6px rgba(14, 165, 233, 0.4);
`;

const Subtitle = styled.h2`
  font-size: 1.1rem;
  color: #cbd5e1;
  max-width: 740px;
  margin: 0.5rem auto 0;
`;

const InputRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  margin: 2rem 0;

  input[type="text"] {
    padding: 0.75rem 1rem;
    font-size: 1rem;
    border-radius: 0.5rem;
    border: 1px solid #334155;
    background: #1e293b;
    color: white;
    width: 360px;
  }

  input::placeholder {
    color: #94a3b8;
  }

  label,
  button {
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
    input,
    button,
    label {
      width: 100%;
    }
  }
`;

const AssistantBox = styled(motion.div)<{ mode?: string }>`
  background: #1e293b;
  border: 1px solid #334155;
  padding: 1.2rem 1.5rem;
  font-size: 1rem;
  max-width: 780px;
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
  text-align: center;
`;

const Divider = styled.hr`
  width: 100%;
  max-width: 840px;
  border: none;
  border-top: 1px solid #334155;
  margin: 2rem 0;
`;

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
  const { error } = await supabase.from("links").insert([{ code, url: originalUrl }]);
  if (error) {
    toast.error("Error creating short link.");
    return null;
  }
  try {
    await logEvent("create_link", { code, url: originalUrl });
  } catch (err) {
    console.warn(err);
  }
  return `https://jump2.link/${code}`;
}

export default function Share() {
  const [url, setUrl] = useState("");
  const [submittedUrl, setSubmittedUrl] = useState<string | null>(null);
  const [fileName, setFileName] = useState("");
  const [isValid, setIsValid] = useState(false);
  const [tip, setTip] = useState("Paste a link or upload a file to begin.");
  const [errorMsg, setErrorMsg] = useState("");
  const [mode, setMode] = useState<'url' | 'file'>('url');
  const previewRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!localStorage.getItem("visitedShare")) {
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
        setMode("url");
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
      setMode("url");
      setTip("🔗 URL loaded. Scroll down to begin.");
      setFileName("");
      setErrorMsg("");
      setTimeout(() => {
        previewRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 200);
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
    setMode("file");
    setTip("📄 File uploaded. Parsing support coming soon.");
    toast.success(`📁 ${file.name} uploaded`);
    setErrorMsg("");
  }, []);

  const clearInputs = useCallback(() => {
    setUrl("");
    setSubmittedUrl(null);
    setFileName("");
    setMode("url");
    setTip("Paste a link or upload a file to begin.");
    setErrorMsg("");
  }, []);

  return (
    <AppLayout>
      <Head>
        <title>Jump2 – Share the Moment That Matters</title>
        <meta name="description" content="Highlight. Meme. Timestamp. Upload. Welcome to Share-Tech." />
      </Head>
      <Toaster position="top-right" />

      <Container>
        <HeaderBlock>
          <Title>Create a Shareable Moment</Title>
          <Subtitle>Paste a link or upload a file — highlight key content, generate memes, or timestamp insights.</Subtitle>
        </HeaderBlock>

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
          <div ref={previewRef} style={{ width: "100%" }}>
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
                  try {
                    await navigator.clipboard.writeText(shortLink);
                  } catch {
                    console.warn("Clipboard copy failed.");
                  }
                }
              }}
            />
          </div>
        )}
      </Container>
    </AppLayout>
  );
}
