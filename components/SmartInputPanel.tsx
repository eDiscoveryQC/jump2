import React, { useState, useEffect, useCallback, useRef } from "react";
import styled from "styled-components";
import { FaLink, FaTimesCircle, FaUpload } from "react-icons/fa";
import { motion } from "framer-motion";
import toast from "react-hot-toast";

const Panel = styled(motion.div)`
  background: linear-gradient(to bottom right, #1e293b, #0f172a);
  border: 1px solid #334155;
  padding: 2.2rem;
  border-radius: 1.4rem;
  box-shadow: 0 0 50px rgba(14, 165, 233, 0.25);
  width: 100%;
  max-width: 820px;
  display: flex;
  flex-direction: column;
  gap: 1.75rem;
  position: relative;
  transition: all 0.4s ease;
`;

const DropZone = styled.div<{ isDragging: boolean }>`
  border: 2px dashed #0ea5e9;
  padding: 2rem;
  border-radius: 1rem;
  background: ${({ isDragging }) => (isDragging ? "#0ea5e91a" : "#1e293b")};
  color: #cbd5e1;
  text-align: center;
  transition: background 0.3s ease;
`;

const MetaPreview = styled.div`
  background: #0f172a;
  border: 1px solid #334155;
  padding: 1.25rem;
  border-radius: 1rem;
  color: #f8fafc;
  font-size: 0.95rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  line-height: 1.6;
`;

const Row = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const Input = styled.input`
  padding: 1.2rem 1.5rem;
  font-size: 1.15rem;
  border-radius: 0.75rem;
  border: 1px solid #334155;
  background: #0f172a;
  color: white;
  width: 100%;
  transition: border 0.3s ease;
  box-shadow: inset 0 0 6px #0ea5e966;

  &:focus {
    outline: none;
    border-color: #0ea5e9;
    box-shadow: 0 0 6px #0ea5e9aa;
  }

  &::placeholder {
    color: #64748b;
  }
`;

const ButtonRow = styled.div`
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;

  button {
    padding: 0.9rem 1.4rem;
    font-size: 1rem;
    border-radius: 0.65rem;
    border: none;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    transition: all 0.25s ease;
    color: white;
    font-weight: 600;
  }

  .primary {
    background: #16a34a;
  }
  .primary:hover {
    background: #15803d;
  }

  .clear {
    background: #334155;
  }
  .clear:hover {
    background: #1e293b;
  }
`;

const Tip = styled(motion.div)`
  font-size: 1.05rem;
  color: #cbd5e1;
  padding-top: 0.5rem;
  min-height: 1.5rem;
  text-align: center;
`;

const PulseGlow = styled.div`
  position: absolute;
  top: -10px;
  right: -10px;
  width: 25px;
  height: 25px;
  border-radius: 50%;
  background: #0ea5e9;
  box-shadow: 0 0 15px 4px #0ea5e9aa;
  animation: pulse 2s infinite;

  @keyframes pulse {
    0% {
      transform: scale(1);
      opacity: 1;
    }
    70% {
      transform: scale(1.7);
      opacity: 0;
    }
    100% {
      transform: scale(1);
      opacity: 0;
    }
  }
`;

export default function SmartInputPanel({ onSubmit, onAutoExtract }: { onSubmit?: (url: string) => void; onAutoExtract?: (url: string) => void }) {
  const [url, setUrl] = useState("");
  const [tip, setTip] = useState("Paste any article or YouTube link — or drop a file.");
  const [isValid, setIsValid] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [meta, setMeta] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    const t = setTimeout(() => {
      try {
        const parsed = new URL(url.trim());
        const isLink = parsed.protocol === "http:" || parsed.protocol === "https:";
        setIsValid(isLink);

        if (isLink && parsed.hostname.includes("youtube")) {
          const id = parsed.searchParams.get("v") ?? "";
          setMeta(`🎬 YouTube video detected${id ? ` (Video ID: ${id})` : ""}`);
        } else if (isLink) {
          setMeta("📰 Article detected — preview will extract title, author, and more.");
        } else {
          setMeta(null);
        }
      } catch {
        setIsValid(false);
        setMeta(null);
      }
    }, 250);
    return () => clearTimeout(t);
  }, [url]);

  const handleSubmit = useCallback(() => {
    const trimmed = url.trim();
    try {
      const parsed = new URL(trimmed);
      if (parsed.protocol === "http:" || parsed.protocol === "https:") {
        toast.success("✅ Link accepted");
        setTip("🔗 Smart preview loading...");
        onSubmit?.(trimmed);
        onAutoExtract?.(trimmed);
      }
    } catch {
      toast.error("⚠️ Invalid URL");
      setTip("Please enter a valid link.");
    }
  }, [url, onSubmit]);

  const clear = useCallback(() => {
    setUrl("");
    setTip("Paste any article or YouTube link — or drop a file.");
    setMeta(null);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (!file) return;
    toast.success(`📁 File "${file.name}" loaded.`);
    const blobUrl = URL.createObjectURL(file);
    onSubmit?.(blobUrl);
  }, [onSubmit]);

  return (
    <Panel
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <PulseGlow />
      <DropZone
        isDragging={isDragging}
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
      >
        📥 Drop a file here — or paste a link below to get started.
      </DropZone>

      <Row>
        <Input
          ref={inputRef}
          type="text"
          placeholder="Paste an article or YouTube link..."
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
        />

        {meta && <MetaPreview>{meta}</MetaPreview>}
      </Row>

      <ButtonRow>
        <button onClick={handleSubmit} className="primary" disabled={!isValid}>
          <FaLink /> Load Preview
        </button>
        {url && (
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
