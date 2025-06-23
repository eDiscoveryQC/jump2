import React from "react";
import styled from "styled-components";

// --- Brand colors
const blue1 = "#2563eb";
const blue2 = "#3b82f6";
const gold = "#ffd100";
const goldShadow = "#ffe066";
const white = "#fff";

// --- Layout
const LogoWrap = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  user-select: none;
  margin-bottom: 0.2em;
  width: 100%;
`;

const Icon = styled.div`
  margin-bottom: 0.32em;
`;

// --- SVG Icon Mark: Stylized "J" with dynamic "2"
const JMark = () => (
  <svg
    width="56"
    height="56"
    viewBox="0 0 56 56"
    fill="none"
    aria-hidden="true"
    style={{display: "block"}}
    xmlns="http://www.w3.org/2000/svg"
  >
    <defs>
      <linearGradient id="j2g" x1="6" y1="8" x2="50" y2="48" gradientUnits="userSpaceOnUse">
        <stop stopColor={blue1} />
        <stop offset="1" stopColor={blue2} />
      </linearGradient>
      <filter id="shadow" x="0" y="0" width="56" height="56" filterUnits="userSpaceOnUse">
        <feDropShadow dx="0" dy="3" stdDeviation="3" floodColor="#2563eb33" />
      </filter>
    </defs>
    <circle
      cx="28"
      cy="28"
      r="26"
      fill="url(#j2g)"
      stroke={blue2}
      strokeWidth="2.5"
      filter="url(#shadow)"
    />
    {/* Stylized J - geometric, with upward arc */}
    <path
      d="M35 16v13c0 5-3.5 8-7 8s-7-2-7-7"
      stroke={white}
      strokeWidth="3.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    {/* Superscript "2" at jump apex */}
    <text
      x="34"
      y="14"
      fontFamily="'JetBrains Mono', 'Inter', monospace"
      fontWeight="900"
      fontSize="12"
      fill={gold}
      stroke={goldShadow}
      strokeWidth="0.5"
      textAnchor="middle"
      dominantBaseline="middle"
      style={{
        filter: "drop-shadow(0 0 3px #ffe06699)",
        paintOrder: "stroke fill"
      }}
    >
      2
    </text>
  </svg>
);

const Wordmark = styled.h1`
  font-family: 'Inter', 'JetBrains Mono', ui-sans-serif, system-ui, sans-serif;
  font-weight: 900;
  font-size: clamp(2.1rem, 6vw, 3.1rem);
  letter-spacing: -0.03em;
  color: ${white};
  margin: 0;
  line-height: 1.04;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  gap: 0.09em;
  @media (max-width: 600px) {
    font-size: clamp(1.3rem, 7vw, 2rem);
  }
`;

const Jump = styled.span`
  background: linear-gradient(90deg, #2563eb 0%, #3b82f6 100%);
  background-clip: text;
  -webkit-background-clip: text;
  color: transparent;
  -webkit-text-fill-color: transparent;
  font-weight: 900;
  letter-spacing: -0.03em;
  display: inline-block;
`;

const Sup = styled.sup`
  color: ${gold};
  font-size: 0.65em;
  font-weight: 900;
  margin-left: 0.08em;
  margin-top: 0.22em;
  text-shadow: 0 0 7px ${goldShadow}55;
  font-family: inherit;
  line-height: 1;
`;

const Tagline = styled.div`
  font-family: 'Inter', 'JetBrains Mono', ui-sans-serif, system-ui, sans-serif;
  color: #b9d3ff;
  font-size: 1.05em;
  font-weight: 600;
  margin-top: 0.24em;
  letter-spacing: 0.01em;
  opacity: 0.82;
  text-align: center;
  @media (max-width: 600px) {
    font-size: 0.98em;
  }
`;

const Jump2Logo = () => (
  <LogoWrap>
    <Icon>
      <JMark />
    </Icon>
    <Wordmark>
      <Jump>JUMP</Jump>
      <Sup>2</Sup>
    </Wordmark>
    <Tagline>
      Instantly. Precisely. Anywhere.
    </Tagline>
  </LogoWrap>
);

export default Jump2Logo;