import React, { useState, useEffect, useCallback } from 'react';
import styled from 'styled-components';

const Container = styled.div`
  display: flex;
  max-width: 900px;
  margin: 2rem auto;
  gap: 2rem;
`;

const ArticleArea = styled.div`
  flex: 3;
  line-height: 1.6;
  font-size: 1.1rem;
  border: 1px solid #ddd;
  padding: 1.5rem;
  border-radius: 8px;
  position: relative;
  user-select: text;
`;

const HighlightedText = styled.mark`
  background-color: #ffe58a;
  cursor: pointer;
`;

const Sidebar = styled.div`
  flex: 1;
  border-left: 1px solid #ccc;
  padding-left: 1rem;
`;

const HighlightItem = styled.div`
  background: #f9f9f9;
  padding: 8px 12px;
  margin-bottom: 8px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.95rem;
  border: 1px solid transparent;
  display: flex;
  justify-content: space-between;
  align-items: center;

  &:hover {
    border-color: #1e4268;
    background: #e6f0ff;
  }
`;

const RemoveButton = styled.button`
  background: none;
  border: none;
  color: red;
  font-size: 1.2rem;
  cursor: pointer;
  padding: 0;
  line-height: 1;
`;

const Button = styled.button`
  background-color: #1e4268;
  color: white;
  border: none;
  padding: 8px 12px;
  margin-top: 1rem;
  border-radius: 5px;
  cursor: pointer;
  font-weight: 600;
  &:hover {
    background-color: #163559;
  }
`;

interface Highlight {
  id: string;
  text: string;
  start: number;
  end: number;
}

interface Props {
  articleText: string;
  onShare?: (highlights: Highlight[]) => void;
  initialHighlights?: Highlight[];
  readOnly?: boolean;
}

export default function HighlightEditor({
  articleText,
  onShare,
  initialHighlights = [],
  readOnly = false,
}: Props) {
  const [highlights, setHighlights] = useState<Highlight[]>(initialHighlights);

  useEffect(() => {
    setHighlights(initialHighlights);
  }, [initialHighlights]);

  const addHighlight = useCallback(() => {
    if (readOnly) return;

    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return;

    const selectedText = selection.toString().trim();
    if (selectedText.length < 3) return;

    const start = articleText.indexOf(selectedText);
    if (start === -1) return;
    const end = start + selectedText.length;

    if (highlights.some(h => h.text === selectedText)) return;

    const newHighlight: Highlight = {
      id: Math.random().toString(36).substr(2, 9),
      text: selectedText,
      start,
      end,
    };

    setHighlights(prev => [...prev, newHighlight]);
    selection.removeAllRanges();
  }, [articleText, highlights, readOnly]);

  const removeHighlight = (id: string) => {
    if (readOnly) return;
    setHighlights(prev => prev.filter(h => h.id !== id));
  };

  const renderHighlightedText = () => {
    if (highlights.length === 0) return articleText;

    const sorted = [...highlights].sort((a, b) => a.start - b.start);
    const parts: (string | JSX.Element)[] = [];
    let lastIndex = 0;

    sorted.forEach(({ start, end, id, text }) => {
      if (start > lastIndex) {
        parts.push(articleText.slice(lastIndex, start));
      }
      parts.push(
        <HighlightedText key={id} title={text}>
          {articleText.slice(start, end)}
        </HighlightedText>
      );
      lastIndex = end;
    });

    if (lastIndex < articleText.length) {
      parts.push(articleText.slice(lastIndex));
    }

    return parts;
  };

  return (
    <Container>
      <ArticleArea onMouseUp={addHighlight}>{renderHighlightedText()}</ArticleArea>
      <Sidebar>
        <h3>Highlights</h3>
        {highlights.length === 0 && <p>No highlights yet. Select text above to add.</p>}
        {highlights.map(h => (
          <HighlightItem key={h.id} title={h.text}>
            <span>{h.text}</span>
            {!readOnly && (
              <RemoveButton onClick={() => removeHighlight(h.id)} aria-label="Remove highlight">
                &times;
              </RemoveButton>
            )}
          </HighlightItem>
        ))}
        {!readOnly && highlights.length > 0 && (
          <Button onClick={() => onShare && onShare(highlights)}>Generate Share Link</Button>
        )}
      </Sidebar>
    </Container>
  );
}
