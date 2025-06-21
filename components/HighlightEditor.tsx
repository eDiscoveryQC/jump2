import * as React from 'react';
import { useState, useEffect, useCallback } from 'react';
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
  position: relative;
  white-space: pre-wrap;
  overflow-wrap: break-word;
`;

const HighlightedText = styled.mark`
  background-color: #ffe58a;
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
  transition: background 0.2s, border-color 0.2s;

  &:hover {
    border-color: #1e4268;
    background: #e6f0ff;
  }
`;

const RemoveButton = styled.button`
  background: none;
  border: none;
  color: #e55353;
  font-size: 1.2rem;
  cursor: pointer;
  padding: 0;
  line-height: 1;
  transition: color 0.2s;

  &:hover {
    color: #b22222;
  }
`;

const Button = styled.button`
  background-color: #1e4268;
  color: white;
  border: none;
  padding: 10px 14px;
  margin-top: 1rem;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 600;
  font-size: 1rem;
  width: 100%;

  &:hover {
    background-color: #163559;
  }

  &:disabled {
    background-color: #64748b;
    cursor: not-allowed;
  }
`;

interface Highlight {
  id: string;
  text: string;
  start: number;
  end: number;
}

interface Props {
  htmlContent: string;
  initialHighlights?: Highlight[];
  readOnly?: boolean;
  sharing?: boolean;
  onShare?: (highlights: Highlight[]) => Promise<void> | void;
}

export default function HighlightEditor({
  htmlContent,
  initialHighlights = [],
  readOnly = false,
  sharing = false,
  onShare,
}: Props) {
  const [highlights, setHighlights] = useState<Highlight[]>(initialHighlights);

  React.useEffect(() => {
    setHighlights(initialHighlights);
  }, [initialHighlights]);

  const addHighlight = useCallback(() => {
    if (readOnly) return;

    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return;

    const selectedText = selection.toString().trim();
    if (selectedText.length < 3) return;

    const start = htmlContent.indexOf(selectedText);
    if (start === -1) return;
    const end = start + selectedText.length;

    if (highlights.some(h => h.text === selectedText)) return;

    const newHighlight: Highlight = {
      id: Math.random().toString(36).slice(2, 11),
      text: selectedText,
      start,
      end,
    };

    setHighlights(prev => [...prev, newHighlight]);
    selection.removeAllRanges();
  }, [htmlContent, highlights, readOnly]);

  const removeHighlight = (id: string) => {
    if (readOnly) return;
    setHighlights(prev => prev.filter(h => h.id !== id));
  };

  // Render the article text with highlights applied
  const renderHighlightedText = () => {
    if (highlights.length === 0) return htmlContent;

    const sorted = [...highlights].sort((a, b) => a.start - b.start);
    const parts: (string | React.ReactElement)[] = [];
    let lastIndex = 0;

    sorted.forEach(({ start, end, id, text }) => {
      if (start > lastIndex) {
        parts.push(htmlContent.slice(lastIndex, start));
      }
      parts.push(
        <HighlightedText key={id} title={text}>
          {htmlContent.slice(start, end)}
        </HighlightedText>
      );
      lastIndex = end;
    });

    if (lastIndex < htmlContent.length) {
      parts.push(htmlContent.slice(lastIndex));
    }

    return parts;
  };

  return (
    <Container>
      <ArticleArea onMouseUp={addHighlight} aria-label="Article content with highlights">
        {renderHighlightedText()}
      </ArticleArea>
      <Sidebar aria-label="Highlight list">
        <h3>Highlights</h3>
        {highlights.length === 0 && <p>No highlights yet. Select text above to add.</p>}
        {highlights.map(h => (
          <HighlightItem
            key={h.id}
            title={h.text}
            onClick={() => {
              const element = document.querySelector(`mark[title="${h.text}"]`);
              element?.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }}
          >
            <span>{h.text}</span>
            {!readOnly && (
              <RemoveButton
                onClick={(e) => {
                  e.stopPropagation();
                  removeHighlight(h.id);
                }}
                aria-label="Remove highlight"
              >
                &times;
              </RemoveButton>
            )}
          </HighlightItem>
        ))}
        {!readOnly && highlights.length > 0 && (
          <Button onClick={() => onShare && onShare(highlights)} disabled={sharing}>
            {sharing ? 'Generating Link...' : 'Generate Share Link'}
          </Button>
        )}
      </Sidebar>
    </Container>
  );
}
