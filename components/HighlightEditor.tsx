import * as React from 'react';
import {
  useState,
  useEffect,
  useCallback,
  useMemo,
} from 'react';
import styled from 'styled-components';

const Container = styled.div`...`; // (same as before)
const ArticleArea = styled.div`...`;
const HighlightedText = styled.mark<{ $color: string }>`
  background-color: ${({ $color }) => $color};
  cursor: pointer;
  border-radius: 3px;
  padding: 0 2px;
`;
const Sidebar = styled.div`...`;
const HighlightItem = styled.div`...`;
const RemoveButton = styled.button`...`;
const Button = styled.button`...`;
const ColorInput = styled.input`
  margin: 0 8px 0 0;
  cursor: pointer;
  border: none;
  padding: 0;
  width: 1.5rem;
  height: 1.5rem;
  border-radius: 3px;
`;

interface Highlight {
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
    return initialHighlights.length > 0
      ? initialHighlights
      : saved
      ? JSON.parse(saved)
      : [];
  });

  // Persist highlights locally
  useEffect(() => {
    localStorage.setItem('jump2-highlights', JSON.stringify(highlights));
  }, [highlights]);

  // Scroll to highlightId on load
  useEffect(() => {
    if (!highlightId) return;
    const el = document.querySelector<HTMLElement>(
      `mark[data-highlight-id="${highlightId}"]`
    );
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      el.classList.add('highlighted');
      setTimeout(() => el.classList.remove('highlighted'), 2000);
    }
  }, [highlightId]);

  const addHighlight = useCallback(() => {
    if (readOnly) return;
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return;
    const selectedText = selection.toString().trim();
    if (selectedText.length < 3) return;

    const start = htmlContent.indexOf(selectedText);
    if (start === -1) return;
    const end = start + selectedText.length;

    if (highlights.some(h => h.text === selectedText && h.start === start)) {
      return;
    }

    const color = '#ffe58a';
    const newHighlight: Highlight = {
      id: Math.random().toString(36).slice(2, 11),
      text: selectedText,
      start,
      end,
      color,
    };

    setHighlights(prev => [...prev, newHighlight]);
    selection.removeAllRanges();
  }, [htmlContent, highlights, readOnly]);

  const removeHighlight = (id: string) => {
    if (readOnly) return;
    setHighlights(prev => prev.filter(h => h.id !== id));
  };

  const updateHighlightColor = (id: string, color: string) => {
    setHighlights(prev =>
      prev.map(h => (h.id === id ? { ...h, color } : h))
    );
  };

  const renderHighlightedText = useMemo(() => {
    if (highlights.length === 0) return htmlContent;
    const sorted = [...highlights].sort((a, b) => a.start - b.start);
    const parts: (string | React.ReactElement)[] = [];
    let lastIndex = 0;

    sorted.forEach(({ start, end, id, text, color }) => {
      if (start > lastIndex) parts.push(htmlContent.slice(lastIndex, start));
      parts.push(
        <HighlightedText
          key={id}
          data-highlight-id={id}
          $color={color}
          title={text}
        >
          {htmlContent.slice(start, end)}
        </HighlightedText>
      );
      lastIndex = end;
    });
    if (lastIndex < htmlContent.length)
      parts.push(htmlContent.slice(lastIndex));
    return parts;
  }, [htmlContent, highlights]);

  return (
    <Container>
      <ArticleArea onMouseUp={addHighlight} aria-label="Article content with highlights">
        {renderHighlightedText}
      </ArticleArea>

      <Sidebar aria-label="Highlight list">
        <h3>Highlights</h3>
        {highlights.length === 0 && <p>No highlights yet. Select text above to add.</p>}

        {highlights.map(h => (
          <HighlightItem
            key={h.id}
            onClick={() => {
              const el = document.querySelector<HTMLElement>(
                `mark[data-highlight-id="${h.id}"]`
              );
              el?.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }}
          >
            <ColorInput
              type="color"
              value={h.color}
              onChange={e => updateHighlightColor(h.id, e.target.value)}
            />
            <span>{h.text}</span>
            {!readOnly && (
              <RemoveButton
                onClick={e => {
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
          <Button onClick={() => onShare?.(highlights)} disabled={sharing}>
            {sharing ? 'Generating Link...' : 'Generate Share Link'}
          </Button>
        )}
      </Sidebar>
    </Container>
  );
}
