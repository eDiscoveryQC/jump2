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

const FullPage = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
  background: linear-gradient(to right, #0f172a, #1e293b);
  color: white;
  padding: 3rem 2rem;
  @media (max-width: 768px) {
    padding: 1.2rem;
  }
`;

const Section = styled.section`
  max-width: 1440px;
  margin: 0 auto;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Title = styled.h1`
  font-size: 3rem;
  font-weight: 900;
  color: #facc15;
  text-shadow: 0 2px 6px rgba(14, 165, 233, 0.4);
  margin-bottom: 1rem;
  text-align: center;
`;

const Subtitle = styled.p`
  font-size: 1.25rem;
  max-width: 840px;
  text-align: center;
  color: #cbd5e1;
`;

const Form = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  margin: 2.5rem 0 3rem;
  gap: 1rem;

  input[type="text"] {
    padding: 0.85rem 1.2rem;
    font-size: 1rem;
    border-radius: 0.5rem;
    border: 1px solid #334155;
    background: #1e293b;
    color: white;
    width: 460px;
  }

  input::placeholder {
    color: #94a3b8;
  }

  label,
  button {
    padding: 0.85rem 1.3rem;
    border-radius: 0.5rem;
    font-size: 1rem;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    border: none;
    cursor: pointer;
    color: white;
  }

  button {
    background-color: #16a34a;
    transition: background 0.2s;
  }

  button:hover {
    background-color: #15803d;
  }

  label {
    background-color: #0ea5e9;
  }

  input[type="file"] {
    display: none;
  }

  @media (max-width: 640px) {
    flex-direction: column;
    input,
    button,
    label {
      width: 100%;
    }
  }
`;

const Assistant = styled(motion.div)`
  padding: 1.6rem;
  background: #1e293b;
  border: 1px solid #334155;
  color: #e2e8f0;
  border-radius: 0.75rem;
  max-width: 900px;
  text-align: center;
  margin-bottom: 2rem;
  box-shadow: 0 0 28px #0ea5e9cc;
`;

const Divider = styled.hr`
  width: 100%;
  max-width: 940px;
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
  if (error) return toast.error("Error creating short link.");
  try {
    await logEvent("create_link", { code, url: originalUrl });
  } catch (err) {
    console.warn(err);
  }
  return `https://jump2.link/${code}`;
}

export default function SharePage() {
  const [url, setUrl] = useState("");
  const [submittedUrl, setSubmittedUrl] = useState<string | null>(null);
  const [fileName, setFileName] = useState("");
  const [isValid, setIsValid] = useState(false);
  const [tip, setTip] = useState("Paste a link or upload a file to begin.");
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
      setTimeout(() => previewRef.current?.scrollIntoView({ behavior: "smooth" }), 200);
    } else {
      toast.error("Invalid URL");
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
  }, []);

  const clearInputs = useCallback(() => {
    setUrl("");
    setSubmittedUrl(null);
    setFileName("");
    setMode("url");
    setTip("Paste a link or upload a file to begin.");
  }, []);

  return (
    <AppLayout fullScreen>
      <Head>
        <title>Jump2 – Share the Moment That Matters</title>
        <meta name="description" content="Highlight. Meme. Timestamp. Upload. Welcome to Sharing-as-a-Service." />
      </Head>
      <Toaster position="top-right" />
      <FullPage>
        <Section>
          <Title>Create a Shareable Moment</Title>
          <Subtitle>Paste a link or upload a file — highlight key content, generate memes, timestamp insights, and generate smart share links.</Subtitle>
          <Form>
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
          </Form>
          <Assistant
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            {tip}
          </Assistant>
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
        </Section>
      </FullPage>
    </AppLayout>
  );
}
