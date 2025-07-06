// components/SmartInputPanel.tsx
import React, { useState, useCallback, useEffect } from "react";
import styled from "styled-components";
import { FaLink, FaUpload, FaWandMagicSparkles } from "react-icons/fa6";
import { FaTimesCircle } from "react-icons/fa"; // ✅ Patched to avoid build failure
import { motion } from "framer-motion";
import toast from "react-hot-toast";

const Panel = styled(motion.div)`
  background: linear-gradient(to bottom right, #1e293b, #0f172a);
  border: 1px solid #334155;
  padding: 2rem;
  border-radius: 1.2rem;
  box-shadow: 0 0 40px rgba(14, 165, 233, 0.2);
  width: 100%;
  max-width: 800px;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  position: relative;
`;

const Row = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const Input = styled.input`
  padding: 1.1rem 1.4rem;
  font-size: 1.15rem;
  border-radius: 0.7rem;
  border: 1px solid #334155;
  background: #0f172a;
  color: white;
  width: 100%;
  transition: border 0.3s ease;

  &:focus {
    outline: none;
    border-color: #0ea5e9;
  }

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
    padding: 0.85rem 1.3rem;
    font-size: 1rem;
    border-radius: 0.6rem;
    border: none;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    transition: all 0.25s ease;
    color: white;
    font-weight: 500;
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
  font-size: 1.05rem;
  color: #cbd5e1;
  padding-top: 0.5rem;
  min-height: 1.5rem;
  text-align: center;
`;

export default function SmartInputPanel({
  onShareGenerated,
}: {
  onShareGenerated: (url: string) => void;
}) {
  const [url, setUrl] = useState("");
  const [fileName, setFileName] = useState("");
  const [tip, setTip] = useState("Paste a link or upload a file to begin.");
  const [isValid, setIsValid] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => {
      const trimmed = url.trim();
      try {
        const u = new URL(trimmed);
        setIsValid(u.protocol === "http:" || u.protocol === "https:");
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
      if (parsed.protocol === "http:" || parsed.protocol === "https:") {
        setTip("🔗 URL accepted. Loading preview...");
        onShareGenerated(trimmed);
        setFileName("");
        toast.success("🔗 Smart link created");
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
    setUrl("");
    setTip("📄 File uploaded. Smart parsing coming soon.");
    toast.success(`📁 ${file.name} uploaded`);
  }, []);

  const clear = useCallback(() => {
    setUrl("");
    setFileName("");
    setTip("Paste a link or upload a file to begin.");
  }, []);

  return (
    <Panel
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
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
        {(fileName || url) && (
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
