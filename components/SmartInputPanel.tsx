// components/SmartInputPanel.tsx
import React, { useState, useCallback, useEffect } from "react";
import styled from "styled-components";
import { FaLink, FaUpload, FaWandMagicSparkles, FaTimesCircle } from "react-icons/fa6";
import { motion } from "framer-motion";
import toast from "react-hot-toast";

const Panel = styled(motion.div)`
  background: linear-gradient(to bottom right, #1e293b, #0f172a);
  border: 1px solid #334155;
  padding: 2rem;
  border-radius: 1rem;
  box-shadow: 0 0 50px rgba(14, 165, 233, 0.3);
  width: 100%;
  max-width: 800px;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const Row = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const Input = styled.input`
  padding: 1rem 1.2rem;
  font-size: 1.1rem;
  border-radius: 0.6rem;
  border: 1px solid #334155;
  background: #0f172a;
  color: white;
  width: 100%;

  &::placeholder {
    color: #64748b;
  }
`;

const ButtonRow = styled.div`
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;

  button,
  label {
    padding: 0.9rem 1.4rem;
    font-size: 1rem;
    border-radius: 0.5rem;
    border: none;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    transition: all 0.2s;
    color: white;
  }

  button.primary {
    background: #16a34a;
  }

  button.primary:hover {
    background: #15803d;
  }

  label.upload {
    background: #0ea5e9;
  }

  label.upload:hover {
    background: #0284c7;
  }

  button.clear {
    background: #334155;
  }

  input[type="file"] {
    display: none;
  }
`;

const Tip = styled(motion.div)`
  font-size: 1rem;
  color: #cbd5e1;
  padding-top: 0.5rem;
`;

export default function SmartInputPanel({
  url,
  setUrl,
  setSubmittedUrl,
  fileName,
  setFileName,
  setMode,
  tip,
  setTip,
}: {
  url: string;
  setUrl: (val: string) => void;
  setSubmittedUrl: (val: string | null) => void;
  fileName: string;
  setFileName: (val: string) => void;
  setMode: (val: 'url' | 'file') => void;
  tip: string;
  setTip: (val: string) => void;
}) {
  const [isValid, setIsValid] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => {
      const trimmed = url.trim();
      try {
        const u = new URL(trimmed);
        setIsValid(u.protocol === 'http:' || u.protocol === 'https:');
      } catch {
        setIsValid(false);
      }
    }, 300);
    return () => clearTimeout(t);
  }, [url]);

  const handlePaste = useCallback(() => {
    const trimmed = url.trim();
    try {
      const parsed = new URL(trimmed);
      if (parsed.protocol === 'http:' || parsed.protocol === 'https:') {
        setSubmittedUrl(trimmed);
        setMode("url");
        setTip("🔗 Ready. Scroll to preview.");
        setFileName("");
        return;
      }
    } catch {
      toast.error("Invalid URL");
    }
  }, [url]);

  const handleFileUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setFileName(file.name);
    setSubmittedUrl(null);
    setMode("file");
    setTip("📄 File uploaded. Parsing coming soon.");
    toast.success(`📁 ${file.name} uploaded`);
  }, []);

  const clear = useCallback(() => {
    setUrl("");
    setSubmittedUrl(null);
    setFileName("");
    setMode("url");
    setTip("Paste a link or upload a file to begin.");
  }, []);

  return (
    <Panel
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Row>
        <Input
          type="text"
          placeholder="Paste article or video link..."
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handlePaste()}
        />
      </Row>
      <ButtonRow>
        <button onClick={handlePaste} className="primary" disabled={!isValid}>
          <FaLink /> Share URL
        </button>
        <label className="upload">
          <FaUpload /> Upload File
          <input type="file" accept=".pdf,.doc,.docx,.txt" onChange={handleFileUpload} />
        </label>
        {fileName && (
          <button onClick={clear} className="clear">
            <FaTimesCircle /> Clear
          </button>
        )}
      </ButtonRow>
      <Tip
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        {tip}
      </Tip>
    </Panel>
  );
}
