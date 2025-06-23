import React, { useEffect, useRef } from "react";
import styled, { keyframes } from "styled-components";

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(40px) scale(0.98);}
  to { opacity: 1; transform: translateY(0) scale(1);}
`;

const Overlay = styled.div<{ open: boolean }>`
  display: ${({ open }) => (open ? "flex" : "none")};
  position: fixed;
  inset: 0;
  background: rgba(15, 23, 42, 0.92);
  z-index: 1200;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  transition: background 0.2s;
`;

const Content = styled.div`
  background: #1e293b;
  border-radius: 1.5rem;
  box-shadow: 0 0 40px #2563ebbb;
  color: #cbd5e1;
  max-width: 95vw;
  width: 420px;
  padding: 2.5rem 2rem 2rem;
  position: relative;
  animation: ${fadeIn} 0.4s cubic-bezier(.19,1,.22,1);
  text-align: center;
  outline: none;

  @media (max-width: 600px) {
    padding: 1.5rem 0.5rem 1rem;
  }
`;

const Title = styled.h2`
  font-size: 2.5rem;
  font-weight: 900;
  color: #3b82f6;
  margin: 0 0 1rem;
  letter-spacing: -1px;
`;

const Body = styled.div`
  font-size: 1.22rem;
  line-height: 1.7;
  margin-bottom: 2rem;
  color: #dbeafe;
`;

const CloseBtn = styled.button`
  position: absolute;
  top: 1.2rem;
  right: 1.5rem;
  background: transparent;
  border: none;
  font-size: 1.7rem;
  color: #7dd3fc;
  cursor: pointer;
  transition: color 0.2s;

  &:hover {
    color: #f87171;
  }
`;

interface LightboxProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  children?: React.ReactNode;
}

export default function Lightbox({
  open,
  onClose,
  title = "Welcome to Jump2!",
  children,
}: LightboxProps) {
  const contentRef = useRef<HTMLDivElement>(null);

  // Focus trap & ESC close
  useEffect(() => {
    if (!open) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "Tab" && contentRef.current) {
        const focusables = contentRef.current.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        if (focusables.length === 0) return;
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        if (!e.shiftKey && document.activeElement === last) {
          first.focus();
          e.preventDefault();
        }
        if (e.shiftKey && document.activeElement === first) {
          last.focus();
          e.preventDefault();
        }
      }
    };
    document.addEventListener("keydown", handleKey);
    // focus the modal
    contentRef.current?.focus();
    return () => document.removeEventListener("keydown", handleKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <Overlay
      open={open}
      role="dialog"
      aria-modal="true"
      aria-labelledby="lightbox-title"
      tabIndex={-1}
      onClick={onClose}
    >
      <Content
        ref={contentRef}
        tabIndex={0}
        aria-label={title}
        onClick={e => e.stopPropagation()}
      >
        <CloseBtn aria-label="Close" onClick={onClose}>&times;</CloseBtn>
        <Title id="lightbox-title">{title}</Title>
        <Body>
          {children ?? (
            <>
              Easily highlight the best parts of any article or video, generate a quick shareable link, and skip the fluff.
            </>
          )}
        </Body>
      </Content>
    </Overlay>
  );
}