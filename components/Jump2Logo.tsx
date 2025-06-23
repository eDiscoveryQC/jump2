import React from "react";
import styled, { keyframes } from "styled-components";

const blue = "#1e3af2";
const gold = "#ffd700";
const white = "#ffffff";

// Core brand jump animation
const jump = keyframes`
  0%, 100% { transform: translateY(0) scaleY(1); }
  30% { transform: translateY(-10px) scaleY(1.08); }
  60% { transform: translateY(2px) scaleY(0.95); }
`;

// Elegant glow for superscript 2
const glow = keyframes`
  0% { text-shadow: 0 0 4px ${gold}44, 0 0 2px ${gold}22; }
  100% { text-shadow: 0 0 8px ${gold}aa, 0 0 3px ${gold}55; }
`;

// Master logo wrapper
const Logo = styled.h1.attrs(() => ({
  role: 'img',
  'aria-label': 'Jump2 Logo',
}))`
  display: inline-flex;
  align-items: flex-end;
  font-family: 'Inter', 'JetBrains Mono', ui-sans-serif, sans-serif;
  font-weight: 900;
  font-size: clamp(2rem, 5vw, 3.2rem);
  line-height: 1.1;
  color: ${white};
  letter-spacing: -0.03em;
  user-select: none;
  margin: 0;
  gap: 0.05em;
`;

// Each animated letter
const Letter = styled.span<{ delay: number }>`
  display: inline-block;
  animation: ${jump} 2.4s ease-in-out infinite;
  animation-delay: ${({ delay }) => `${delay}s`};
`;

// Glowing 2 (doesn't jump for anchor effect)
const Sup2 = styled.sup`
  font-size: 0.52em;
  font-weight: 800;
  color: ${gold};
  animation: ${glow} 2.8s ease-in-out infinite alternate;
  margin-left: 0.05em;
  position: relative;
  top: -0.2em;
`;

const Jump2Logo = () => {
  return (
    <Logo>
      <Letter delay={0}>J</Letter>
      <Letter delay={0.15}>U</Letter>
      <Letter delay={0.3}>M</Letter>
      <Letter delay={0.45}>P</Letter>
      <Letter delay={0.6}><Sup2>2</Sup2></Letter>
    </Logo>
  );
};

export default Jump2Logo;
