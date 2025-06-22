import React, { useState, useEffect, useCallback, useMemo } from 'react';
import styled from 'styled-components';

const Container = styled.div`
  display: flex;
  max-width: 900px;
  margin: 2rem auto;
  gap: 2rem;
  user-select: text;
`;

const ArticleArea = styled.div`
  flex: 3;
  line-height: 1.6;
  font-size: 1.1rem;
  border: 1px solid #ddd;
  padding: 1.5rem;
  border-radius: 8px;
  white-space: pre-wrap;
  overflow-wrap: break-word;
`;

const HighlightedText = styled.mark<{ color: string }>`
  background-color: ${({ color }) => color};
  cursor: pointer;
  border-radius: 3px;
  padding: 0 2px;
`;

const Sidebar = styled.div`
  flex: 1;
  border-left: 1px solid #ccc;
  padding-left: 1rem;
  max-height: 60vh;
  overflow-y: auto;
`;

const HighlightItem = styled.div`
  display: flex;
  align-items: center;
  background: #f9f9f9;
  padding: 8px;
  margin-bottom: 8px;
  border-radius: 6px;
  cursor: pointer;
  user-select: none;

  &:hover {
    background: #e6f0ff;
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

  &:disabled {
    background: #64748b;
    cursor: not-allowed;
  }
`;

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

export default function HighlightEditor({
  htmlContent,
  initialHighlights = [],
  readOnly = false,
  sharing = false,
  onShare,
  highlightId,
}: Props) {
  const [highlights, setHighlights] = useState<Highlight[]>(() => {
    const saved = localStorage.getItem('jump2-highlights');
    return initialHighlights.length
      ? initialHighlights
      : saved
      ? JSON.parse(saved)
      : [];
  });

  useEffect(() => {
    localStorage.setItem('jump2-highlights', JSON.stringify(highlights));
  }, [highlights]);

  useEffect(() => {
    if (!highlightId) return;
    const marker = document.querySelector<HTMLElement>(
      `mark[data-highlight-id="${highlightId}"]`
    );
    if (marker) {
      marker.scrollIntoView({ behavior: 'smooth', block: 'center' });
      marker.classList.add('highlighted');
      setTimeout(() => marker.classList.remove('highlighted'), 2000);
    }
  }, [highlightId]);

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
  }, [htmlContent, highlights, readOnly]);

  const removeHighlight = (id: string) => {
    if (readOnly) return;
    setHighlights(highlights.filter(h => h.id !== id));
  };

  const updateColor = (id: string, color: string) => {
    setHighlights(highlights.map(h => (h.id === id ? { ...h, color } : h)));
  };

  const rendered = useMemo(() => {
    if (!highlights.length) return htmlContent;
    const sorted = [...highlights].sort((a, b) => a.start - b.start);
    const parts = [];
    let pos = 0;

    sorted.forEach(({ start, end, id, text, color }) => {
      if (start > pos) parts.push(htmlContent.slice(pos, start));
      parts.push(
        <HighlightedText key={id} data-highlight-id={id} color={color} title={text}>
          {htmlContent.slice(start, end)}
        </HighlightedText>
      );
      pos = end;
    });

    if (pos < htmlContent.length) parts.push(htmlContent.slice(pos));
    return parts;
  }, [htmlContent, highlights]);

  return (
    <Container>
      <ArticleArea onMouseUp={addHighlight} aria-label="Article content">
        {rendered}
      </ArticleArea>

      <Sidebar>
        <h3>Highlights</h3>
        {highlights.length === 0 && <p>Select text to highlight it.</p>}
        {highlights.map(h => (
          <HighlightItem key={h.id} onClick={() => {
              const m = document.querySelector<HTMLElement>(`mark[data-highlight-id="${h.id}"]`);
              m?.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }}>
            <ColorInput type="color" value={h.color} onChange={e => updateColor(h.id, e.target.value)} />
            <span>{h.text}</span>
            {!readOnly && <RemoveButton onClick={e => { e.stopPropagation(); removeHighlight(h.id); }}>&times;</RemoveButton>}
          </HighlightItem>
        ))}
        {!readOnly && highlights.length > 0 && (
          <Button onClick={() => onShare?.(highlights)} disabled={sharing}>
            {sharing ? 'Generating link...' : 'Generate Share Link'}
          </Button>
        )}
      </Sidebar>
    </Container>
  );
}
