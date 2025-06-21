import React, { useState, useRef, useEffect, useCallback } from "react";
import styled from "styled-components";

const Container = styled.div`
  display: flex;
  max-width: 900px;
  margin: 2rem auto;
  gap: 2rem;
`;

const ArticleArea = styled.div`
  flex: 3;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 1.5rem;
  line-height: 1.6;
  font-size: 1.1rem;
  overflow-y: auto;
  max-height: 80vh;
  user-select: text;
  position: relative;
  background: #fff;
  color: #000;

  mark {
    background-color: #ffe58a;
  }
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
  display: flex;
  justify-content: space-between;
  align-items: center;
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

function serializeRange(container: HTMLElement, range: Range) {
  // Serialize highlight as start/end container xpath + offsets
  // For simplicity here, just saving text and offsets relative to container textContent
  const containerText = container.textContent || "";
  const selectedText = range.toString();

  // Compute start and end offsets relative to container text
  // Warning: This is a simplification; a robust method would handle more edge cases.
  let preSelectionRange = document.createRange();
  preSelectionRange.selectNodeContents(container);
  preSelectionRange.setEnd(range.startContainer, range.startOffset);
  const start = preSelectionRange.toString().length;
  const end = start + selectedText.length;

  return { start, end, text: selectedText };
}

function applyHighlights(
  text: string,
  highlights: { start: number; end: number; id: string }[]
) {
  if (!highlights.length) return text;

  let result = [];
  let lastIndex = 0;

  // Sort highlights by start index
  const sorted = highlights.sort((a, b) => a.start - b.start);

  sorted.forEach(({ start, end, id }) => {
    if (start > lastIndex) {
      result.push(text.slice(lastIndex, start));
    }
    const highlightedText = text.slice(start, end);
    result.push(
      <mark key={id} data-highlight-id={id}>
        {highlightedText}
      </mark>
    );
    lastIndex = end;
  });

  if (lastIndex < text.length) {
    result.push(text.slice(lastIndex));
  }

  return result;
}

export default function HighlightEditorLongTerm({ htmlContent }: { htmlContent: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [highlights, setHighlights] = useState<
    { id: string; start: number; end: number; text: string }[]
  >([]);

  const addHighlight = useCallback(() => {
    if (!containerRef.current) return;

    const selection = window.getSelection();
    if (!selection || selection.isCollapsed) return;
    if (!containerRef.current.contains(selection.anchorNode)) return;

    const range = selection.getRangeAt(0);
    if (range.toString().length < 3) return;

    const serialized = serializeRange(containerRef.current, range);

    // Avoid duplicate highlights for same range
    if (
      highlights.some(
        (h) =>
          h.start === serialized.start &&
          h.end === serialized.end &&
          h.text === serialized.text
      )
    )
      return;

    setHighlights((prev) => [
      ...prev,
      { ...serialized, id: Math.random().toString(36).substr(2, 9) },
    ]);

    selection.removeAllRanges();
  }, [highlights]);

  // Extract plain text from HTML for highlight application
  const tempDiv = document.createElement("div");
  tempDiv.innerHTML = htmlContent;
  const plainText = tempDiv.textContent || tempDiv.innerText || "";

  return (
    <Container>
      <ArticleArea
        ref={containerRef}
        onMouseUp={addHighlight}
        aria-label="Article content with highlights"
      >
        {applyHighlights(plainText, highlights)}
      </ArticleArea>
      <Sidebar aria-label="Highlights sidebar">
        <h3>Highlights</h3>
        {highlights.length === 0 && <p>No highlights yet. Select text above to add.</p>}
        {highlights.map((h) => (
          <HighlightItem key={h.id}>
            <span>{h.text.length > 80 ? h.text.slice(0, 77) + "..." : h.text}</span>
            <RemoveButton
              onClick={() =>
                setHighlights((prev) => prev.filter((highlight) => highlight.id !== h.id))
              }
              aria-label={`Remove highlight: ${h.text}`}
            >
              &times;
            </RemoveButton>
          </HighlightItem>
        ))}
      </Sidebar>
    </Container>
  );
}
