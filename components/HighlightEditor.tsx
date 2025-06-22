import React, { useState, useEffect, useCallback, useMemo } from 'react';
import styled, { keyframes } from 'styled-components';

// --- UI Styles ---
const Container = styled.div`
  display: flex;
  max-width: 900px;
  margin: 2rem auto;
  gap: 2rem;
  user-select: text;
`;

const ArticleArea = styled.div`
  flex: 3;
  line-height: 1.7;
  font-size: 1.12rem;
  border: 1px solid #ddd;
  padding: 1.5rem;
  border-radius: 8px;
  background: #fcfcfc;
  white-space: pre-wrap;
  overflow-wrap: break-word;
  min-height: 340px;
  transition: box-shadow .2s;
  &:hover {
    box-shadow: 0 4px 20px #1e426820;
  }
`;

const flash = keyframes`
  0%   { background: #ffe066; }
  100% { background: inherit; }
`;

const HighlightedText = styled.mark<{ color: string; isActive?: boolean }>`
  background-color: ${({ color }) => color};
  cursor: pointer;
  border-radius: 3px;
  padding: 0 2px;
  transition: background 0.2s;
  ${({ isActive }) => isActive && `
    animation: ${flash} 1.5s ease-out;
    box-shadow: 0 0 0 2px #ffd10099;
  `}
`;

const Sidebar = styled.div`
  flex: 1.2;
  border-left: 1px solid #ccc;
  padding-left: 1rem;
  max-height: 60vh;
  overflow-y: auto;
  background: #f6faff;
  border-radius: 8px;
`;

const HighlightItem = styled.div<{ active?: boolean }>`
  display: flex;
  align-items: center;
  background: ${({ active }) => active ? '#e0f2fe' : '#f9f9f9'};
  padding: 8px;
  margin-bottom: 8px;
  border-radius: 6px;
  cursor: pointer;
  user-select: none;
  box-shadow: ${({ active }) => active ? '0 0 0 2px #3b82f6' : 'none'};
  &:hover {
    background: #dbeafe;
  }
`;

const ColorInput = styled.input`
  margin-right: 8px;
  border: none;
  padding: 0;
  width: 1.5em;
  height: 1.5em;
  cursor: pointer;
`;

const RemoveButton = styled.button`
  margin-left: auto;
  background: transparent;
  border: none;
  color: #e55353;
  font-size: 1.2rem;
  cursor: pointer;
`;

const Button = styled.button`
  width: 100%;
  padding: 12px;
  background: #1e4268;
  color: #fff;
  border: none;
  border-radius: 6px;
  font-weight: bold;
  cursor: pointer;
  margin-top: 1.5em;

  &:disabled {
    background: #64748b;
    cursor: not-allowed;
  }
`;

const UtilityBar = styled.div`
  margin-bottom: 1.2em;
  display: flex;
  gap: 0.5em;
  align-items: center;
  font-size: .98em;
`;

const Input = styled.input`
  padding: 3px 6px;
  border: 1px solid #cbd5e1;
  border-radius: 4px;
  min-width: 0;
  width: 100%;
`;

const Toast = styled.div`
  position: fixed;
  bottom: 24px;
  left: 50%;
  transform: translateX(-50%);
  background: #1e4268;
  color: #fff;
  padding: 0.7em 1.8em;
  border-radius: 8px;
  font-size: 1.08em;
  box-shadow: 0 2px 18px #1e293b33;
  z-index: 100000;
  animation: fadeOut 2.5s forwards;
  @keyframes fadeOut {
    0% { opacity: 1 }
    85% { opacity: 1 }
    100% { opacity: 0 }
  }
`;

// --- Highlight Interface ---
export interface Highlight {
  id: string;
  text: string;
  start: number;
  end: number;
  color: string;
}

interface Props {
  htmlContent: string;
  initialHighlights?: Highlight[];
  readOnly?: boolean;
  sharing?: boolean;
  onShare?: (highlights: Highlight[]) => Promise<void> | void;
  highlightId?: string;
}

// --- Main Component ---
export default function HighlightEditor({
  htmlContent,
  initialHighlights = [],
  readOnly = false,
  sharing = false,
  onShare,
  highlightId,
}: Props) {
  const [highlights, setHighlights] = useState<Highlight[]>(() => {
    const saved = typeof window !== "undefined"
      ? localStorage.getItem('jump2-highlights')
      : null;
    return initialHighlights.length
      ? initialHighlights
      : saved
      ? JSON.parse(saved)
      : [];
  });
  const [activeHighlight, setActiveHighlight] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [toast, setToast] = useState<string | null>(null);

  // --- Save to localStorage ---
  useEffect(() => {
    if (typeof window !== "undefined")
      localStorage.setItem('jump2-highlights', JSON.stringify(highlights));
  }, [highlights]);

  // --- Scroll to highlightId if present ---
  useEffect(() => {
    if (!highlightId) return;
    const marker = document.querySelector<HTMLElement>(
      `mark[data-highlight-id="${highlightId}"]`
    );
    if (marker) {
      marker.scrollIntoView({ behavior: 'smooth', block: 'center' });
      marker.classList.add('highlighted');
      setTimeout(() => marker.classList.remove('highlighted'), 2000);
      setActiveHighlight(highlightId);
    }
  }, [highlightId]);

  // --- Add highlight from selection ---
  const addHighlight = useCallback(() => {
    if (readOnly) return;
    const sel = window.getSelection();
    if (!sel || sel.rangeCount === 0) return;

    const text = sel.toString().trim();
    if (text.length < 3) return;

    const start = htmlContent.indexOf(text);
    if (start === -1) return;
    const end = start + text.length;

    const existing = highlights.some(h => h.start === start && h.end === end);
    if (existing) return;

    const newHighlight: Highlight = {
      id: Math.random().toString(36).slice(2, 10),
      text,
      start,
      end,
      color: '#ffe58a',
    };

    setHighlights([...highlights, newHighlight]);
    sel.removeAllRanges();
    setToast("Highlight added!");
  }, [htmlContent, highlights, readOnly]);

  // --- Remove highlight ---
  const removeHighlight = (id: string) => {
    if (readOnly) return;
    setHighlights(highlights.filter(h => h.id !== id));
    setToast("Highlight removed");
  };

  // --- Update highlight color ---
  const updateColor = (id: string, color: string) => {
    setHighlights(highlights.map(h => (h.id === id ? { ...h, color } : h)));
  };

  // --- Copy highlight as quote to clipboard ---
  const copyQuote = (text: string) => {
    navigator.clipboard.writeText(text);
    setToast("Copied quote!");
  };

  // --- Filtered highlights for sidebar search ---
  const filteredHighlights = useMemo(() => {
    if (!search.trim()) return highlights;
    return highlights.filter(h => h.text.toLowerCase().includes(search.toLowerCase()));
  }, [highlights, search]);

  // --- Rendered article with highlights ---
  const rendered = useMemo(() => {
    if (!highlights.length) return htmlContent;
    const sorted = [...highlights].sort((a, b) => a.start - b.start);
    const parts = [];
    let pos = 0;

    sorted.forEach(({ start, end, id, text, color }) => {
      if (start > pos) parts.push(htmlContent.slice(pos, start));
      parts.push(
        <HighlightedText
          key={id}
          data-highlight-id={id}
          color={color}
          isActive={activeHighlight === id}
          onClick={() => {
            setActiveHighlight(id);
            setToast("Highlight focused");
          }}
          title={text}
        >
          {htmlContent.slice(start, end)}
        </HighlightedText>
      );
      pos = end;
    });

    if (pos < htmlContent.length) parts.push(htmlContent.slice(pos));
    return parts;
  }, [htmlContent, highlights, activeHighlight]);

  // --- Keyboard shortcut: Add highlight with Cmd/Ctrl+H ---
  useEffect(() => {
    if (readOnly) return;
    const handler = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'h') {
        e.preventDefault();
        addHighlight();
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [addHighlight, readOnly]);

  // --- Toast auto-dismiss ---
  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 2100);
    return () => clearTimeout(t);
  }, [toast]);

  return (
    <Container>
      <ArticleArea
        onMouseUp={addHighlight}
        aria-label="Article content"
        tabIndex={0}
        style={{ outline: activeHighlight ? '2px solid #3b82f6' : undefined }}
      >
        {rendered}
      </ArticleArea>

      <Sidebar>
        <UtilityBar>
          <Input
            type="search"
            placeholder="Filter highlights"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          {!readOnly && (
            <Button
              style={{ width: "auto", padding: "8px 14px", fontWeight: 400, fontSize: ".98em" }}
              title="Add highlight from selected text (Cmd/Ctrl+H)"
              onClick={addHighlight}
              disabled={readOnly}
            >
              + Highlight
            </Button>
          )}
        </UtilityBar>
        <h3 style={{ marginTop: 0 }}>Highlights</h3>
        {filteredHighlights.length === 0 && <p>No highlights yet.</p>}
        {filteredHighlights.map(h => (
          <HighlightItem
            key={h.id}
            active={activeHighlight === h.id}
            onClick={() => {
              setActiveHighlight(h.id);
              setTimeout(() => {
                const m = document.querySelector<HTMLElement>(`mark[data-highlight-id="${h.id}"]`);
                m?.scrollIntoView({ behavior: 'smooth', block: 'center' });
                if (m) m.classList.add('highlighted');
                setTimeout(() => m?.classList.remove('highlighted'), 1500);
              }, 100);
            }}
          >
            <ColorInput
              type="color"
              value={h.color}
              title="Highlight color"
              onChange={e => updateColor(h.id, e.target.value)}
              disabled={readOnly}
            />
            <span style={{ marginLeft: 2, flex: 1, fontFamily: 'inherit' }}>{h.text}</span>
            <Button
              style={{ width: 35, marginLeft: 6, fontWeight: 400, fontSize: "1em", padding: "0 0.35em" }}
              title="Copy quote"
              onClick={e => { e.stopPropagation(); copyQuote(h.text); }}
              disabled={readOnly}
            >📋</Button>
            {!readOnly && (
              <RemoveButton
                title="Remove highlight"
                onClick={e => { e.stopPropagation(); removeHighlight(h.id); }}
              >&times;</RemoveButton>
            )}
          </HighlightItem>
        ))}
        {!readOnly && highlights.length > 0 && (
          <Button
            onClick={() => onShare?.(highlights)}
            disabled={sharing}
            title="Generate a Jump2 link for these highlights"
          >
            {sharing ? 'Generating link...' : 'Generate Share Link'}
          </Button>
        )}
      </Sidebar>
      {toast && <Toast>{toast}</Toast>}
    </Container>
  );
}