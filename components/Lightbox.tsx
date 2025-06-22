import React from "react";
import styled, { keyframes } from "styled-components";

const fadeInUp = keyframes`
  from { opacity: 0; transform: translateY(8px); }
  to { opacity: 1; transform: translateY(0); }
`;

const fadeInUpMixin = `
  animation: ${fadeInUp} 0.5s ease forwards;
`;

const LightboxBackdrop = styled.div<{ open: boolean }>`
  display: ${({ open }) => (open ? "flex" : "none")};
  position: fixed;
  inset: 0;
  background: rgba(15, 23, 42, 0.9);
  z-index: 1200;
  align-items: center;
  justify-content: center;
  padding: 2rem;
`;

const LightboxContent = styled.div`
  max-width: 480px;
  background: #1e293b;
  border-radius: 1rem;
  padding: 2.5rem 3rem;
  box-shadow: 0 0 30px #2563ebaa;
  color: #cbd5e1;
  font-size: 1.25rem;
  line-height: 1.6;
  user-select: text;
  text-align: center;
  ${fadeInUpMixin};

  h2 {
    margin-top: 0;
    font-weight: 900;
    font-size: 2.75rem;
    color: #3b82f6;
    margin-bottom: 1rem;
  }

  p {
    margin-bottom: 1.25rem;
  }
`;

const Button = styled.button`
  margin-top: 1.5rem;
  background-color: #64748b;
  animation: none;
  padding: 1rem 2rem;
  border-radius: 9999px;
  border: none;
  color: white;
  font-weight: 700;
  cursor: pointer;

  &:hover {
    background-color: #526070;
  }
`;

interface LightboxProps {
  open: boolean;
  onClose: () => void;
}

export default function Lightbox({ open, onClose }: LightboxProps) {
  if (!open) return null;

  return (
    <LightboxBackdrop
      open={open}
      role="dialog"
      aria-modal="true"
      aria-labelledby="welcomeTitle"
      aria-describedby="welcomeDesc"
    >
      <LightboxContent>
        <h2 id="welcomeTitle">Welcome to Jump2!</h2>
        <p id="welcomeDesc">
          Easily highlight the best parts of any article or video, generate a
          quick shareable link, and skip the fluff.
        </p>
        <Button type="button" onClick={onClose} aria-label="Close welcome dialog">
          Close
        </Button>
      </LightboxContent>
    </LightboxBackdrop>
  );
}
