import React from "react";
import styled, { keyframes } from "styled-components";

const highlightFade = keyframes`
  0% { background-color: #2563ebbb; }
  100% { background-color: #2563ebaa; }
`;

const HighlightChipsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-top: -0.5rem;
  margin-bottom: 1rem;
`;

const HighlightChip = styled.span`
  background: #2563ebaa;
  color: #e0e7ff;
  border-radius: 9999px;
  padding: 0.25rem 0.75rem;
  font-size: 0.875rem;
  user-select: none;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  animation: ${highlightFade} 0.8s ease forwards;
`;

const ChipRemoveButton = styled.button`
  background: transparent;
  border: none;
  color: #cbd5e1;
  font-weight: 700;
  cursor: pointer;
  font-size: 1rem;
  line-height: 1;
  padding: 0;
  user-select: none;

  &:hover {
    color: #f87171;
  }
`;

interface HighlightChipsProps {
  highlights: string[];
  onRemove: (text: string) => void;
}

export default function HighlightChips({
  highlights,
  onRemove,
}: HighlightChipsProps) {
  if (highlights.length === 0) return null;

  return (
    <HighlightChipsContainer aria-label="Selected highlights">
      {highlights.map((text) => (
        <HighlightChip key={text}>
          {text}
          <ChipRemoveButton
            onClick={() => onRemove(text)}
            aria-label={`Remove highlight: ${text}`}
            title="Remove highlight"
          >
            ×
          </ChipRemoveButton>
        </HighlightChip>
      ))}
    </HighlightChipsContainer>
  );
}
